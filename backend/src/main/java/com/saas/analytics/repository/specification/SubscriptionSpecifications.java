package com.saas.analytics.repository.specification;

import com.saas.analytics.entity.Subscription;
import com.saas.analytics.model.Department;
import com.saas.analytics.model.SubscriptionStatus;
import org.springframework.data.jpa.domain.Specification;

public final class SubscriptionSpecifications {
    private SubscriptionSpecifications() {}

    public static Specification<Subscription> hasDepartment(Department department) {
        return (root, query, cb) -> department == null ? null : cb.equal(root.get("department"), department);
    }

    public static Specification<Subscription> hasStatus(SubscriptionStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Subscription> searchByName(String query) {
        return (root, queryStr, cb) -> {
            if (query == null || query.isBlank()) return null;
            return cb.like(cb.lower(root.get("softwareName")), "%" + query.toLowerCase() + "%");
        };
    }
}
