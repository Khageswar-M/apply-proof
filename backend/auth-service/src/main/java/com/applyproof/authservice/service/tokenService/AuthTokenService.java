package com.applyproof.authservice.service.tokenService;

import com.applyproof.authservice.dto.response.TokenPair;

public interface AuthTokenService {
    TokenPair issue(String email);
    TokenPair refresh(String refreshToken);
}
