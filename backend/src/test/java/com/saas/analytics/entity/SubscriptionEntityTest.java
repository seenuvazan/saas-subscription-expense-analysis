package com.saas.analytics.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class SubscriptionEntityTest {
    @Test
    void testSubscriptionEntityFields() {
        Subscription sub = new Subscription();
        sub.setSoftwareName("Slack");
        assertEquals("Slack", sub.getSoftwareName());
    }
}
