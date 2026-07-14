package com.office.inventory.dto;

import com.office.inventory.entity.OrderItem;

public record OrderItemResponse(String name, int quantity) {
    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(item.getName(), item.getQuantity());
    }
}
