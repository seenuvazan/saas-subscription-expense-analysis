# Database Schema Specification

### Core Tables
1. **users**: id, email, password_hash, name, role, department, created_at
2. **subscriptions**: id, software_name, vendor_id, cost, billing_frequency, renewal_date, status, department, category
3. **department_budgets**: id, department, monthly_budget, alert_threshold_percentage
4. **alert_notifications**: id, user_id, title, message, severity, type, is_read, created_at
5. **cron_run_logs**: id, run_timestamp, jobs_executed, alerts_triggered, status
