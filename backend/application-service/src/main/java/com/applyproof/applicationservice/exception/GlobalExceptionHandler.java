package com.applyproof.applicationservice.exception;

import com.applyproof.applicationservice.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(
            MethodArgumentNotValidException ex
    ){
        HashMap<String, String> errors = new HashMap<>();

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

        log.warn("Validation failed for {}", ex.getMessage());

        return ResponseEntity.badRequest().body(response);
    }


    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleUserNotFoundException(
            UserNotFoundException ex
    ){
        var errors = new HashMap<String, String>();

        errors.put("message", ex.getMessage());

        log.info("Validation failed for {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiResponse.failure(
                        "error",
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

        log.warn("Application not found error {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiResponse.failure(
                        "error",
                        error
                )
        );
    }
}
