package com.applyproof.applicationservice.service;

import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.dto.response.PagedResponse;

import java.util.List;

public interface ApplicationFilterService {

    // Filter services
    PagedResponse<ApplicationResponse> latestApplications(String userId, int page, int size);

    PagedResponse<ApplicationResponse> lastWeekApplications(String userId, int page, int size);

    PagedResponse<ApplicationResponse> lastMonthApplications(String userId, int page, int size);

    PagedResponse<ApplicationResponse> lastSixMonthApplications(String userId, int page, int size);

    PagedResponse<ApplicationResponse> lastYearApplications(String userId, int page, int size);
}
