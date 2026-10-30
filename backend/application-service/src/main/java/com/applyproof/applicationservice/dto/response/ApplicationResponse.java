package com.applyproof.applicationservice.dto.response;

import lombok.Builder;

@Builder
public record ApplicationResponse(
        String id,

        String companyName,

        String resource,

        String status,

        String resumeName,

        String appliedDateTime
) {
}
