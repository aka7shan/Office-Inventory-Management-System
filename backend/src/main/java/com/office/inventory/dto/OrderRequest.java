package com.office.inventory.dto;

import com.office.inventory.entity.Priority;
import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public record OrderRequest(
        @NotBlank @Size(max = 120) String title,
        @NotNull Priority priority,
        @NotNull @FutureOrPresent LocalDate expiryDate,
        @Size(max = 1000) String notes,
        @NotEmpty List<@Valid OrderItemRequest> items
) {
}
