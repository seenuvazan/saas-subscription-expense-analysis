package com.saas.analytics.service;

import com.saas.analytics.dto.CronCheckResult;
import com.saas.analytics.entity.AlertNotification;
import com.saas.analytics.entity.CronRunLog;
import com.saas.analytics.entity.DepartmentBudget;
import com.saas.analytics.entity.Subscription;
import com.saas.analytics.model.*;
import com.saas.analytics.repository.AlertNotificationRepository;
import com.saas.analytics.repository.CronRunLogRepository;
import com.saas.analytics.repository.DepartmentBudgetRepository;
import com.saas.analytics.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RenewalCheckService {

    private static final Logger log = LoggerFactory.getLogger(RenewalCheckService.class);

    private final SubscriptionRepository subscriptionRepository;
    private final DepartmentBudgetRepository budgetRepository;
    private final AlertNotificationRepository alertRepository;
    private final CronRunLogRepository cronRunLogRepository;

    /**
     * Daily scheduled job at 9:00 AM.
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void scheduledDailyCheck() {
        log.info("Executing scheduled daily renewal check at 9:00 AM...");
        runRenewalCheck(null, "scheduled", "System Scheduler");
    }

    /**
     * Scans subscriptions for upcoming/overdue renewals, underutilization, and budget limits.
     * Prevents duplicate alerts for the same subscription and day-threshold.
     */
    @Transactional
    public CronCheckResult runRenewalCheck(Department departmentFilter, String triggeredBy, String userIdentifier) {
        LocalDate today = LocalDate.now();
        List<Subscription> subscriptions;

        if (departmentFilter != null) {
            subscriptions = subscriptionRepository.findByDepartment(departmentFilter);
        } else {
            subscriptions = subscriptionRepository.findAll();
        }

        int checkedCount = 0;
        int notificationsCreated = 0;
        int expiringSoon = 0;
        int overdue = 0;
        int underused = 0;

        for (Subscription sub : subscriptions) {
            if (sub.getStatus() == SubscriptionStatus.CANCELLED || sub.getNextRenewalDate() == null) {
                continue;
            }

            checkedCount++;
            long daysUntilRenewal = ChronoUnit.DAYS.between(today, sub.getNextRenewalDate());
            BigDecimal costUSD = sub.getNormalizedMonthlyCostUSD() != null ? sub.getNormalizedMonthlyCostUSD() : BigDecimal.ZERO;
            String formattedCost = String.format("%,.0f", costUSD);

            // 1. Renewal Date Check
            if (daysUntilRenewal < 0) {
                overdue++;
                String threshold = "overdue";
                if (!alertRepository.existsBySubscriptionIdAndThreshold(sub.getId(), threshold)) {
                    createNotification(
                            AlertType.RENEWAL,
                            AlertSeverity.CRITICAL,
                            "Overdue Renewal: " + sub.getVendorName(),
                            sub.getVendorName() + " renewal is overdue by " + Math.abs(daysUntilRenewal) + " day(s) ($" + formattedCost + "/mo)",
                            sub.getDepartment(),
                            sub.getId(),
                            sub.getVendorName(),
                            threshold
                    );
                    notificationsCreated++;
                }
            } else if (daysUntilRenewal <= 1) {
                expiringSoon++;
                String threshold = "1d";
                if (!alertRepository.existsBySubscriptionIdAndThreshold(sub.getId(), threshold)) {
                    String timeText = daysUntilRenewal == 0 ? "today" : "in 1 day";
                    createNotification(
                            AlertType.RENEWAL,
                            AlertSeverity.CRITICAL,
                            "Urgent Renewal: " + sub.getVendorName(),
                            sub.getVendorName() + " renews " + timeText + " ($" + formattedCost + "/mo)",
                            sub.getDepartment(),
                            sub.getId(),
                            sub.getVendorName(),
                            threshold
                    );
                    notificationsCreated++;
                }
            } else if (daysUntilRenewal <= 7) {
                expiringSoon++;
                String threshold = "7d";
                if (!alertRepository.existsBySubscriptionIdAndThreshold(sub.getId(), threshold)) {
                    createNotification(
                            AlertType.RENEWAL,
                            AlertSeverity.CRITICAL,
                            "Upcoming Renewal: " + sub.getVendorName(),
                            sub.getVendorName() + " renews in " + daysUntilRenewal + " days ($" + formattedCost + "/mo)",
                            sub.getDepartment(),
                            sub.getId(),
                            sub.getVendorName(),
                            threshold
                    );
                    notificationsCreated++;
                }
            } else if (daysUntilRenewal <= 14) {
                expiringSoon++;
                String threshold = "14d";
                if (!alertRepository.existsBySubscriptionIdAndThreshold(sub.getId(), threshold)) {
                    createNotification(
                            AlertType.RENEWAL,
                            AlertSeverity.WARNING,
                            "Renewal Notice: " + sub.getVendorName(),
                            sub.getVendorName() + " renews in " + daysUntilRenewal + " days ($" + formattedCost + "/mo)",
                            sub.getDepartment(),
                            sub.getId(),
                            sub.getVendorName(),
                            threshold
                    );
                    notificationsCreated++;
                }
            } else if (daysUntilRenewal <= 30) {
                String threshold = "30d";
                if (!alertRepository.existsBySubscriptionIdAndThreshold(sub.getId(), threshold)) {
                    createNotification(
                            AlertType.RENEWAL,
                            AlertSeverity.INFO,
                            "Advance Renewal Notice: " + sub.getVendorName(),
                            sub.getVendorName() + " renews in " + daysUntilRenewal + " days ($" + formattedCost + "/mo)",
                            sub.getDepartment(),
                            sub.getId(),
                            sub.getVendorName(),
                            threshold
                    );
                    notificationsCreated++;
                }
            }

            // 2. Underused Subscriptions Check (seats used below 60% of assigned)
            if (sub.getAssignedSeats() != null && sub.getAssignedSeats() > 0 && sub.getUsedSeats() != null) {
                double ratio = (double) sub.getUsedSeats() / sub.getAssignedSeats();
                if (ratio < 0.60) {
                    underused++;
                    if (sub.getStatus() == SubscriptionStatus.ACTIVE) {
                        sub.setStatus(SubscriptionStatus.FLAGGED_IDLE);
                        subscriptionRepository.save(sub);
                    }

                    String threshold = "underused";
                    if (!alertRepository.existsBySubscriptionIdAndThreshold(sub.getId(), threshold)) {
                        createNotification(
                                AlertType.UNDERUTILIZATION,
                                AlertSeverity.WARNING,
                                "Underutilization Alert: " + sub.getVendorName(),
                                "Only " + sub.getUsedSeats() + " of " + sub.getAssignedSeats() + " assigned seats (" + String.format("%.0f", ratio * 100) + "%) are used for " + sub.getVendorName() + " in " + sub.getDepartment() + ".",
                                sub.getDepartment(),
                                sub.getId(),
                                sub.getVendorName(),
                                threshold
                        );
                        notificationsCreated++;
                    }
                }
            }
        }

        // 3. Departmental Budget Limit Check
        List<DepartmentBudget> budgets = budgetRepository.findAll();
        Map<Department, BigDecimal> spendMap = subscriptions.stream()
                .filter(s -> s.getStatus() != SubscriptionStatus.CANCELLED)
                .collect(Collectors.groupingBy(
                        Subscription::getDepartment,
                        Collectors.mapping(Subscription::getNormalizedMonthlyCostUSD, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        for (DepartmentBudget budget : budgets) {
            if (departmentFilter != null && budget.getDepartment() != departmentFilter) {
                continue;
            }

            BigDecimal actualSpend = spendMap.getOrDefault(budget.getDepartment(), BigDecimal.ZERO);
            BigDecimal limit = budget.getMonthlyBudgetLimitUSD();

            if (limit != null && limit.compareTo(BigDecimal.ZERO) > 0) {
                double usagePercent = actualSpend.divide(limit, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;

                if (usagePercent >= budget.getCriticalThresholdPercent()) {
                    String threshold = "budget_critical";
                    if (!alertRepository.existsByTypeAndTargetDepartmentAndThreshold(AlertType.BUDGET_EXCEEDED, budget.getDepartment(), threshold)) {
                        createNotification(
                                AlertType.BUDGET_EXCEEDED,
                                AlertSeverity.CRITICAL,
                                "Budget Limit Exceeded: " + budget.getDepartment(),
                                "Department " + budget.getDepartment() + " has reached " + String.format("%.1f", usagePercent) + "% of its monthly budget limit ($" + String.format("%,.0f", actualSpend) + " / $" + String.format("%,.0f", limit) + " USD).",
                                budget.getDepartment(),
                                null,
                                null,
                                threshold
                        );
                        notificationsCreated++;
                    }
                } else if (usagePercent >= budget.getWarningThresholdPercent()) {
                    String threshold = "budget_warning";
                    if (!alertRepository.existsByTypeAndTargetDepartmentAndThreshold(AlertType.BUDGET_EXCEEDED, budget.getDepartment(), threshold)) {
                        createNotification(
                                AlertType.BUDGET_EXCEEDED,
                                AlertSeverity.WARNING,
                                "Budget Warning: " + budget.getDepartment(),
                                "Department " + budget.getDepartment() + " is at " + String.format("%.1f", usagePercent) + "% of its monthly budget limit ($" + String.format("%,.0f", actualSpend) + " / $" + String.format("%,.0f", limit) + " USD).",
                                budget.getDepartment(),
                                null,
                                null,
                                threshold
                        );
                        notificationsCreated++;
                    }
                }
            }
        }

        LocalDateTime ranAt = LocalDateTime.now();
        String summaryText = "Checked " + checkedCount + " subscriptions, " + notificationsCreated + " new alerts (" + expiringSoon + " expiring soon, " + overdue + " overdue, " + underused + " underused)";

        // Save CronRunLog record
        CronRunLog logEntry = CronRunLog.builder()
                .ranAt(ranAt)
                .triggeredBy(triggeredBy != null ? triggeredBy : "manual")
                .executedByUser(userIdentifier != null ? userIdentifier : "System")
                .summary(summaryText)
                .checkedCount(checkedCount)
                .notificationsCreated(notificationsCreated)
                .expiringSoon(expiringSoon)
                .overdue(overdue)
                .underused(underused)
                .departmentFilter(departmentFilter)
                .build();
        cronRunLogRepository.save(logEntry);

        return CronCheckResult.builder()
                .checkedCount(checkedCount)
                .notificationsCreated(notificationsCreated)
                .expiringSoon(expiringSoon)
                .overdue(overdue)
                .underused(underused)
                .ranAt(ranAt)
                .build();
    }

    private void createNotification(AlertType type, AlertSeverity severity, String title, String message, Department dept, Long subId, String vendorName, String threshold) {
        AlertNotification notification = AlertNotification.builder()
                .type(type)
                .severity(severity)
                .title(title)
                .message(message)
                .targetDepartment(dept)
                .subscriptionId(subId)
                .vendorName(vendorName)
                .threshold(threshold)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        alertRepository.save(notification);
    }
}
