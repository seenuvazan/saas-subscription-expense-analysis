package com.saas.analytics.exception;

public class EmailDeliveryException extends RuntimeException {
    private final int statusCode;

    public EmailDeliveryException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public EmailDeliveryException(String message) {
        this(message, 502);
    }

    public int getStatusCode() {
        return statusCode;
    }
}
