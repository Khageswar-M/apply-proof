package com.applyproof.authservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Valid email is required")
        @Size(max = 100)
        String email,

        @NotBlank(message = "OTP is required")
        String otp
) {

}
