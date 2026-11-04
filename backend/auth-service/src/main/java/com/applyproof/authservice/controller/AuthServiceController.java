package com.applyproof.authservice.controller;

import com.applyproof.authservice.dto.request.EmailRequest;
import com.applyproof.authservice.dto.request.VerifyOtpRequest;
import com.applyproof.authservice.dto.response.*;
import com.applyproof.authservice.exception.InvalidTokenException;
import com.applyproof.authservice.service.UserService;
import com.applyproof.authservice.service.tokenService.AuthTokenService;
import com.applyproof.authservice.utils.CookieUtil;
import com.applyproof.authservice.utils.JwtUtil;
import io.jsonwebtoken.JwtException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthServiceController {

    private final UserService userService;
    private final AuthTokenService authTokenService;
    private final CookieUtil cookieUtil;
    private final JwtUtil jwtUtil;

    public AuthServiceController(UserService userService,
                                 AuthTokenService authTokenService,
                                 CookieUtil cookieUtil,
                                 JwtUtil jwtUtil) {
        this.userService = userService;
        this.authTokenService = authTokenService;
        this.cookieUtil = cookieUtil;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Boolean>> sendOtp(@RequestBody EmailRequest request) {
        userService.sendOtp(request);
        return ResponseEntity.ok(ApiResponse.success("Mail sent successfully", true));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Boolean>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        if (!userService.verifyOtp(request)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.failure("Invalid OTP", null));
        }
        return ResponseEntity.ok(ApiResponse.success("OTP verification successful", true));
    }

    @PostMapping("/sign-up")
    public ResponseEntity<ApiResponse<SignUpResponse>> signUp(@RequestBody EmailRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User signed up successfully", userService.signup(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody EmailRequest request) {
        AuthResult result = userService.login(request);
        return withTokenCookies(result.tokens())
                .body(ApiResponse.success("User logged-in successfully", result.user()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Boolean>> refresh(
            @CookieValue(name = CookieUtil.REFRESH_COOKIE, required = false) String refreshToken) {
        if (refreshToken == null) {
            throw new InvalidTokenException("Missing refresh token");
        }
        TokenPair tokens = authTokenService.refresh(refreshToken);
        return withTokenCookies(tokens)
                .body(ApiResponse.success("Token refreshed", true));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Boolean>> logout() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieUtil.clearAccess().toString())
                .header(HttpHeaders.SET_COOKIE, cookieUtil.clearRefresh().toString())
                .body(ApiResponse.success("Logged out successfully", true));
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, String>> validate(
            @RequestHeader(value = "Authorization", required = false) String header) {

        if (header == null || !header.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String token = header.substring(7);
            if (!jwtUtil.isAccessToken(token)) {            // rejects refresh tokens
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            return ResponseEntity.ok(Map.of("userId", jwtUtil.extractEmail(token)));
        } catch (JwtException | IllegalArgumentException e) {   // expired, bad signature, malformed
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    private ResponseEntity.BodyBuilder withTokenCookies(TokenPair tokens) {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieUtil.accessCookie(tokens.accessToken()).toString())
                .header(HttpHeaders.SET_COOKIE, cookieUtil.refreshCookie(tokens.refreshToken()).toString());
    }
}