package com.applyproof.applicationservice.service;

import com.applyproof.applicationservice.dto.request.ApplicationUpdateRequest;
import com.applyproof.applicationservice.dto.response.ApplicationResponse;

import java.util.List;

public interface ApplicationService {
    List<ApplicationResponse> getAllApplications();

    List<ApplicationResponse> getAllApplicationsByUserId(String UUID);

    ApplicationResponse updateApplication(String applicationId, ApplicationUpdateRequest request);
}
