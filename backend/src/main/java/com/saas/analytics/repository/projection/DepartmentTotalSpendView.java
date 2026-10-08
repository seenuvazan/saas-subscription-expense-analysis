package com.saas.analytics.repository.projection;

import com.saas.analytics.model.Department;
import java.math.BigDecimal;

public interface DepartmentTotalSpendView {
    Department getDepartment();
    BigDecimal getTotalSpend();
    Long getSubscriptionCount();
}
