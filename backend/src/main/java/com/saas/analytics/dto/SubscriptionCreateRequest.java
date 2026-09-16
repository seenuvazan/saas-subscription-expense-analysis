package com.saas.analytics.dto;

import com.saas.analytics.model.BillingFrequency;
import com.saas.analytics.model.Category;
import com.saas.analytics.model.Currency;
import com.saas.analytics.model.Department;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionCreateRequest {
    @NotBlank
    private String vendorName;

    @NotNull
    private Category category;

    @NotNull
    private BigDecimal cost;

    private Currency currency = Currency.USD;

    @NotNull
    private BillingFrequency billingFrequency;

    @NotNull
    private Department department;

    @NotNull
    private LocalDate nextRenewalDate;

    @Min(1)
    private Integer assignedSeats = 1;

    @Min(0)
    private Integer usedSeats = 1;

    private String notes;
}
