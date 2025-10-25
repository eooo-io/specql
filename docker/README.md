# Docker Setup

This directory contains Docker-related configuration and initialization scripts for specql development databases.

## Directory Structure

```
docker/
├── init-scripts/
│   ├── postgres/       # PostgreSQL initialization scripts
│   │   └── 01-init.sql
│   ├── mysql/          # MySQL initialization scripts
│   │   └── 01-init.sql
│   └── mssql/          # MSSQL initialization scripts
│       └── 01-init.sql
└── README.md           # This file
```

## Initialization Scripts

Scripts in the `init-scripts/` directories are automatically executed when database containers are first created.

### Script Execution Order

Scripts are executed in **alphabetical order**. Use numeric prefixes to control execution sequence:
- `01-init.sql` - Basic setup
- `02-schema.sql` - Schema creation
- `03-seed.sql` - Sample data

### PostgreSQL Scripts

Location: `docker/init-scripts/postgres/`

Scripts run as the `POSTGRES_USER` (specql by default).

Example:
```sql
-- 01-init.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SCHEMA IF NOT EXISTS my_schema;
```

### MySQL Scripts

Location: `docker/init-scripts/mysql/`

Scripts run with full privileges.

Example:
```sql
-- 01-init.sql
USE specql_dev;
CREATE TABLE my_table (id INT PRIMARY KEY);
```

### MSSQL Scripts

Location: `docker/init-scripts/mssql/`

Scripts run as SA user with full privileges.

Example:
```sql
-- 01-init.sql
USE specql_dev;
GO
CREATE TABLE my_table (id INT PRIMARY KEY);
GO
```

## Adding Custom Scripts

1. Create a new `.sql` file in the appropriate directory
2. Use numeric prefixes to control execution order
3. Restart the container to apply (for new containers)

```bash
# After adding a new script
npm run db:stop:postgres
docker volume rm specql_postgres_data
npm run db:start:postgres
```

**Note:** Scripts only run on container initialization. To re-run, you must remove the volume.

## Testing Generated Schemas

To test a generated schema:

```bash
# Generate schema with specql
specql init openapi.yaml

# Apply to PostgreSQL
psql -h localhost -U specql -d specql_dev -f db/schema.sql

# Or use the helper script
./scripts/db.sh connect postgres
# Then paste your schema
```

## See Also

- [../DOCKER.md](../DOCKER.md) - Complete Docker documentation
- [../docker-compose.yml](../docker-compose.yml) - Service definitions
- [../scripts/db.sh](../scripts/db.sh) - Database management script
