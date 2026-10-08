package com.saas.analytics.util;

import com.saas.analytics.model.BillingFrequency;
import java.math.BigDecimal;
import java.math.RoundingMode;

public final class ExpenseCalculator {
    private ExpenseCalculator() {}

    public static BigDecimal calculateMonthlyCost(BigDecimal amount, BillingFrequency frequency) {
        if (amount == null) return BigDecimal.ZERO;
        if (frequency == null) return amount;

        switch (frequency) {
            case ANNUALLY:
                return amount.divide(new BigDecimal("12"), 2, RoundingMode.HALF_UP);
            case QUARTERLY:
                return amount.divide(new BigDecimal("3"), 2, RoundingMode.HALF_UP);
            case MONTHLY:
            default:
                return amount;
        }
    }

    public static BigDecimal calculateAnnualizedCost(BigDecimal amount, BillingFrequency frequency) {
        if (amount == null) return BigDecimal.ZERO;
        if (frequency == null) return amount;

        switch (frequency) {
            case MONTHLY:
                return amount.multiply(new BigDecimal("12"));
            case QUARTERLY:
                return amount.multiply(new BigDecimal("4"));
            case ANNUALLY:
            default:
                return amount;
        }
    }
}
