package com.applyproof.authservice.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long accessExpMs;
    private final long refreshExpMs;

    public JwtUtil(
            @Value("${jwt.secret.key}") String secret,
            @Value("${jwt.access.expiration-ms:600000}") long accessExpMs,
            @Value("${jwt.refresh.expiration-ms:604800000}") long refreshExpMs
    ){
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.accessExpMs = accessExpMs;
        this.refreshExpMs = refreshExpMs;
    }

    public String generateAccessToken(String email){
        return build(email, "access", accessExpMs);
    }

    public String generateRefreshToken(String email){
        return build(email, "refresh", refreshExpMs);
    }

    private String build(String email, String type, long expMs){
        Date now = new Date();
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(email)
                .claim("type", type)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expMs))
                .signWith(key)
                .compact();
    }

    public Claims parse(String token){
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload();
    }

    public String extractEmail(String token) { return parse(token).getSubject(); }
    public String extractJti(String token) { return parse(token).getId(); }
    public Date extractExpiration(String token) { return parse(token).getExpiration(); }

    public boolean isAccessToken(String token) { return "access".equals(parse(token).get("type", String.class)); }
    public boolean isRefreshToken(String token) { return "refresh".equals(parse(token).get("type", String.class)); }
}
