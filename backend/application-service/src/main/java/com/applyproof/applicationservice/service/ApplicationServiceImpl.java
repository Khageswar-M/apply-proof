package com.applyproof.applicationservice.service;

import com.applyproof.applicationservice.dto.request.ApplicationCreateRequest;
import com.applyproof.applicationservice.dto.request.ApplicationUpdateRequest;
import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.exception.ApplicationNotFoundException;
import com.applyproof.applicationservice.mapper.ApplicationMapper;
import com.applyproof.applicationservice.model.ApplicationStatus;
import com.applyproof.applicationservice.model.JobApplications;
import com.applyproof.applicationservice.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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

    @Override
    public ApplicationResponse updateApplication(
            String applicationId,
            ApplicationUpdateRequest request) {

        JobApplications existingApplication =
                repository.findById(UUID.fromString(applicationId))
                        .orElseThrow(() ->
                                new ApplicationNotFoundException("Job application not found!"));

        existingApplication.setCompanyName(request.companyName());
        existingApplication.setApplicationResource(request.applicationResource());
        existingApplication.setStatus(ApplicationStatus.valueOf(request.status()));
        existingApplication.setResumeName(request.resumeName());

        JobApplications updatedApplication = repository.save(existingApplication);

        return ApplicationMapper.toDto(updatedApplication);
    }

    @Override
    public ApplicationResponse createApplication(ApplicationCreateRequest request) {

        JobApplications jobApplications = JobApplications.builder()
                .userId(UUID.fromString(request.userId()))
                .companyName(request.companyName())
                .status(ApplicationStatus.valueOf(request.status()))
                .applicationResource(request.resourceName())
                .resumeName(request.resumeName())
                .appliedDateTime(LocalDateTime.now())
                .build();

        JobApplications newJobApplication = repository.save(jobApplications);

        return ApplicationMapper.toDto(newJobApplication);
    }

    @Override
    public void deleteApplication(String applicationId) {
        JobApplications jobApplication = repository.findById(UUID.fromString(applicationId))
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found"));

        repository.deleteById(UUID.fromString(applicationId));
    }
}
