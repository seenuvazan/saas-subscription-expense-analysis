package com.saas.analytics.repository;

import com.saas.analytics.entity.Subscription;
import com.saas.analytics.model.Category;
import com.saas.analytics.model.Department;
import com.saas.analytics.model.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long>, JpaSpecificationExecutor<Subscription> {

    List<Subscription> findByDepartment(Department department);

    List<Subscription> findByCategory(Category category);

    List<Subscription> findByStatus(SubscriptionStatus status);

    List<Subscription> findByNextRenewalDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT s FROM Subscription s WHERE s.nextRenewalDate <= :thresholdDate AND s.status = 'ACTIVE'")
    List<Subscription> findUpcomingRenewals(@Param("thresholdDate") LocalDate thresholdDate);

    List<Subscription> findByDepartmentAndCategoryAndStatus(Department department, Category category, SubscriptionStatus status);

    @Query("SELECT s.department, SUM(s.normalizedMonthlyCostUSD) FROM Subscription s WHERE s.status != 'CANCELLED' GROUP BY s.department")
    List<Object[]> findMonthlySpendByDepartment();

    @Query("SELECT s.category, SUM(s.normalizedMonthlyCostUSD) FROM Subscription s WHERE s.status != 'CANCELLED' GROUP BY s.category")
    List<Object[]> findMonthlySpendByCategory();

    List<Subscription> findByLoggedById(Long userId);

    Optional<Subscription> findByIdAndLoggedById(Long id, Long userId);

    @Query("SELECT s.department, SUM(s.normalizedMonthlyCostUSD) FROM Subscription s WHERE s.status != 'CANCELLED' AND s.loggedBy.id = :userId GROUP BY s.department")
    List<Object[]> findMonthlySpendByDepartmentForUser(@Param("userId") Long userId);

    @Query("SELECT s.category, SUM(s.normalizedMonthlyCostUSD) FROM Subscription s WHERE s.status != 'CANCELLED' AND s.loggedBy.id = :userId GROUP BY s.category")
    List<Object[]> findMonthlySpendByCategoryForUser(@Param("userId") Long userId);
}
