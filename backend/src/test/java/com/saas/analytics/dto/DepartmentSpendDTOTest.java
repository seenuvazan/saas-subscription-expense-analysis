package com.saas.analytics.dto;

import com.saas.analytics.model.Department;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class DepartmentSpendDTOTest {
    @Test
    void testDepartmentSpendDto() {
        DepartmentSpendDTO dto = new DepartmentSpendDTO();
        dto.setDepartment(Department.PRODUCT);
        dto.setSpend(new BigDecimal("4200.00"));

        assertEquals(Department.PRODUCT, dto.getDepartment());
        assertEquals(new BigDecimal("4200.00"), dto.getSpend());
    }
}
