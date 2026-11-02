package com.applyproof.authservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record MailRequest(
        @NotBlank @Email String to,
        @NotBlank String subject,
        @NotBlank String body
) {
}
