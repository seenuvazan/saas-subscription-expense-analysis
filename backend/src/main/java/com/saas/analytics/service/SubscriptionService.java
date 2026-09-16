package com.saas.analytics.service;

import com.saas.analytics.dto.SubscriptionCreateRequest;
import com.saas.analytics.dto.SubscriptionDTO;
import com.saas.analytics.entity.Subscription;
import com.saas.analytics.entity.User;
import com.saas.analytics.entity.Vendor;
import com.saas.analytics.exception.ResourceNotFoundException;
import com.saas.analytics.model.Category;
import com.saas.analytics.model.Department;
import com.saas.analytics.model.SubscriptionStatus;
import com.saas.analytics.repository.SubscriptionRepository;
import com.saas.analytics.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final VendorRepository vendorRepository;

    public SubscriptionDTO createSubscription(SubscriptionCreateRequest request, User loggedInUser) {
        Optional<Vendor> existingVendor = vendorRepository.findByNameIgnoreCase(request.getVendorName());
        Vendor vendor = existingVendor.orElseGet(() -> vendorRepository.save(
                Vendor.builder()
                        .name(request.getVendorName())
                        .category(request.getCategory())
                        .isVerified(true)
                        .build()
        ));

        SubscriptionStatus initialStatus = SubscriptionStatus.ACTIVE;

        // Seat utilization check
        if (request.getAssignedSeats() != null && request.getUsedSeats() != null && request.getAssignedSeats() > 0) {
            double ratio = (double) request.getUsedSeats() / request.getAssignedSeats();
            if (ratio < 0.5) {
                initialStatus = SubscriptionStatus.FLAGGED_IDLE;
            }
        }

        // Duplicate tool check in same department & category
        List<Subscription> duplicates = subscriptionRepository.findByDepartmentAndCategoryAndStatus(
                request.getDepartment(), request.getCategory(), SubscriptionStatus.ACTIVE
        );
        if (!duplicates.isEmpty() && initialStatus == SubscriptionStatus.ACTIVE) {
            initialStatus = SubscriptionStatus.FLAGGED_DUPLICATE;
        }

        Subscription subscription = Subscription.builder()
                .vendorName(request.getVendorName())
                .vendor(vendor)
                .category(request.getCategory())
                .cost(request.getCost())
                .currency(request.getCurrency())
                .billingFrequency(request.getBillingFrequency())
                .department(request.getDepartment())
                .nextRenewalDate(request.getNextRenewalDate())
                .status(initialStatus)
                .assignedSeats(request.getAssignedSeats() != null ? request.getAssignedSeats() : 1)
                .usedSeats(request.getUsedSeats() != null ? request.getUsedSeats() : 1)
                .notes(request.getNotes())
                .loggedBy(loggedInUser)
                .build();

        subscription.calculateNormalizedCost();
        Subscription saved = subscriptionRepository.save(subscription);
        return mapToDTO(saved);
    }

    public List<SubscriptionDTO> getAllSubscriptions(Department department, Category category, SubscriptionStatus status, String search) {
        List<Subscription> list = subscriptionRepository.findAll();

        return list.stream()
                .filter(s -> department == null || s.getDepartment() == department)
                .filter(s -> category == null || s.getCategory() == category)
                .filter(s -> status == null || s.getStatus() == status)
                .filter(s -> search == null || search.isBlank() || s.getVendorName().toLowerCase().contains(search.toLowerCase()))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SubscriptionDTO getSubscriptionById(Long id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));
        return mapToDTO(subscription);
    }

    public SubscriptionDTO updateSubscriptionStatus(Long id, SubscriptionStatus status) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));

        subscription.setStatus(status);
        Subscription saved = subscriptionRepository.save(subscription);
        return mapToDTO(saved);
    }

    public SubscriptionDTO updateSubscription(Long id, SubscriptionCreateRequest request) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));

        subscription.setVendorName(request.getVendorName());
        subscription.setCategory(request.getCategory());
        subscription.setCost(request.getCost());
        subscription.setCurrency(request.getCurrency());
        subscription.setBillingFrequency(request.getBillingFrequency());
        subscription.setDepartment(request.getDepartment());
        subscription.setNextRenewalDate(request.getNextRenewalDate());
        subscription.setAssignedSeats(request.getAssignedSeats());
        subscription.setUsedSeats(request.getUsedSeats());
        subscription.setNotes(request.getNotes());

        subscription.calculateNormalizedCost();

        // Re-check seat utilization
        if (subscription.getAssignedSeats() != null && subscription.getAssignedSeats() > 0) {
            double ratio = (double) subscription.getUsedSeats() / subscription.getAssignedSeats();
            if (ratio < 0.5 && subscription.getStatus() == SubscriptionStatus.ACTIVE) {
                subscription.setStatus(SubscriptionStatus.FLAGGED_IDLE);
            }
        }

        Subscription saved = subscriptionRepository.save(subscription);
        return mapToDTO(saved);
    }

    public void deleteSubscription(Long id) {
        if (!subscriptionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subscription not found with id: " + id);
        }
        subscriptionRepository.deleteById(id);
    }

    public SubscriptionDTO mapToDTO(Subscription sub) {
        double utilization = (sub.getAssignedSeats() != null && sub.getAssignedSeats() > 0)
                ? (double) sub.getUsedSeats() / sub.getAssignedSeats() * 100.0
                : 100.0;

        return SubscriptionDTO.builder()
                .id(sub.getId())
                .vendorName(sub.getVendorName())
                .category(sub.getCategory())
                .cost(sub.getCost())
                .currency(sub.getCurrency())
                .billingFrequency(sub.getBillingFrequency())
                .normalizedMonthlyCostUSD(sub.getNormalizedMonthlyCostUSD())
                .department(sub.getDepartment())
                .nextRenewalDate(sub.getNextRenewalDate())
                .status(sub.getStatus())
                .assignedSeats(sub.getAssignedSeats())
                .usedSeats(sub.getUsedSeats())
                .utilizationRate(Math.round(utilization * 10.0) / 10.0)
                .notes(sub.getNotes())
                .loggedByEmail(sub.getLoggedBy() != null ? sub.getLoggedBy().getEmail() : null)
                .loggedByName(sub.getLoggedBy() != null ? sub.getLoggedBy().getFullName() : null)
                .createdAt(sub.getCreatedAt())
                .build();
    }
}
