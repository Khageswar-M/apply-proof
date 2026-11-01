package com.applyproof.applicationservice.grpc;


import com.applyproof.application.grpc.ApplicationRecordedEvent;
import com.applyproof.application.grpc.ApplicationStatsServiceGrpc;
import com.applyproof.application.grpc.RecordApplicationResponse;
import io.grpc.ManagedChannel;
import io.grpc.StatusRuntimeException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.grpc.client.GrpcChannelFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Slf4j
@Service
public class AnalyticsServiceGrpcClient {

    private ApplicationStatsServiceGrpc.ApplicationStatsServiceBlockingStub statsServiceStub;

    // The official spring gRPC starter provides GrpcChannelFactory automatically
    public AnalyticsServiceGrpcClient(
            GrpcChannelFactory channelFactory
    ){
        // "analytic-service" matches your target configuration key
        ManagedChannel channel =
                channelFactory.createChannel("analytic-service");
        this.statsServiceStub =
                ApplicationStatsServiceGrpc.newBlockingStub(channel);
    }

    public void sendApplicationRecordedEvent(
            UUID userId, LocalDate applyDate
    ){
        if(userId == null || applyDate == null){
            log.warn("Skipping gRPC call: userId or applyDate is null");
            return;
        }

        try {
            ApplicationRecordedEvent request =
                    ApplicationRecordedEvent.newBuilder()
                            .setUserId(userId.toString())
                            .setApplyDate(applyDate.toString())
                            .build();

            log.info("Sending gRPC request to the analytic-service for user ID: {} on date: {}", userId, applyDate);

            RecordApplicationResponse response =
                    statsServiceStub.recordApplication(request);

            if(response.getSuccess()){
                log.info("Successfully recorded application stats via gRPC for user ID: {}", userId);
            }else{
                log.warn("Analytic service processed request fo user ID: {}, but returned success = false", userId);
            }
        }catch (StatusRuntimeException e){
            log.error("gRPC communication failed while calling analytic-service for user ID: {}: Status [{}], Description [{}]", userId, e.getStatus().getCause(), e.getStatus().getDescription(), e);
        }catch (Exception e){
            log.error("Unexpected error occurred while communicating with analytics-service for user ID {}: {}", userId, e.getMessage(), e);
        }
    }

}
