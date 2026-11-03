package com.applyproof.authservice.controller;

import com.applyproof.authservice.dto.request.EmailRequest;
import com.applyproof.authservice.dto.request.VerifyOtpRequest;
import com.applyproof.authservice.dto.response.ApiResponse;
import com.applyproof.authservice.dto.response.LoginResponse;
import com.applyproof.authservice.dto.response.SignUpResponse;
import com.applyproof.authservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthServiceController {

    private final UserService userService;

    public AuthServiceController(UserService userService) {
        this.userService = userService;
    }

    // Changed from @PathVariable to @RequestParam to avoid email dot-truncation bugs
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Boolean>> sendOtp(
            @RequestBody EmailRequest request
            ){
        userService.sendOtp(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Mail sent successfully",
                        true
                )
        );
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<Boolean>> verifyOtp(
            @RequestBody VerifyOtpRequest verifyOtpRequest
            ){
        boolean isVerified = userService.verifyOtp(verifyOtpRequest);

        if(!isVerified){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(
                            ApiResponse.failure(
                                    "Invalid OTP",
                                    null
                            )
                    );
        }

        return ResponseEntity.ok(
                ApiResponse.success(
                        "OTP verification successful",
                        true
                )
        );
    }


    @PostMapping("/sign-up")
    public ResponseEntity<ApiResponse<SignUpResponse>> signUp(
            @RequestBody EmailRequest emailRequest
    ){
        SignUpResponse response = userService.signup(emailRequest);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User SignedUp successfully",
                        response
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @RequestBody EmailRequest emailRequest
    ){
        LoginResponse response = userService.login(emailRequest);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "User logged-in successfully",
                        response
                )
        );
    }
}