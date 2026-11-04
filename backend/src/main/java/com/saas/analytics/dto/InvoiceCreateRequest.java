package com.saas.analytics.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceCreateRequest {

    @NotBlank(message = "Invoice number is required")
    private String invoiceNumber;

    @NotBlank(message = "SaaS provider / vendor name is required")
    private String vendorName;

    private Long subscriptionId;

    @NotNull(message = "Invoice date is required")
    private LocalDate invoiceDate;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private LocalDate billingPeriodStart;

    private LocalDate billingPeriodEnd;

    private String billingPeriod;

    private String currency;

    private BigDecimal gstRate;

    private BigDecimal discountAmount;

    private String vendorAddress;

    private String vendorGstin;

    private String customerName;

    private String customerGstin;

    private String customerAddress;

    private String notes;

    private List<InvoiceItemDTO> items;
}
