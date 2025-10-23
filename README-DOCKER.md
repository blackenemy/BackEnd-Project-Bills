# Docker Setup Guide

This guide explains how to run the Bills Management System using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed

## Quick Start

### 1. Production Environment

```bash
# Build and start all services
npm run docker:up

# Or using docker-compose directly
docker-compose up -d

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### 2. Development Environment

```bash
# Start development environment
npm run docker:dev

# Stop development environment
npm run docker:dev:down
```

## Services

### Production (`docker-compose.yml`)

- **app**: NestJS application (Port: 3000)
- **postgres**: PostgreSQL database (Port: 5432)
- **pgadmin**: Database administration tool (Port: 8080)

### Development (`docker-compose.dev.yml`)

- **app**: NestJS application with hot reload and debug mode
- **postgres**: PostgreSQL database

## Environment Variables

The docker-compose files use the following environment variables:

### Database
- `DB_HOST`: postgres (container name)
- `DB_PORT`: 5432
- `DB_USERNAME`: bills_user
- `DB_PASSWORD`: bills_password
- `DB_NAME`: bills_db

### JWT
- `JWT_SECRET`: your-jwt-secret-key
- `JWT_EXPIRES_IN`: 24h

## Accessing Services

### Production
- **API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/reference
- **pgAdmin**: http://localhost:8080
  - Email: admin@bills.com
  - Password: admin123

### Development
- **API**: http://localhost:3000
- **Debug port**: 9229 (for VS Code debugging)

## Database Management

### pgAdmin Setup
1. Open http://localhost:8080
2. Login with credentials above
3. Add server:
   - Host: postgres
   - Port: 5432
   - Username: bills_user
   - Password: bills_password
   - Database: bills_db

### Manual Database Access

```bash
# Connect to PostgreSQL container
docker exec -it bills_postgres psql -U bills_user -d bills_db

# Run SQL commands
\dt  # List tables
\q   # Quit
```

## Useful Commands

```bash
# View running containers
docker ps

# View logs for specific service
docker-compose logs app
docker-compose logs postgres

# Restart specific service
docker-compose restart app

# Rebuild application
docker-compose build app
docker-compose up -d app

# Clean up
docker-compose down -v  # Remove volumes
docker system prune     # Clean up unused Docker resources
```

## Development with Docker

### VS Code Debug Setup

Add this to your `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Docker: Attach to Node",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "address": "localhost",
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/app",
      "protocol": "inspector"
    }
  ]
}
```

### Hot Reload

In development mode, the application supports hot reload. Any changes to your code will automatically restart the server.

## Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL container is running: `docker ps`
2. Check logs: `docker-compose logs postgres`
3. Verify environment variables in docker-compose files

### Port Conflicts
If ports 3000, 5432, or 8080 are already in use, modify the port mappings in docker-compose files.

### Permission Issues
If you encounter permission issues on Linux/macOS:
```bash
sudo chown -R $USER:$USER .
```

## Production Deployment

For production deployment:

1. Update environment variables in `docker-compose.yml`
2. Use strong passwords and secrets
3. Consider using Docker secrets or external secret management
4. Set up proper logging and monitoring
5. Use a reverse proxy (nginx) for SSL termination
