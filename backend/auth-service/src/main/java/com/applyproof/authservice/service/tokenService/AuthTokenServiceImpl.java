package com.applyproof.authservice.service.tokenService;

import com.applyproof.authservice.dto.response.TokenPair;
import com.applyproof.authservice.exception.InvalidTokenException;
import com.applyproof.authservice.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.stereotype.Service;

@Service
public class AuthTokenServiceImpl implements AuthTokenService {

    private final JwtUtil jwtUtil;

    public AuthTokenServiceImpl(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public TokenPair issue(String email) {
        return new TokenPair(
                jwtUtil.generateAccessToken(email),
                jwtUtil.generateRefreshToken(email));
    }

    @Override
    public TokenPair refresh(String refreshToken) {
        Claims claims;
        try {
            claims = jwtUtil.parse(refreshToken);      // checks signature + expiry
        } catch (JwtException e) {
            throw new InvalidTokenException("Invalid or expired refresh token");
        }

        if (!"refresh".equals(claims.get("type", String.class))) {
            throw new InvalidTokenException("Not a refresh token");
        }

        return issue(claims.getSubject());             // new access + new refresh token
    }
}
