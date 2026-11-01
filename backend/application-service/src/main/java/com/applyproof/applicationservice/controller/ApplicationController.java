package com.applyproof.applicationservice.controller;

import com.applyproof.applicationservice.dto.request.ApplicationCreateRequest;
import com.applyproof.applicationservice.dto.request.ApplicationUpdateRequest;
import com.applyproof.applicationservice.dto.response.ApiResponse;
import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/applications")
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
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getApplicationsByUserId(
            @PathVariable String userId
    ){
        List<ApplicationResponse> applications = service.getAllApplicationsByUserId(userId);

        return ResponseEntity.ok(
                ApiResponse.success(
                        applications.isEmpty() ?
                                "No application found for this user id" :
                                "Applications retrieved successfully by user id",
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
}
