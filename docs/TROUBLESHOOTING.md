# Troubleshooting Guide

### Port 8080 or 5173 In Use
Kill conflicting processes or pass alternate ports via `--server.port` or `--port`.

### CORS Errors
Verify backend `SecurityConfig` has allowed origin set to frontend dev host.
