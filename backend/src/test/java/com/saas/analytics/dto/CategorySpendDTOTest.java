package com.saas.analytics.dto;

import com.saas.analytics.model.Category;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class CategorySpendDTOTest {
    @Test
    void testCategorySpendDto() {
        CategorySpendDTO dto = new CategorySpendDTO();
        dto.setCategory(Category.ENGINEERING);
        dto.setTotalSpend(new BigDecimal("3500.00"));

        assertEquals(Category.ENGINEERING, dto.getCategory());
        assertEquals(new BigDecimal("3500.00"), dto.getTotalSpend());
    }
}
