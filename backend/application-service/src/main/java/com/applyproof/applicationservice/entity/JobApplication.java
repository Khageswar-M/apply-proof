package com.applyproof.applicationservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "job_application")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ApplicationStatus status;

    @Column(name = "resume_name", nullable = false, length = 100)
    private String resumeName;

    @Column(name = "applied_date_time", nullable = false)
    private LocalDateTime appliedDateTime;
}
