package com.saas.analytics.model;

public enum Currency {
    USD(1.0),
    EUR(1.08),
    INR(0.012),
    GBP(1.27);

    private final double toUsdRate;

    Currency(double toUsdRate) {
        this.toUsdRate = toUsdRate;
    }

    public double getToUsdRate() {
        return toUsdRate;
    }
}
