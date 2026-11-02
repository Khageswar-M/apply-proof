package com.applyproof.applicationservice.kafka;

import analytic.event.ApplyCountEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ApplicationEventProducer {

    private final KafkaTemplate<String, byte[]> kafkaTemplate;

    private static final String TOPIC_NAME = "analytic-apply-count-event";

    public ApplicationEventProducer(
            KafkaTemplate<String, byte[]> kafkaTemplate
    ){
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishApplyEvent(String userId, String applyDate){

        log.info("Publish Apply Event (Kafka) executed.");

        // 1. Build the protobuf event contract object
        ApplyCountEvent applyCountEvent = ApplyCountEvent.newBuilder()
                .setUserId(userId)
                .setApplyDate(applyDate)
                .build();


        // 2. Serialize the Protobuf Object to a byte array
        byte[] payload = applyCountEvent.toByteArray();

        // 3. Send to Kafka
        kafkaTemplate.send(TOPIC_NAME, userId, payload)
                        .whenComplete((result, exception) -> {
                            if(exception != null){
                                log.error(
                                        "Failed to publish application event for user {}",
                                        userId,
                                        exception
                                );
                            } else {
                                log.info(
                                        "Application event published successfully. " +
                                                "Topic: {}, partition: {}, offset: {}",
                                        result.getRecordMetadata().topic(),
                                        result.getRecordMetadata().partition(),
                                        result.getRecordMetadata().offset()
                                );
                            }
                        });

        log.info("Analytic event from application-serviced sent successfully");
    }

}
