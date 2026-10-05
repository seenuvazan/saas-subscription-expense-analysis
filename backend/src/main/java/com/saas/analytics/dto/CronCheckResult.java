package com.saas.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CronCheckResult {
    private int checkedCount;
    private int notificationsCreated;
    private int expiringSoon;
    private int overdue;
    private int underused;
    private LocalDateTime ranAt;
}
