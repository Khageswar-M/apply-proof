package com.applyproof.applicationservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ApplicationCreateRequest(

        @NotBlank(message = "User ID is required!")
        @Pattern(
                regexp = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
                message = "User ID must be a valid UUID!"
        )
        String userId,

        @NotBlank(message = "Company name is required!")
        @Size(max = 100, message = "Company name must not exceed 100 characters")
        String companyName,

        @NotBlank(message = "Application resource is required!")
        @Size(max = 50, message = "Application resource must not exceed 50 characters")
        String resourceName,

        @NotBlank(message = "Application status is required!")
        @Pattern(
                regexp = "APPLIED|ASSESSMENT|INTERVIEW|OFFER|REJECTED|WITHDRAWN",
                message = "Status must be APPLIED, ASSESSMENT, INTERVIEW, OFFER, REJECTED, or WITHDRAWN"
        )
        String status,

        @NotBlank(message = "Resume name is required!")
        @Size(max = 100, message = "Resume name must not exceed 100 characters")
        String resumeName

) {
}
