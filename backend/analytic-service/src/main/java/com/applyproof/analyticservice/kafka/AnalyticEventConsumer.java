package com.applyproof.analyticservice.kafka;

import analytic.event.ApplyCountEvent;
import com.applyproof.analyticservice.service.DailyApplicationStatsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Slf4j
@Component
public class AnalyticEventConsumer {

    private final DailyApplicationStatsService service;

    public AnalyticEventConsumer(
            DailyApplicationStatsService service
    ){
        this.service = service;
    }

    @KafkaListener(
            topics = "analytic-apply-count-event",
            groupId = "analytic-service"
    )
    public void consumerApplicationEvent(byte[] payload){

        try {
            ApplyCountEvent event = ApplyCountEvent.parseFrom(payload);

            UUID userId = UUID.fromString(event.getUserId());
            LocalDate date = LocalDate.parse(event.getApplyDate());

            service.recordApplication(userId, date);

            log.info(
                    "Application recorded in analytics for user {} on {}",
                    userId,
                    date
            );

        }catch (Exception e){
            log.error("Failed to process application event ", e);
        }

    }
}
