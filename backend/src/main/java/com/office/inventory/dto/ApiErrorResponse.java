package com.office.inventory.dto;

import java.time.Instant;
import java.util.List;

public record ApiErrorResponse(
        Instant timestamp,
        int status,
        String error,
        List<String> messages
) {
    public static ApiErrorResponse of(int status, String error, List<String> messages) {
        return new ApiErrorResponse(Instant.now(), status, error, messages);
    }
}
