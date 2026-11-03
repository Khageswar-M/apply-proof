package com.applyproof.authservice.service;

import com.applyproof.authservice.dto.request.MailRequest;
import com.applyproof.authservice.dto.request.EmailRequest;
import com.applyproof.authservice.dto.request.VerifyOtpRequest;
import com.applyproof.authservice.dto.response.LoginResponse;
import com.applyproof.authservice.dto.response.SignUpResponse;
import com.applyproof.authservice.exception.EmailNotVerifiedException;
import com.applyproof.authservice.exception.UserNotFoundException;
import com.applyproof.authservice.kafka.KafkaMailEventProducer;
import com.applyproof.authservice.modal.User;
import com.applyproof.authservice.repository.UserRepository;
import com.applyproof.authservice.service.redisService.RedisService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final RedisService redisService;
    private final KafkaMailEventProducer kafkaProducer;

    @Value("${app.otp.length}")
    private int otpLength; // Updated to camelCase convention

    @Value("${app.otp.expiration}")
    private int otpExpiration;

    @Value("${app.email.subject}")
    private String emailSubject;

    @Value("${app.email.body}")
    private String emailBody;

    public UserServiceImpl(
            UserRepository repository,
            RedisService redisService,
            KafkaMailEventProducer kafkaProducer
    ){
        this.repository = repository;
        this.redisService = redisService;
        this.kafkaProducer = kafkaProducer;
    }

    @Override
    public void sendOtp(EmailRequest request) {
        // Generate OTP
        String otp = generateOtp(otpLength);

        // Add OTP into the Redis cache
        redisService.set(request.email(), otp, Duration.ofSeconds(otpExpiration));

        // Build and publish Mail Event via Kafka
        MailRequest mailRequest = MailRequest.builder()
                .to(request.email())
                .subject(emailSubject)
                .body(otp + " " +emailBody)
                .build();

        kafkaProducer.publishMailEvent(mailRequest);

        log.info("Kafka email producer event produced successfully for email {}", request.email());
    }

    @Override
    public boolean verifyOtp(VerifyOtpRequest verifyOtpRequest) {
        // Check if Redis has the correct OTP for the email
        if (!verify(verifyOtpRequest.email(), verifyOtpRequest.otp())) {
            return false;
        }


        // 🔒 SECURITY FIX: Delete OTP from Redis so it cannot be reused (Replay Attack prevention)
        redisService.delete(verifyOtpRequest.email()); // (Make sure your RedisService has a delete method)

        // Find existing user or create a new one, then mark as verified and save
        User user = repository.findByEmail(verifyOtpRequest.email()).orElse(
                User.builder()
                        .email(verifyOtpRequest.email())
                        .isLoggedIn(false)
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        user.setEmailVerified(true);
        user.setUpdatedAt(LocalDateTime.now());
        repository.save(user);

        return true;
    }

    @Override
    public LoginResponse login(EmailRequest request) {
        User existingUser = repository.findByEmail(request.email())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if(!existingUser.isEmailVerified()){
            throw new EmailNotVerifiedException("Email is not verified");
        }

        existingUser.setLoggedIn(true);
        existingUser.setUpdatedAt(LocalDateTime.now());

        User loggedInUser = repository.save(existingUser);

        return LoginResponse.builder()
                .userId(loggedInUser.getId().toString())
                .email(loggedInUser.getEmail())
                .build();
    }

    @Override
    public SignUpResponse signup(EmailRequest request) {
        if (isUserExists(request.email())) {
            throw new RuntimeException("User already exists!");
        }

        User newUser = User.builder()
                .email(request.email())
                .emailVerified(true)
                .isLoggedIn(false)
                .emailVerified(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = repository.save(newUser);

        return SignUpResponse.builder()
                .userId(savedUser.getId().toString())
                .email(savedUser.getEmail())
                .build();

    }

    public boolean isUserExists(String email) {
        return repository.existsByEmail(email);
    }

    private String generateOtp(int length) {
        if (length <= 0)
            throw new IllegalArgumentException("Length must be greater than 0");

        var random = new SecureRandom();
        var otp = new StringBuilder();

        for (int i = 0; i < length; i++) {
            otp.append(random.nextInt(10));
        }

        return otp.toString();
    }

    private boolean verify(String key, String otp) {
        String value = redisService.get(key);
        return value != null && value.equals(otp);
    }
}