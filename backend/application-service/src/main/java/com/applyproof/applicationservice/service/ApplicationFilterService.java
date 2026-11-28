package com.applyproof.applicationservice.service;

import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.dto.response.PagedResponse;

import java.util.List;

public interface ApplicationFilterService {

    // Filter services
    List<ApplicationResponse> latestApplications(String userId);

    PagedResponse<ApplicationResponse> lastWeekApplications(String userId, int page, int size);

    List<ApplicationResponse> lastMonthApplications(String userId);

    List<ApplicationResponse> lastSixMonthApplications(String userId);

    List<ApplicationResponse> lastYearApplications(String userId);
}
