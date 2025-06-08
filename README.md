# specql

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0+-38B832?style=flat-square&logo=openapiinitiative&logoColor=white)](https://www.openapis.org/)
[![npm](https://img.shields.io/badge/npm-latest-CB3837?style=flat-square&logo=npm&logoColor=white)](https://www.npmjs.com/package/specql)

[![FastAPI](https://img.shields.io/badge/FastAPI-Support-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Laravel](https://img.shields.io/badge/Laravel-Support-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-Support-E83524?style=flat-square&logo=typeorm&logoColor=white)](https://typeorm.io/)

[![SQLite](https://img.shields.io/badge/SQLite-Support-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![MySQL](https://img.shields.io/badge/MySQL-Support-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![MariaDB](https://img.shields.io/badge/MariaDB-Support-003545?style=flat-square&logo=mariadb&logoColor=white)](https://mariadb.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Support-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

</div>

A CLI tool that generates database setups from OpenAPI specifications.

## Features

- Reads OpenAPI specifications in JSON or YAML format
- Generates database schemas for multiple databases:
  - SQLite
  - MySQL
  - MariaDB
  - PostgreSQL
- Supports multiple programming languages and frameworks:
  - Python (FastAPI + SQLAlchemy)
  - PHP (Laravel + Eloquent)
  - TypeScript (TypeORM)
- Interactive CLI with configuration options
- Generates complete database setup including:
  - Schema definitions
  - Migrations
  - ORM models
  - Basic CRUD operations

## Installation

```bash
npm install -g specql
```

## Usage

Basic usage:

```bash
specql --spec path/to/openapi.yaml
```

The CLI will prompt you for:
1. Programming language selection
2. Database type selection
3. Additional configuration options

### Command Line Options

- `-s, --spec <path>`: Path to OpenAPI specification file (required)
- `-o, --output <path>`: Output directory for generated files
- `-c, --config <path>`: Path to configuration file
- `-f, --force`: Overwrite existing files
- `--dry-run`: Preview changes without writing files

### Configuration File

You can provide a YAML configuration file with the following structure:

```yaml
language: python  # python, php, or typescript
database: postgresql  # sqlite, mysql, mariadb, or postgresql
output: ./output
force: false
dryRun: false
```

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/specql.git
cd specql
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

### Running Tests

```bash
npm test
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details 