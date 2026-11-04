package com.saas.analytics.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UpdateProfileRequestTest {
    @Test
    void testUpdateProfileRequest() {
        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setFirstName("Bob");
        req.setLastName("Smith");
        assertEquals("Bob", req.getFirstName());
        assertEquals("Smith", req.getLastName());
    }
}
