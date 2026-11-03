package com.applyproof.authservice.service;

import com.applyproof.authservice.dto.request.MailRequest;
import com.applyproof.authservice.dto.request.EmailRequest;
import com.applyproof.authservice.dto.request.VerifyOtpRequest;
import com.applyproof.authservice.dto.response.AuthResult;
import com.applyproof.authservice.dto.response.LoginResponse;
import com.applyproof.authservice.dto.response.SignUpResponse;
import com.applyproof.authservice.dto.response.TokenPair;
import com.applyproof.authservice.exception.EmailNotVerifiedException;
import com.applyproof.authservice.exception.InvalidTokenException;
import com.applyproof.authservice.exception.UserAlreadyExistsException;
import com.applyproof.authservice.exception.UserNotFoundException;
import com.applyproof.authservice.kafka.KafkaMailEventProducer;
import com.applyproof.authservice.modal.User;
import com.applyproof.authservice.repository.UserRepository;
import com.applyproof.authservice.service.redisService.RedisService;
import com.applyproof.authservice.service.tokenService.AuthTokenService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private static final String OTP_PREFIX = "otp:";
    private static final String ATTEMPTS_PREFIX = "otp:attempts:";
    private static final int MAX_OTP_ATTEMPTS = 5;

    private final UserRepository repository;
    private final RedisService redisService;
    private final KafkaMailEventProducer kafkaProducer;
    private final AuthTokenService authTokenService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.otp.length}")
    private int otpLength;

    @Value("${app.otp.expiration}")
    private int otpExpiration;

    @Value("${app.email.subject}")
    private String emailSubject;

    @Value("${app.email.body}")
    private String emailBody;

    public UserServiceImpl(
            UserRepository repository,
            RedisService redisService,
            KafkaMailEventProducer kafkaProducer,
            AuthTokenService authTokenService
    ) {
        this.repository = repository;
        this.redisService = redisService;
        this.kafkaProducer = kafkaProducer;
        this.authTokenService = authTokenService;
    }

    @Override
    public void sendOtp(EmailRequest request) {
        String email = normalize(request.email());
        String otp = generateOtp(otpLength);

        Duration ttl = Duration.ofSeconds(otpExpiration);
        redisService.set(OTP_PREFIX + email, otp, ttl);
        redisService.delete(ATTEMPTS_PREFIX + email);   // new OTP, fresh attempt counter

        MailRequest mailRequest = MailRequest.builder()
                .to(email)
                .subject(emailSubject)
                .body(otp + " " + emailBody)
                .build();

        kafkaProducer.publishMailEvent(mailRequest);

        log.info("OTP mail event published for email {}", email);
    }

    @Override
    public boolean verifyOtp(VerifyOtpRequest request) {
        String email = normalize(request.email());

        if (!verify(email, request.otp())) {
            return false;
        }

        // Existing user (created by signup) or a brand-new one
        User user = repository.findByEmail(email).orElseGet(() ->
                User.builder()
                        .email(email)
                        .isLoggedIn(false)
                        .createdAt(LocalDateTime.now())
                        .build());

        user.setEmailVerified(true);
        user.setUpdatedAt(LocalDateTime.now());
        repository.save(user);

        return true;
    }

    @Override
    public AuthResult login(VerifyOtpRequest request) {
        String email = normalize(request.email());

        // OTP is the credential: no valid OTP, no tokens
        if (!verify(email, request.otp())) {
            throw new InvalidTokenException("Invalid or expired OTP");
        }

        User user = repository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!user.isEmailVerified()) {
            throw new EmailNotVerifiedException("Email is not verified");
        }

        user.setLoggedIn(true);
        user.setUpdatedAt(LocalDateTime.now());
        User saved = repository.save(user);

        TokenPair tokens = authTokenService.issue(saved.getEmail());

        LoginResponse userInfo = LoginResponse.builder()
                .userId(saved.getId().toString())
                .email(saved.getEmail())
                .build();

        return new AuthResult(userInfo, tokens);
    }

    @Override
    public SignUpResponse signup(EmailRequest request) {
        String email = normalize(request.email());

        if (isUserExists(email)) {
            throw new UserAlreadyExistsException(
                    "An account already exists with this email, please log in.");
        }

        User newUser = User.builder()
                .email(email)
                .emailVerified(false)            // becomes true only after OTP verification
                .isLoggedIn(false)
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
        return repository.existsByEmail(normalize(email));
    }

    // ---------- helpers ----------

    private String normalize(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        return email.trim().toLowerCase();
    }

    private String generateOtp(int length) {
        if (length <= 0) {
            throw new IllegalArgumentException("Length must be greater than 0");
        }
        StringBuilder otp = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            otp.append(secureRandom.nextInt(10));
        }
        return otp.toString();
    }

    /**
     * Checks the OTP with attempt limiting. On success the OTP is deleted (single use).
     * On failure the attempt counter goes up; after MAX_OTP_ATTEMPTS the OTP is invalidated.
     */
    private boolean verify(String email, String otp) {
        String otpKey = OTP_PREFIX + email;
        String attemptsKey = ATTEMPTS_PREFIX + email;

        int attempts = parseInt(redisService.get(attemptsKey));
        if (attempts >= MAX_OTP_ATTEMPTS) {
            redisService.delete(otpKey);
            throw new InvalidTokenException("Too many wrong attempts, please request a new OTP");
        }

        String stored = redisService.get(otpKey);
        boolean matches = stored != null && otp != null
                && MessageDigest.isEqual(
                stored.getBytes(StandardCharsets.UTF_8),
                otp.getBytes(StandardCharsets.UTF_8));

        if (!matches) {
            redisService.set(attemptsKey, String.valueOf(attempts + 1),
                    Duration.ofSeconds(otpExpiration));
            return false;
        }

        redisService.delete(otpKey);        // replay protection
        redisService.delete(attemptsKey);
        return true;
    }

    private int parseInt(String value) {
        try {
            return value == null ? 0 : Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}