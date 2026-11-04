package com.saas.analytics.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AlertTypeEnumTest {
    @Test
    void testAlertTypeValues() {
        assertTrue(AlertType.values().length > 0);
    }
}
