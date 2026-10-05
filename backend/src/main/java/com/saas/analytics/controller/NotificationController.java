package com.saas.analytics.controller;

import com.saas.analytics.entity.AlertNotification;
import com.saas.analytics.entity.User;
import com.saas.analytics.model.Department;
import com.saas.analytics.model.Role;
import com.saas.analytics.repository.AlertNotificationRepository;
import com.saas.analytics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin
public class NotificationController {

    private final AlertNotificationRepository alertRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<AlertNotification>> getNotifications(
            @RequestParam(required = false) Department department,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Department", required = false) String deptHeader,
            @RequestHeader(value = "X-User-Email", required = false) String emailHeader
    ) {
        Department targetDept = department;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = null;
        if (auth != null && auth.getPrincipal() instanceof User) {
            currentUser = (User) auth.getPrincipal();
        } else if (emailHeader != null) {
            currentUser = userRepository.findByEmail(emailHeader).orElse(null);
        }

        if (currentUser != null && currentUser.getRole() == Role.ROLE_EMPLOYEE) {
            targetDept = currentUser.getDepartment();
        } else if (currentUser == null && "ROLE_EMPLOYEE".equalsIgnoreCase(roleHeader)) {
            if (deptHeader != null) {
                try {
                    targetDept = Department.valueOf(deptHeader.toUpperCase());
                } catch (Exception ignored) {
                    targetDept = Department.ENGINEERING;
                }
            } else {
                targetDept = Department.ENGINEERING;
            }
        }

        List<AlertNotification> list;
        if (targetDept != null) {
            list = alertRepository.findByTargetDepartmentOrderByCreatedAtDesc(targetDept);
        } else {
            list = alertRepository.findAllByOrderByCreatedAtDesc();
        }

        return ResponseEntity.ok(list);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<AlertNotification> markAsRead(@PathVariable Long id) {
        AlertNotification notification = alertRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with id: " + id));
        notification.setIsRead(true);
        return ResponseEntity.ok(alertRepository.save(notification));
    }

    @PatchMapping("/read-all")
    @Transactional
    public ResponseEntity<Map<String, String>> markAllAsRead(
            @RequestParam(required = false) Department department,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Department", required = false) String deptHeader,
            @RequestHeader(value = "X-User-Email", required = false) String emailHeader
    ) {
        Department targetDept = department;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = null;
        if (auth != null && auth.getPrincipal() instanceof User) {
            currentUser = (User) auth.getPrincipal();
        } else if (emailHeader != null) {
            currentUser = userRepository.findByEmail(emailHeader).orElse(null);
        }

        if (currentUser != null && currentUser.getRole() == Role.ROLE_EMPLOYEE) {
            targetDept = currentUser.getDepartment();
        } else if (currentUser == null && "ROLE_EMPLOYEE".equalsIgnoreCase(roleHeader)) {
            if (deptHeader != null) {
                try {
                    targetDept = Department.valueOf(deptHeader.toUpperCase());
                } catch (Exception ignored) {
                    targetDept = Department.ENGINEERING;
                }
            } else {
                targetDept = Department.ENGINEERING;
            }
        }

        alertRepository.markAllAsRead(targetDept);
        return ResponseEntity.ok(Collections.singletonMap("message", "All notifications marked as read"));
    }
}
