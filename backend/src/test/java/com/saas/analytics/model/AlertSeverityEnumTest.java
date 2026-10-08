package com.saas.analytics.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AlertSeverityEnumTest {
    @Test
    void testAlertSeverityValues() {
        assertNotNull(AlertSeverity.valueOf("LOW"));
        assertNotNull(AlertSeverity.valueOf("MEDIUM"));
        assertNotNull(AlertSeverity.valueOf("HIGH"));
    }
}
