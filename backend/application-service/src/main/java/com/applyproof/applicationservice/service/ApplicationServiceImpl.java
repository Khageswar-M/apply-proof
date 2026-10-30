package com.applyproof.applicationservice.service;

import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.model.JobApplications;
import com.applyproof.applicationservice.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ApplicationServiceImpl implements ApplicationService{

    private final ApplicationRepository repository;

    public ApplicationServiceImpl(
            ApplicationRepository repository
    ){
        this.repository = repository;
    }

    @Override
    public List<ApplicationResponse> getAllApplications() {

        List<JobApplications> applications = repository.findAll();

        return applications.stream()
                .map(application -> ApplicationResponse.builder()
                        .id(application.getId().toString())
                        .companyName(application.getCompanyName())
                        .resource(application.getApplicationResource())
                        .status(application.getStatus().toString())
                        .resumeName(application.getResumeName())
                        .appliedDateTime(application.getAppliedDateTime().toString())
                        .build()
                )
                .toList();
    }

    @Override
    public List<ApplicationResponse> getAllApplicationsByUserId(String userId) {

        List<JobApplications> jobApplicationsByUserId =
                repository.findByUserId(UUID.fromString(userId));

        return jobApplicationsByUserId.stream()
                .map(application -> ApplicationResponse.builder()
                        .id(application.getId().toString())
                        .companyName(application.getCompanyName())
                        .resource(application.getApplicationResource())
                        .status(application.getStatus().toString())
                        .resumeName(application.getResumeName())
                        .appliedDateTime(application.getAppliedDateTime().toString())
                        .build())
                .toList();
    }
}
