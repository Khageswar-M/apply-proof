package com.applyproof.authservice.dto.response;

import lombok.Builder;

@Builder
public record SignUpResponse(
        String userId,
        String email
) {
}
