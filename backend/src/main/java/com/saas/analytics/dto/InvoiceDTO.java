package com.saas.analytics.dto;

import com.saas.analytics.model.InvoiceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDTO {
    private Long id;
    private String invoiceNumber;
    private String vendorName;
    private Long subscriptionId;
    private String subscriptionVendorName;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private LocalDate billingPeriodStart;
    private LocalDate billingPeriodEnd;
    private String billingPeriod;
    private String currency;
    private BigDecimal subtotal;
    private BigDecimal gstRate;
    private BigDecimal gstAmount;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private BigDecimal paidAmount;
    private BigDecimal balanceDue;
    private InvoiceStatus status;
    private String paymentMethod;
    private String paymentReference;
    private String vendorAddress;
    private String vendorGstin;
    private String customerName;
    private String customerGstin;
    private String customerAddress;
    private String notes;
    private boolean hasOriginalPdf;
    private String originalPdfFilename;
    private List<InvoiceItemDTO> items;
    private List<InvoicePaymentDTO> payments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
