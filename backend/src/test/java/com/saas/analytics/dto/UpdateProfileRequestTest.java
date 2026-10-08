package com.saas.analytics.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UpdateProfileRequestTest {
    @Test
    void testUpdateProfileRequest() {
        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setName("Bob Smith");
        assertEquals("Bob Smith", req.getName());
    }
}
