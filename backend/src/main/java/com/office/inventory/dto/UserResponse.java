package com.office.inventory.dto;

import com.office.inventory.entity.AppUser;
import com.office.inventory.entity.UserRole;

public record UserResponse(
        String id,
        String name,
        String email,
        UserRole role,
        String department,
        String phone
) {
    public static UserResponse from(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getDepartment(),
                user.getPhone()
        );
    }
}
