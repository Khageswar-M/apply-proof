package com.applyproof.authservice.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class CookieUtil {

    public static final String ACCESS_COOKIE = "access_token";
    public static final String REFRESH_COOKIE = "refresh_token";
    private static final String REFRESH_PATH = "/api/v1/auth";

    @Value("${app.cookie.secure}") private boolean secure;
    @Value("${app.cookie.same-site}") private String sameSite;
    @Value("${jwt.access.expiration-ms}") private long accessExpMs;
    @Value("${jwt.access.expiration-ms}") private long refreshExpMs;

    public ResponseCookie accessCookie(String token){
        return build(ACCESS_COOKIE, token, "/", Duration.ofMillis(accessExpMs));
    }

    // path "/auth" means the browser sends it only to refresh/logout, not every API call
    public ResponseCookie refreshCookie(String token){
        return build(REFRESH_COOKIE, token, REFRESH_PATH, Duration.ofMillis(refreshExpMs));
    }

    public ResponseCookie clearAccess() { return build(ACCESS_COOKIE, "", "/", Duration.ZERO); }
    public ResponseCookie clearRefresh() { return build(REFRESH_COOKIE, "", REFRESH_PATH, Duration.ZERO); }



    private ResponseCookie build(String name, String value, String path, Duration maxAge){
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path(path)
                .maxAge(maxAge)
                .build();
    }
}
