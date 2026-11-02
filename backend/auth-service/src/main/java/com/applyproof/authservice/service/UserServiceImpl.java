package com.applyproof.authservice.service;

import com.applyproof.authservice.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{

    private final UserRepository repository;

    public UserServiceImpl(
            UserRepository repository
    ){
        this.repository = repository;
    }
}
