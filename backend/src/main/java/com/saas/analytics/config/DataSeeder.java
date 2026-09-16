package com.saas.analytics.config;

import com.saas.analytics.entity.*;
import com.saas.analytics.model.*;
import com.saas.analytics.repository.*;
import com.saas.analytics.service.RenewalSchedulerService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final DepartmentBudgetRepository budgetRepository;
    private final RenewalSchedulerService schedulerService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        // 1. Seed Users
        User employee = User.builder()
                .email("employee@company.com")
                .password(passwordEncoder.encode("password123"))
                .fullName("Alex Morgan")
                .department(Department.ENGINEERING)
                .role(Role.ROLE_EMPLOYEE)
                .build();

        User admin = User.builder()
                .email("admin@company.com")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Sarah Jenkins (Finance)")
                .department(Department.FINANCE)
                .role(Role.ROLE_ADMIN)
                .build();

        userRepository.saveAll(List.of(employee, admin));

        // 2. Seed Department Budgets
        budgetRepository.saveAll(List.of(
                DepartmentBudget.builder().department(Department.ENGINEERING).monthlyBudgetLimitUSD(BigDecimal.valueOf(18000)).warningThresholdPercent(80).criticalThresholdPercent(100).build(),
                DepartmentBudget.builder().department(Department.DESIGN).monthlyBudgetLimitUSD(BigDecimal.valueOf(4000)).warningThresholdPercent(80).criticalThresholdPercent(100).build(),
                DepartmentBudget.builder().department(Department.SALES).monthlyBudgetLimitUSD(BigDecimal.valueOf(12000)).warningThresholdPercent(80).criticalThresholdPercent(100).build(),
                DepartmentBudget.builder().department(Department.MARKETING).monthlyBudgetLimitUSD(BigDecimal.valueOf(8000)).warningThresholdPercent(80).criticalThresholdPercent(100).build(),
                DepartmentBudget.builder().department(Department.HR).monthlyBudgetLimitUSD(BigDecimal.valueOf(3500)).warningThresholdPercent(80).criticalThresholdPercent(100).build(),
                DepartmentBudget.builder().department(Department.PRODUCTIVITY).monthlyBudgetLimitUSD(BigDecimal.valueOf(5000)).warningThresholdPercent(80).criticalThresholdPercent(100).build()
        ));

        // 3. Seed Vendors & Subscriptions
        LocalDate today = LocalDate.now();

        List<Subscription> initialSubs = List.of(
                Subscription.builder()
                        .vendorName("AWS Cloud Services")
                        .category(Category.DEV)
                        .cost(BigDecimal.valueOf(8450.00))
                        .currency(Currency.USD)
                        .billingFrequency(BillingFrequency.MONTHLY)
                        .department(Department.ENGINEERING)
                        .nextRenewalDate(today.plusDays(4)) // Urgent renewal alert trigger
                        .status(SubscriptionStatus.ACTIVE)
                        .assignedSeats(50)
                        .usedSeats(48)
                        .notes("Core infrastructure & Kubernetes clusters")
                        .loggedBy(employee)
                        .build(),

                Subscription.builder()
                        .vendorName("GitHub Enterprise")
                        .category(Category.DEV)
                        .cost(BigDecimal.valueOf(2500.00))
                        .currency(Currency.USD)
                        .billingFrequency(BillingFrequency.MONTHLY)
                        .department(Department.ENGINEERING)
                        .nextRenewalDate(today.plusDays(12)) // Warning renewal alert trigger
                        .status(SubscriptionStatus.ACTIVE)
                        .assignedSeats(100)
                        .usedSeats(92)
                        .notes("CI/CD pipeline and code repositories")
                        .loggedBy(employee)
                        .build(),

                Subscription.builder()
                        .vendorName("Datadog Monitoring")
                        .category(Category.DEV)
                        .cost(BigDecimal.valueOf(4200.00))
                        .currency(Currency.USD)
                        .billingFrequency(BillingFrequency.MONTHLY)
                        .department(Department.ENGINEERING)
                        .nextRenewalDate(today.plusDays(28))
                        .status(SubscriptionStatus.ACTIVE)
                        .assignedSeats(30)
                        .usedSeats(28)
                        .notes("APM and log aggregation")
                        .loggedBy(employee)
                        .build(),

                Subscription.builder()
                        .vendorName("Figma Enterprise")
                        .category(Category.DESIGN)
                        .cost(BigDecimal.valueOf(1800.00))
                        .currency(Currency.USD)
                        .billingFrequency(BillingFrequency.MONTHLY)
                        .department(Department.DESIGN)
                        .nextRenewalDate(today.plusDays(9))
                        .status(SubscriptionStatus.ACTIVE)
                        .assignedSeats(25)
                        .usedSeats(23)
                        .notes("UI/UX design workspace")
                        .loggedBy(admin)
                        .build(),

                Subscription.builder()
                        .vendorName("Sketch Pro")
                        .category(Category.DESIGN)
                        .cost(BigDecimal.valueOf(990.00))
                        .currency(Currency.USD)
                        .billingFrequency(BillingFrequency.MONTHLY)
                        .department(Department.DESIGN)
                        .nextRenewalDate(today.plusDays(15))
                        .status(SubscriptionStatus.FLAGGED_DUPLICATE) // Redundant tool in Design
                        .assignedSeats(15)
                        .usedSeats(2) // Low usage + Duplicate
                        .notes("Legacy design tool replaced by Figma")
                        .loggedBy(admin)
                        .build(),

                Subscription.builder()
                        .vendorName("Salesforce Enterprise CRM")
                        .category(Category.SALES)
                        .cost(BigDecimal.valueOf(14200.00))
                        .currency(Currency.USD)
                        .billingFrequency(BillingFrequency.MONTHLY)
                        .department(Department.SALES)
                        .nextRenewalDate(today.plusDays(6))
                        .status(SubscriptionStatus.ACTIVE)
                        .assignedSeats(80)
                        .usedSeats(35) // Only 35 of 80 seats used -> Underutilization trigger!
                        .notes("Global pipeline & customer accounts")
                        .loggedBy(admin)
                        .build(),

                Subscription.builder()
                        .vendorName("HubSpot Marketing Hub")
                        .category(Category.MARKETING)
                        .cost(BigDecimal.valueOf(4800.00))
                        .currency(Currency.USD)
                        .billingFrequency(BillingFrequency.MONTHLY)
                        .department(Department.MARKETING)
                        .nextRenewalDate(today.plusDays(21))
                        .status(SubscriptionStatus.ACTIVE)
                        .assignedSeats(20)
                        .usedSeats(18)
                        .notes("Inbound lead generation & email campaigns")
                        .loggedBy(admin)
                        .build(),

                Subscription.builder()
                        .vendorName("Zoom Enterprise")
                        .category(Category.PRODUCTIVITY)
                        .cost(BigDecimal.valueOf(2400.00))
                        .currency(Currency.USD)
                        .billingFrequency(BillingFrequency.MONTHLY)
                        .department(Department.PRODUCTIVITY)
                        .nextRenewalDate(today.plusDays(18))
                        .status(SubscriptionStatus.FLAGGED_IDLE)
                        .assignedSeats(150)
                        .usedSeats(40) // Underutilized
                        .notes("Video conferencing licenses")
                        .loggedBy(employee)
                        .build()
        );

        for (Subscription sub : initialSubs) {
            sub.calculateNormalizedCost();
            subscriptionRepository.save(sub);
        }

        // 4. Trigger initial scan for alerts
        schedulerService.runRenewalAndBudgetChecks();
    }
}
