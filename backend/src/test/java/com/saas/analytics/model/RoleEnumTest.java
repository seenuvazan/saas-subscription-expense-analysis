package com.saas.analytics.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class RoleEnumTest {
    @Test
    void testRoleValues() {
        assertEquals(2, Role.values().length);
        assertNotNull(Role.valueOf("ROLE_ADMIN"));
        assertNotNull(Role.valueOf("ROLE_EMPLOYEE"));
    }
}
