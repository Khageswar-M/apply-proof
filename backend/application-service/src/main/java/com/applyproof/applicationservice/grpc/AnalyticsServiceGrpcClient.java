package com.applyproof.applicationservice.grpc;


import application.ApplicationRecordedEvent;
import application.ApplicationStatsServiceGrpc;
import application.ApplicationStatsServiceGrpc.ApplicationStatsServiceBlockingStub;
import application.RecordApplicationResponse;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AnalyticsServiceGrpcClient {

    private final ApplicationStatsServiceBlockingStub blockingStub;

    public AnalyticsServiceGrpcClient(
        @Value("${analytic.service.address:localhost}") String serverAddress,
        @Value("${analytic.service.grpc.port:9001}")int serverPort
    ){

        try {
            log.info("Initializing gRPC channel to analytic-service at {}:{}", serverAddress, serverPort);

            ManagedChannel channel = ManagedChannelBuilder
                    .forAddress(serverAddress, serverPort)
                    .usePlaintext()
                    .build();

            this.blockingStub = ApplicationStatsServiceGrpc.newBlockingStub(channel);
            log.info("Successfully initialized AnalyticsServiceGrpcClient stub.");
        } catch (Exception e) {
            log.error("CRITICAL: Failed to initialize AnalyticsServiceGrpcClient!", e);
            throw e; // Rethrow so you see the precise stack trace in the logs
        }
    }

    public RecordApplicationResponse recordApplication(String userId, String applyDate){

        try {
            ApplicationRecordedEvent request =
                    ApplicationRecordedEvent.newBuilder()
                            .setUserId(userId)
                            .setApplyDate(applyDate)
                            .build();

            RecordApplicationResponse response =
                    blockingStub.recordApplication(request);

            log.info("Successfully recorded application stats via gRPC for user: {}",userId);
            return response;
        }catch (Exception e){
            log.error("Failed to record application via gRPC to analytic service", e);
            return RecordApplicationResponse.newBuilder().setSuccess(false).build();
        }
    }

}
