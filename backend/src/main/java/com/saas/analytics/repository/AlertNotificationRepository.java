package com.saas.analytics.repository;

import com.saas.analytics.entity.AlertNotification;
import com.saas.analytics.model.AlertType;
import com.saas.analytics.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertNotificationRepository extends JpaRepository<AlertNotification, Long> {
    List<AlertNotification> findByIsReadFalseOrderByCreatedAtDesc();
    List<AlertNotification> findAllByOrderByCreatedAtDesc();
    List<AlertNotification> findByTargetDepartmentOrderByCreatedAtDesc(Department targetDepartment);
    List<AlertNotification> findByTargetDepartmentAndIsReadFalseOrderByCreatedAtDesc(Department targetDepartment);

    boolean existsBySubscriptionIdAndThreshold(Long subscriptionId, String threshold);
    boolean existsByTypeAndTargetDepartmentAndThreshold(AlertType type, Department targetDepartment, String threshold);

    @Modifying
    @Query("UPDATE AlertNotification a SET a.isRead = true WHERE (:dept IS NULL OR a.targetDepartment = :dept)")
    void markAllAsRead(@Param("dept") Department dept);
}
