# Docker Development Environment

This document describes the Docker-based development environment for specql, which provides containerized databases for testing and development.

## Overview

The Docker setup includes:
- **PostgreSQL 16** (Alpine) - Recommended for production
- **MySQL 8.0** - General purpose
- **Microsoft SQL Server 2022** - Enterprise ready
- **SQLite** - File-based (via Alpine container)
- **pgAdmin 4** - PostgreSQL management (optional)
- **phpMyAdmin** - MySQL management (optional)

All containers support **both ARM64 and AMD64 architectures** automatically.

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Node.js 16+ (for npm scripts)

### Installation

**macOS:**
```bash
brew install --cask docker
```

**Windows:**
Download from [docker.com](https://www.docker.com/products/docker-desktop)

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

## Quick Start

### Start All Databases
```bash
npm run db:start
```

This starts all database containers in the background. Wait 10-15 seconds for initialization.

### Check Status
```bash
npm run db:ps
```

### Check Health
```bash
npm run db:health
```

### Stop All Databases
```bash
npm run db:stop
```

## Database Connection Information

### PostgreSQL
- **Host:** localhost
- **Port:** 5432
- **Database:** specql_dev
- **Username:** specql
- **Password:** specql_dev_password

**Connection String:**
```
postgresql://specql:specql_dev_password@localhost:5432/specql_dev
```

### MySQL
- **Host:** localhost
- **Port:** 3306
- **Database:** specql_dev
- **Username:** specql
- **Password:** specql_dev_password

**Connection String:**
```
mysql://specql:specql_dev_password@localhost:3306/specql_dev
```

### Microsoft SQL Server
- **Host:** localhost
- **Port:** 1433
- **Database:** specql_dev
- **Username:** sa
- **Password:** SpecQL_Dev_Pass123!

**Connection String:**
```
mssql://sa:SpecQL_Dev_Pass123!@localhost:1433/specql_dev
```

### SQLite
SQLite is file-based. Files are stored in the container at `/data/`.

**Access the container:**
```bash
docker-compose exec sqlite sh
cd /data
sqlite3 specql_dev.db
```

## Available Commands

### Start Databases

```bash
# Start all databases
npm run db:start

# Start specific database
npm run db:start:postgres
npm run db:start:mysql
npm run db:start:mssql
npm run db:start:sqlite
```

### Stop Databases

```bash
# Stop all databases
npm run db:stop

# Stop specific database
npm run db:stop:postgres
npm run db:stop:mysql
npm run db:stop:mssql
```

### Restart Databases

```bash
# Restart all databases
npm run db:restart

# Restart specific database
./scripts/db.sh restart postgres
./scripts/db.sh restart mysql
./scripts/db.sh restart mssql
```

### View Logs

```bash
# View all database logs
npm run db:logs

# View specific database logs
./scripts/db.sh logs postgres
./scripts/db.sh logs mysql
./scripts/db.sh logs mssql
```

### Connect to Database CLI

```bash
# PostgreSQL
./scripts/db.sh connect postgres

# MySQL
./scripts/db.sh connect mysql

# MSSQL
./scripts/db.sh connect mssql
```

### Management Tools

```bash
# Start pgAdmin and phpMyAdmin
npm run db:tools
```

**pgAdmin:** http://localhost:5050
- Email: admin@specql.local
- Password: admin

**phpMyAdmin:** http://localhost:8080

### Clean Up

```bash
# Remove all containers and volumes (DELETES ALL DATA!)
npm run db:clean
```

## Using the Helper Script Directly

The `scripts/db.sh` script provides additional commands:

```bash
# Show help
./scripts/db.sh help

# Start databases
./scripts/db.sh start [postgres|mysql|mssql|sqlite|all]

# Stop databases
./scripts/db.sh stop [postgres|mysql|mssql|sqlite|all]

# Check health
./scripts/db.sh health [postgres|mysql|mssql|all]

# Connect to CLI
./scripts/db.sh connect [postgres|mysql|mssql]

# View container status
./scripts/db.sh ps
```

## Data Persistence

Database data is stored in Docker volumes:
- `postgres_data` - PostgreSQL data
- `mysql_data` - MySQL data
- `mssql_data` - MSSQL data
- `sqlite_data` - SQLite files

**Data persists** across container restarts. To completely remove data, use:
```bash
npm run db:clean
```

## Initialization Scripts

Custom initialization scripts can be placed in:
- `docker/init-scripts/postgres/` - PostgreSQL (.sql files)
- `docker/init-scripts/mysql/` - MySQL (.sql files)
- `docker/init-scripts/mssql/` - MSSQL (.sql files)

Scripts are executed automatically when containers are first created (in alphabetical order).

## Architecture Support

All database images support both ARM64 (Apple Silicon, ARM servers) and AMD64 (Intel/AMD) architectures. Docker automatically selects the correct image for your platform.

## Troubleshooting

### Container Won't Start

**Check if port is already in use:**
```bash
# macOS/Linux
lsof -i :5432  # PostgreSQL
lsof -i :3306  # MySQL
lsof -i :1433  # MSSQL

# Windows
netstat -ano | findstr :5432
```

**Check Docker logs:**
```bash
docker-compose logs postgres
docker-compose logs mysql
docker-compose logs mssql
```

### Database Connection Refused

Wait for the container to fully initialize (check with `npm run db:health`):
```bash
npm run db:health
```

### Containers Not Healthy

Restart the problematic container:
```bash
./scripts/db.sh restart postgres
```

### Reset Everything

```bash
# Stop and remove all containers/volumes
npm run db:clean

# Start fresh
npm run db:start
```

### Permission Denied on Script

Make the script executable:
```bash
chmod +x scripts/db.sh
```

## Testing Against Multiple Databases

To test your generated schemas against all databases:

```bash
# Start all databases
npm run db:start

# Generate schema for PostgreSQL
specql init openapi.yaml --database postgres

# Test the generated schema
psql -h localhost -U specql -d specql_dev -f db/schema.sql

# Repeat for other databases
# MySQL
specql init openapi.yaml --database mysql
mysql -h localhost -u specql -pspecql_dev_password specql_dev < db/schema.sql

# MSSQL
specql init openapi.yaml --database mssql
./scripts/db.sh connect mssql
# Then run your schema in the SQL prompt
```

## CI/CD Integration

For GitHub Actions or other CI systems:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    env:
      POSTGRES_DB: specql_test
      POSTGRES_USER: specql
      POSTGRES_PASSWORD: test_password
    ports:
      - 5432:5432
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

## Advanced Configuration

### Custom Environment Variables

Create a `.env` file (not committed to git):

```env
# PostgreSQL
POSTGRES_PASSWORD=your_custom_password
POSTGRES_PORT=5432

# MySQL
MYSQL_PASSWORD=your_custom_password
MYSQL_PORT=3306

# MSSQL
MSSQL_SA_PASSWORD=your_custom_password
MSSQL_PORT=1433
```

Then update `docker-compose.yml` to use these variables.

### Custom Ports

Edit `docker-compose.yml` to change port mappings:

```yaml
postgres:
  ports:
    - "5433:5432"  # Use port 5433 on host
```

### Resource Limits

Add resource limits to prevent containers from consuming too much memory:

```yaml
postgres:
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 1G
      reservations:
        cpus: '0.5'
        memory: 512M
```

## Security Notes

**Development Use Only**: The provided credentials are for development only. Never use these in production!

**Network Isolation**: All containers run in an isolated `specql-network`. They can communicate with each other but are isolated from other Docker networks.

**Default Passwords**: Change all default passwords for any non-local deployments.

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [MySQL Docker](https://hub.docker.com/_/mysql)
- [MSSQL Docker](https://hub.docker.com/_/microsoft-mssql-server)
