package com.saas.analytics.controller;

import com.saas.analytics.entity.AlertNotification;
import com.saas.analytics.service.AlertService;
import com.saas.analytics.service.RenewalSchedulerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
@CrossOrigin
public class AlertController {

    private final AlertService alertService;
    private final RenewalSchedulerService schedulerService;

    @GetMapping
    public ResponseEntity<List<AlertNotification>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    @GetMapping("/unread")
    public ResponseEntity<List<AlertNotification>> getUnreadAlerts() {
        return ResponseEntity.ok(alertService.getUnreadAlerts());
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<AlertNotification> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(alertService.markAsRead(id));
    }

    @PostMapping("/trigger-scan")
    public ResponseEntity<String> triggerScan() {
        schedulerService.runRenewalAndBudgetChecks();
        return ResponseEntity.ok("Renewal date and budget threshold check triggered successfully.");
    }
}
