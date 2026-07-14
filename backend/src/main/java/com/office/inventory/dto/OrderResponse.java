package com.office.inventory.dto;

import com.office.inventory.entity.InventoryOrder;
import com.office.inventory.entity.OrderStatus;
import com.office.inventory.entity.Priority;
import java.time.LocalDate;
import java.util.List;

public record OrderResponse(
        Long numericId,
        String id,
        String title,
        UserResponse creator,
        String creatorId,
        OrderStatus status,
        Priority priority,
        LocalDate expiryDate,
        LocalDate createdAt,
        LocalDate updatedAt,
        List<OrderItemResponse> items,
        String notes,
        String transactionReference,
        String purchaserNote
) {
    public static OrderResponse from(InventoryOrder order) {
        return new OrderResponse(
                order.getId(),
                order.getDisplayId(),
                order.getTitle(),
                UserResponse.from(order.getCreator()),
                order.getCreator().getId(),
                order.getStatus(),
                order.getPriority(),
                order.getExpiryDate(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                order.getItems().stream().map(OrderItemResponse::from).toList(),
                order.getNotes(),
                order.getTransactionReference(),
                order.getPurchaserNote()
        );
    }
}
