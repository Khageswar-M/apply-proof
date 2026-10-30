package com.applyproof.applicationservice.exception;

import com.applyproof.applicationservice.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(
            MethodArgumentNotValidException ex
    ){
        var errors = new HashMap<String, String>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(
                        error -> errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        ApiResponse<Map<String, String>> response =
                ApiResponse.failure(
                        "Validation failed",
                        errors
                );

        return ResponseEntity.badRequest().body(response);
    }


    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleUserNotFoundException(
            UserNotFoundException ex
    ){
        var errors = new HashMap<String, String>();

        errors.put("message", "User not found");

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiResponse.failure(
                        "User Id not found, please login again.",
                        errors
                )
        );
    }

    @ExceptionHandler(ApplicationNotFoundException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleApplicationNotFoundException(
            ApplicationNotFoundException ex
    ){
        var error = new HashMap<String, String>();

        error.put("error", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiResponse.failure(
                        "Application not found error",
                        error
                )
        );
    }
}
