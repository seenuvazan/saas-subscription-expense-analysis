package com.saas.analytics.repository;

import com.saas.analytics.entity.AlertNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertNotificationRepository extends JpaRepository<AlertNotification, Long> {
    List<AlertNotification> findByIsReadFalseOrderByCreatedAtDesc();
    List<AlertNotification> findAllByOrderByCreatedAtDesc();
}
