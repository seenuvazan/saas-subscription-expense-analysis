package com.saas.analytics.controller;

import com.saas.analytics.dto.AuthRequest;
import com.saas.analytics.dto.AuthResponse;
import com.saas.analytics.dto.RegisterRequest;
import com.saas.analytics.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final com.saas.analytics.service.PasswordResetService passwordResetService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody com.saas.analytics.dto.ForgotPasswordRequest request) {
        return ResponseEntity.ok(passwordResetService.requestOtp(request.getEmail()));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody com.saas.analytics.dto.VerifyOtpRequest request) {
        return ResponseEntity.ok(passwordResetService.verifyOtp(request.getEmail(), request.getOtp()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody com.saas.analytics.dto.ResetPasswordRequest request) {
        return ResponseEntity.ok(passwordResetService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword()));
    }
}
