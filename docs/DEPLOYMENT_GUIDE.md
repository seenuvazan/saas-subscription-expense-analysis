# Production Deployment Guide

## Docker Compose Deployment
```bash
docker-compose up --build -d
```

## Environment Variables
- `SPRING_PROFILES_ACTIVE=prod`
- `DB_URL=jdbc:postgresql://postgres:5432/saas_db`
- `JWT_SECRET=your_production_secret_key_here`
