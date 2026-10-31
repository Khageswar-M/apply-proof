package com.applyproof.analyticservice.service;

import com.applyproof.analyticservice.modal.DailyApplicationStats;
import com.applyproof.analyticservice.repository.DailyApplicationStatsRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class DailyApplicationStatsServiceImpl implements DailyApplicationStatsService{

    private final DailyApplicationStatsRepository repository;

    public DailyApplicationStatsServiceImpl(
            DailyApplicationStatsRepository repository
    ){
        this.repository = repository;
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
        }catch (DataIntegrityViolationException ex){
            // Another request inserted the same (user, date) row first
            // The unique constraint rejected ours, so just increment theirs.
            repository.increment(userId, date);
        }
    }
}
