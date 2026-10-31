package com.applyproof.analyticservice.controller;

import com.applyproof.analyticservice.service.DailyApplicationStatsService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stats")
public class ApplicationStatsController {

    private final DailyApplicationStatsService statsService;

    public ApplicationStatsController(
            DailyApplicationStatsService statsService
    ){
        this.statsService = statsService;
    }


}
