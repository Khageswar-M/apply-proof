package com.applyproof.authservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailRequest(
        @NotBlank(message = "Email should not be empty")
        @Email
        String email
) {
}
