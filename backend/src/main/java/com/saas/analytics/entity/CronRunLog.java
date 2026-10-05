package com.saas.analytics.entity;

import com.saas.analytics.model.Department;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cron_run_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CronRunLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime ranAt;

    @Column(nullable = false)
    private String triggeredBy; // "manual" or "scheduled"

    @Column(nullable = false)
    private String executedByUser; // User's name/email or "System Scheduler"

    @Column(length = 1000)
    private String summary;

    private int checkedCount;

    private int notificationsCreated;

    private int expiringSoon;

    private int overdue;

    private int underused;

    @Enumerated(EnumType.STRING)
    private Department departmentFilter;

    @PrePersist
    protected void onCreate() {
        if (this.ranAt == null) {
            this.ranAt = LocalDateTime.now();
        }
    }
}
