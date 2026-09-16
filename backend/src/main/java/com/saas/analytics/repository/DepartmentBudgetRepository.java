package com.saas.analytics.repository;

import com.saas.analytics.entity.DepartmentBudget;
import com.saas.analytics.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentBudgetRepository extends JpaRepository<DepartmentBudget, Long> {
    Optional<DepartmentBudget> findByDepartment(Department department);
}
