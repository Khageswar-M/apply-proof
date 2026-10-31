package com.applyproof.analyticservice.controller;

import com.applyproof.analyticservice.dto.response.ApiResponse;
import com.applyproof.analyticservice.dto.response.StatsResponse;
import com.applyproof.analyticservice.service.DailyApplicationStatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/analytics")
public class ApplicationStatsController {

    private final DailyApplicationStatsService statsService;

    public ApplicationStatsController(
            DailyApplicationStatsService statsService
    ){
        this.statsService = statsService;
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<StatsResponse>>> getAllStats(){
        List<StatsResponse> allStats = statsService.getAllStats();
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Fetched all stats successfully",
                        allStats
                )
        );
    }
}
