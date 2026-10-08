# Backend Architecture

### Layer Responsibilities
1. **Controller Layer**: Handles HTTP requests, validations, and returns standardized response DTOs.
2. **Service Layer**: Business logic, expense aggregations, cron renewal triggers.
3. **Repository Layer**: Spring Data JPA query execution and specifications.
