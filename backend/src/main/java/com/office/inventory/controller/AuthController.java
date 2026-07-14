package com.office.inventory.controller;

import com.office.inventory.dto.LoginRequest;
import com.office.inventory.dto.UserResponse;
import com.office.inventory.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<UserResponse> users() {
        return userService.findAll();
    }

    @PostMapping("/auth/login")
    public UserResponse login(@Valid @RequestBody LoginRequest request) {
        return userService.login(request.userId());
    }
}
