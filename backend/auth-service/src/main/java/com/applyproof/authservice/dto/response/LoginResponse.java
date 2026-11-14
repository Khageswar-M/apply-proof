package com.applyproof.authservice.dto.response;

import lombok.Builder;

@Builder
public record LoginResponse(
        String userId,
        String email
) {
}
