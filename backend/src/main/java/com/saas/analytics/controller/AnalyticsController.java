package com.saas.analytics.controller;

import com.saas.analytics.dto.AnalyticsSummaryDTO;
import com.saas.analytics.dto.CategorySpendDTO;
import com.saas.analytics.dto.DepartmentSpendDTO;
import com.saas.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryDTO> getSummary() {
        return ResponseEntity.ok(analyticsService.getExecutiveSummary());
    }

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentSpendDTO>> getDepartmentBreakdown() {
        return ResponseEntity.ok(analyticsService.getDepartmentSpendBreakdown(null));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategorySpendDTO>> getCategoryBreakdown() {
        return ResponseEntity.ok(analyticsService.getCategorySpendBreakdown(null, null));
    }
}
