package com.applyproof.applicationservice.controller;

import com.applyproof.applicationservice.dto.response.ApiResponse;
import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
