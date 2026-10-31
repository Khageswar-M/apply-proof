package com.applyproof.analyticservice.service;


import java.time.LocalDate;
import java.util.UUID;

public interface DailyApplicationStatsService {

    // find all the rows


    // call this everytime the user applies to a job
    void recordApplication(UUID userId, LocalDate date);
}
