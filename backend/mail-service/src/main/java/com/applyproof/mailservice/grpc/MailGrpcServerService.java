package com.applyproof.mailservice.grpc;

import com.applyproof.mailservice.dto.request.MailRequest;
import com.applyproof.mailservice.service.MailService;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mail.MailingGrpcServiceGrpc.MailingGrpcServiceImplBase;
import mail.MailingRequest;
import mail.MailingResponse;
import org.springframework.grpc.server.service.GrpcService;

@Slf4j
@GrpcService
@RequiredArgsConstructor
public class MailGrpcServerService
    extends MailingGrpcServiceImplBase {

    private final MailService mailService;

    @Override
    public void sendingMail(
            MailingRequest request,
            StreamObserver<MailingResponse> responseObserver
    ){


        log.info("gRPC mail sending request received to {}", request.getTo());

        try {
            MailRequest mailRequest = MailRequest.builder()
                    .to(request.getTo())
                    .subject(request.getSubject())
                    .body(request.getBody())
                    .build();
            mailService.sendSimpleMail(
                    mailRequest
            );

            MailingResponse response =
                    MailingResponse.newBuilder()
                            .setSend(true)
                            .setTo(mailRequest.to())
                            .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }catch (Exception e){
            log.error("Failed to process mail sending gRPC request: {}", e.getMessage(), e);

            responseObserver.onError(
                    Status.INTERNAL
                            .withDescription("Failed to send mail: " + e.getMessage())
                            .asRuntimeException()
            );
        }
    }
}
