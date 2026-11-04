package com.saas.analytics.util;

import com.saas.analytics.model.Currency;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.EnumMap;
import java.util.Map;

public final class CurrencyConverter {
    private static final Map<Currency, BigDecimal> USD_RATES = new EnumMap<>(Currency.class);

    static {
        USD_RATES.put(Currency.USD, BigDecimal.ONE);
        USD_RATES.put(Currency.EUR, new BigDecimal("1.08"));
        USD_RATES.put(Currency.GBP, new BigDecimal("1.27"));
        USD_RATES.put(Currency.INR, new BigDecimal("0.012"));
    }

    private CurrencyConverter() {}

    public static BigDecimal convertToUsd(BigDecimal amount, Currency fromCurrency) {
        if (amount == null) return BigDecimal.ZERO;
        if (fromCurrency == null || fromCurrency == Currency.USD) return amount;
        BigDecimal rate = USD_RATES.getOrDefault(fromCurrency, BigDecimal.ONE);
        return amount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
    }
}
