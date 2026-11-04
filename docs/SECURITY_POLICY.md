# Security & RBAC Policy

## Authentication & Authorization
- Passwords hashed using BCrypt (cost factor 10).
- Stateless JWT tokens signed with HMAC-SHA256.
- Role-based access control enforces ADMIN vs EMPLOYEE capabilities across all REST controllers.
