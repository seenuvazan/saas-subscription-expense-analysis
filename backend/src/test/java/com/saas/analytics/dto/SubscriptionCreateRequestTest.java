package com.saas.analytics.dto;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class SubscriptionCreateRequestTest {
    @Test
    void testSubscriptionCreationDto() {
        SubscriptionCreateRequest req = new SubscriptionCreateRequest();
        req.setSoftwareName("Figma");
        req.setCost(new BigDecimal("15.00"));

        assertEquals("Figma", req.getSoftwareName());
        assertEquals(new BigDecimal("15.00"), req.getCost());
    }
}
