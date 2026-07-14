package com.office.inventory.config;

import com.office.inventory.entity.AppUser;
import com.office.inventory.entity.InventoryOrder;
import com.office.inventory.entity.OrderItem;
import com.office.inventory.entity.OrderStatus;
import com.office.inventory.entity.Priority;
import com.office.inventory.entity.UserRole;
import com.office.inventory.repository.OrderRepository;
import com.office.inventory.repository.UserRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public DataSeeder(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        if (orderRepository.count() == 0) {
            seedOrders();
        }
    }

    private void seedUsers() {
        userRepository.saveAll(List.of(
                new AppUser("u-1001", "Akarshan Sharma", "akarshan.creator@office.local", UserRole.CREATOR, "Engineering", "+91 98765 10001"),
                new AppUser("u-1002", "Arjun Mehta", "arjun.creator@office.local", UserRole.CREATOR, "Operations", "+91 98765 10002"),
                new AppUser("u-2001", "Priya Nair", "priya.purchaser@office.local", UserRole.PURCHASER, "Procurement", "+91 98765 20001"),
                new AppUser("u-3001", "Sameer Khan", "sameer.manager@office.local", UserRole.MANAGER, "Administration", "+91 98765 30001")
        ));
    }

    private void seedOrders() {
        AppUser akarshan = userRepository.getReferenceById("u-1001");
        AppUser arjun = userRepository.getReferenceById("u-1002");

        InventoryOrder draft = createOrder(
                "Engineering onboarding supplies",
                akarshan,
                OrderStatus.DRAFT,
                Priority.MEDIUM,
                LocalDate.of(2026, 8, 15),
                LocalDate.of(2026, 7, 9),
                LocalDate.of(2026, 7, 9),
                "For new engineering hires joining next month.",
                List.of(new OrderItem("Laptop Stand", 12), new OrderItem("USB-C Hub", 12))
        );

        InventoryOrder submitted = createOrder(
                "Monthly pantry stationery",
                arjun,
                OrderStatus.SUBMITTED,
                Priority.HIGH,
                LocalDate.of(2026, 7, 25),
                LocalDate.of(2026, 7, 11),
                LocalDate.of(2026, 7, 12),
                "Needed before the audit preparation cycle.",
                List.of(new OrderItem("A4 Paper Ream", 40), new OrderItem("Whiteboard Markers", 25))
        );

        InventoryOrder sentBack = createOrder(
                "Procurement for admin seating",
                akarshan,
                OrderStatus.SENT_BACK,
                Priority.LOW,
                LocalDate.of(2026, 8, 1),
                LocalDate.of(2026, 7, 10),
                LocalDate.of(2026, 7, 13),
                "Replacement for damaged chairs on floor 4.",
                List.of(new OrderItem("Ergonomic Chair", 6))
        );
        sentBack.setPurchaserNote("Please attach cost center confirmation before resubmitting.");

        InventoryOrder completed = createOrder(
                "Printer supplies for finance",
                arjun,
                OrderStatus.COMPLETED,
                Priority.MEDIUM,
                LocalDate.of(2026, 7, 20),
                LocalDate.of(2026, 7, 3),
                LocalDate.of(2026, 7, 8),
                "Finance printer toner refill.",
                List.of(new OrderItem("Printer Toner", 8))
        );
        completed.setTransactionReference("PO-77821");
        completed.setPurchaserNote("Completed through offline procurement.");

        InventoryOrder rejected = createOrder(
                "Desk accessories refresh",
                akarshan,
                OrderStatus.REJECTED,
                Priority.LOW,
                LocalDate.of(2026, 7, 29),
                LocalDate.of(2026, 7, 5),
                LocalDate.of(2026, 7, 6),
                "General desk accessories.",
                List.of(new OrderItem("Desk Organizer", 20), new OrderItem("Sticky Notes", 30))
        );
        rejected.setPurchaserNote("Rejected because the same category was fulfilled last week.");

        orderRepository.saveAll(List.of(draft, submitted, sentBack, completed, rejected));
    }

    private InventoryOrder createOrder(
            String title,
            AppUser creator,
            OrderStatus status,
            Priority priority,
            LocalDate expiryDate,
            LocalDate createdAt,
            LocalDate updatedAt,
            String notes,
            List<OrderItem> items
    ) {
        InventoryOrder order = new InventoryOrder(title, creator, status, priority, expiryDate, createdAt, updatedAt, notes);
        order.replaceItems(items);
        return order;
    }
}
