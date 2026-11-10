package com.applyproof.apigateway.filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Set;

@Component
public class JwtAuthFilter implements GlobalFilter, Ordered {

    private static final Set<String> PUBLIC_PATHS = Set.of(
            "/api/v1/auth/send-otp",
            "/api/v1/auth/verify-otp",
            "/api/v1/auth/refresh",
            "/api/v1/auth/login",
            "/api/v1/auth/sign-up",
            "/api/v1/auth/register"
    );

    private final WebClient webClient;

    public JwtAuthFilter(
            WebClient.Builder builder,
            @Value("${AUTH_SERVICE_URL:http://localhost:4003}") String authUrl
    ) {
        this.webClient = builder.baseUrl(authUrl).build();
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        return chain.filter(exchange);

//      TODO: uncomment this after implement all the API in the frontend

//        ServerHttpRequest request = exchange.getRequest();
//        String path = request.getURI().getPath();
//
//        if (request.getMethod() == HttpMethod.OPTIONS || PUBLIC_PATHS.contains(path)) {
//            return chain.filter(exchange);
//        }
//
//        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            return unauthorized(exchange);
//        }
//
//        return webClient.get()
//                .uri("/api/v1/auth/validate")
//                .header(HttpHeaders.AUTHORIZATION, authHeader)
//                .retrieve()
//                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
//                .map(body -> String.valueOf(body.getOrDefault("userId", "")))
//                .onErrorResume(WebClientResponseException.class, e -> Mono.just(""))
//                .defaultIfEmpty("")
//                .flatMap(userId -> {
//                    if (userId.isEmpty()) {
//                        return unauthorized(exchange);
//                    }
//                    ServerHttpRequest mutated = request.mutate()
//                            .headers(h -> {
//                                h.remove("X-User-Id");   // never trust a client-supplied value
//                                h.add("X-User-Id", userId);
//                            })
//                            .build();
//                    return chain.filter(exchange.mutate().request(mutated).build());
//                });
    }

    private Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    @Override
    public int getOrder() {
        return -1;
    }
}