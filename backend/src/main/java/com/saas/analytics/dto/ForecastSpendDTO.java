package com.saas.analytics.dto;

import java.math.BigDecimal;

public class ForecastSpendDTO {
    private String forecastMonth;
    private BigDecimal projectedAmount;
    private BigDecimal upperConfidence;
    private BigDecimal lowerConfidence;

    public ForecastSpendDTO() {}

    public ForecastSpendDTO(String forecastMonth, BigDecimal projectedAmount) {
        this.forecastMonth = forecastMonth;
        this.projectedAmount = projectedAmount;
    }

    public String getForecastMonth() { return forecastMonth; }
    public void setForecastMonth(String forecastMonth) { this.forecastMonth = forecastMonth; }
    public BigDecimal getProjectedAmount() { return projectedAmount; }
    public void setProjectedAmount(BigDecimal projectedAmount) { this.projectedAmount = projectedAmount; }
    public BigDecimal getUpperConfidence() { return upperConfidence; }
    public void setUpperConfidence(BigDecimal upperConfidence) { this.upperConfidence = upperConfidence; }
    public BigDecimal getLowerConfidence() { return lowerConfidence; }
    public void setLowerConfidence(BigDecimal lowerConfidence) { this.lowerConfidence = lowerConfidence; }
}
