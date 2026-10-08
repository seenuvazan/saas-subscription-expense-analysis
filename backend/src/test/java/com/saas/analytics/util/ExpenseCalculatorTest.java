package com.saas.analytics.util;

import com.saas.analytics.model.BillingFrequency;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class ExpenseCalculatorTest {
    @Test
    void testMonthlyCalculationForAnnualPlan() {
        BigDecimal monthly = ExpenseCalculator.calculateMonthlyCost(new BigDecimal("1200.00"), BillingFrequency.ANNUALLY);
        assertEquals(new BigDecimal("100.00"), monthly);
    }

    @Test
    void testAnnualCalculationForMonthlyPlan() {
        BigDecimal annual = ExpenseCalculator.calculateAnnualizedCost(new BigDecimal("50.00"), BillingFrequency.MONTHLY);
        assertEquals(new BigDecimal("600.00"), annual);
    }
}
