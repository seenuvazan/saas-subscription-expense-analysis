package com.saas.analytics.service;

import com.saas.analytics.config.JwtUtils;
import com.saas.analytics.dto.AuthRequest;
import com.saas.analytics.dto.AuthResponse;
import com.saas.analytics.dto.RegisterRequest;
import com.saas.analytics.entity.User;
import com.saas.analytics.model.Department;
import com.saas.analytics.model.Role;
import com.saas.analytics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthResponse register(RegisterRequest request) {
        // Check for existing account
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("An account with this email already exists");
        }

        String firstName = request.getFirstName().trim();
        String lastName  = request.getLastName().trim();
        String fullName  = firstName + " " + lastName;

        // All new registrations are employees — admins are promoted post-registration
        Department dept = request.getDepartment() != null ? request.getDepartment() : Department.ENGINEERING;

        User user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .fullName(fullName)
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .department(dept)
                .role(Role.ROLE_EMPLOYEE)
                .build();

        userRepository.save(user);

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return buildResponse(user, token);
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        boolean rememberMe = Boolean.TRUE.equals(request.getRememberMe());
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name(), rememberMe);

        return buildResponse(user, token);
    }

    private AuthResponse buildResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .jobTitle(user.getJobTitle())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .department(user.getDepartment())
                .role(user.getRole())
                .build();
    }
}
