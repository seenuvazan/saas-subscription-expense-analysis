package com.saas.analytics.util;

import com.saas.analytics.model.Currency;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class CurrencyConverterTest {
    @Test
    void testConvertUsdToUsd() {
        BigDecimal res = CurrencyConverter.convertToUsd(new BigDecimal("100"), Currency.USD);
        assertEquals(new BigDecimal("100"), res);
    }

    @Test
    void testConvertEurToUsd() {
        BigDecimal res = CurrencyConverter.convertToUsd(new BigDecimal("100"), Currency.EUR);
        assertEquals(new BigDecimal("108.00"), res);
    }
}
