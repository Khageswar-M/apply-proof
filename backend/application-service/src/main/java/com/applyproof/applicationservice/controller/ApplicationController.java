package com.applyproof.applicationservice.controller;

import com.applyproof.applicationservice.dto.request.ApplicationCreateRequest;
import com.applyproof.applicationservice.dto.request.ApplicationUpdateRequest;
import com.applyproof.applicationservice.dto.request.SearchCompanyByNameRequest;
import com.applyproof.applicationservice.dto.response.ApiResponse;
import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.dto.response.PagedResponse;
import com.applyproof.applicationservice.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final ApplicationService service;

    public ApplicationController(
            ApplicationService service
    ){
        this.service = service;
    }


    @GetMapping
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getAllApplications(){
        List<ApplicationResponse> applications = service.getAllApplications();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Applications retrieved successfully",
                        applications
                )
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>> getApplicationByUserId(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        PagedResponse<ApplicationResponse> applications  =
                service.getAllApplicationsByUserId(userId, page, size);

        return ResponseEntity.ok(
                ApiResponse.success(
                        applications.content().isEmpty()
                        ? "No application found for this user id"
                                : "Applications retrieved successfully by user id",
                        applications
                )
        );
    }

    @PutMapping("/{applicationId}")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateApplication(
            @PathVariable String applicationId,
            @Valid @RequestBody ApplicationUpdateRequest request
            ){
        ApplicationResponse response = service.updateApplication(applicationId, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Application updated successfully",
                        response
                )
        );
    }

    @PostMapping()
    public ResponseEntity<ApiResponse<ApplicationResponse>> createApplication(
            @Valid @RequestBody ApplicationCreateRequest request
            ){
        ApplicationResponse response = service.createApplication(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Application created successfully",
                        response
                )
        );
    }

    @DeleteMapping("/{applicationId}")
    public ResponseEntity<ApiResponse<Void>> deleteApplication(
            @PathVariable String applicationId
    ){
        service.deleteApplication(applicationId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Application deleted successfully",
                        null
                )
        );
    }

    @PostMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationResponse>>>
    searchByCompanyName(
            @RequestBody SearchCompanyByNameRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        PagedResponse<ApplicationResponse> companies =
                service.searchByCompany(
                        request.userId(),
                        request.companyName(),
                        page,
                        size
                );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Applications retrieved successfully by userId and company name",
                        companies
                )
        );
    }
}
