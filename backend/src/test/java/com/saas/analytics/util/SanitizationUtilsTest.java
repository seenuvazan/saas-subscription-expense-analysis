package com.saas.analytics.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class SanitizationUtilsTest {
    @Test
    void testSanitizeScriptTags() {
        String input = "<script>alert('xss')</script>";
        String sanitized = SanitizationUtils.sanitizeString(input);
        assertFalse(sanitized.contains("<script>"));
        assertTrue(sanitized.contains("&lt;script&gt;"));
    }
}
