package com.applyproof.applicationservice.dto.response;

import lombok.Builder;

@Builder
public record ApplicationResponse(
        String id,

        String companyName,

        String jobBoard,

        String jobRole,

        String appliedResumeName,

        String currentStatus,

        String note,

        String appliedDateTime
) {
}
