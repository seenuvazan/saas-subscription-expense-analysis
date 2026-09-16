package com.saas.analytics.entity;

import com.saas.analytics.model.AlertSeverity;
import com.saas.analytics.model.AlertType;
import com.saas.analytics.model.Department;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "alert_notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertSeverity severity;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(length = 1000, nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    private Department targetDepartment;

    private Long subscriptionId;

    @Builder.Default
    private Boolean isRead = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
