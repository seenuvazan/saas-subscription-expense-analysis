package com.saas.analytics.dto;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class AnalyticsSummaryDTOTest {
    @Test
    void testAnalyticsSummaryDto() {
        AnalyticsSummaryDTO dto = new AnalyticsSummaryDTO();
        dto.setTotalMonthlySpend(new BigDecimal("12500.00"));
        dto.setActiveSubscriptionsCount(15);

        assertEquals(new BigDecimal("12500.00"), dto.getTotalMonthlySpend());
        assertEquals(15, dto.getActiveSubscriptionsCount());
    }
}
