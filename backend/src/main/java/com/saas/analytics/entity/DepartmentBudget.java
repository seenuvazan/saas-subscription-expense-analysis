package com.saas.analytics.entity;

import com.saas.analytics.model.Department;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "department_budgets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private Department department;

    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monthlyBudgetLimitUSD;

    @Builder.Default
    private Integer warningThresholdPercent = 80;

    @Builder.Default
    private Integer criticalThresholdPercent = 100;
}
