package com.applyproof.mailservice.service;

import com.applyproof.mailservice.dto.request.MailRequest;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class MailServiceImpl implements MailService{

    private final JavaMailSender javaMailSender;

    @Value("${app.mail.from}")
    private String from;

    public MailServiceImpl(
            JavaMailSender javaMailSender
            ){
        this.javaMailSender = javaMailSender;
    }

    @Override
    public void sendSimpleMail(MailRequest request) {
        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setFrom(from);
        message.setTo(request.to());
        message.setSubject(request.subject());
        message.setText(request.body());

        javaMailSender.send(message);

        log.info("Plain mail sent to {}", request.to());
    }

    @Override
    public void sendHtmlMail(MailRequest request) {
        try {
            MimeMessage message =
                    javaMailSender.createMimeMessage();

            MimeMessageHelper helper =
                    new MimeMessageHelper(message, "UTF-8");

            helper.setFrom(from);
            helper.setTo(request.to());
            helper.setSubject(request.subject());
            helper.setText(request.body(), true);

            javaMailSender.send(message);
            log.info("HTML mail sent to {}", request.to());
        } catch (Exception e) {
            log.error("Failed to send HTML mail to {}", request.to(), e);
            throw new IllegalStateException("Could not send mail", e);

        }
    }
}
