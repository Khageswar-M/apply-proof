package com.applyproof.authservice.service;

import com.applyproof.authservice.dto.request.MailRequest;
import com.applyproof.authservice.dto.response.LoginResponse;
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
    public void sendOtp(String email) {
        // Generate OTP
        String otp = generateOtp(otpLength);

        // Add OTP into the Redis cache
        redisService.set(email, otp, Duration.ofSeconds(otpExpiration));

        // Build and publish Mail Event via Kafka
        MailRequest request = MailRequest.builder()
                .to(email)
                .subject(emailSubject)
                .body(otp + " " +emailBody)
                .build();

        kafkaProducer.publishMailEvent(request);

        log.info("Kafka email producer event produced successfully for email {}", email);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        // Check if Redis has the correct OTP for the email
        if (!verify(email, otp)) {
            return false;
        }

        // 🔒 SECURITY FIX: Delete OTP from Redis so it cannot be reused (Replay Attack prevention)
        redisService.delete(email); // (Make sure your RedisService has a delete method)

        // Find existing user or create a new one, then mark as verified and save
        User user = repository.findByEmail(email).orElse(
                User.builder()
                        .email(email)
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
    public LoginResponse login(String email) {
        User existingUser = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User does not exist!"));

        // TODO: Check if existingUser.isEmailVerified() is true before letting them log in!

        existingUser.setLoggedIn(true);
        existingUser.setUpdatedAt(LocalDateTime.now());

        User loggedInUser = repository.save(existingUser);

        return LoginResponse.builder()
                .userId(loggedInUser.getEmail()) // .toString() was redundant since email is already a String
                .build();
    }

    @Override
    public void signup(String email) {
        if (isUserExists(email)) {
            throw new RuntimeException("User already exists!");
        }

        // Signup typically triggers the OTP flow rather than saving a verified user instantly
        sendOtp(email);
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
        return value != null && value.equals(otp); // Safe null check to avoid NullPointerException
    }
}