package com.office.inventory.service;

import com.office.inventory.dto.DecisionRequest;
import com.office.inventory.dto.OrderItemRequest;
import com.office.inventory.dto.OrderRequest;
import com.office.inventory.dto.OrderResponse;
import com.office.inventory.entity.AppUser;
import com.office.inventory.entity.InventoryOrder;
import com.office.inventory.entity.OrderItem;
import com.office.inventory.entity.OrderStatus;
import com.office.inventory.entity.UserRole;
import com.office.inventory.exception.BadRequestException;
import com.office.inventory.exception.ResourceNotFoundException;
import com.office.inventory.repository.OrderRepository;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class OrderService {

    private static final Set<OrderStatus> CREATOR_EDITABLE_STATUSES = Set.of(OrderStatus.DRAFT, OrderStatus.SENT_BACK);
    private static final Set<OrderStatus> ITEM_CONFLICT_STATUSES = Set.of(OrderStatus.SUBMITTED);

    private final OrderRepository orderRepository;
    private final UserService userService;

    public OrderService(OrderRepository orderRepository, UserService userService) {
        this.orderRepository = orderRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findVisibleOrders(String userId) {
        AppUser user = userService.findUser(userId);
        List<InventoryOrder> orders = user.getRole() == UserRole.CREATOR
                ? orderRepository.findByCreatorIdOrderByUpdatedAtDesc(userId)
                : orderRepository.findByStatusNotOrderByUpdatedAtDesc(OrderStatus.DRAFT);

        return orders.stream().map(OrderResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse findById(Long orderId, String userId) {
        AppUser user = userService.findUser(userId);
        InventoryOrder order = findOrder(orderId);
        ensureVisible(order, user);
        return OrderResponse.from(order);
    }

    @Transactional
    public OrderResponse create(String userId, OrderStatus targetStatus, OrderRequest request) {
        AppUser user = userService.findUser(userId);
        ensureCreator(user);
        ensureValidTargetStatus(targetStatus);
        validateItemRequest(request.items());

        if (targetStatus == OrderStatus.SUBMITTED) {
            ensureNoSubmittedItemConflicts(request.items(), null);
        }

        LocalDate now = LocalDate.now();
        InventoryOrder order = new InventoryOrder(
                request.title().trim(),
                user,
                targetStatus,
                request.priority(),
                request.expiryDate(),
                now,
                now,
                trimToNull(request.notes())
        );
        order.replaceItems(toItems(request.items()));

        return OrderResponse.from(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse update(Long orderId, String userId, OrderStatus targetStatus, OrderRequest request) {
        AppUser user = userService.findUser(userId);
        InventoryOrder order = findOrder(orderId);

        ensureCreator(user);
        ensureOrderOwner(order, user);
        ensureCreatorCanEdit(order);
        ensureValidTargetStatus(targetStatus);
        validateItemRequest(request.items());

        if (targetStatus == OrderStatus.SUBMITTED) {
            ensureNoSubmittedItemConflicts(request.items(), orderId);
            order.setPurchaserNote(null);
        }

        order.setTitle(request.title().trim());
        order.setPriority(request.priority());
        order.setExpiryDate(request.expiryDate());
        order.setNotes(trimToNull(request.notes()));
        order.setStatus(targetStatus);
        order.setUpdatedAt(LocalDate.now());
        order.replaceItems(toItems(request.items()));

        return OrderResponse.from(order);
    }

    @Transactional
    public OrderResponse complete(Long orderId, String userId, DecisionRequest request) {
        AppUser user = userService.findUser(userId);
        InventoryOrder order = findOrder(orderId);
        ensurePurchaser(user);
        ensureSubmitted(order);

        if (!StringUtils.hasText(request.transactionReference())) {
            throw new BadRequestException("Transaction reference is required to complete a request.");
        }

        order.setStatus(OrderStatus.COMPLETED);
        order.setTransactionReference(request.transactionReference().trim());
        order.setPurchaserNote(StringUtils.hasText(request.note())
                ? request.note().trim()
                : "Completed through offline procurement.");
        order.setUpdatedAt(LocalDate.now());
        return OrderResponse.from(order);
    }

    @Transactional
    public OrderResponse reject(Long orderId, String userId, DecisionRequest request) {
        AppUser user = userService.findUser(userId);
        InventoryOrder order = findOrder(orderId);
        ensurePurchaser(user);
        ensureSubmitted(order);
        ensureNote(request.note(), "A rejection note is required.");

        order.setStatus(OrderStatus.REJECTED);
        order.setPurchaserNote(request.note().trim());
        order.setUpdatedAt(LocalDate.now());
        return OrderResponse.from(order);
    }

    @Transactional
    public OrderResponse sendBack(Long orderId, String userId, DecisionRequest request) {
        AppUser user = userService.findUser(userId);
        InventoryOrder order = findOrder(orderId);
        ensurePurchaser(user);
        ensureSubmitted(order);
        ensureNote(request.note(), "A note is required before sending the request back.");

        order.setStatus(OrderStatus.SENT_BACK);
        order.setPurchaserNote(request.note().trim());
        order.setUpdatedAt(LocalDate.now());
        return OrderResponse.from(order);
    }

    private InventoryOrder findOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
    }

    private void ensureVisible(InventoryOrder order, AppUser user) {
        if (user.getRole() == UserRole.CREATOR && !order.getCreator().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Order not found: " + order.getId());
        }
        if (user.getRole() != UserRole.CREATOR && order.getStatus() == OrderStatus.DRAFT) {
            throw new ResourceNotFoundException("Order not found: " + order.getId());
        }
    }

    private void ensureCreator(AppUser user) {
        if (user.getRole() != UserRole.CREATOR) {
            throw new BadRequestException("Only creators can create or edit requests.");
        }
    }

    private void ensurePurchaser(AppUser user) {
        if (user.getRole() != UserRole.PURCHASER) {
            throw new BadRequestException("Only purchasers can process requests.");
        }
    }

    private void ensureOrderOwner(InventoryOrder order, AppUser user) {
        if (!order.getCreator().getId().equals(user.getId())) {
            throw new BadRequestException("Only the creator who owns the request can edit it.");
        }
    }

    private void ensureCreatorCanEdit(InventoryOrder order) {
        if (!CREATOR_EDITABLE_STATUSES.contains(order.getStatus())) {
            throw new BadRequestException("Only draft or sent-back requests can be edited.");
        }
    }

    private void ensureValidTargetStatus(OrderStatus targetStatus) {
        if (targetStatus != OrderStatus.DRAFT && targetStatus != OrderStatus.SUBMITTED) {
            throw new BadRequestException("Creator can only save as draft or submit.");
        }
    }

    private void ensureSubmitted(InventoryOrder order) {
        if (order.getStatus() != OrderStatus.SUBMITTED) {
            throw new BadRequestException("Only submitted requests can be processed by purchaser.");
        }
    }

    private void ensureNote(String note, String message) {
        if (!StringUtils.hasText(note)) {
            throw new BadRequestException(message);
        }
    }

    private void validateItemRequest(List<OrderItemRequest> items) {
        Set<String> itemNames = new HashSet<>();
        for (OrderItemRequest item : items) {
            String normalizedName = item.name().trim().toLowerCase();
            if (!itemNames.add(normalizedName)) {
                throw new BadRequestException("Duplicate items are not allowed in the same request.");
            }
        }
    }

    private void ensureNoSubmittedItemConflicts(List<OrderItemRequest> items, Long editingOrderId) {
        Set<String> requestedItems = new HashSet<>();
        items.forEach(item -> requestedItems.add(item.name().trim().toLowerCase()));

        orderRepository.findByStatusInOrderByUpdatedAtDesc(ITEM_CONFLICT_STATUSES).stream()
                .filter(order -> editingOrderId == null || !order.getId().equals(editingOrderId))
                .filter(order -> order.getItems().stream()
                        .map(item -> item.getName().trim().toLowerCase())
                        .anyMatch(requestedItems::contains))
                .findFirst()
                .ifPresent(order -> {
                    throw new BadRequestException("Cannot submit because one or more items already exist in submitted request "
                            + order.getDisplayId() + ".");
                });
    }

    private List<OrderItem> toItems(List<OrderItemRequest> itemRequests) {
        return itemRequests.stream()
                .map(item -> new OrderItem(item.name().trim(), item.quantity()))
                .toList();
    }

    private String trimToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
