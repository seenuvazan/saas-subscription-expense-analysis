package com.saas.analytics.dto;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class BudgetSettingDTOTest {
    @Test
    void testBudgetSettingDto() {
        BudgetSettingDTO dto = new BudgetSettingDTO();
        dto.setMonthlyBudget(new BigDecimal("5000"));
        dto.setAlertThresholdPercentage(80);

        assertEquals(new BigDecimal("5000"), dto.getMonthlyBudget());
        assertEquals(80, dto.getAlertThresholdPercentage());
    }
}
