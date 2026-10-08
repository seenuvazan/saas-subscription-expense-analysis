package com.saas.analytics.util;

public final class SanitizationUtils {
    private SanitizationUtils() {}

    public static String sanitizeString(String input) {
        if (input == null) return null;
        return input.trim()
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace(""", "&quot;")
                .replace("'", "&#x27;");
    }
}
