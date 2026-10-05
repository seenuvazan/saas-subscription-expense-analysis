package com.saas.analytics.controller;

import com.saas.analytics.dto.ChangePasswordRequest;
import com.saas.analytics.dto.UpdateProfileRequest;
import com.saas.analytics.dto.UserProfileDTO;
import com.saas.analytics.entity.User;
import com.saas.analytics.model.Role;
import com.saas.analytics.repository.UserRepository;
import com.saas.analytics.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin
public class ProfileController {

    private final UserService userService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(String emailHeader, String roleHeader) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            return (User) auth.getPrincipal();
        }
        if (emailHeader != null && !emailHeader.trim().isEmpty()) {
            return userRepository.findByEmail(emailHeader.trim())
                    .orElseThrow(() -> new IllegalArgumentException("User not found for email: " + emailHeader));
        }
        if ("ROLE_ADMIN".equalsIgnoreCase(roleHeader)) {
            return userRepository.findByEmail("admin@company.com")
                    .orElseThrow(() -> new IllegalArgumentException("Admin account not found"));
        }
        return userRepository.findByEmail("employee@company.com")
                .orElseThrow(() -> new IllegalArgumentException("Employee account not found"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getMyProfile(
            @RequestHeader(value = "X-User-Email", required = false) String emailHeader,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        User user = getAuthenticatedUser(emailHeader, roleHeader);
        return ResponseEntity.ok(userService.getProfile(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @RequestHeader(value = "X-User-Email", required = false) String emailHeader,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        User user = getAuthenticatedUser(emailHeader, roleHeader);
        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;
        return ResponseEntity.ok(userService.updateProfile(user, request, isAdmin));
    }

    @PostMapping("/avatar")
    public ResponseEntity<UserProfileDTO> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @RequestHeader(value = "X-User-Email", required = false) String emailHeader,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        User user = getAuthenticatedUser(emailHeader, roleHeader);
        return ResponseEntity.ok(userService.updateAvatar(user, file));
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @RequestHeader(value = "X-User-Email", required = false) String emailHeader,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        User user = getAuthenticatedUser(emailHeader, roleHeader);
        userService.changePassword(user, request);
        return ResponseEntity.ok(Collections.singletonMap("message", "Password changed successfully"));
    }
}
