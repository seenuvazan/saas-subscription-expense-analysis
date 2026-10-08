package com.saas.analytics.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ApiResponseTest {
    @Test
    void testApiResponseSuccess() {
        ApiResponse<String> res = ApiResponse.ok("test-data");
        assertTrue(res.isSuccess());
        assertEquals("test-data", res.getData());
        assertNotNull(res.getTimestamp());
    }

    @Test
    void testApiResponseError() {
        ApiResponse<Void> res = ApiResponse.error("Something went wrong");
        assertFalse(res.isSuccess());
        assertEquals("Something went wrong", res.getMessage());
    }
}
