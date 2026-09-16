package com.saas.analytics.entity;

import com.saas.analytics.model.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String vendorName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal cost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Currency currency = Currency.USD;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillingFrequency billingFrequency;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal normalizedMonthlyCostUSD;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Department department;

    @NotNull
    @Column(nullable = false)
    private LocalDate nextRenewalDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SubscriptionStatus status = SubscriptionStatus.ACTIVE;

    @Builder.Default
    private Integer assignedSeats = 1;

    @Builder.Default
    private Integer usedSeats = 1;

    @Column(length = 1000)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User loggedBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void calculateNormalizedCost() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();

        if (cost != null) {
            BigDecimal monthlyInOriginalCurrency = (billingFrequency == BillingFrequency.ANNUAL)
                    ? cost.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP)
                    : cost;
            double rate = (currency != null) ? currency.getToUsdRate() : 1.0;
            this.normalizedMonthlyCostUSD = monthlyInOriginalCurrency.multiply(BigDecimal.valueOf(rate)).setScale(2, RoundingMode.HALF_UP);
        }
    }
}
