package com.saas.analytics.service;

import com.saas.analytics.dto.AnalyticsSummaryDTO;
import com.saas.analytics.dto.CategorySpendDTO;
import com.saas.analytics.dto.DepartmentSpendDTO;
import com.saas.analytics.entity.DepartmentBudget;
import com.saas.analytics.entity.Subscription;
import com.saas.analytics.model.Category;
import com.saas.analytics.model.Department;
import com.saas.analytics.model.SubscriptionStatus;
import com.saas.analytics.repository.DepartmentBudgetRepository;
import com.saas.analytics.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final SubscriptionRepository subscriptionRepository;
    private final DepartmentBudgetRepository budgetRepository;

    public AnalyticsSummaryDTO getExecutiveSummary() {
        List<Subscription> allSubscriptions = subscriptionRepository.findAll();

        List<Subscription> activeOrFlagged = allSubscriptions.stream()
                .filter(s -> s.getStatus() != SubscriptionStatus.CANCELLED)
                .collect(Collectors.toList());

        BigDecimal totalMonthlyUSD = activeOrFlagged.stream()
                .map(Subscription::getNormalizedMonthlyCostUSD)
                .filter(cost -> cost != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal projectedAnnualUSD = totalMonthlyUSD.multiply(BigDecimal.valueOf(12));

        long activeCount = activeOrFlagged.stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.ACTIVE)
                .count();

        long idleCount = activeOrFlagged.stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.FLAGGED_IDLE)
                .count();

        long duplicateCount = activeOrFlagged.stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.FLAGGED_DUPLICATE)
                .count();

        BigDecimal wastedMonthlyUSD = activeOrFlagged.stream()
                .filter(s -> s.getStatus() == SubscriptionStatus.FLAGGED_IDLE || s.getStatus() == SubscriptionStatus.FLAGGED_DUPLICATE)
                .map(Subscription::getNormalizedMonthlyCostUSD)
                .filter(cost -> cost != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<DepartmentSpendDTO> departmentSpend = getDepartmentSpendBreakdown(activeOrFlagged);
        List<CategorySpendDTO> categorySpend = getCategorySpendBreakdown(activeOrFlagged, totalMonthlyUSD);

        return AnalyticsSummaryDTO.builder()
                .totalMonthlySpendUSD(totalMonthlyUSD)
                .projectedAnnualSpendUSD(projectedAnnualUSD)
                .activeSubscriptionsCount(activeCount)
                .idleCount(idleCount)
                .duplicateCount(duplicateCount)
                .wastedMonthlySpendUSD(wastedMonthlyUSD)
                .departmentSpend(departmentSpend)
                .categorySpend(categorySpend)
                .build();
    }

    public List<DepartmentSpendDTO> getDepartmentSpendBreakdown(List<Subscription> activeOrFlagged) {
        if (activeOrFlagged == null) {
            activeOrFlagged = subscriptionRepository.findAll().stream()
                    .filter(s -> s.getStatus() != SubscriptionStatus.CANCELLED)
                    .collect(Collectors.toList());
        }

        Map<Department, BigDecimal> spendByDept = activeOrFlagged.stream()
                .collect(Collectors.groupingBy(
                        Subscription::getDepartment,
                        Collectors.mapping(
                                Subscription::getNormalizedMonthlyCostUSD,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                        )
                ));

        List<DepartmentBudget> budgets = budgetRepository.findAll();
        Map<Department, BigDecimal> budgetMap = budgets.stream()
                .collect(Collectors.toMap(DepartmentBudget::getDepartment, DepartmentBudget::getMonthlyBudgetLimitUSD));

        List<DepartmentSpendDTO> result = new ArrayList<>();
        for (Department dept : Department.values()) {
            BigDecimal actual = spendByDept.getOrDefault(dept, BigDecimal.ZERO);
            BigDecimal budget = budgetMap.getOrDefault(dept, BigDecimal.valueOf(5000)); // default $5000 budget if not set

            double utilization = (budget.compareTo(BigDecimal.ZERO) > 0)
                    ? actual.divide(budget, 4, RoundingMode.HALF_UP).doubleValue() * 100.0
                    : 0.0;

            boolean isOver = actual.compareTo(budget) > 0;

            result.add(DepartmentSpendDTO.builder()
                    .department(dept)
                    .actualMonthlySpendUSD(actual)
                    .budgetLimitUSD(budget)
                    .utilizationPercentage(Math.round(utilization * 10.0) / 10.0)
                    .isOverBudget(isOver)
                    .build());
        }

        return result;
    }

    public List<CategorySpendDTO> getCategorySpendBreakdown(List<Subscription> activeOrFlagged, BigDecimal totalSpend) {
        if (activeOrFlagged == null) {
            activeOrFlagged = subscriptionRepository.findAll().stream()
                    .filter(s -> s.getStatus() != SubscriptionStatus.CANCELLED)
                    .collect(Collectors.toList());
        }

        if (totalSpend == null || totalSpend.compareTo(BigDecimal.ZERO) == 0) {
            totalSpend = activeOrFlagged.stream()
                    .map(Subscription::getNormalizedMonthlyCostUSD)
                    .filter(c -> c != null)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        Map<Category, BigDecimal> spendByCat = activeOrFlagged.stream()
                .collect(Collectors.groupingBy(
                        Subscription::getCategory,
                        Collectors.mapping(
                                Subscription::getNormalizedMonthlyCostUSD,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)
                        )
                ));

        BigDecimal finalTotal = totalSpend;
        List<CategorySpendDTO> result = new ArrayList<>();
        for (Category cat : Category.values()) {
            BigDecimal spend = spendByCat.getOrDefault(cat, BigDecimal.ZERO);
            double percentage = (finalTotal.compareTo(BigDecimal.ZERO) > 0)
                    ? spend.divide(finalTotal, 4, RoundingMode.HALF_UP).doubleValue() * 100.0
                    : 0.0;

            if (spend.compareTo(BigDecimal.ZERO) > 0) {
                result.add(CategorySpendDTO.builder()
                        .category(cat)
                        .monthlySpendUSD(spend)
                        .percentageOfTotal(Math.round(percentage * 10.0) / 10.0)
                        .build());
            }
        }

        return result;
    }
}
