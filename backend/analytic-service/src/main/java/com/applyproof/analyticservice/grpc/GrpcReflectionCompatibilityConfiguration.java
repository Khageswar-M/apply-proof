package com.applyproof.analyticservice.grpc;

import io.grpc.BindableService;
import io.grpc.protobuf.services.ProtoReflectionService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
class GrpcReflectionCompatibilityConfiguration {

    @Bean
    @SuppressWarnings("deprecation")
    BindableService grpcV1AlphaReflectionService() {
        return ProtoReflectionService.newInstance();
    }
}
