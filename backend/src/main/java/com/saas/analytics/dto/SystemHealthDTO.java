package com.saas.analytics.dto;

import java.time.LocalDateTime;

public class SystemHealthDTO {
    private String status;
    private long uptimeSeconds;
    private String databaseStatus;
    private LocalDateTime checkedAt;

    public SystemHealthDTO() {
        this.checkedAt = LocalDateTime.now();
    }

    public SystemHealthDTO(String status, long uptimeSeconds, String databaseStatus) {
        this.status = status;
        this.uptimeSeconds = uptimeSeconds;
        this.databaseStatus = databaseStatus;
        this.checkedAt = LocalDateTime.now();
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public long getUptimeSeconds() { return uptimeSeconds; }
    public void setUptimeSeconds(long uptimeSeconds) { this.uptimeSeconds = uptimeSeconds; }
    public String getDatabaseStatus() { return databaseStatus; }
    public void setDatabaseStatus(String databaseStatus) { this.databaseStatus = databaseStatus; }
    public LocalDateTime getCheckedAt() { return checkedAt; }
}
