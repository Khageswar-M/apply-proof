package com.applyproof.authservice.service.redisService;

import java.time.Duration;

public interface RedisService {

    // Store a value without expiration
    public void set(String key, String value);

    // Store a value with expiration
    public void set(String key, String value, Duration expiration);

    // Retrieve a value
    public String get(String key);

    // Check whether a key exists
    public boolean exists(String key);

    // Delete a key
    public boolean delete(String key);

    // Set expiration for an existing key
    public boolean expire(String key, Duration expiration);

    // Get remaining expiration time
    public Long getTTL(String key);

}
