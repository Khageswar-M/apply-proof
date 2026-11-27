package com.applyproof.applicationservice.repository;

import com.applyproof.applicationservice.model.JobApplications;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<JobApplications, UUID> {
    List<JobApplications> findByUserId(UUID userId);

    Page<JobApplications> findByUserId(UUID userId, Pageable pageable);

    List<JobApplications> findByUserIdAndCompanyNameStartingWith(UUID userId, String companyName);

    // Latest first, limited by Pageable
    @Query("""
        SELECT a FROM JobApplications a
        WHERE a.userId = :userId
        ORDER BY a.appliedDateTime DESC
        """)
    List<JobApplications> findLatestByUserId(@Param("userId") UUID userId, Pageable pageable);

    @Query("""
        SELECT a FROM JobApplications a
        WHERE a.userId = :userId
                AND a.appliedDateTime >= :from
                        ORDER BY a.appliedDateTime DESC
        """)
    List<JobApplications> findByUserIdSince(@Param("userId") UUID userId, @Param("from")LocalDateTime from);
}
