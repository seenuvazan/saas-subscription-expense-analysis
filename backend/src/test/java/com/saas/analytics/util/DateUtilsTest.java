package com.saas.analytics.util;

import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;

class DateUtilsTest {
    @Test
    void testDaysBetween() {
        LocalDate start = LocalDate.of(2026, 1, 1);
        LocalDate end = LocalDate.of(2026, 1, 10);
        assertEquals(9, DateUtils.daysBetween(start, end));
    }

    @Test
    void testIsWithinDays() {
        LocalDate target = LocalDate.now().plusDays(5);
        assertTrue(DateUtils.isWithinDays(target, 7));
        assertFalse(DateUtils.isWithinDays(target, 3));
    }
}
