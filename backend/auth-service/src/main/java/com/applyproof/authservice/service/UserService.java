package com.applyproof.authservice.service;

import com.applyproof.authservice.dto.request.EmailRequest;
import com.applyproof.authservice.dto.request.VerifyOtpRequest;
import com.applyproof.authservice.dto.response.LoginResponse;
import com.applyproof.authservice.dto.response.SignUpResponse;

public interface UserService {

    void sendOtp(EmailRequest request);

    boolean verifyOtp(VerifyOtpRequest verifyOtpRequest);

    LoginResponse login(EmailRequest request);

    SignUpResponse signup(EmailRequest request);
}
