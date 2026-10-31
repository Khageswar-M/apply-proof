package com.applyproof.analyticservice.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.HashMap;

@Builder
public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        LocalDateTime timeStamp
) {

    public static <T> ApiResponse<T> success(String message, T data){
        return new ApiResponse<>(
                true,
                message,
                data,
                LocalDateTime.now()
        );
    }

    public static <T> ApiResponse<T> failure(String message, HashMap<String, String> errors){
        return new ApiResponse<>(
                false,
                message,
                null,
                LocalDateTime.now()
        );
    }

}
