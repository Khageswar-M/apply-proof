package com.applyproof.applicationservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ApplicationUpdateRequest(

        @NotBlank(message = "Company name is required!")
        @Size(max = 100, message = "Company name must not exceed 100 characters")
        String companyName,

        String jobBoard,

        String jobRole,

        String appliedResumeName,

        String currentStatus,

        String note

) {
}
