package com.applyproof.mailservice.controller;

import com.applyproof.mailservice.dto.request.MailRequest;
import com.applyproof.mailservice.service.MailService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mail")
public class MailController {

    private final MailService mailService;

    public MailController(
            MailService mailService
    ){
        this.mailService = mailService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> send(
            @Valid @RequestBody MailRequest request
            ){
        mailService.sendSimpleMail(request);
        return ResponseEntity.ok("Mail sent");
    }

    @PostMapping("/send-html")
    public ResponseEntity<String> sendHtml(
            @Valid @RequestBody MailRequest request
    ){
        mailService.sendHtmlMail(request);
        return ResponseEntity.ok("Html mail sent");
    }
}
