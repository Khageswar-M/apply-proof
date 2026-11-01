package com.applyproof.mailservice.service;

import com.applyproof.mailservice.dto.request.MailRequest;

public interface MailService {
    void sendSimpleMail(MailRequest request);
    void sendHtmlMail(MailRequest request);
}
