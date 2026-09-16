package com.saas.analytics.dto;

import com.saas.analytics.model.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionDTO {
    private Long id;
    private String vendorName;
    private Category category;
    private BigDecimal cost;
    private Currency currency;
    private BillingFrequency billingFrequency;
    private BigDecimal normalizedMonthlyCostUSD;
    private Department department;
    private LocalDate nextRenewalDate;
    private SubscriptionStatus status;
    private Integer assignedSeats;
    private Integer usedSeats;
    private Double utilizationRate;
    private String notes;
    private String loggedByEmail;
    private String loggedByName;
    private LocalDateTime createdAt;
}
