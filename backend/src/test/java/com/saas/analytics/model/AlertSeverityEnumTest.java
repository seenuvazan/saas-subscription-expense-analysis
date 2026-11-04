package com.saas.analytics.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AlertSeverityEnumTest {
    @Test
    void testAlertSeverityValues() {
        assertNotNull(AlertSeverity.valueOf("INFO"));
        assertNotNull(AlertSeverity.valueOf("WARNING"));
        assertNotNull(AlertSeverity.valueOf("CRITICAL"));
    }
}
