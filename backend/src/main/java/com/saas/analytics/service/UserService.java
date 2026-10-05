package com.saas.analytics.service;

import com.saas.analytics.dto.ChangePasswordRequest;
import com.saas.analytics.dto.UpdateProfileRequest;
import com.saas.analytics.dto.UserProfileDTO;
import com.saas.analytics.entity.User;
import com.saas.analytics.exception.CustomValidationException;
import com.saas.analytics.exception.ResourceNotFoundException;
import com.saas.analytics.model.Role;
import com.saas.analytics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final Pattern PHONE_PATTERN = Pattern.compile("^[+0-9\\s\\-\\(\\)]{7,20}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$");

    public UserProfileDTO getProfile(User user) {
        return UserProfileDTO.fromEntity(user);
    }

    public List<UserProfileDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserProfileDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public UserProfileDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return UserProfileDTO.fromEntity(user);
    }

    @Transactional
    public UserProfileDTO updateProfile(User targetUser, UpdateProfileRequest request, boolean isElevatedAdmin) {
        Map<String, String> errors = new HashMap<>();

        // 1. Validation
        if (request.getFirstName() == null || request.getFirstName().trim().length() < 2 || request.getFirstName().trim().length() > 50) {
            errors.put("firstName", "First name must be between 2 and 50 characters");
        }

        if (request.getLastName() == null || request.getLastName().trim().length() < 2 || request.getLastName().trim().length() > 50) {
            errors.put("lastName", "Last name must be between 2 and 50 characters");
        }

        if (request.getEmail() == null || !EMAIL_PATTERN.matcher(request.getEmail().trim()).matches()) {
            errors.put("email", "Please provide a valid email address");
        } else {
            String newEmail = request.getEmail().trim();
            userRepository.findByEmail(newEmail).ifPresent(existing -> {
                if (!existing.getId().equals(targetUser.getId())) {
                    errors.put("email", "This email is already in use by another account");
                }
            });
        }

        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            if (!PHONE_PATTERN.matcher(request.getPhone().trim()).matches()) {
                errors.put("phone", "Please provide a valid phone number (e.g. +1 555-123-4567)");
            }
        }

        if (request.getDateOfBirth() != null) {
            LocalDate dob = request.getDateOfBirth();
            LocalDate today = LocalDate.now();
            if (!dob.isBefore(today)) {
                errors.put("dateOfBirth", "Date of birth must be in the past");
            } else if (Period.between(dob, today).getYears() < 16) {
                errors.put("dateOfBirth", "User must be at least 16 years old");
            }
        }

        if (request.getBio() != null && request.getBio().length() > 250) {
            errors.put("bio", "Bio must not exceed 250 characters (" + request.getBio().length() + "/250)");
        }

        if (!errors.isEmpty()) {
            throw new CustomValidationException(errors);
        }

        // 2. Apply modifications
        targetUser.setFirstName(request.getFirstName().trim());
        targetUser.setLastName(request.getLastName().trim());
        targetUser.setEmail(request.getEmail().trim().toLowerCase());
        targetUser.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        targetUser.setDateOfBirth(request.getDateOfBirth());
        targetUser.setGender(request.getGender() != null ? request.getGender().trim() : null);
        targetUser.setLocation(request.getLocation() != null ? request.getLocation().trim() : null);
        targetUser.setBio(request.getBio() != null ? request.getBio().trim() : null);
        if (request.getAvatarUrl() != null) {
            targetUser.setAvatarUrl(request.getAvatarUrl());
        }

        // Work info permissions:
        // Admin editing an employee (or admin editing self) can update jobTitle and department
        if (isElevatedAdmin || targetUser.getRole() == Role.ROLE_ADMIN) {
            if (request.getDepartment() != null) {
                targetUser.setDepartment(request.getDepartment());
            }
            if (request.getJobTitle() != null && !request.getJobTitle().trim().isEmpty()) {
                targetUser.setJobTitle(request.getJobTitle().trim());
            }
        } else {
            // Standard employee editing their own profile: department and employeeId are read-only
            // Job title: can only update if employee is permitted or preserve current
            if (request.getJobTitle() != null && !request.getJobTitle().trim().isEmpty()) {
                targetUser.setJobTitle(request.getJobTitle().trim());
            }
        }

        targetUser.syncFullName();
        User saved = userRepository.save(targetUser);
        return UserProfileDTO.fromEntity(saved);
    }

    @Transactional
    public UserProfileDTO updateAvatar(User user, MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty");
        }
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new IllegalArgumentException("Avatar image file size must be less than 2 MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png") && !contentType.equals("image/webp"))) {
            throw new IllegalArgumentException("Only JPEG, PNG, and WebP images are supported");
        }

        try {
            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
            String dataUrl = "data:" + contentType + ";base64," + base64Image;
            user.setAvatarUrl(dataUrl);
            User saved = userRepository.save(user);
            return UserProfileDTO.fromEntity(saved);
        } catch (IOException e) {
            throw new RuntimeException("Failed to process avatar file: " + e.getMessage());
        }
    }

    @Transactional
    public void changePassword(User user, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            Map<String, String> errors = new HashMap<>();
            errors.put("currentPassword", "Current password does not match");
            throw new CustomValidationException(errors);
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            Map<String, String> errors = new HashMap<>();
            errors.put("newPassword", "New password must be at least 6 characters long");
            throw new CustomValidationException(errors);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
