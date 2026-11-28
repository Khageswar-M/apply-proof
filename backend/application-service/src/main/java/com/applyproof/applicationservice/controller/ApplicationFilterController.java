package com.applyproof.applicationservice.controller;


import com.applyproof.applicationservice.dto.response.ApiResponse;
import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.dto.response.PagedResponse;
import com.applyproof.applicationservice.service.ApplicationFilterService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications/filter")
public class ApplicationFilterController {

    private final ApplicationFilterService applicationFilterService;

    public ApplicationFilterController(
            ApplicationFilterService applicationFilterService
    ){
        this.applicationFilterService = applicationFilterService;
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> latest(
            @RequestParam String userId
    ){
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Latest Applications",
                        applicationFilterService.latestApplications(userId)
                )
        );
    }

    @GetMapping("/last-week/{userId}")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> lastWeek(
            @PathVariable String userId,
            @RequestParam int page,
            @RequestParam int size
    ){
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Last week applications",
                        applicationFilterService.lastWeekApplications(userId, page, size)
                )
        );
    }

    @GetMapping("/last-month")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> lastMonth(
            @RequestParam String userId
    ){
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Last month applied applications",
                        applicationFilterService.lastMonthApplications(userId)
                )
        );
    }

    @GetMapping("/last-six-month")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> lastSixMonth(
            @RequestParam String userId
    ){
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Last six month applied applications",
                        applicationFilterService.lastSixMonthApplications(userId)
                )
        );
    }

    @GetMapping("/last-year")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> lastYear(
            @RequestParam String userId
    ){
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Last year applied applications",
                        applicationFilterService.lastYearApplications(userId)
                )
        );
    }
}
