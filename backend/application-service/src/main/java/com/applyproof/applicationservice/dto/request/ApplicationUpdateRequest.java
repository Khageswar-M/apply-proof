package com.applyproof.applicationservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ApplicationUpdateRequest(

        @NotBlank(message = "Company name is required!")
        @Size(max = 100, message = "Company name must not exceed 100 characters")
        String companyName,

        @NotBlank(message = "Application resource is required!")
        @Size(max = 50, message = "Application resource must not exceed 50 characters")
        String applicationResource,

        @NotBlank(message = "Status is required!")
        @Pattern(
                regexp = "APPLIED|RECRUITER_CALL|ASSESSMENT|FINAL_DISCUSSION|OFFER|REJECTED",
                message = "Status must be one of: APPLIED, RECRUITER_CALL, ASSESSMENT, FINAL_DISCUSSION, OFFER, REJECTED"
        )
        String status,

        @NotBlank(message = "Resume name is required!")
        @Size(max = 50, message = "Resume name must not exceed 50 characters")
        String resumeName

) {
}
