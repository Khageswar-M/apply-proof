package com.applyproof.applicationservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "job_applications")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class JobApplications {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(length = 36)
    private UUID id;

    @Column(name = "user_id", nullable = false, length = 36)
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID userId;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "application_resource", nullable = false)
    private String applicationResource;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ApplicationStatus status;

    @Column(name = "resume_name", nullable = false, length = 100)
    private String resumeName;

    @Column(name = "applied_date_time", nullable = false, updatable = false)
    private LocalDateTime appliedDateTime;
}
