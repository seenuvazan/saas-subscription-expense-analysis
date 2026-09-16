package com.saas.analytics.controller;

import com.saas.analytics.dto.BudgetSettingDTO;
import com.saas.analytics.entity.DepartmentBudget;
import com.saas.analytics.repository.DepartmentBudgetRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
@CrossOrigin
public class BudgetController {

    private final DepartmentBudgetRepository budgetRepository;

    @GetMapping
    public ResponseEntity<List<DepartmentBudget>> getAllBudgets() {
        return ResponseEntity.ok(budgetRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<DepartmentBudget> setOrUpdateBudget(@Valid @RequestBody BudgetSettingDTO dto) {
        DepartmentBudget budget = budgetRepository.findByDepartment(dto.getDepartment())
                .orElseGet(() -> DepartmentBudget.builder()
                        .department(dto.getDepartment())
                        .build());

        budget.setMonthlyBudgetLimitUSD(dto.getMonthlyBudgetLimitUSD());
        if (dto.getWarningThresholdPercent() != null) {
            budget.setWarningThresholdPercent(dto.getWarningThresholdPercent());
        }
        if (dto.getCriticalThresholdPercent() != null) {
            budget.setCriticalThresholdPercent(dto.getCriticalThresholdPercent());
        }

        return ResponseEntity.ok(budgetRepository.save(budget));
    }
}
