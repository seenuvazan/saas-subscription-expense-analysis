package com.saas.analytics.service;

import com.saas.analytics.entity.AlertNotification;
import com.saas.analytics.entity.DepartmentBudget;
import com.saas.analytics.entity.Subscription;
import com.saas.analytics.model.*;
import com.saas.analytics.repository.AlertNotificationRepository;
import com.saas.analytics.repository.DepartmentBudgetRepository;
import com.saas.analytics.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

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
public class RenewalSchedulerService {

    private static final Logger log = LoggerFactory.getLogger(RenewalSchedulerService.class);

    private final SubscriptionRepository subscriptionRepository;
    private final DepartmentBudgetRepository budgetRepository;
    private final AlertNotificationRepository alertRepository;

    // Runs every day at 08:00 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void scheduledDailyCheck() {
        log.info("Running daily scheduled renewal & budget threshold check...");
        runRenewalAndBudgetChecks();
    }

    public void runRenewalAndBudgetChecks() {
        LocalDate today = LocalDate.now();
        List<Subscription> subscriptions = subscriptionRepository.findAll();

        // 1. Renewal Date Check (due within 7 and 14 days)
        for (Subscription sub : subscriptions) {
            if (sub.getStatus() == SubscriptionStatus.CANCELLED || sub.getNextRenewalDate() == null) {
                continue;
            }

            long daysUntilRenewal = ChronoUnit.DAYS.between(today, sub.getNextRenewalDate());

            if (daysUntilRenewal <= 7 && daysUntilRenewal >= 0) {
                createAlertIfNotExists(
                        AlertType.RENEWAL_UPCOMING,
                        AlertSeverity.CRITICAL,
                        "Urgent Renewal Warning: " + sub.getVendorName(),
                        "Tool '" + sub.getVendorName() + "' (" + sub.getDepartment() + ") renews in " + daysUntilRenewal + " day(s) on " + sub.getNextRenewalDate() + ". Cost: $" + sub.getNormalizedMonthlyCostUSD() + "/mo.",
                        sub.getDepartment(),
                        sub.getId()
                );
            } else if (daysUntilRenewal <= 14 && daysUntilRenewal > 7) {
                createAlertIfNotExists(
                        AlertType.RENEWAL_UPCOMING,
                        AlertSeverity.WARNING,
                        "Upcoming Renewal Notice: " + sub.getVendorName(),
                        "Tool '" + sub.getVendorName() + "' (" + sub.getDepartment() + ") renews in " + daysUntilRenewal + " days on " + sub.getNextRenewalDate() + ".",
                        sub.getDepartment(),
                        sub.getId()
                );
            }
        }

        // 2. Underutilization Check (usedSeats / assignedSeats < 50%)
        for (Subscription sub : subscriptions) {
            if (sub.getStatus() == SubscriptionStatus.CANCELLED) continue;
            if (sub.getAssignedSeats() != null && sub.getAssignedSeats() > 0 && sub.getUsedSeats() != null) {
                double ratio = (double) sub.getUsedSeats() / sub.getAssignedSeats();
                if (ratio < 0.5) {
                    if (sub.getStatus() == SubscriptionStatus.ACTIVE) {
                        sub.setStatus(SubscriptionStatus.FLAGGED_IDLE);
                        subscriptionRepository.save(sub);
                    }

                    createAlertIfNotExists(
                            AlertType.UNDERUTILIZATION,
                            AlertSeverity.WARNING,
                            "Software Waste Alert: " + sub.getVendorName(),
                            "Only " + sub.getUsedSeats() + " of " + sub.getAssignedSeats() + " assigned seats are actively used for " + sub.getVendorName() + " in " + sub.getDepartment() + ".",
                            sub.getDepartment(),
                            sub.getId()
                    );
                }
            }
        }

        // 3. Departmental Budget Threshold Check
        Map<Department, BigDecimal> spendMap = subscriptions.stream()
                .filter(s -> s.getStatus() != SubscriptionStatus.CANCELLED)
                .collect(Collectors.groupingBy(
                        Subscription::getDepartment,
                        Collectors.mapping(Subscription::getNormalizedMonthlyCostUSD, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        List<DepartmentBudget> budgets = budgetRepository.findAll();
        for (DepartmentBudget budget : budgets) {
            BigDecimal actualSpend = spendMap.getOrDefault(budget.getDepartment(), BigDecimal.ZERO);
            BigDecimal limit = budget.getMonthlyBudgetLimitUSD();

            if (limit.compareTo(BigDecimal.ZERO) > 0) {
                double usagePercent = actualSpend.divide(limit, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;

                if (usagePercent >= budget.getCriticalThresholdPercent()) {
                    createAlertIfNotExists(
                            AlertType.BUDGET_EXCEEDED,
                            AlertSeverity.CRITICAL,
                            "Budget Limit Exceeded: " + budget.getDepartment(),
                            "Department " + budget.getDepartment() + " has spent $" + actualSpend + " USD (" + String.format("%.1f", usagePercent) + "% of $" + limit + " USD monthly budget limit).",
                            budget.getDepartment(),
                            null
                    );
                } else if (usagePercent >= budget.getWarningThresholdPercent()) {
                    createAlertIfNotExists(
                            AlertType.BUDGET_EXCEEDED,
                            AlertSeverity.WARNING,
                            "Budget Warning: " + budget.getDepartment(),
                            "Department " + budget.getDepartment() + " is at " + String.format("%.1f", usagePercent) + "% of its monthly budget limit ($" + actualSpend + " / $" + limit + " USD).",
                            budget.getDepartment(),
                            null
                    );
                }
            }
        }
    }

    private void createAlertIfNotExists(AlertType type, AlertSeverity severity, String title, String message, Department dept, Long subId) {
        AlertNotification alert = AlertNotification.builder()
                .type(type)
                .severity(severity)
                .title(title)
                .message(message)
                .targetDepartment(dept)
                .subscriptionId(subId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        alertRepository.save(alert);
    }
}
