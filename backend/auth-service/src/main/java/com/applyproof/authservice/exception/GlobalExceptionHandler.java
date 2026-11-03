package com.applyproof.authservice.exception;

import com.applyproof.authservice.dto.response.ApiResponse;
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

        log.warn("Validation failed for {}", ex.getMessage());

        return ResponseEntity.badRequest().body(response);
    }


    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleUserNotFoundException(
            UserNotFoundException ex
    ){

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(
                        ApiResponse.failure(
                                ex.getMessage(),
                                null
                        )
                );

    }

    @ExceptionHandler(EmailNotVerifiedException.class)
    public ResponseEntity<ApiResponse<String>> handleEmailNotVerifiedException(
            EmailNotVerifiedException ex
    ){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(
                        ApiResponse.failure(
                                ex.getMessage(),
                                null
                        )
                );
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<String>> handleUserAlreadyExistsException(
            UserAlreadyExistsException ex
    ){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(
                        ApiResponse.failure(
                                ex.getMessage(),
                                null
                        )
                );
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ApiResponse<String>> handleTokenExpiredException(
            TokenExpiredException ex
    ){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(
                        ApiResponse.failure(
                                ex.getMessage(),
                                null
                        )
                );
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ApiResponse<String>> handleInvalidTokenException(
            InvalidTokenException ex
    ){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(
                        ApiResponse.failure(
                                ex.getMessage(),
                                null
                        )
                );
    }

}
