package com.applyproof.applicationservice.repository;

import com.applyproof.applicationservice.model.JobApplications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<JobApplications, UUID> {
    List<JobApplications> findByUserId(UUID userId);
}
