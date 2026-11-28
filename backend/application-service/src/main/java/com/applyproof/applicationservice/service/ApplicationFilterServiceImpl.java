package com.applyproof.applicationservice.service;

import com.applyproof.applicationservice.dto.response.ApplicationResponse;
import com.applyproof.applicationservice.dto.response.PagedResponse;
import com.applyproof.applicationservice.exception.UserNotFoundException;
import com.applyproof.applicationservice.mapper.ApplicationMapper;
import com.applyproof.applicationservice.model.JobApplications;
import com.applyproof.applicationservice.repository.ApplicationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class ApplicationFilterServiceImpl implements ApplicationFilterService{

    private static final int LATEST_LIMIT = 10;

    private final ApplicationRepository repository;

    public ApplicationFilterServiceImpl(
            ApplicationRepository repository
    ){
        this.repository = repository;
    }


    @Override
    public List<ApplicationResponse> latestApplications(String userId) {
        log.info("Latest applications service called by {}", userId);
        return repository
                .findLatestByUserId(UUID.fromString(userId), PageRequest.of(0, LATEST_LIMIT))
                .stream()
                .map(ApplicationMapper::toDto)
                .toList();
    }

    @Override
    public PagedResponse<ApplicationResponse> lastWeekApplications(String userId, int page, int size) {
        log.info("Last week applications service called by {}", userId);
        return since(userId, LocalDateTime.now().minusWeeks(1), page, size);
    }

    @Override
    public PagedResponse<ApplicationResponse> lastMonthApplications(String userId, int page, int size) {
        log.info("Last month applications service called by {}", userId);
        return since(userId, LocalDateTime.now().minusMonths(1), page, size);
    }

    @Override
    public PagedResponse<ApplicationResponse> lastSixMonthApplications(String userId, int page, int size) {
        log.info("Last six month service called by {}", userId);
        return since(userId, LocalDateTime.now().minusMonths(6), page, size);
    }

    @Override
    public PagedResponse<ApplicationResponse> lastYearApplications(String userId, int page, int size) {
        log.info("Last year applications service called by {}", userId);
        return since(userId, LocalDateTime.now().minusYears(1), page, size);
    }

    private boolean isUserExist(String userId) {
        if(!repository.existsById(UUID.fromString(userId))){
            throw new UserNotFoundException("Invalid user id");
        }

        return true;
    }

    private List<ApplicationResponse> since(String userId, LocalDateTime from) {
        return repository
                .findByUserIdSince(UUID.fromString(userId), from)
                .stream()
                .map(ApplicationMapper::toDto)
                .toList();
    }


    // supported for paged response
    private PagedResponse<ApplicationResponse> since(String userId, LocalDateTime from, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<JobApplications> applications =
                repository.findByUserIdSince(
                        UUID.fromString(userId),
                        from,
                        pageable
                );

        return toPagedResponse(applications);
    }

    private PagedResponse<ApplicationResponse> toPagedResponse(
            Page<JobApplications> applications
    ) {
        Page<ApplicationResponse> responsePage =
                applications.map(ApplicationMapper::toDto);

        return PagedResponse.fromPage(responsePage);
    }
}
