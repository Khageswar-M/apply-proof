package com.applyproof.analyticservice.repository;

import com.applyproof.analyticservice.dto.response.StatsResponse;
import com.applyproof.analyticservice.modal.DailyApplicationStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DailyApplicationStatsRepository extends JpaRepository<DailyApplicationStats, Long> {

    List<DailyApplicationStats> findByUserIdOrderByApplyDateAsc(UUID userId);

    List<DailyApplicationStats> findByUserIdAndApplyDateBetweenOrderByApplyDateAsc(
            UUID userId, LocalDate from, LocalDate to
    );

    Optional<DailyApplicationStats> findByUserIdAndApplyDate(UUID userId, LocalDate applyDate);

    //Atomic increment, returns number of rows updated (0 = no row for that day yet)
    @Transactional
    @Modifying
    @Query("""
        UPDATE DailyApplicationStats d
            SET d.applyCount = d.applyCount + 1
                WHERE d.userId = :userId AND d.applyDate = :date
    """)
    int increment(@Param("userId") UUID userId, @Param("date") LocalDate date);
}
