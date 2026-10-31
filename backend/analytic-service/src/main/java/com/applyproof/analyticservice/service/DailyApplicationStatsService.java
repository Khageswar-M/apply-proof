package com.applyproof.analyticservice.service;


import com.applyproof.analyticservice.dto.response.StatsResponse;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface DailyApplicationStatsService {

    // find all the rows
    List<StatsResponse> getAllStats();

    // call this everytime the user applies to a job
    void recordApplication(UUID userId, LocalDate date);
}
