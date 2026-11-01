package com.applyproof.analyticservice.service;

import com.applyproof.analyticservice.dto.response.StatsResponse;
import com.applyproof.analyticservice.modal.DailyApplicationStats;
import com.applyproof.analyticservice.repository.DailyApplicationStatsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class DailyApplicationStatsServiceImpl implements DailyApplicationStatsService{

    private final DailyApplicationStatsRepository repository;

    public DailyApplicationStatsServiceImpl(
            DailyApplicationStatsRepository repository
    ){
        this.repository = repository;
    }

    @Override
    public List<StatsResponse> getAllStats() {
        List<DailyApplicationStats> allStats = repository.findAll();

        log.info("All application stats fetched successfully");

        return allStats.stream()
                .map(stat -> StatsResponse.builder()
                        .date(stat.getApplyDate())
                        .count(stat.getApplyCount())
                        .build())
                .toList();
    }

    @Override
    public void recordApplication(UUID userId, LocalDate date) {
        // 1. Try to bump an existing row for that day
        int updated = repository.increment(userId, date);
        if(updated > 0) return;

        // 2. No row yet, so create it with count = 1
        try {
            repository.save(DailyApplicationStats.builder()
                    .userId(userId)
                    .applyDate(date)
                    .applyCount(1)
                    .build());

            log.info("New application recorded by user id {}", userId);
        }catch (DataIntegrityViolationException ex){
            // Another request inserted the same (user, date) row first
            // The unique constraint rejected ours, so just increment theirs.
            repository.increment(userId, date);

            log.info("Existing record count updated by user id {}", userId);
        }
    }

    @Override
    public List<StatsResponse> getAllStatsFrom(UUID userId) {
        List<DailyApplicationStats> applications = repository.findByUserIdOrderByApplyDateAsc(userId);

        log.info("Fetched all stats from user id {}", userId);
        return applications.stream()
                .map( application -> StatsResponse.builder()
                        .date(application.getApplyDate())
                        .count(application.getApplyCount())
                        .build())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<StatsResponse> getStatsForUserBetween(UUID userId, LocalDate from, LocalDate to) {

        List<DailyApplicationStats> stats = repository.findByUserIdAndApplyDateBetweenOrderByApplyDateAsc(userId, from, to);

        return stats.stream()
                .map(stat -> StatsResponse.builder()
                        .date(stat.getApplyDate())
                        .count(stat.getApplyCount())
                        .build())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public int getCountForDate(UUID userId, LocalDate date) {
        log.info("Get count for date requested by user {}", userId);
        return repository.findByUserIdAndApplyDate(userId, date)
                .map(DailyApplicationStats::getApplyCount)
                .orElse(0);
    }

    @Override
    @Transactional(readOnly = true)
    public int getTotalApplications(UUID userId) {
        return repository.findByUserIdOrderByApplyDateAsc(userId).stream()
                .mapToInt(DailyApplicationStats::getApplyCount)
                .sum();
    }
}
