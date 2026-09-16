package com.saas.analytics.service;

import com.saas.analytics.entity.AlertNotification;
import com.saas.analytics.exception.ResourceNotFoundException;
import com.saas.analytics.repository.AlertNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final AlertNotificationRepository alertRepository;

    public List<AlertNotification> getAllAlerts() {
        return alertRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<AlertNotification> getUnreadAlerts() {
        return alertRepository.findByIsReadFalseOrderByCreatedAtDesc();
    }

    public AlertNotification markAsRead(Long id) {
        AlertNotification alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with id: " + id));
        alert.setIsRead(true);
        return alertRepository.save(alert);
    }
}
