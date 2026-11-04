package com.applyproof.authservice.dto.response;

public record AuthResult(LoginResponse user, TokenPair tokens) {
}
