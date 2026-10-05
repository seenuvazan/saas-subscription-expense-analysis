package com.saas.analytics.controller;

import com.saas.analytics.dto.UpdateProfileRequest;
import com.saas.analytics.dto.UserProfileDTO;
import com.saas.analytics.entity.User;
import com.saas.analytics.exception.ResourceNotFoundException;
import com.saas.analytics.model.Role;
import com.saas.analytics.repository.UserRepository;
import com.saas.analytics.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    private boolean isCallerAdmin(String roleHeader) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            return ((User) auth.getPrincipal()).getRole() == Role.ROLE_ADMIN;
        }
        return "ROLE_ADMIN".equalsIgnoreCase(roleHeader);
    }

    @GetMapping
    public ResponseEntity<List<UserProfileDTO>> getAllUsers(
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        if (!isCallerAdmin(roleHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDTO> getUserById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        if (!isCallerAdmin(roleHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserProfileDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProfileRequest request,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        if (!isCallerAdmin(roleHeader)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return ResponseEntity.ok(userService.updateProfile(targetUser, request, true));
    }
}
