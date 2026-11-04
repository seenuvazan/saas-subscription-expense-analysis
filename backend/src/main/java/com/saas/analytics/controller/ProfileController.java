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
import org.springframework.http.HttpStatus;
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

    /**
     * Resolves the currently authenticated user from the Spring Security context.
     * No header-based fallback — authentication is strictly JWT-based.
     */
    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return user;
        }
        throw new org.springframework.security.access.AccessDeniedException("Not authenticated");
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getMyProfile() {
        User user = getAuthenticatedUser();
        // Reload from DB to ensure fresh data (e.g. after profile update in same session)
        User freshUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in database"));
        return ResponseEntity.ok(userService.getProfile(freshUser));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateMyProfile(@Valid @RequestBody UpdateProfileRequest request) {
        User user = getAuthenticatedUser();
        User freshUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in database"));
        boolean isAdmin = freshUser.getRole() == Role.ROLE_ADMIN;
        return ResponseEntity.ok(userService.updateProfile(freshUser, request, isAdmin));
    }

    @PostMapping("/avatar")
    public ResponseEntity<UserProfileDTO> uploadAvatar(@RequestParam("file") MultipartFile file) {
        User user = getAuthenticatedUser();
        User freshUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in database"));
        return ResponseEntity.ok(userService.updateAvatar(freshUser, file));
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        User user = getAuthenticatedUser();
        User freshUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found in database"));
        userService.changePassword(freshUser, request);
        return ResponseEntity.ok(Collections.singletonMap("message", "Password changed successfully"));
    }
}
