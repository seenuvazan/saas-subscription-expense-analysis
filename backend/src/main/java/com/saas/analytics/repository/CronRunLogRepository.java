package com.saas.analytics.repository;

import com.saas.analytics.entity.CronRunLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CronRunLogRepository extends JpaRepository<CronRunLog, Long> {
    List<CronRunLog> findTop10ByOrderByRanAtDesc();
}
