package com.applyproof.applicationservice.mapper;

import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.model.JobApplications;

public class ApplicationMapper {

    // map application to DTO
    public static ApplicationResponse toDto(JobApplications jobApplication){
        return ApplicationResponse.builder()
                .id(jobApplication.getId().toString())
                .companyName(jobApplication.getCompanyName())
                .jobBoard(jobApplication.getJobBoard())
                .jobRole(jobApplication.getJobRole())
                .appliedResumeName(jobApplication.getAppliedResumeName())
                .currentStatus(jobApplication.getCurrentStatus())
                .note(jobApplication.getNote())
                .build();
    }
}
