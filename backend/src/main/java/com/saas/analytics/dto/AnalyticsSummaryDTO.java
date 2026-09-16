package com.saas.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsSummaryDTO {
    private BigDecimal totalMonthlySpendUSD;
    private BigDecimal projectedAnnualSpendUSD;
    private Long activeSubscriptionsCount;
    private Long idleCount;
    private Long duplicateCount;
    private BigDecimal wastedMonthlySpendUSD;
    private List<DepartmentSpendDTO> departmentSpend;
    private List<CategorySpendDTO> categorySpend;
}
