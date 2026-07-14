package com.office.inventory.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(@NotBlank String userId) {
}
