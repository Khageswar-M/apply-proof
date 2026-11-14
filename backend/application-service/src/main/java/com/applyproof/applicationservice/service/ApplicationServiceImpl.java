package com.applyproof.applicationservice.service;

import com.applyproof.applicationservice.dto.request.ApplicationCreateRequest;
import com.applyproof.applicationservice.dto.request.ApplicationUpdateRequest;
import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.exception.ApplicationNotFoundException;
import com.applyproof.applicationservice.grpc.AnalyticsServiceGrpcClient;
import com.applyproof.applicationservice.kafka.ApplicationEventProducer;
import com.applyproof.applicationservice.mapper.ApplicationMapper;
import com.applyproof.applicationservice.model.ApplicationStatus;
import com.applyproof.applicationservice.model.JobApplications;
import com.applyproof.applicationservice.repository.ApplicationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class ApplicationServiceImpl implements ApplicationService{

    private final ApplicationRepository repository;
    private final AnalyticsServiceGrpcClient grpcClient;
    private final ApplicationEventProducer kafkaProducer;

    public ApplicationServiceImpl(
            ApplicationRepository repository,
            AnalyticsServiceGrpcClient grpcClient,
            ApplicationEventProducer kafkaProducer
    ){
        this.repository = repository;
        this.grpcClient = grpcClient;
        this.kafkaProducer = kafkaProducer;
    }

    @Override
    public List<ApplicationResponse> getAllApplications() {

        List<JobApplications> applications = repository.findAll();

        log.info("All applications fetched successfully.");

        return applications.stream()
                .map(application -> ApplicationResponse.builder()
                        .id(application.getId().toString())
                        .companyName(application.getCompanyName())
                        .jobBoard(application.getJobBoard())
                        .jobRole(application.getJobRole())
                        .appliedResumeName(application.getAppliedResumeName())
                        .currentStatus(application.getCurrentStatus())
                        .note(application.getNote())
                        .appliedDateTime(application.getAppliedDateTime().toString())
                        .build()
                )
                .toList();
    }

    @Override
    public List<ApplicationResponse> getAllApplicationsByUserId(String userId) {

        List<JobApplications> jobApplicationsByUserId =
                repository.findByUserId(UUID.fromString(userId));

        log.info("All applications are fetched successfully by userId: {}", userId);

        return jobApplicationsByUserId.stream()
                .map(application -> ApplicationResponse.builder()
                        .id(application.getId().toString())
                        .companyName(application.getCompanyName())
                        .jobBoard(application.getJobBoard())
                        .jobRole(application.getJobRole())
                        .appliedResumeName(application.getAppliedResumeName())
                        .currentStatus(application.getCurrentStatus())
                        .note(application.getNote())
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
        existingApplication.setJobBoard(request.jobBoard());
        existingApplication.setJobRole(request.jobRole());
        existingApplication.setAppliedResumeName(request.appliedResumeName());
        existingApplication.setCurrentStatus(request.currentStatus());
        existingApplication.setNote(request.note());

        JobApplications updatedApplication = repository.save(existingApplication);

        log.info("Application updated successfully for application id {}", applicationId);

        return ApplicationMapper.toDto(updatedApplication);
    }

    @Override
    public ApplicationResponse createApplication(ApplicationCreateRequest request) {

        JobApplications jobApplications = JobApplications.builder()
                .userId(UUID.fromString(request.userId()))
                .companyName(request.companyName())
                .jobBoard(request.jobBoard())
                .jobRole(request.jobRole())
                .appliedResumeName(request.appliedResumeName())
                .currentStatus(request.currentStatus())
                .note(request.note())
                .appliedDateTime(LocalDateTime.parse(request.appliedDateTime()))
                .build();

        JobApplications newJobApplication = repository.save(jobApplications);

//        grpcClient.recordApplication(
//                newJobApplication.getUserId().toString(),
//                newJobApplication.getAppliedDateTime().toLocalDate().toString()
//        );

        kafkaProducer.publishApplyEvent(
                newJobApplication.getUserId().toString(),
                newJobApplication.getAppliedDateTime().toLocalDate().toString());

        return ApplicationMapper.toDto(newJobApplication);
    }

    @Override
    public void deleteApplication(String applicationId) {
        JobApplications jobApplication = repository.findById(UUID.fromString(applicationId))
                .orElseThrow(() -> new ApplicationNotFoundException("Application not found"));

        repository.deleteById(UUID.fromString(applicationId));

        log.info("Application deleted successfully {}", applicationId);
    }
}
