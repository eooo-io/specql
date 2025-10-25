# NPM Scripts Reference

Complete reference for all npm scripts available in the specql project.

## Table of Contents

- [Build & Development](#build--development)
- [Testing & Quality](#testing--quality)
- [Documentation](#documentation)
- [Docker Database Management](#docker-database-management)
- [Quick Reference Table](#quick-reference-table)

---

## Build & Development

### `npm run build`
Compiles TypeScript source code to JavaScript in the `dist/` directory.

```bash
npm run build
```

**What it does:**
- Runs TypeScript compiler (`tsc`)
- Outputs compiled JavaScript to `dist/`
- Generates source maps
- Creates type declaration files

**When to use:**
- Before publishing to npm
- Before running the CLI with `npm start`
- After making changes to TypeScript files

---

### `npm start`
Runs the compiled CLI application.

```bash
npm start
```

**What it does:**
- Executes `dist/index.js`
- Requires `npm run build` to be run first

**When to use:**
- Testing the compiled version
- After building the project

**Note:** For development, use `npm run dev` instead.

---

### `npm run dev`
Runs the CLI in development mode without compilation.

```bash
npm run dev
```

**What it does:**
- Uses `ts-node` to run TypeScript directly
- No build step required
- Faster iteration during development

**When to use:**
- Active development
- Testing changes quickly
- Debugging

---

### `npm run clean`
Removes build artifacts and temporary files.

```bash
npm run clean
```

**What it does:**
- Runs `gts clean`
- Removes `dist/` directory
- Removes `.tsbuildinfo` files

**When to use:**
- Before a fresh build
- Cleaning up after build issues
- Freeing up disk space

---

## Testing & Quality

### `npm test`
Runs the test suite using Jest.

```bash
npm test
```

**What it does:**
- Executes all test files (`*.test.ts`, `*.spec.ts`)
- Generates coverage reports
- Uses ts-jest for TypeScript support

**Status:** Test infrastructure is configured but tests not yet implemented.

---

### `npm run lint`
Checks code against Google TypeScript Style Guide.

```bash
npm run lint
```

**What it does:**
- Runs `gts lint`
- Checks for style violations
- Reports errors and warnings
- Does NOT modify files

**Exit codes:**
- 0: No issues found
- 1: Issues found

**Example output:**
```
✔ No lint errors found
```

---

### `npm run lint:fix`
Automatically fixes linting issues.

```bash
npm run lint:fix
```

**What it does:**
- Runs `gts fix`
- Auto-fixes style violations where possible
- Reports unfixable issues

**What it fixes:**
- Formatting issues
- Import ordering
- Simple style violations

**What it doesn't fix:**
- Type errors
- Logic errors
- Complex style issues

---

### `npm run format`
Formats code with Prettier.

```bash
npm run format
```

**What it does:**
- Runs Prettier on all TypeScript files in `src/`
- Applies formatting rules from `.prettierrc.json`
- Modifies files in place

**Formatting rules:**
- Single quotes
- 2-space indentation
- Semicolons required
- 80-character line length

---

### `npm run format:check`
Checks if code is formatted correctly without modifying files.

```bash
npm run format:check
```

**What it does:**
- Checks formatting against Prettier rules
- Does NOT modify files
- Reports formatting violations

**Exit codes:**
- 0: All files properly formatted
- 1: Some files need formatting

**Use in CI/CD:**
```yaml
- run: npm run format:check
```

---

### `npm run check`
Runs both linting and formatting checks.

```bash
npm run check
```

**What it does:**
- Runs `gts check`
- Combines linting and formatting checks
- Comprehensive code quality check

**When to use:**
- Before committing code
- In CI/CD pipelines
- Pre-push hooks

---

## Documentation

### `npm run docs`
Generates API documentation with TypeDoc.

```bash
npm run docs
```

**What it does:**
- Generates HTML documentation from TypeScript/JSDoc comments
- Outputs to `docs/` directory
- Uses Material theme
- Includes all exported APIs

**Output structure:**
```
docs/
├── index.html
├── modules.html
├── classes/
├── interfaces/
└── ...
```

**When to use:**
- After adding/updating JSDoc comments
- Before releasing
- Updating documentation site

---

### `npm run docs:watch`
Watches for file changes and regenerates documentation.

```bash
npm run docs:watch
```

**What it does:**
- Monitors TypeScript files for changes
- Automatically regenerates documentation
- Keeps documentation in sync during development

**When to use:**
- Writing documentation
- Working on JSDoc comments
- Reviewing generated docs

---

### `npm run docs:serve`
Generates documentation and serves it locally.

```bash
npm run docs:serve
```

**What it does:**
- Generates TypeDoc documentation
- Starts HTTP server on port 8080
- Opens browser automatically

**Access at:** http://localhost:8080

**When to use:**
- Previewing documentation changes
- Reviewing generated API docs
- Sharing docs locally

---

## Docker Database Management

### Starting Databases

#### `npm run db:start`
Starts all database containers.

```bash
npm run db:start
```

**What it does:**
- Starts PostgreSQL, MySQL, MSSQL, and SQLite containers
- Creates Docker network (`specql-network`)
- Initializes databases with init scripts
- Sets up health checks

**Databases started:**
- PostgreSQL 16 on port 5432
- MySQL 8.0 on port 3306
- MSSQL 2022 on port 1433
- SQLite container

**First-time setup:** Takes 15-30 seconds for initialization.

---

#### `npm run db:start:postgres`
Starts only PostgreSQL.

```bash
npm run db:start:postgres
```

**Connection details:**
- Host: localhost
- Port: 5432
- User: specql
- Password: specql_dev_password
- Database: specql_dev

---

#### `npm run db:start:mysql`
Starts only MySQL.

```bash
npm run db:start:mysql
```

**Connection details:**
- Host: localhost
- Port: 3306
- User: specql
- Password: specql_dev_password
- Database: specql_dev

---

#### `npm run db:start:mssql`
Starts only Microsoft SQL Server.

```bash
npm run db:start:mssql
```

**Connection details:**
- Host: localhost
- Port: 1433
- User: sa
- Password: SpecQL_Dev_Pass123!
- Database: specql_dev

---

#### `npm run db:start:sqlite`
Starts SQLite container.

```bash
npm run db:start:sqlite
```

**Note:** SQLite is file-based. Access via container shell:
```bash
docker-compose exec sqlite sh
cd /data
sqlite3 database.db
```

---

### Stopping Databases

#### `npm run db:stop`
Stops all database containers.

```bash
npm run db:stop
```

**What it does:**
- Stops all running database containers
- Preserves data in volumes
- Containers can be restarted with `db:start`

**Data preservation:** All data is kept in Docker volumes.

---

#### `npm run db:stop:postgres`
Stops only PostgreSQL.

```bash
npm run db:stop:postgres
```

---

#### `npm run db:stop:mysql`
Stops only MySQL.

```bash
npm run db:stop:mysql
```

---

#### `npm run db:stop:mssql`
Stops only MSSQL.

```bash
npm run db:stop:mssql
```

---

### Database Management

#### `npm run db:restart`
Restarts all database containers.

```bash
npm run db:restart
```

**What it does:**
- Stops all databases
- Waits 2 seconds
- Starts all databases

**When to use:**
- After configuration changes
- Resolving connection issues
- Applying init script changes (requires clean first)

---

#### `npm run db:logs`
Views logs from all database containers.

```bash
npm run db:logs
```

**What it does:**
- Streams logs from all databases
- Shows real-time output
- Useful for debugging

**Exit:** Press Ctrl+C to stop

**View specific database logs:**
```bash
./scripts/db.sh logs postgres
./scripts/db.sh logs mysql
./scripts/db.sh logs mssql
```

---

#### `npm run db:ps`
Shows status of database containers.

```bash
npm run db:ps
```

**What it does:**
- Lists all database containers
- Shows running status
- Displays port mappings
- Shows health status

**Example output:**
```
NAME                 STATUS                   PORTS
specql-postgres      Up 5 minutes (healthy)   0.0.0.0:5432->5432/tcp
specql-mysql         Up 5 minutes (healthy)   0.0.0.0:3306->3306/tcp
specql-mssql         Up 5 minutes (healthy)   0.0.0.0:1433->1433/tcp
```

---

#### `npm run db:health`
Checks health status of all databases.

```bash
npm run db:health
```

**What it does:**
- Runs health checks on each database
- Reports healthy/unhealthy status
- Uses database-specific health check commands

**Example output:**
```
ℹ Checking database health...
✓ PostgreSQL is healthy
✓ MySQL is healthy
✓ MSSQL is healthy
```

---

#### `npm run db:tools`
Starts database management tools.

```bash
npm run db:tools
```

**What it does:**
- Starts pgAdmin for PostgreSQL
- Starts phpMyAdmin for MySQL

**Access points:**
- **pgAdmin:** http://localhost:5050
  - Email: admin@specql.local
  - Password: admin

- **phpMyAdmin:** http://localhost:8080
  - Auto-configured for MySQL

**Note:** Requires databases to be running first.

---

#### `npm run db:clean`
**⚠️ WARNING: Destructive operation!**

Removes all containers and volumes, deleting all data.

```bash
npm run db:clean
```

**What it does:**
- Stops all containers
- Removes all containers
- Removes all volumes
- **Deletes all database data**

**Confirmation required:** Script prompts for `yes/no`

**When to use:**
- Fresh start needed
- Clearing corrupt data
- Freeing up disk space
- Testing initialization scripts

**To recover:**
```bash
npm run db:start
```
(Creates fresh databases)

---

### Helper Script

The `scripts/db.sh` script provides additional functionality not available via npm scripts:

```bash
# Connect to database CLI
./scripts/db.sh connect postgres   # PostgreSQL psql
./scripts/db.sh connect mysql      # MySQL CLI
./scripts/db.sh connect mssql      # MSSQL sqlcmd

# View help
./scripts/db.sh help

# Check health of specific database
./scripts/db.sh health postgres
./scripts/db.sh health mysql
```

---

## Quick Reference Table

| Command | Purpose | Modifies Files | Production Ready |
|---------|---------|----------------|------------------|
| `npm run build` | Compile TypeScript | No (creates dist/) | Yes |
| `npm start` | Run compiled CLI | No | Yes |
| `npm run dev` | Run in dev mode | No | No |
| `npm run clean` | Remove artifacts | Yes | Yes |
| `npm test` | Run tests | No | Yes |
| `npm run lint` | Check code style | No | Yes |
| `npm run lint:fix` | Fix style issues | Yes | Yes |
| `npm run format` | Format code | Yes | Yes |
| `npm run format:check` | Check formatting | No | Yes |
| `npm run check` | Lint + format check | No | Yes |
| `npm run docs` | Generate docs | No (creates docs/) | Yes |
| `npm run docs:watch` | Watch & generate docs | No | No |
| `npm run docs:serve` | Serve docs locally | No | No |
| `npm run db:start` | Start all databases | No | Dev only |
| `npm run db:stop` | Stop all databases | No | Dev only |
| `npm run db:restart` | Restart databases | No | Dev only |
| `npm run db:logs` | View database logs | No | Dev only |
| `npm run db:ps` | Show container status | No | Dev only |
| `npm run db:health` | Check DB health | No | Dev only |
| `npm run db:tools` | Start DB management tools | No | Dev only |
| `npm run db:clean` | **Delete all DB data** | Yes ⚠️ | Dev only |

---

## Workflow Examples

### Development Workflow
```bash
# 1. Start fresh
npm install
npm run build

# 2. Start databases
npm run db:start
npm run db:health

# 3. Develop
npm run dev
# Make changes...

# 4. Check code quality
npm run check
npm run format

# 5. Generate docs
npm run docs

# 6. Clean up
npm run db:stop
```

### Pre-commit Workflow
```bash
npm run check       # Lint + format check
npm test           # Run tests
npm run build      # Ensure it builds
```

### Testing Against Databases
```bash
# Start database
npm run db:start:postgres

# Generate schema
specql init openapi.yaml

# Test schema
psql -h localhost -U specql -d specql_dev -f db/schema.sql

# View logs if issues
npm run db:logs

# Connect for debugging
./scripts/db.sh connect postgres
```

### Documentation Workflow
```bash
# Start watch mode
npm run docs:watch

# In another terminal, serve docs
npm run docs:serve

# Edit code/JSDoc comments
# Docs auto-regenerate and are visible at localhost:8080
```

---

## See Also

- [DOCKER.md](DOCKER.md) - Complete Docker documentation
- [CLAUDE.md](CLAUDE.md) - Developer guide
- [README.md](README.md) - Project overview
- [package.json](package.json) - Script definitions
