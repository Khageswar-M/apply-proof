package com.applyproof.applicationservice.dto.response;

import org.springframework.data.domain.Page;

import java.util.List;

public record PagedResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last,
        boolean hasNext,
        boolean hasPrevious
) {

    public static <T> PagedResponse<T> fromPage(Page<T> pageData) {

        return new PagedResponse<> (
                pageData.getContent(),
                pageData.getNumber(),
                pageData.getSize(),
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                pageData.isFirst(),
                pageData.isLast(),
                pageData.hasNext(),
                pageData.hasPrevious()
        );
    }
}
