package com.office.inventory.repository;

import com.office.inventory.entity.InventoryOrder;
import com.office.inventory.entity.OrderStatus;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<InventoryOrder, Long> {

    @EntityGraph(attributePaths = {"creator", "items"})
    List<InventoryOrder> findAllByOrderByUpdatedAtDesc();

    @EntityGraph(attributePaths = {"creator", "items"})
    List<InventoryOrder> findByCreatorIdOrderByUpdatedAtDesc(String creatorId);

    @EntityGraph(attributePaths = {"creator", "items"})
    List<InventoryOrder> findByStatusNotOrderByUpdatedAtDesc(OrderStatus status);

    @EntityGraph(attributePaths = {"creator", "items"})
    List<InventoryOrder> findByStatusInOrderByUpdatedAtDesc(Collection<OrderStatus> statuses);
}
