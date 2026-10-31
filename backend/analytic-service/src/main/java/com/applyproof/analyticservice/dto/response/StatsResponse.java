package com.applyproof.analyticservice.dto.response;

import lombok.Builder;

@Builder
public record StatsResponse(
        Long id,

        String userId,

        String applyDate,

        int applyCount
) {
}
