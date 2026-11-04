package com.saas.analytics.dto;

import com.saas.analytics.model.Category;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class CategorySpendDTOTest {
    @Test
    void testCategorySpendDto() {
        CategorySpendDTO dto = new CategorySpendDTO();
        dto.setCategory(Category.DEV);
        dto.setMonthlySpendUSD(new BigDecimal("3500.00"));

        assertEquals(Category.DEV, dto.getCategory());
        assertEquals(new BigDecimal("3500.00"), dto.getMonthlySpendUSD());
    }
}
