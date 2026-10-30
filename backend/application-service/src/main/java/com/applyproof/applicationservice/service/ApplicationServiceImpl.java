package com.applyproof.applicationservice.service;

import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.entity.JobApplication;
import com.applyproof.applicationservice.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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

        List<JobApplication> applications = repository.findAll();

        return applications.stream()
                .map(application -> ApplicationResponse.builder()
                        .id(application.getId().toString())
                        .companyName(application.getCompanyName())
                        .status(application.getStatus().toString())
                        .resumeName(application.getResumeName())
                        .appliedDateTime(application.getAppliedDateTime().toString())
                        .build()
                )
                .toList();
    }
}
