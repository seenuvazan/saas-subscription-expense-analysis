# REST API Specification

### Authentication Endpoints
- `POST /api/auth/login`: Authenticate credentials and receive Bearer JWT.
- `POST /api/auth/register`: Register a new workspace user.
- `GET /api/auth/me`: Retrieve the authenticated user context.

### Subscription Endpoints
- `GET /api/subscriptions`: Fetch all subscriptions.
- `POST /api/subscriptions`: Create a new subscription record.
- `PUT /api/subscriptions/{id}`: Update subscription details.
- `DELETE /api/subscriptions/{id}`: Remove a subscription record.
