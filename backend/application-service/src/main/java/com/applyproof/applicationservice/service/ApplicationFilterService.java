package com.applyproof.applicationservice.service;

import com.applyproof.applicationservice.dto.response.ApplicationResponse;

import java.util.List;

public interface ApplicationFilterService {

    // Filter services
    List<ApplicationResponse> latestApplications(String userId);

    List<ApplicationResponse> lastWeekApplications(String userId);

    List<ApplicationResponse> lastMonthApplications(String userId);

    List<ApplicationResponse> lastSixMonthApplications(String userId);

    List<ApplicationResponse> lastYearApplications(String userId);
}
