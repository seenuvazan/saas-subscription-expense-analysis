package com.saas.analytics.controller;

import com.saas.analytics.dto.SubscriptionCreateRequest;
import com.saas.analytics.dto.SubscriptionDTO;
import com.saas.analytics.entity.User;
import com.saas.analytics.model.Category;
import com.saas.analytics.model.Department;
import com.saas.analytics.model.SubscriptionStatus;
import com.saas.analytics.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@CrossOrigin
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<SubscriptionDTO> createSubscription(
            @Valid @RequestBody SubscriptionCreateRequest request,
            @AuthenticationPrincipal User loggedInUser) {
        SubscriptionDTO created = subscriptionService.createSubscription(request, loggedInUser);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionDTO>> getSubscriptions(
            @RequestParam(required = false) Department department,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) SubscriptionStatus status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions(department, category, status, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionDTO> getSubscriptionById(@PathVariable Long id) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionDTO> updateSubscription(
            @PathVariable Long id,
            @Valid @RequestBody SubscriptionCreateRequest request) {
        return ResponseEntity.ok(subscriptionService.updateSubscription(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SubscriptionDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusBody) {
        SubscriptionStatus newStatus = SubscriptionStatus.valueOf(statusBody.get("status").toUpperCase());
        return ResponseEntity.ok(subscriptionService.updateSubscriptionStatus(id, newStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubscription(@PathVariable Long id) {
        subscriptionService.deleteSubscription(id);
        return ResponseEntity.noContent().build();
    }
}
