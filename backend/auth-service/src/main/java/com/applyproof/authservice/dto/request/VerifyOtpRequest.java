package com.applyproof.authservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record VerifyOtpRequest(
        @NotBlank(message = "Email should not be blank or empty")
        @Email(message = "Valid email is required")
        String email,

        @NotBlank(message = "OTP should not be blank or empty")
        String otp
) {
}
