package com.applyproof.analyticservice.mapper;

import com.applyproof.analyticservice.dto.response.StatsResponse;
import com.applyproof.analyticservice.modal.DailyApplicationStats;

public class DailyApplicationStatsMapper {

    public StatsResponse toResponse(DailyApplicationStats applicationStats){
        return StatsResponse.builder()
                .date(applicationStats.getApplyDate())
                .count(applicationStats.getApplyCount())
                .build();
    }
}
