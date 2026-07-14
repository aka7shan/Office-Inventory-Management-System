package com.office.inventory.service;

import com.office.inventory.dto.UserResponse;
import com.office.inventory.entity.AppUser;
import com.office.inventory.exception.ResourceNotFoundException;
import com.office.inventory.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream().map(UserResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse login(String userId) {
        return UserResponse.from(findUser(userId));
    }

    @Transactional(readOnly = true)
    public AppUser findUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }
}
