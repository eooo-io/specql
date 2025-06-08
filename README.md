# specql

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
[![SQLite](https://img.shields.io/badge/SQLite-Support-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![MySQL](https://img.shields.io/badge/MySQL-Support-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![MariaDB](https://img.shields.io/badge/MariaDB-Support-003545?style=flat-square&logo=mariadb&logoColor=white)](https://mariadb.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Support-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

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
- 🔄 Converting OpenAPI schemas directly into database structures
- 🛠️ Generating language-specific ORM models and migrations
- ✨ Creating boilerplate CRUD operations
- 🔍 Maintaining consistency between API and database
- 🚀 Accelerating development workflow

### Perfect For:
- 🏗️ **API-First Development**: Start with your API design and automatically generate the supporting database structure
- 🔄 **Rapid Prototyping**: Quickly turn API specifications into working backends
- 🎯 **Microservices**: Generate consistent data layers across multiple services
- 🔁 **Database Migrations**: Automatically create migrations when your API specs change
- 📚 **Documentation**: Keep your API, database, and code documentation in sync

A CLI tool that generates database setups from OpenAPI specifications.

## 🚀 Features

- 📝 Reads OpenAPI specifications in JSON or YAML format
- 🗄️ Generates database schemas for multiple databases:
  - SQLite: Perfect for development and small applications
  - MySQL/MariaDB: Robust and widely-used
  - PostgreSQL: Advanced features and JSON support
- 🛠️ Supports multiple programming languages and frameworks:
  - Python: FastAPI + SQLAlchemy
  - PHP: Laravel + Eloquent
  - TypeScript: TypeORM
- 💻 Interactive CLI with smart configuration options
- 🔄 Generates complete database setup including:
  - Schema definitions
  - Migrations
  - ORM models
  - Basic CRUD operations

## 📦 Installation

```bash
# Using npm
npm install -g specql

# Using yarn
yarn global add specql

# Using pnpm
pnpm add -g specql
```

## 🎯 Quick Start

```bash
# Generate database setup from OpenAPI spec
specql --spec path/to/openapi.yaml

# Preview changes without writing files
specql --spec path/to/openapi.yaml --dry-run

# Use configuration file
specql --spec path/to/openapi.yaml --config path/to/config.yml
```

### ⚙️ Command Line Options

| Option | Description |
|--------|-------------|
| `-s, --spec <path>` | Path to OpenAPI specification file (required) |
| `-o, --output <path>` | Output directory for generated files |
| `-c, --config <path>` | Path to configuration file |
| `-f, --force` | Overwrite existing files |
| `--dry-run` | Preview changes without writing files |

### 📄 Configuration File

```yaml
# config.yml
language: python  # python, php, or typescript
database: postgresql  # sqlite, mysql, mariadb, or postgresql
output: ./output
force: false
dryRun: false
```

## 🛠️ Development

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
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific tests
npm test -- --grep "feature name"
```

### 🧪 Testing

We use Jest for testing. Our test suite includes:
- Unit tests
- Integration tests
- E2E tests for CLI operations

### 📝 Code Style

We use ESLint and Prettier for code formatting:
```bash
# Check code style
npm run lint

# Fix code style issues
npm run lint:fix
```

## 🤝 Contributing

We love your input! We want to make contributing to specql as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

### Development Process

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## 📜 License

MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- OpenAPI Initiative for the specification
- All our contributors and supporters
- The amazing open-source community

## 📚 Documentation

For detailed documentation, please visit our [Wiki](https://github.com/eooo-io/specql/wiki).

## 🔗 Links

- [npm package](https://www.npmjs.com/package/specql)
- [GitHub repository](https://github.com/eooo-io/specql)
- [Issue tracker](https://github.com/eooo-io/specql/issues)
- [Project roadmap](ROADMAP.md) 