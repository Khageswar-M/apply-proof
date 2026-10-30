package com.applyproof.applicationservice.service;

import com.applyproof.applicationservice.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

@Service
public class ApplicationServiceImpl implements ApplicationService{

    private final ApplicationRepository repository;

    public ApplicationServiceImpl(
            ApplicationRepository repository
    ){
        this.repository = repository;
    }
}
