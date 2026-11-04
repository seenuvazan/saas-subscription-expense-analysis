package com.saas.analytics.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class BillingFrequencyEnumTest {
    @Test
    void testBillingFrequencyValues() {
        assertNotNull(BillingFrequency.valueOf("MONTHLY"));
        assertNotNull(BillingFrequency.valueOf("ANNUALLY"));
        assertNotNull(BillingFrequency.valueOf("QUARTERLY"));
    }
}
