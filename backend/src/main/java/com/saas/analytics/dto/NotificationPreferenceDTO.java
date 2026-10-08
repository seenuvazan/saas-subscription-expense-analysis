package com.saas.analytics.dto;

public class NotificationPreferenceDTO {
    private boolean emailAlerts;
    private boolean inAppAlerts;
    private boolean renewalAlerts;
    private boolean budgetThresholdAlerts;
    private int alertDaysBeforeRenewal;

    public NotificationPreferenceDTO() {
        this.emailAlerts = true;
        this.inAppAlerts = true;
        this.renewalAlerts = true;
        this.budgetThresholdAlerts = true;
        this.alertDaysBeforeRenewal = 7;
    }

    public boolean isEmailAlerts() { return emailAlerts; }
    public void setEmailAlerts(boolean emailAlerts) { this.emailAlerts = emailAlerts; }
    public boolean isInAppAlerts() { return inAppAlerts; }
    public void setInAppAlerts(boolean inAppAlerts) { this.inAppAlerts = inAppAlerts; }
    public boolean isRenewalAlerts() { return renewalAlerts; }
    public void setRenewalAlerts(boolean renewalAlerts) { this.renewalAlerts = renewalAlerts; }
    public boolean isBudgetThresholdAlerts() { return budgetThresholdAlerts; }
    public void setBudgetThresholdAlerts(boolean budgetThresholdAlerts) { this.budgetThresholdAlerts = budgetThresholdAlerts; }
    public int getAlertDaysBeforeRenewal() { return alertDaysBeforeRenewal; }
    public void setAlertDaysBeforeRenewal(int alertDaysBeforeRenewal) { this.alertDaysBeforeRenewal = alertDaysBeforeRenewal; }
}
