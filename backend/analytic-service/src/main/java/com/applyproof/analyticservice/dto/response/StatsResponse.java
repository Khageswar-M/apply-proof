package com.applyproof.analyticservice.dto.response;

import com.applyproof.analyticservice.modal.DailyApplicationStats;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record StatsResponse(

        LocalDate date,

        int count
) {
    public static StatsResponse from(DailyApplicationStats stats){
        return new StatsResponse(stats.getApplyDate(), stats.getApplyCount());
    }
}
