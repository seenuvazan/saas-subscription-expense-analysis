package com.saas.analytics.dto;

public record EmailSendResult(
        boolean success,
        String messageId,
        String errorMessage,
        int statusCode
) {
    public static EmailSendResult success(String messageId, int statusCode) {
        return new EmailSendResult(true, messageId, null, statusCode);
    }

    public static EmailSendResult failure(String errorMessage, int statusCode) {
        return new EmailSendResult(false, null, errorMessage, statusCode);
    }
}
