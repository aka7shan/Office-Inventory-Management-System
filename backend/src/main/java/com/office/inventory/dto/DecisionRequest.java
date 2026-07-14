package com.office.inventory.dto;

import jakarta.validation.constraints.Size;

public record DecisionRequest(
        @Size(max = 120) String transactionReference,
        @Size(max = 1000) String note
) {
}
