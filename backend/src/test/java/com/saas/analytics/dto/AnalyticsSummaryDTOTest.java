package com.saas.analytics.dto;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class AnalyticsSummaryDTOTest {
    @Test
    void testAnalyticsSummaryDto() {
        AnalyticsSummaryDTO dto = new AnalyticsSummaryDTO();
        dto.setTotalMonthlySpendUSD(new BigDecimal("12500.00"));
        dto.setActiveSubscriptionsCount(15L);

        assertEquals(new BigDecimal("12500.00"), dto.getTotalMonthlySpendUSD());
        assertEquals(15L, dto.getActiveSubscriptionsCount());
    }
}
