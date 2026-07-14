package com.office.inventory.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private InventoryOrder order;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false)
    private int quantity;

    protected OrderItem() {
    }

    public OrderItem(String name, int quantity) {
        this.name = name;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public InventoryOrder getOrder() {
        return order;
    }

    public void setOrder(InventoryOrder order) {
        this.order = order;
    }

    public String getName() {
        return name;
    }

    public int getQuantity() {
        return quantity;
    }
}
