package com.saas.analytics.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AuthRequestTest {
    @Test
    void testAuthRequestGettersAndSetters() {
        AuthRequest request = new AuthRequest();
        request.setEmail("user@example.com");
        request.setPassword("secret123");

        assertEquals("user@example.com", request.getEmail());
        assertEquals("secret123", request.getPassword());
    }
}
