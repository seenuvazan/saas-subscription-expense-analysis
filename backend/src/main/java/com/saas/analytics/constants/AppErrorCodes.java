package com.saas.analytics.constants;

public final class AppErrorCodes {
    private AppErrorCodes() {}

    public static final String ERR_RESOURCE_NOT_FOUND = "ERR_404_NOT_FOUND";
    public static final String ERR_UNAUTHORIZED = "ERR_401_UNAUTHORIZED";
    public static final String ERR_FORBIDDEN = "ERR_403_FORBIDDEN";
    public static final String ERR_INVALID_INPUT = "ERR_400_BAD_REQUEST";
    public static final String ERR_BUDGET_EXCEEDED = "ERR_409_BUDGET_OVERLIMIT";
    public static final String ERR_INTERNAL_SERVER = "ERR_500_INTERNAL";
}
