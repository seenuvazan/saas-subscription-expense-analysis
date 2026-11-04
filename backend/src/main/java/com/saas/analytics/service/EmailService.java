package com.saas.analytics.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saas.analytics.dto.EmailSendResult;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    @Value("${resend.api-key}")
    private String resendApiKey;

    @Value("${resend.from-email:SaaSOptima <onboarding@resend.dev>}")
    private String resendFromEmail;

    private final ObjectMapper objectMapper;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @PostConstruct
    public void init() {
        boolean configured = isApiKeyConfigured();
        String keyStatus = configured
                ? String.format("CONFIGURED (starts with %s, length %d)",
                resendApiKey.trim().startsWith("re_") ? "re_***" : "***",
                resendApiKey.trim().length())
                : "NOT CONFIGURED (placeholder/empty)";

        log.info("EmailService initialized. Sender: '{}', Resend API Key: {}", resendFromEmail, keyStatus);
    }

    public boolean isApiKeyConfigured() {
        return resendApiKey != null && !resendApiKey.isBlank() && !resendApiKey.equals("re_default_placeholder");
    }

    /**
     * Send password reset verification code via Resend transactional email API.
     * Never logs plaintext OTPs or secret keys.
     */
    public EmailSendResult sendOtpEmail(String recipientEmail, String otpCode) {
        String maskedEmail = maskEmail(recipientEmail);
        log.info("Initiating password-reset OTP email dispatch to {}", maskedEmail);

        if (!isApiKeyConfigured()) {
            String err = "RESEND_API_KEY is not configured in the backend environment. "
                    + "Please obtain an API key from https://resend.com/api-keys and configure RESEND_API_KEY.";
            log.warn("Cannot dispatch OTP email: {}", err);
            return EmailSendResult.failure(err, 500);
        }

        try {
            String htmlContent = buildOtpHtml(otpCode);
            Map<String, Object> payloadMap = Map.of(
                    "from", resendFromEmail.trim(),
                    "to", List.of(recipientEmail.trim()),
                    "subject", "Your SaaSOptima Verification Code",
                    "html", htmlContent
            );
            String jsonPayload = objectMapper.writeValueAsString(payloadMap);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .timeout(Duration.ofSeconds(15))
                    .header("Authorization", "Bearer " + resendApiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                String messageId = extractMessageId(response.body());
                log.info("Successfully delivered OTP email via Resend to {} (messageId: {}, status: {})",
                        maskedEmail, messageId != null ? messageId : "accepted", response.statusCode());
                return EmailSendResult.success(messageId, response.statusCode());
            } else {
                String errorDetail = parseResendError(response.body(), response.statusCode());
                log.error("Resend API rejected email delivery to {}. Status: {}, Error: {}",
                        maskedEmail, response.statusCode(), errorDetail);
                return EmailSendResult.failure(errorDetail, response.statusCode());
            }
        } catch (Exception e) {
            String err = "Network error connecting to Resend API: " + e.getMessage();
            log.error("Exception during email dispatch to {}: {}", maskedEmail, err);
            return EmailSendResult.failure(err, 500);
        }
    }

    private String extractMessageId(String body) {
        try {
            JsonNode root = objectMapper.readTree(body);
            if (root.has("id")) {
                return root.get("id").asText();
            }
        } catch (Exception ignored) {}
        return null;
    }

    private String parseResendError(String body, int statusCode) {
        String parsedMsg = null;
        try {
            JsonNode root = objectMapper.readTree(body);
            if (root.has("message")) {
                parsedMsg = root.get("message").asText();
            }
        } catch (Exception ignored) {}

        if (statusCode == 401) {
            return "Resend API authentication failed (HTTP 401): The configured RESEND_API_KEY is invalid or expired. Check your key at https://resend.com/api-keys.";
        }

        if (statusCode == 403) {
            if (parsedMsg != null && parsedMsg.contains("only send testing emails")) {
                return "Resend restriction (HTTP 403): Default sender 'onboarding@resend.dev' can only deliver to the email address registered on your Resend account. To send to other inboxes, verify a custom domain at https://resend.com/domains.";
            }
            return "Resend authorization error (HTTP 403): " + (parsedMsg != null ? parsedMsg : "Sender or domain is unauthorized.");
        }

        if (statusCode == 422) {
            return "Resend validation error (HTTP 422): " + (parsedMsg != null ? parsedMsg : "Invalid email format or sender configuration.");
        }

        return "Resend API error (HTTP " + statusCode + "): " + (parsedMsg != null ? parsedMsg : body);
    }

    private String buildOtpHtml(String otpCode) {
        return "<!DOCTYPE html>"
                + "<html><head><meta charset='utf-8'></head>"
                + "<body style='font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background-color:#F8FAFC;margin:0;padding:24px;color:#0F172A;'>"
                + "<div style='max-width:520px;margin:0 auto;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:36px;box-shadow:0 4px 16px rgba(0,0,0,0.04);'>"
                + "<div style='display:flex;align-items:center;gap:10px;margin-bottom:24px;'>"
                + "<div style='width:36px;height:36px;border-radius:10px;background:#2563EB;display:inline-block;text-align:center;line-height:36px;color:#FFFFFF;font-weight:bold;font-size:18px;'>S</div>"
                + "<span style='font-size:20px;font-weight:bold;color:#0F172A;margin-left:10px;vertical-align:middle;'>SaaSOptima</span>"
                + "</div>"
                + "<h2 style='font-size:22px;font-weight:800;color:#0F172A;margin:0 0 12px 0;'>Password Reset Verification Code</h2>"
                + "<p style='font-size:14px;color:#475569;line-height:1.6;margin:0 0 24px 0;'>We received a request to reset the password for your SaaSOptima account. Use the following 6-digit code to complete the verification:</p>"
                + "<div style='background:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px 0;'>"
                + "<span style='font-family:monospace;font-size:36px;font-weight:900;letter-spacing:8px;color:#1D4ED8;'>" + otpCode + "</span>"
                + "</div>"
                + "<p style='font-size:13px;color:#64748B;line-height:1.5;margin:0 0 16px 0;'><strong>Security Information:</strong></p>"
                + "<ul style='font-size:13px;color:#64748B;line-height:1.6;margin:0 0 24px 0;padding-left:20px;'>"
                + "<li>This code expires in <strong>5 minutes</strong>.</li>"
                + "<li>It can only be used once.</li>"
                + "<li>Never share this code with anyone. SaaSOptima will never ask for your verification code.</li>"
                + "</ul>"
                + "<p style='font-size:12px;color:#94A3B8;border-top:1px solid #E2E8F0;padding-top:16px;margin:0;'>If you did not request a password reset, you can safely ignore this email. Your account remains secure.</p>"
                + "</div>"
                + "</body></html>";
    }

    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "***";
        int atIndex = email.indexOf('@');
        String name = email.substring(0, atIndex);
        String domain = email.substring(atIndex);
        if (name.length() <= 2) {
            return name.charAt(0) + "***" + domain;
        }
        return name.charAt(0) + "***" + name.charAt(name.length() - 1) + domain;
    }
}
