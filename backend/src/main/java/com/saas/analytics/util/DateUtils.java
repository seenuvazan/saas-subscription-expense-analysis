package com.saas.analytics.util;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public final class DateUtils {
    private DateUtils() {}

    public static long daysBetween(LocalDate start, LocalDate end) {
        if (start == null || end == null) return 0;
        return ChronoUnit.DAYS.between(start, end);
    }

    public static boolean isWithinDays(LocalDate targetDate, int daysThreshold) {
        if (targetDate == null) return false;
        LocalDate now = LocalDate.now();
        long diff = ChronoUnit.DAYS.between(now, targetDate);
        return diff >= 0 && diff <= daysThreshold;
    }
}
