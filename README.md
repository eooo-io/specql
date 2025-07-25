# specql

> **⚠️ Work In Progress ⚠️**  
> This project is under active development. While we're excited about its potential, many features are still in development. Star the repository to stay updated on our progress!

<div align="center">

### Created With
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0+-38B832?style=flat-square&logo=openapiinitiative&logoColor=white)](https://www.openapis.org/)

### Framework Support
[![FastAPI](https://img.shields.io/badge/FastAPI-Support-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Laravel](https://img.shields.io/badge/Laravel-Support-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-Support-E83524?style=flat-square&logo=typeorm&logoColor=white)](https://typeorm.io/)

### Database Support
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Support-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![MySQL](https://img.shields.io/badge/MySQL-Support-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Support-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![MSSQL](https://img.shields.io/badge/MSSQL-Support-CC2927?style=flat-square&logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)

### Project Status
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/eooo-io/specql/main.yml?style=flat-square)](https://github.com/eooo-io/specql/actions)
[![Coverage](https://img.shields.io/codecov/c/github/eooo-io/specql?style=flat-square)](https://codecov.io/gh/eooo-io/specql)
[![npm version](https://img.shields.io/npm/v/specql?style=flat-square)](https://www.npmjs.com/package/specql)
[![npm downloads](https://img.shields.io/npm/dm/specql?style=flat-square)](https://www.npmjs.com/package/specql)

### Project Standards
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)
[![Code Style](https://img.shields.io/badge/code%20style-prettier-F7B93E.svg?style=flat-square)](https://prettier.io)

---

</div>

## What is specql?

specql is a powerful CLI tool that bridges the gap between API design and database implementation. It transforms OpenAPI specifications into fully functional database setups, complete with schema definitions, migrations, and ORM models.

### Why specql?

In modern web development, we often start with API design using OpenAPI (formerly Swagger) specifications. However, translating these specifications into database schemas and ORM models is typically a manual, time-consuming process that can lead to inconsistencies between your API contract and data layer.

specql automates this process by:
- Converting OpenAPI schemas directly into database structures
- Generating language-specific ORM models and migrations
- Creating boilerplate CRUD operations
- Maintaining consistency between API and database
- Accelerating development workflow

### Perfect For

**API-First Development**  
Start with your API design and automatically generate the supporting database structure.

**Rapid Prototyping**  
Quickly turn API specifications into working backends.

**Microservices**  
Generate consistent data layers across multiple services.

**Database Migrations**  
Automatically create migrations when your API specs change.

**Documentation**  
Keep your API, database, and code documentation in sync.

## Features

- **Smart OpenAPI Processing**
  - Reads OpenAPI specifications in JSON or YAML format
  - Intelligent schema analysis and relationship detection
  - Handles complex nested objects and arrays

- **Multi-Database Support**
  - PostgreSQL (recommended for production)
  - MySQL (great for general use)
  - SQLite (perfect for development)
  - Microsoft SQL Server (enterprise ready)

- **Beautiful Interactive CLI**
  - Modern, colorful interface
  - Step-by-step guided setup
  - Smart defaults and recommendations
  - Real-time validation and feedback
  - Progress indicators and success messages

- **Flexible Generation Options**
  - Multiple naming strategies
  - Schema generation strategies
  - TypeScript type generation
  - Sample query generation
  - Customizable output structure

- **Generated Assets**
  - Database schema definitions
  - TypeScript type definitions
  - Sample CRUD queries
  - Relationship mappings
  - Index recommendations

## Coming Soon: Internal API Generation

Transform your database into a fully-featured internal API service with our upcoming API generation feature:

- **Framework Support**
  - FastAPI (Python) with Pydantic and SQLAlchemy
  - NestJS (TypeScript) with TypeORM
  - Laravel (PHP) with Eloquent
  - Express (TypeScript) with type-safe implementations

- **Generated Components**
  - DTOs for request/response handling
  - Service layer with dependency injection
  - Repository pattern implementation
  - OpenAPI documentation
  - Validation schemas
  - Test suites

- **Advanced Features**
  - GraphQL endpoint generation
  - WebSocket support
  - Event sourcing
  - CQRS pattern
  - Caching layer
  - Message queue integration

- **DevOps Ready**
  - Docker configuration
  - CI/CD pipelines
  - Kubernetes manifests
  - Monitoring setup
  - Logging configuration

Stay tuned for these exciting features! Follow our [Roadmap](ROADMAP.md) for more details.

## Installation

```bash
# Using npm
npm install -g specql

# Using yarn
yarn global add specql

# Using pnpm
pnpm add -g specql
```

## Quick Start

```bash
# Initialize a new database setup
specql init path/to/openapi.yaml

# Get help and see all commands
specql --help
```

### Interactive Setup

specql guides you through the setup process with an interactive CLI:

1. **Database Selection**
   - Choose your target database
   - Get recommendations based on your needs
   - Configure database-specific options

2. **Naming Strategy**
   - From schema titles (human-readable)
   - From schema IDs (consistent)
   - Custom naming pattern (advanced)

3. **Schema Strategy**
   - One table per schema (normalized)
   - Denormalized (flatten nested objects)
   - Custom mapping (advanced)

4. **Additional Options**
   - TypeScript type generation
   - Sample query generation
   - Output location customization

## Generated Output

```
db/
├── schema.sql        # Database schema definitions
├── types/           # TypeScript type definitions
│   └── index.ts
└── queries/         # Sample SQL queries
    ├── users.sql
    ├── products.sql
    └── orders.sql
```

## Development

### Prerequisites

- Node.js 16+
- npm, yarn, or pnpm

### Setup

1. Clone and setup:
```bash
# Clone the repository
git clone https://github.com/eooo-io/specql.git
cd specql

# Install dependencies
npm install

# Build the project
npm run build
```

2. Create a link for local development:
```bash
npm link
```

3. Run tests:
```bash
npm test
```

### Code Style

We use ESLint and Prettier for code formatting:
```bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix
```

## Contributing

We love your input! We want to make contributing to specql as easy and transparent as possible. See our [Contributing Guide](CONTRIBUTING.md) for more information.

## License

specql is [MIT licensed](LICENSE).

## Acknowledgments

- OpenAPI Initiative for the specification
- All our contributors and supporters
- The amazing open-source community

## Documentation

For detailed documentation, please visit our [Wiki](https://github.com/eooo-io/specql/wiki).

## Links

- [npm package](https://www.npmjs.com/package/specql)
- [GitHub repository](https://github.com/eooo-io/specql)
- [Issue tracker](https://github.com/eooo-io/specql/issues)
- [Project roadmap](ROADMAP.md) 