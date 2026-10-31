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


    // GET /analytics -> full daily history for the user
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<List<StatsResponse>>> getAllStats(
            @PathVariable UUID userId
    ){
        List<StatsResponse> userStats = statsService.getAllStatsFrom(userId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Fetched all stats successfully for user",
                        userStats
                )
        );
    }

    // GET /analytics/userId/range?from=2026-10-01&to=2026-10-31
    @GetMapping("/{userId}/range")
    public ResponseEntity<ApiResponse<List<StatsResponse>>> getStatsBetween(
            @PathVariable UUID userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ){
        if(from.isAfter(to)){
            return ResponseEntity.badRequest().body(ApiResponse.failure(
                    "'from' date must not be after 'to' date",
                    null
            ));
        }

        List<StatsResponse> stats = statsService.getStatsForUserBetween(userId, from, to)
                .stream()
                .map(stat -> StatsResponse.builder()
                        .date(stat.date())
                        .count(stat.count())
                        .build())
                .toList();

        return ResponseEntity.ok(
                ApiResponse.success("Fetched stats for range successfully", stats)
        );
    }

    // GET /analytics/date/2026-10-31 -> count for one day
    @GetMapping("/date/{userId}")
    public ResponseEntity<ApiResponse<Integer>> getCountForDate(
            @PathVariable UUID userId,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ){
        LocalDate applyDate = date != null ? date : LocalDate.now();
        int count = statsService.getCountForDate(userId, applyDate);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Fetched count for date successfully",
                        count
                )
        );
    }
}
