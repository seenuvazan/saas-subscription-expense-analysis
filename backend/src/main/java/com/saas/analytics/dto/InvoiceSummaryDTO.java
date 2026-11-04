package com.saas.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceSummaryDTO {
    private BigDecimal totalInvoiceAmount;
    private BigDecimal paidAmount;
    private BigDecimal pendingAmount;
    private BigDecimal overdueAmount;

    private long totalCount;
    private long paidCount;
    private long pendingCount;
    private long overdueCount;
    private long partiallyPaidCount;

    private String primaryCurrency;
}
