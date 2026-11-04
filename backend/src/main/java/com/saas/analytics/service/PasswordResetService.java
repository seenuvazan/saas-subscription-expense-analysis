package com.saas.analytics.service;

import com.saas.analytics.dto.EmailSendResult;
import com.saas.analytics.entity.PasswordResetOtp;
import com.saas.analytics.entity.User;
import com.saas.analytics.exception.EmailDeliveryException;
import com.saas.analytics.repository.PasswordResetOtpRepository;
import com.saas.analytics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final PasswordResetOtpRepository otpRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int RESEND_COOLDOWN_SECONDS = 60;
    private static final int MAX_ATTEMPTS = 5;

    @Transactional
    public Map<String, Object> requestOtp(String rawEmail) {
        String email = rawEmail.trim().toLowerCase();

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("No account registered with email: " + email);
        }

        // 60-second cooldown check on existing active OTPs
        Optional<PasswordResetOtp> latestOtp = otpRepository.findTopByEmailAndUsedFalseOrderByCreatedAtDesc(email);
        if (latestOtp.isPresent()) {
            PasswordResetOtp active = latestOtp.get();
            if (active.getCreatedAt().isAfter(LocalDateTime.now().minusSeconds(RESEND_COOLDOWN_SECONDS))) {
                long remainingSec = RESEND_COOLDOWN_SECONDS - java.time.Duration.between(active.getCreatedAt(), LocalDateTime.now()).toSeconds();
                throw new IllegalArgumentException("Please wait " + Math.max(remainingSec, 1) + " seconds before requesting a new code.");
            }
        }

        // Generate cryptographically random 6-digit code
        int code = 100_000 + secureRandom.nextInt(900_000);
        String otp = String.valueOf(code);

        // Attempt real delivery via Resend API FIRST
        // If delivery fails, we DO NOT save the OTP or trigger a cooldown lock
        EmailSendResult deliveryResult = emailService.sendOtpEmail(email, otp);
        if (!deliveryResult.success()) {
            log.warn("Password reset OTP delivery rejected for account {}: {}", email, deliveryResult.errorMessage());
            throw new EmailDeliveryException(deliveryResult.errorMessage(), deliveryResult.statusCode());
        }

        // Delivery succeeded: Invalidate prior unused OTPs for this email
        List<PasswordResetOtp> previous = otpRepository.findByEmailOrderByCreatedAtDesc(email);
        for (PasswordResetOtp p : previous) {
            if (!p.isUsed()) {
                p.setUsed(true);
                otpRepository.save(p);
            }
        }

        // Store secure BCrypt hash only (never plaintext OTP)
        PasswordResetOtp newOtp = PasswordResetOtp.builder()
                .email(email)
                .otpHash(passwordEncoder.encode(otp))
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .attempts(0)
                .used(false)
                .build();
        otpRepository.save(newOtp);

        log.info("Password reset OTP successfully dispatched and persisted for account {}", email);

        return Map.of(
                "success", true,
                "message", "A 6-digit verification code has been sent to your email address.",
                "expiresInMinutes", OTP_EXPIRY_MINUTES,
                "cooldownSeconds", RESEND_COOLDOWN_SECONDS,
                "delivered", true,
                "messageId", deliveryResult.messageId() != null ? deliveryResult.messageId() : ""
        );
    }

    @Transactional
    public Map<String, Object> verifyOtp(String rawEmail, String otp) {
        String email = rawEmail.trim().toLowerCase();
        getValidOtpRecord(email, otp);

        return Map.of(
                "success", true,
                "verified", true,
                "message", "Verification code confirmed. You may now set your new password."
        );
    }

    @Transactional
    public Map<String, Object> resetPassword(String rawEmail, String otp, String newPassword) {
        String email = rawEmail.trim().toLowerCase();
        PasswordResetOtp otpRecord = getValidOtpRecord(email, otp);

        if (newPassword == null || newPassword.trim().length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters long.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Account not found for email: " + email));

        // Mark OTP as used (one-time use only)
        otpRecord.setUsed(true);
        otpRepository.save(otpRecord);

        // Update password with BCrypt hash in existing account record
        user.setPassword(passwordEncoder.encode(newPassword.trim()));
        userRepository.save(user);

        log.info("Password successfully updated for user account ID: {}", user.getId());

        return Map.of(
                "success", true,
                "message", "Your password has been successfully reset. Please sign in with your new credentials."
        );
    }

    private PasswordResetOtp getValidOtpRecord(String email, String otp) {
        Optional<PasswordResetOtp> latestOpt = otpRepository.findTopByEmailAndUsedFalseOrderByCreatedAtDesc(email);
        if (latestOpt.isEmpty()) {
            throw new IllegalArgumentException("No active verification code found for this email. Please request a new code.");
        }

        PasswordResetOtp otpRecord = latestOpt.get();

        if (otpRecord.getExpiresAt().isBefore(LocalDateTime.now())) {
            otpRecord.setUsed(true);
            otpRepository.save(otpRecord);
            throw new IllegalArgumentException("Verification code has expired (valid for 5 minutes). Please request a new one.");
        }

        if (otpRecord.getAttempts() >= MAX_ATTEMPTS) {
            otpRecord.setUsed(true);
            otpRepository.save(otpRecord);
            throw new IllegalArgumentException("Maximum verification attempts exceeded. Please request a new code.");
        }

        if (!passwordEncoder.matches(otp.trim(), otpRecord.getOtpHash())) {
            otpRecord.setAttempts(otpRecord.getAttempts() + 1);
            otpRepository.save(otpRecord);
            int remaining = MAX_ATTEMPTS - otpRecord.getAttempts();
            throw new IllegalArgumentException("Invalid verification code. " + (remaining > 0 ? remaining + " attempts remaining." : "Please request a new code."));
        }

        return otpRecord;
    }
}
