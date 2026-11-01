package com.applyproof.analyticservice.grpc;

import analytics.ApplicationRecordedEvent;
import analytics.ApplicationStatsServiceGrpc.ApplicationStatsServiceImplBase;
import analytics.RecordApplicationResponse;
import com.applyproof.analyticservice.modal.DailyApplicationStats;
import com.applyproof.analyticservice.repository.DailyApplicationStatsRepository;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.grpc.server.service.GrpcService;

import java.time.LocalDate;
import java.util.UUID;

@GrpcService
@RequiredArgsConstructor
public class AnalyticsGrpcServerService extends ApplicationStatsServiceImplBase {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsGrpcServerService.class);
    private final DailyApplicationStatsRepository repository;

    @Override
    public void recordApplication(
            ApplicationRecordedEvent request,
            StreamObserver<RecordApplicationResponse> responseObserver) {

        log.info("recordApplication request received: {}", request);

        try {
            UUID userId = UUID.fromString(request.getUserId());
            LocalDate date = LocalDate.parse(request.getApplyDate());

            // 1. Try to bump an existing row for that day
            int updated = repository.increment(userId, date);
            if (updated > 0) {
                log.info("Incremented existing application stats count for user id {}", userId);
            } else {
                // 2. No row yet, so create it with count = 1
                try {
                    repository.save(DailyApplicationStats.builder()
                            .userId(userId)
                            .applyDate(date)
                            .applyCount(1)
                            .build());
                    log.info("New application recorded by user ID {}", userId);
                } catch (DataIntegrityViolationException ex) {
                    // Concurrency collision fallback: increment the row created by another thread/request
                    repository.increment(userId, date);
                    log.info("Existing record count updated by user id {} after concurrency collision", userId);
                }
            }

            // 3. Build and send the successful response
            RecordApplicationResponse response = RecordApplicationResponse.newBuilder()
                    .setSuccess(true)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (Exception e) {
            log.error("Failed to process recordApplication gRPC request: {}", e.getMessage(), e);

            responseObserver.onError(
                    Status.INTERNAL
                            .withDescription("Failed to record application stats: " + e.getMessage())
                            .asRuntimeException()
            );
        }
    }
}