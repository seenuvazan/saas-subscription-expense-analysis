package com.saas.analytics.constants;

public final class SecurityConstants {
    private SecurityConstants() {}

    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final long TOKEN_EXPIRATION_TIME = 86_400_000L; // 24 Hours
    public static final String DEFAULT_ROLE = "EMPLOYEE";
    public static final String ADMIN_ROLE = "ADMIN";
}
