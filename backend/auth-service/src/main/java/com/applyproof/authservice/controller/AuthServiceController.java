package com.applyproof.authservice.controller;

import com.applyproof.authservice.dto.response.ApiResponse;
import com.applyproof.authservice.service.UserService;
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
            @RequestParam String email
    ){
        userService.sendOtp(email);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Mail sent successfully",
                        true
                )
        );
    }
}