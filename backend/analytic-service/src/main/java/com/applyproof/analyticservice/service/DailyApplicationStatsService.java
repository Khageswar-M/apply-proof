package com.applyproof.analyticservice.service;


import com.applyproof.analyticservice.dto.response.StatsResponse;
import com.applyproof.analyticservice.modal.DailyApplicationStats;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface DailyApplicationStatsService {

    // find all the rows
    List<StatsResponse> getAllStats();

    // call this everytime the user applies to a job
    void recordApplication(UUID userId, LocalDate date);

    // get all stats by userId
    List<StatsResponse> getAllStatsFrom(UUID userId);

    // get stats within a date range
    List<StatsResponse> getStatsForUserBetween(UUID userId, LocalDate from, LocalDate to);

    // Count for one specific day (0 if no row exists)
    int getCountForDate(UUID userId, LocalDate date);

    // Total applications across all days
    int getTotalApplications(UUID userId);
}
