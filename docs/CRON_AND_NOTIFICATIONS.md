# Scheduled Jobs & Notifications

Spring Boot `@Scheduled` runs daily at midnight to scan for:
- Subscriptions expiring within the upcoming 7, 14, and 30 days.
- Over-budget department limits.
