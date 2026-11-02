package com.applyproof.authservice.service;

import com.applyproof.authservice.dto.response.LoginResponse;
import com.applyproof.authservice.modal.User;
import com.applyproof.authservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService{

    private final UserRepository repository;

    public UserServiceImpl(
            UserRepository repository
    ){
        this.repository = repository;
    }

    @Override
    public void sendOtp(String email) {

        // Generate OTP

        // add otp in the Redis cache

        // TODO: use Kafka email-event

        // send the log
    }

    @Override
    public boolean verifyOtp(String email, String otp) {

        // if redis has the key equal to email

        // OTP verified then done
        User newUser = User.builder()
                .email(email)
                .emailVerified(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return true;
    }

    @Override
    public LoginResponse login(String email) {

        User existingUser = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not exists!"));

        // TODO: verify is user email is verified or not and return a custom exception for that

        existingUser.setLoggedIn(true);
        existingUser.setUpdatedAt(LocalDateTime.now());

        User logedInUser = repository.save(existingUser);

        return LoginResponse.builder()
                .userId(logedInUser.getEmail().toString())
                .build();
    }

    @Override
    public void signup(String email) {
        if(isUserExists(email)) return;

        User newUser = User.builder()
                .email(email)
                .emailVerified(true)
                .isLoggedIn(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = repository.save(newUser);
    }

    public boolean isUserExists(String email){
        return repository.existsByEmail(email);
    }
}
