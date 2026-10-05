package com.saas.analytics.controller;

import com.saas.analytics.dto.CronCheckResult;
import com.saas.analytics.entity.CronRunLog;
import com.saas.analytics.entity.User;
import com.saas.analytics.model.Department;
import com.saas.analytics.model.Role;
import com.saas.analytics.repository.CronRunLogRepository;
import com.saas.analytics.repository.UserRepository;
import com.saas.analytics.service.RenewalCheckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cron")
@RequiredArgsConstructor
@CrossOrigin
public class CronController {

    private final RenewalCheckService renewalCheckService;
    private final CronRunLogRepository cronRunLogRepository;
    private final UserRepository userRepository;

    @PostMapping("/run-check")
    public ResponseEntity<CronCheckResult> runCheck(
            @RequestParam(required = false) Department department,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Department", required = false) String deptHeader,
            @RequestHeader(value = "X-User-Email", required = false) String emailHeader
    ) {
        Department targetDept = null;
        String userIdentifier = "Finance Admin";

        // 1. Resolve from SecurityContext
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = null;
        if (auth != null && auth.getPrincipal() instanceof User) {
            currentUser = (User) auth.getPrincipal();
        } else if (emailHeader != null) {
            currentUser = userRepository.findByEmail(emailHeader).orElse(null);
        }

        if (currentUser != null) {
            userIdentifier = currentUser.getFullName();
            if (currentUser.getRole() == Role.ROLE_EMPLOYEE) {
                targetDept = currentUser.getDepartment();
            } else {
                targetDept = department; // Admin can specify or run all
            }
        } else {
            // Fallback for demo role switches
            if ("ROLE_EMPLOYEE".equalsIgnoreCase(roleHeader)) {
                userIdentifier = "Alex Morgan (Employee)";
                if (deptHeader != null) {
                    try {
                        targetDept = Department.valueOf(deptHeader.toUpperCase());
                    } catch (Exception ignored) {
                        targetDept = Department.ENGINEERING;
                    }
                } else {
                    targetDept = Department.ENGINEERING;
                }
            } else {
                userIdentifier = "Sarah Jenkins (Finance Admin)";
                targetDept = department;
            }
        }

        CronCheckResult result = renewalCheckService.runRenewalCheck(targetDept, "manual", userIdentifier);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<List<CronRunLog>> getHistory() {
        return ResponseEntity.ok(cronRunLogRepository.findTop10ByOrderByRanAtDesc());
    }
}
