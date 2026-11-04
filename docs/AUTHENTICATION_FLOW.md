# Authentication Flow

1. User submits login credentials.
2. Spring Security authenticates against the database.
3. JWT token returned upon verification.
4. Client stores JWT in LocalStorage and attaches it via HTTP `Authorization: Bearer <token>`.
