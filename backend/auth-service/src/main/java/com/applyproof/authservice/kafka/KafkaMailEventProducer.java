package com.applyproof.authservice.kafka;

import com.applyproof.authservice.dto.request.MailRequest;
import lombok.extern.slf4j.Slf4j;
import mail.event.MailEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class KafkaMailEventProducer {

    private final KafkaTemplate<String, byte[]> kafkaTemplate;

    private static final String TOPIC_NAME = "mail-event";

    public KafkaMailEventProducer(
            KafkaTemplate<String, byte[]> kafkaTemplate
    ){
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishMailEvent(MailRequest mailRequest){
        MailEvent event = MailEvent.newBuilder()
                .setTo(mailRequest.to())
                .setSubject(mailRequest.subject())
                .setBody(mailRequest.body())
                .build();

        byte[] payload = event.toByteArray();

        kafkaTemplate.send(TOPIC_NAME, mailRequest.to(), payload)
                .whenComplete((result, exception) -> {
                    if(exception != null){
                        log.error("Failed to publish mail event to {}", mailRequest.to(), exception);
                    }else{
                        log.info(
                                "Mail event published successfully " +
                                        "Topic: {}, partition: {}, offset: {}",
                                result.getRecordMetadata().topic(),
                                result.getRecordMetadata().partition(),
                                result.getRecordMetadata().offset()
                        );
                    }
                });

    }
}
