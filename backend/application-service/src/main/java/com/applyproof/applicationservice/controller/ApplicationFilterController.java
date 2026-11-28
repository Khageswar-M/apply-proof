
package com.applyproof.applicationservice.controller;

import com.applyproof.applicationservice.dto.response.ApiResponse;
import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.dto.response.PagedResponse;
import com.applyproof.applicationservice.service.ApplicationFilterService;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated
@RequestMapping("/api/v1/applications/filter")
public class ApplicationFilterController {

    private final ApplicationFilterService applicationFilterService;

    public ApplicationFilterController(
            ApplicationFilterService applicationFilterService
    ) {
        this.applicationFilterService = applicationFilterService;
    }

    @GetMapping("/latest/{userId}")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> latest(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Latest applications",
                        applicationFilterService.latestApplications(userId, page, size)
                )
        );
    }

    @GetMapping("/last-week/{userId}")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> lastWeek(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Last week applications",
                        applicationFilterService.lastWeekApplications(userId, page, size)
                )
        );
    }

    @GetMapping("/last-month/{userId}")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> lastMonth(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Last month applications",
                        applicationFilterService.lastMonthApplications(userId, page, size)
                )
        );
    }

    @GetMapping("/last-six-month/{userId}")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> lastSixMonth(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Last six months applications",
                        applicationFilterService.lastSixMonthApplications(userId, page, size)
                )
        );
    }

    @GetMapping("/last-year/{userId}")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> lastYear(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Last year applications",
                        applicationFilterService.lastYearApplications(userId, page, size)
                )
        );
    }
}
