package com.applyproof.mailservice.kafka;

import com.applyproof.mailservice.dto.request.MailRequest;
import com.applyproof.mailservice.service.MailService;
import lombok.extern.slf4j.Slf4j;
import mail.event.MailEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.KafkaListener;

@Slf4j
@Configuration
public class MailEventConsumer {

    private final MailService mailService;

    public MailEventConsumer(
            MailService mailService
    ){
        this.mailService = mailService;
    }

    @KafkaListener(
            topics = "mail-event",
            groupId = "mail-service"
    )
    public void mailEventConsumer(byte[] payload){

        try {
            MailEvent event = MailEvent.parseFrom(payload);


            MailRequest mailRequest = MailRequest.builder()
                            .to(event.getTo())
                            .subject(event.getSubject())
                            .body(event.getBody())
                            .build();

            mailService.sendSimpleMail(mailRequest);

            log.info("Kafka event send the mail successfully to: {}", mailRequest.to());
        }catch (Exception e){
            log.info("Failed to send mail ", e);
        }
    }


}
