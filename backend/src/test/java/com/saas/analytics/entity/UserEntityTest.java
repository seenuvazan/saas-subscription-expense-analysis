package com.saas.analytics.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserEntityTest {
    @Test
    void testUserEntity() {
        User user = new User();
        user.setName("John Doe");
        user.setEmail("john@company.com");
        assertEquals("John Doe", user.getName());
        assertEquals("john@company.com", user.getEmail());
    }
}
