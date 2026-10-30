package com.applyproof.applicationservice.repository;

import com.applyproof.applicationservice.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<JobApplication, UUID> {

}
