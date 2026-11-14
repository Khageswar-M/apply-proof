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

    @Column(name = "company_name", nullable = true)
    private String companyName;

    @Column(name = "job_board", nullable = true)
    private String jobBoard;

    @Column(name = "job_role", nullable = true)
    private String jobRole;

    @Column(name = "applied_resume_name", nullable = true)
    private String appliedResumeName;

    @Column(name = "current_status", nullable = true)
    private String currentStatus;

    @Column(name = "note", nullable = true)
    private String note;

    @Column(name = "applied_date_time", nullable = false, updatable = false)
    private LocalDateTime appliedDateTime;
}
