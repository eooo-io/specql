# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

specql is a CLI tool that generates database schemas, TypeScript types, and SQL queries from OpenAPI specifications. The project transforms API specifications into working database implementations, bridging the gap between API design and database implementation.

**Key Features:**
- OpenAPI 3.0+ specification parsing
- Multi-database support (PostgreSQL, MySQL, SQLite, MSSQL)
- Schema relationship detection and foreign key generation
- TypeScript type generation
- Sample CRUD query generation
- Interactive CLI with inquirer prompts

## Development Commands

> **Complete Reference:** See [NPM_SCRIPTS.md](NPM_SCRIPTS.md) for detailed documentation of all npm scripts, including usage examples, workflows, and a quick reference table.

### Build and Development
```bash
# Install dependencies
npm install

# Build the project (compiles TypeScript to dist/)
npm run build

# Run in development mode without building
npm run dev

# Create local link for testing
npm link

# Test locally after linking
specql init path/to/openapi.yaml
```

### Code Quality
```bash
# Lint code using Google TypeScript Style (gts)
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without making changes
npm run format:check

# Run gts check (lint + format check)
npm run check

# Run tests (Jest configuration present but tests not yet implemented)
npm test

# Clean build artifacts
npm run clean
```

### Documentation
```bash
# Generate TypeDoc documentation
npm run docs

# Watch mode - regenerate docs on file changes
npm run docs:watch

# Generate docs and serve locally on http://localhost:8080
npm run docs:serve
```

The generated documentation will be available in the `docs/` directory and uses the Material theme for a clean, modern look.

### Docker Development Databases
```bash
# Start all database containers (PostgreSQL, MySQL, MSSQL, SQLite)
npm run db:start

# Start specific database
npm run db:start:postgres
npm run db:start:mysql
npm run db:start:mssql
npm run db:start:sqlite

# Stop databases
npm run db:stop
npm run db:stop:postgres

# Check database health and status
npm run db:health
npm run db:ps

# View logs
npm run db:logs

# Start management tools (pgAdmin on :5050, phpMyAdmin on :8080)
npm run db:tools

# Connect to database CLI
./scripts/db.sh connect postgres
./scripts/db.sh connect mysql
./scripts/db.sh connect mssql

# Clean up (removes all containers and volumes)
npm run db:clean
```

See [DOCKER.md](DOCKER.md) for complete Docker setup documentation, connection strings, and troubleshooting.

### Running the CLI
```bash
# After building or linking
specql init <spec-file> [options]
specql --help
specql --version

# Example with options
specql init ./openapi.yaml -o ./output
```

## Architecture

### Project Structure
```
src/
├── index.ts              # CLI entry point (commander setup)
├── types.ts              # Core type definitions and enums
├── commands/
│   └── init.ts          # Main 'init' command implementation
├── processors/
│   └── openapi.ts       # OpenAPI spec parsing and schema extraction
├── generators/
│   ├── database.ts      # SQL schema generation (multi-DB support)
│   ├── types.ts         # TypeScript type generation
│   ├── queries.ts       # Sample SQL query generation
│   └── code.ts          # Future: ORM code generation
└── utils/
    └── terminal.ts      # Terminal styling, banners, boxes (chalk, boxen)
```

### Core Data Flow

1. **OpenAPI Processing** (`processors/openapi.ts`)
   - Parses OpenAPI spec (JSON/YAML)
   - Extracts schemas from `components.schemas`
   - Detects relationships via `$ref` and array items
   - Maps OpenAPI types to internal schema representation
   - Returns array of `Schema` objects with properties, relations, and constraints

2. **Schema Transformation** (`types.ts`)
   - Internal representation uses `Schema`, `SchemaProperty`, `SchemaRelation`
   - Supports relationship types: oneToOne, oneToMany, manyToOne, manyToMany
   - Property constraints: unique, minLength, maxLength, minimum, maximum, pattern

3. **Database Generation** (`generators/database.ts`)
   - Generates database-specific SQL DDL statements
   - Creates tables with auto-increment primary keys and timestamps
   - Handles foreign key constraints and join tables for many-to-many
   - Type mapping varies by database (e.g., JSONB for PostgreSQL, JSON for MySQL)
   - Database-specific features:
     - PostgreSQL: GENERATED ALWAYS AS IDENTITY, JSONB, BYTEA
     - MySQL: AUTO_INCREMENT, JSON, BLOB
     - SQLite: AUTOINCREMENT, TEXT for JSON/dates
     - MSSQL: IDENTITY(1,1), NVARCHAR(MAX) for JSON

4. **Type Generation** (`generators/types.ts`)
   - Creates TypeScript interfaces from schemas
   - Maps database types to TypeScript types
   - Includes relationships as nested types or arrays
   - Adds standard id, createdAt, updatedAt fields

5. **Query Generation** (`generators/queries.ts`)
   - Generates sample CRUD operations for each schema
   - Creates SELECT, INSERT, UPDATE, DELETE queries
   - Adds pagination and search examples
   - Generates JOIN queries for detected relationships

### Configuration System

The `init` command uses interactive prompts to collect:
- **Database Type**: PostgreSQL, MySQL, SQLite, MSSQL
- **Naming Strategy**: schema_title, schema_id, or custom
- **Schema Strategy**: one_table_per_schema, denormalized, or custom
- **Generate Types**: Boolean for TypeScript type generation
- **Generate Queries**: Boolean for sample query generation
- **Output Path**: Destination directory (default: ./db)

### Type Mappings

OpenAPI types are mapped through multiple stages:

1. **OpenAPI → Internal** (`processors/openapi.ts:mapOpenApiType`)
   - integer (int64) → bigint
   - number → decimal or float based on format
   - string formats: date, date-time (timestamp), binary (blob)
   - array/object → json

2. **Internal → Database** (`generators/database.ts:mapToDbType`)
   - Database-specific type maps defined in `typeMap` object
   - Each database has different representations for json, blob, timestamp, etc.

3. **Internal → TypeScript** (`generators/types.ts:mapToTypeScriptType`)
   - integer/bigint/decimal/float → number
   - date → Date
   - timestamp → Timestamp (type alias for string)
   - json → any
   - blob → Buffer

## Important Implementation Details

### OpenAPI Relationship Detection
- `$ref` in a property → oneToOne relationship
- `type: array` with `items.$ref` → oneToMany relationship
- Foreign keys are automatically named as `{targetSchema}_id`
- Many-to-many relationships require explicit `joinTable` configuration

### Database Schema Generation
- All tables automatically include: id (PK), created_at, updated_at
- Auto-increment syntax varies by database type
- Constraints (UNIQUE, CHECK) are generated from OpenAPI validation rules
- Foreign keys use default ON DELETE/ON UPDATE behavior (can be customized in types)

### Code Style

This project follows the **Google TypeScript Style Guide**: https://google.github.io/styleguide/tsguide.html

**Tooling:**
- **gts** (Google TypeScript Style) for linting and formatting
- **Prettier** for code formatting
- **ESLint** with TypeScript plugin and Google's configuration

**Key Style Rules:**
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for strings, backticks for template literals
- **Semicolons**: Always required
- **Line endings**: Unix (LF)
- **Line length**: 80 characters (recommended, not enforced)
- **Naming conventions**:
  - Classes, interfaces, types, enums: `PascalCase`
  - Variables, functions, parameters: `camelCase`
  - Constants and enum members: `PascalCase`
  - No leading/trailing underscores for private members
- **Type safety**:
  - Explicit function return types required
  - `any` type is an error (use `unknown` instead)
  - Unused variables are errors (prefix with `_` if intentionally unused)
  - Use `const` by default, `let` only when reassignment needed, never `var`
- **Equality**: Always use `===` and `!==`, never `==` or `!=`
- **Braces**: Required for all control statements, even single-line
- **Exports**: Prefer named exports over default exports
- **Arrow functions**: Preferred in callbacks and method bodies

**Enforced Linting Rules:**
- No `var` declarations
- Prefer `const` over `let`
- Explicit module boundary types
- Strict equality checks
- No `eval()` or wrapper constructors (`new String()`, etc.)
- Proper naming conventions for all identifiers

### Dependencies
- **CLI**: commander (command parsing), inquirer (interactive prompts)
- **UI**: chalk (colors), boxen (boxes), figlet (banners), ora (spinners)
- **Parsing**: js-yaml (YAML support), openapi-types (type definitions)
- **Build**: TypeScript 5.3+, targets ES2020, CommonJS modules
- **Development**: Docker & Docker Compose for database containers

### Docker Development Environment

The project includes a complete Docker setup for local database testing:

**Architecture Support:** All database images work on both ARM64 (Apple Silicon) and AMD64 (Intel/AMD) automatically.

**Available Databases:**
- PostgreSQL 16 (Alpine) - Port 5432
- MySQL 8.0 - Port 3306
- Microsoft SQL Server 2022 - Port 1433
- SQLite (Alpine container with file system)

**Management Tools (Optional):**
- pgAdmin 4 - http://localhost:5050
- phpMyAdmin - http://localhost:8080

**Key Files:**
- `docker-compose.yml` - Multi-database service definitions
- `scripts/db.sh` - Helper script for database management
- `docker/init-scripts/` - Initialization SQL scripts for each database
- `DOCKER.md` - Complete Docker documentation

**Connection Defaults:**
- PostgreSQL: `postgresql://specql:specql_dev_password@localhost:5432/specql_dev`
- MySQL: `mysql://specql:specql_dev_password@localhost:3306/specql_dev`
- MSSQL: `mssql://sa:SpecQL_Dev_Pass123!@localhost:1433/specql_dev`

**Data Persistence:**
Data is stored in Docker volumes and persists across container restarts:
- `postgres_data`, `mysql_data`, `mssql_data`, `sqlite_data`

**Testing Workflow:**
1. Start databases: `npm run db:start`
2. Generate schema for target DB: `specql init openapi.yaml`
3. Test generated schema against running database
4. View logs: `npm run db:logs`
5. Connect via CLI: `./scripts/db.sh connect postgres`

See [DOCKER.md](DOCKER.md) for detailed setup, troubleshooting, and advanced configuration.

## Clean Code & SOLID Principles

This project adheres to clean code principles and SOLID design patterns. All new code must follow these guidelines.

**Important**: This project follows the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html). The principles below complement the style guide with project-specific patterns and architectural guidance.

### Clean Code Principles

**1. Meaningful Names**
- Use descriptive, intention-revealing names for functions, variables, and types
- Example: `generateDatabaseSchema()` clearly indicates what it does
- Avoid abbreviations: use `schema` not `sch`, `property` not `prop` in function names
- Type names should be nouns (`Schema`, `DatabaseConfig`), functions should be verbs (`generate`, `process`, `extract`)

**2. Single Responsibility**
- Each function should do one thing and do it well
- Good: `mapOpenApiType()` only maps types, `extractConstraints()` only extracts constraints
- Each file/module has a clear, single purpose (processors/, generators/, commands/)
- If a function needs multiple helper functions, that's a sign it's doing one thing well

**3. Function Size and Complexity**
- Keep functions small (ideally < 30 lines)
- Extract complex logic into named helper functions
- Example: `generateDatabaseSchema()` delegates to `generateTableSchema()` and `generateRelations()`
- Avoid deeply nested conditionals (max 2-3 levels)

**4. DRY (Don't Repeat Yourself)**
- Type mappings are centralized in dedicated functions (`mapToDbType`, `mapToTypeScriptType`)
- Reusable UI components in `utils/terminal.ts` prevent duplication
- Database-specific logic uses lookup tables/maps rather than repeated conditionals

**5. Clear Error Handling**
- Use try-catch blocks at command boundaries
- Provide meaningful error messages using the terminal utilities
- Example: `boxes.error()` with descriptive messages in `commands/init.ts`
- Validate inputs early and fail fast

**6. Comments and Documentation**
- Code should be self-documenting through clear names
- Use comments to explain "why" not "what"
- Document complex algorithms, business rules, or non-obvious relationships
- Add JSDoc for public APIs and exported functions

### SOLID Principles

**S - Single Responsibility Principle**
- Each module has one reason to change:
  - `processors/openapi.ts`: Changes only when OpenAPI parsing logic changes
  - `generators/database.ts`: Changes only when database schema generation changes
  - `commands/init.ts`: Changes only when the init command workflow changes
- Classes/types should have one clear responsibility
- When adding new functionality, create new modules rather than expanding existing ones

**O - Open/Closed Principle**
- Code should be open for extension, closed for modification
- Add new database types by extending the `DatabaseType` enum and adding to type maps
- Add new generators by creating new files in `generators/` following the same pattern
- Use configuration objects (`DatabaseConfig`) to allow behavior changes without code modifications
- Strategy pattern: `NamingStrategy` and `SchemaStrategy` enums enable different behaviors

**L - Liskov Substitution Principle**
- Subtypes must be substitutable for their base types
- All database types must implement the same generation interface
- Return types must be consistent across similar functions
- When adding new generator implementations, they must work with existing types

**I - Interface Segregation Principle**
- Keep interfaces focused and minimal
- `Schema` type includes only schema-related data (name, properties, relations)
- `DatabaseConfig` includes only configuration needed for generation
- Don't force clients to depend on methods they don't use
- TypeScript interfaces should be composable and focused

**D - Dependency Inversion Principle**
- Depend on abstractions, not concretions
- Generators depend on the abstract `Schema` type, not specific OpenAPI structures
- Use dependency injection: pass configurations and dependencies as parameters
- Example: `generateDatabaseSchema(schemas, config)` receives dependencies
- High-level modules (commands) don't depend on low-level modules (generators) directly; both depend on abstractions (types)

### Design Patterns to Follow

**1. Strategy Pattern**
- Used for database type selection and naming strategies
- Allows runtime selection of algorithms (schema generation strategy)
- When adding new strategies, implement them as separate functions/modules

**2. Builder Pattern**
- Schema generation builds up complex SQL/code incrementally
- Separate construction (`generateTableSchema`) from representation
- Use method chaining where appropriate for fluent APIs

**3. Factory Pattern**
- Type mapping functions act as factories for database-specific types
- `mapToDbType()` creates the appropriate database type based on input
- Consider factory functions when creating complex objects

**4. Facade Pattern**
- `commands/init.ts` provides a simple facade over complex generation pipeline
- Hides complexity of processors, generators, and file operations
- User interaction simplified through the command interface

### Code Organization Guidelines

**1. Separation of Concerns**
- I/O operations (file read/write) separate from business logic
- UI/presentation logic isolated in `utils/terminal.ts`
- Data transformation (processors) separate from output generation (generators)

**2. Dependency Direction**
- Dependencies flow inward: commands → generators/processors → types
- Core types (`types.ts`) have no dependencies on other modules
- Utilities are leaf nodes (no business logic dependencies)

**3. Type Safety**
- Use TypeScript's type system fully (strict mode enabled)
- Avoid `any` types except where genuinely needed (mark with ESLint warning)
- Define explicit interfaces for all data structures
- Use enums for fixed sets of values

**4. Testing Considerations**
- Write testable code: pure functions, dependency injection
- Keep side effects at module boundaries
- Separate pure logic from I/O operations
- When tests are added, aim for >80% coverage

**5. Extensibility Points**
- New databases: Add to `DatabaseType` enum + implement type mappings
- New generators: Create new file in `generators/` following existing pattern
- New commands: Create in `commands/` and register in `index.ts`
- New output formats: Implement new generator with same interface

### Anti-Patterns to Avoid

- **God Objects**: Don't create objects/modules that know or do too much
- **Tight Coupling**: Avoid direct dependencies between generators
- **Magic Numbers/Strings**: Use constants or enums (e.g., `DatabaseType.PostgreSQL` not `'postgresql'`)
- **Mutation**: Prefer immutable data transformations
- **Deep Nesting**: Extract nested logic into named functions
- **Long Parameter Lists**: Use configuration objects instead (e.g., `DatabaseConfig`)

## Documentation

This project uses **TypeDoc** with the **Material theme** for API documentation.

### TypeDoc Configuration

Documentation is generated from JSDoc comments in TypeScript source files. The configuration is in `typedoc.json`:

- **Entry point**: `src/index.ts` (expanded to include all exported modules)
- **Output directory**: `docs/`
- **Theme**: Material theme with TypeScript blue color (`#3178C6`)
- **Categories**: Commands, Processors, Generators, Types, Utilities

### Documentation Standards

**All public APIs must be documented** with JSDoc comments following these guidelines:

**1. Module Documentation**
```typescript
/**
 * @fileoverview Brief description of the module's purpose.
 * Detailed explanation if needed.
 * @module path/to/module
 * @category CategoryName
 */
```

**2. Function Documentation**
```typescript
/**
 * Brief one-line description of what the function does.
 * More detailed explanation spanning multiple lines if needed,
 * describing the purpose, algorithm, or important notes.
 *
 * @param paramName - Description of the parameter
 * @param optionalParam - Description of optional parameter
 * @returns Description of return value
 * @throws {ErrorType} Description of when error is thrown
 *
 * @example
 * ```typescript
 * const result = functionName(arg1, arg2);
 * console.log(result);
 * ```
 */
```

**3. Interface/Type Documentation**
```typescript
/**
 * Brief description of the interface/type.
 * Additional context about usage.
 * @category CategoryName
 */
export interface TypeName {
  /** Description of property */
  propertyName: string;

  /**
   * Longer description for complex properties.
   * Can span multiple lines.
   */
  complexProperty: ComplexType;
}
```

**4. Enum Documentation**
```typescript
/**
 * Description of what the enum represents.
 * @category CategoryName
 */
export enum EnumName {
  /** Description of this enum value */
  ValueOne = 'value_one',
  /** Description of this enum value */
  ValueTwo = 'value_two',
}
```

### Documentation Categories

Use `@category` tags to organize documentation:

- **Types**: Core type definitions and enums
- **Configuration**: Configuration interfaces and options
- **Schema**: Schema-related types and interfaces
- **Database**: Database-specific types
- **Processors**: OpenAPI processors and parsers
- **Generators**: Code and schema generators
- **Commands**: CLI command implementations
- **Utilities**: Helper functions and utilities

### Documentation Best Practices

**Required Elements:**
- All exported functions, interfaces, types, and enums must have JSDoc comments
- Include `@param` tags for all parameters
- Include `@returns` tag for all non-void return types
- Use `@category` to organize documentation
- Add `@example` blocks for non-trivial functions

**Optional But Recommended:**
- `@throws` for functions that can throw errors
- `@see` to reference related functions/types
- `@deprecated` for deprecated APIs with migration path
- Code examples showing real-world usage

**Style Guidelines:**
- Use Markdown formatting in JSDoc comments
- Keep first line brief (one sentence)
- Add detailed explanation in subsequent paragraphs
- Use proper TypeScript syntax in code examples
- Link to related types using `{@link TypeName}` syntax

### Generating Documentation

```bash
# Generate once
npm run docs

# Watch mode (regenerates on changes)
npm run docs:watch

# Generate and serve locally
npm run docs:serve
```

Documentation is automatically excluded from Git (see `.gitignore`). For production deployment, generate docs as part of CI/CD pipeline.

## Future Development Context

The project is in active development. Key planned features (see ROADMAP.md):

1. **Phase 1-2**: Enhanced OpenAPI processing, migration generation, ORM code generation (FastAPI/SQLAlchemy, Laravel/Eloquent, TypeORM)
2. **Phase 6**: Internal API generation with framework support (FastAPI, NestJS, Laravel, Express)
3. Future: Plugin system, GraphQL support, Docker/K8s configuration generation

When adding features:
- Follow the generator pattern in `src/generators/`
- Add new database types to `DatabaseType` enum and implement in all type mappings
- Add new commands in `src/commands/` and register in `src/index.ts`
- Update interactive prompts in command implementations for UX consistency
