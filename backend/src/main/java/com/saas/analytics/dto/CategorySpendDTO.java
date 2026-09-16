package com.saas.analytics.dto;

import com.saas.analytics.model.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategorySpendDTO {
    private Category category;
    private BigDecimal monthlySpendUSD;
    private Double percentageOfTotal;
}
