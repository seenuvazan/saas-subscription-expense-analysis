package com.saas.analytics.dto;

import com.saas.analytics.model.Department;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class DepartmentSpendDTOTest {
    @Test
    void testDepartmentSpendDto() {
        DepartmentSpendDTO dto = new DepartmentSpendDTO();
        dto.setDepartment(Department.ENGINEERING);
        dto.setActualMonthlySpendUSD(new BigDecimal("4200.00"));

        assertEquals(Department.ENGINEERING, dto.getDepartment());
        assertEquals(new BigDecimal("4200.00"), dto.getActualMonthlySpendUSD());
    }
}
