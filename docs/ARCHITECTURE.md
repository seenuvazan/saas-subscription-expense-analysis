# System Architecture & Design Overview

## 1. High-Level Architecture
The SaaS Subscription & Expense Analytics platform is designed as a modular decoupled system:
- **Frontend SPA**: React 18, Vite, Tailwind CSS, Recharts for reactive UI and charting.
- **Backend API**: Spring Boot 3, Spring Security, Spring Data JPA, Hibernate, JWT.
- **Persistence Layer**: Relational database (PostgreSQL in production, H2 in dev).
- **Background Automation**: Spring Scheduled cron service for renewal alerts and budget reconciliation.
