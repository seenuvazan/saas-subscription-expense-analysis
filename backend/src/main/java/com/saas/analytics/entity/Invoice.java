package com.saas.analytics.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.saas.analytics.model.InvoiceStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String invoiceNumber;

    @NotBlank
    @Column(nullable = false)
    private String vendorName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscription_id")
    private Subscription subscription;

    @NotNull
    @Column(nullable = false)
    private LocalDate invoiceDate;

    @NotNull
    @Column(nullable = false)
    private LocalDate dueDate;

    private LocalDate billingPeriodStart;

    private LocalDate billingPeriodEnd;

    private String billingPeriod;

    @Column(length = 10, nullable = false)
    @Builder.Default
    private String currency = "INR";

    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal gstRate = BigDecimal.valueOf(18.00);

    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal gstAmount = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal balanceDue = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private InvoiceStatus status = InvoiceStatus.PENDING;

    @Column(length = 100)
    private String paymentMethod;

    @Column(length = 150)
    private String paymentReference;

    @Column(length = 250)
    private String vendorAddress;

    @Column(length = 50)
    private String vendorGstin;

    @Column(length = 150)
    private String customerName;

    @Column(length = 50)
    private String customerGstin;

    @Column(length = 250)
    private String customerAddress;

    @Column(length = 1000)
    private String notes;

    @Column(length = 500)
    private String originalPdfPath;

    @Column(length = 255)
    private String originalPdfFilename;

    @Column(length = 100)
    private String originalPdfContentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<InvoiceItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    @Builder.Default
    private List<InvoicePayment> payments = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
        recalculateTotals();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        recalculateTotals();
    }

    public void recalculateTotals() {
        if (items != null && !items.isEmpty()) {
            BigDecimal sum = BigDecimal.ZERO;
            for (InvoiceItem item : items) {
                if (item.getTotalPrice() != null) {
                    sum = sum.add(item.getTotalPrice());
                }
            }
            this.subtotal = sum.setScale(2, RoundingMode.HALF_UP);
        }

        if (this.subtotal == null) {
            this.subtotal = BigDecimal.ZERO;
        }

        if (this.gstRate != null && this.subtotal.compareTo(BigDecimal.ZERO) > 0) {
            this.gstAmount = this.subtotal.multiply(this.gstRate)
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else if (this.gstAmount == null) {
            this.gstAmount = BigDecimal.ZERO;
        }

        if (this.discountAmount == null) {
            this.discountAmount = BigDecimal.ZERO;
        }

        this.totalAmount = this.subtotal.add(this.gstAmount).subtract(this.discountAmount).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);

        if (this.paidAmount == null) {
            this.paidAmount = BigDecimal.ZERO;
        }

        this.balanceDue = this.totalAmount.subtract(this.paidAmount).max(BigDecimal.ZERO).setScale(2, RoundingMode.HALF_UP);

        // Update status automatically
        if (this.totalAmount.compareTo(BigDecimal.ZERO) > 0 && this.paidAmount.compareTo(this.totalAmount) >= 0) {
            this.status = InvoiceStatus.PAID;
        } else if (this.paidAmount.compareTo(BigDecimal.ZERO) > 0) {
            this.status = InvoiceStatus.PARTIALLY_PAID;
        } else if (this.dueDate != null && LocalDate.now().isAfter(this.dueDate)) {
            this.status = InvoiceStatus.OVERDUE;
        } else {
            this.status = InvoiceStatus.PENDING;
        }
    }
}
