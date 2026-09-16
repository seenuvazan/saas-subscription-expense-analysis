package com.saas.analytics.dto;

import com.saas.analytics.model.Department;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetSettingDTO {
    @NotNull
    private Department department;

    @NotNull
    private BigDecimal monthlyBudgetLimitUSD;

    private Integer warningThresholdPercent = 80;

    private Integer criticalThresholdPercent = 100;
}
