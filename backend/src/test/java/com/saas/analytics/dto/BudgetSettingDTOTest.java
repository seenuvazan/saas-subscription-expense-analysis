package com.saas.analytics.dto;

import com.saas.analytics.model.Department;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class BudgetSettingDTOTest {
    @Test
    void testBudgetSettingDto() {
        BudgetSettingDTO dto = new BudgetSettingDTO();
        dto.setDepartment(Department.ENGINEERING);
        dto.setMonthlyBudgetLimitUSD(new BigDecimal("5000"));
        dto.setWarningThresholdPercent(80);

        assertEquals(Department.ENGINEERING, dto.getDepartment());
        assertEquals(new BigDecimal("5000"), dto.getMonthlyBudgetLimitUSD());
        assertEquals(80, dto.getWarningThresholdPercent());
    }
}
