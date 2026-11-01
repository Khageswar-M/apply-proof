package com.applyproof.analyticservice.modal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
        name = "daily_application_stats",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_user_apply_date",
                columnNames = {"user_id", "apply_date"}
        )
)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DailyApplicationStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, length = 36)
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID userId;

    @Column(name = "apply_date", nullable = false)
    private LocalDate applyDate;

    @Column(name = "apply_count", nullable = false)
    private int applyCount;
}