package com.applyproof.analyticservice.controller;

import com.applyproof.analyticservice.dto.response.ApiResponse;
import com.applyproof.analyticservice.dto.response.StatsResponse;
import com.applyproof.analyticservice.service.DailyApplicationStatsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

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

    @PostMapping("/{userId}")
    public ResponseEntity<ApiResponse<Integer>> recordApplication(
            @PathVariable UUID userId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
            ){
        LocalDate applyDate = (date != null) ? date : LocalDate.now();

        statsService.recordApplication(userId, applyDate);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Application recorded successfully",
                        statsService.getCountForDate(userId, applyDate)
                )
        );
    }
}
