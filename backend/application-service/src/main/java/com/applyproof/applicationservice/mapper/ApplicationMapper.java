package com.applyproof.applicationservice.mapper;

import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.model.JobApplications;

public class ApplicationMapper {

    // map application to DTO
    public static ApplicationResponse toDto(JobApplications jobApplication){
        return ApplicationResponse.builder()
                .id(jobApplication.getId().toString())
                .companyName(jobApplication.getCompanyName())
                .resource(jobApplication.getResumeName())
                .status(jobApplication.getStatus().toString())
                .resumeName(jobApplication.getResumeName())
                .appliedDateTime(jobApplication.getAppliedDateTime().toString())
                .build();
    }
}
