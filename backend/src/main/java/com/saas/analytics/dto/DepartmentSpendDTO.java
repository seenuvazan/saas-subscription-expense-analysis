package com.saas.analytics.dto;

import com.saas.analytics.model.Department;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentSpendDTO {
    private Department department;
    private BigDecimal actualMonthlySpendUSD;
    private BigDecimal budgetLimitUSD;
    private Double utilizationPercentage;
    private Boolean isOverBudget;
}
