package com.office.inventory.controller;

import com.office.inventory.dto.DecisionRequest;
import com.office.inventory.dto.OrderRequest;
import com.office.inventory.dto.OrderResponse;
import com.office.inventory.entity.OrderStatus;
import com.office.inventory.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final String USER_HEADER = "X-User-Id";

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderResponse> list(@RequestHeader(USER_HEADER) String userId) {
        return orderService.findVisibleOrders(userId);
    }

    @GetMapping("/{orderId}")
    public OrderResponse get(@PathVariable Long orderId, @RequestHeader(USER_HEADER) String userId) {
        return orderService.findById(orderId, userId);
    }

    @PostMapping
    public OrderResponse create(
            @RequestHeader(USER_HEADER) String userId,
            @RequestParam(defaultValue = "DRAFT") OrderStatus targetStatus,
            @Valid @RequestBody OrderRequest request
    ) {
        return orderService.create(userId, targetStatus, request);
    }

    @PutMapping("/{orderId}")
    public OrderResponse update(
            @PathVariable Long orderId,
            @RequestHeader(USER_HEADER) String userId,
            @RequestParam(defaultValue = "DRAFT") OrderStatus targetStatus,
            @Valid @RequestBody OrderRequest request
    ) {
        return orderService.update(orderId, userId, targetStatus, request);
    }

    @PostMapping("/{orderId}/complete")
    public OrderResponse complete(
            @PathVariable Long orderId,
            @RequestHeader(USER_HEADER) String userId,
            @Valid @RequestBody DecisionRequest request
    ) {
        return orderService.complete(orderId, userId, request);
    }

    @PostMapping("/{orderId}/reject")
    public OrderResponse reject(
            @PathVariable Long orderId,
            @RequestHeader(USER_HEADER) String userId,
            @Valid @RequestBody DecisionRequest request
    ) {
        return orderService.reject(orderId, userId, request);
    }

    @PostMapping("/{orderId}/send-back")
    public OrderResponse sendBack(
            @PathVariable Long orderId,
            @RequestHeader(USER_HEADER) String userId,
            @Valid @RequestBody DecisionRequest request
    ) {
        return orderService.sendBack(orderId, userId, request);
    }
}
