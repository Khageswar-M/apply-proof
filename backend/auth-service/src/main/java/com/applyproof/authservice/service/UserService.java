package com.applyproof.authservice.service;

import com.applyproof.authservice.dto.response.LoginResponse;

public interface UserService {

    void sendOtp(String email);

    boolean verifyOtp(String email, String otp);

    LoginResponse login(String email);

    void signup(String email);
}
