package com.applyproof.authservice.service;

import com.applyproof.authservice.dto.request.EmailRequest;
import com.applyproof.authservice.dto.request.VerifyOtpRequest;
import com.applyproof.authservice.dto.response.AuthResult;
import com.applyproof.authservice.dto.response.LoginResponse;
import com.applyproof.authservice.dto.response.SignUpResponse;

public interface UserService {
    void sendOtp(EmailRequest request);
    boolean verifyOtp(VerifyOtpRequest request);
    AuthResult login(VerifyOtpRequest request);      // changed
    SignUpResponse signup(EmailRequest request);
}
