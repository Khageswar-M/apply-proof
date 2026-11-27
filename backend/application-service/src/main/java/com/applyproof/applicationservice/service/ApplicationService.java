package com.applyproof.applicationservice.service;

import com.applyproof.applicationservice.dto.request.ApplicationCreateRequest;
import com.applyproof.applicationservice.dto.request.ApplicationUpdateRequest;
import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.dto.response.PagedResponse;

import java.util.List;

public interface ApplicationService {
    List<ApplicationResponse> getAllApplications();

    PagedResponse<ApplicationResponse> getAllApplicationsByUserId(String userId, int page, int size);

    ApplicationResponse updateApplication(String applicationId, ApplicationUpdateRequest request);

    ApplicationResponse createApplication(ApplicationCreateRequest request);

    void deleteApplication(String applicationId);

    List<ApplicationResponse> searchByCompany(String userId, String companyName);


}
