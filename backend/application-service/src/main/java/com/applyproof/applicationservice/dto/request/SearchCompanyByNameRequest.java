package com.applyproof.applicationservice.dto.request;

public record SearchCompanyByNameRequest(
        String userId,
        String companyName
) {
}
