package com.saas.analytics.repository.projection;

import com.saas.analytics.model.Category;
import java.math.BigDecimal;

public interface CategoryTotalSpendView {
    Category getCategory();
    BigDecimal getTotalCost();
    Long getToolCount();
}
