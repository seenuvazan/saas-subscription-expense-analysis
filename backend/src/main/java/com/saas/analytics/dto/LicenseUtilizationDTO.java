package com.saas.analytics.dto;

public class LicenseUtilizationDTO {
    private Long subscriptionId;
    private String softwareName;
    private int totalSeats;
    private int usedSeats;
    private double utilizationPercentage;
    private double costPerSeat;

    public LicenseUtilizationDTO() {}

    public Long getSubscriptionId() { return subscriptionId; }
    public void setSubscriptionId(Long subscriptionId) { this.subscriptionId = subscriptionId; }
    public String getSoftwareName() { return softwareName; }
    public void setSoftwareName(String softwareName) { this.softwareName = softwareName; }
    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }
    public int getUsedSeats() { return usedSeats; }
    public void setUsedSeats(int usedSeats) { this.usedSeats = usedSeats; }
    public double getUtilizationPercentage() { return utilizationPercentage; }
    public void setUtilizationPercentage(double utilizationPercentage) { this.utilizationPercentage = utilizationPercentage; }
    public double getCostPerSeat() { return costPerSeat; }
    public void setCostPerSeat(double costPerSeat) { this.costPerSeat = costPerSeat; }
}
