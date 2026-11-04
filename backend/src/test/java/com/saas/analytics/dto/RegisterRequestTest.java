package com.saas.analytics.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class RegisterRequestTest {
    @Test
    void testRegisterRequestFields() {
        RegisterRequest req = new RegisterRequest();
        req.setFirstName("Alice");
        req.setLastName("Smith");
        req.setEmail("alice@test.com");
        req.setPassword("Password!1");

        assertEquals("Alice", req.getFirstName());
        assertEquals("Smith", req.getLastName());
        assertEquals("alice@test.com", req.getEmail());
        assertEquals("Password!1", req.getPassword());
    }
}
