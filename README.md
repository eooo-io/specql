# spec-to-db

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
npm install -g spec-to-db
```

## Usage

Basic usage:

```bash
spec-to-db --spec path/to/openapi.yaml
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
git clone https://github.com/yourusername/spec-to-db.git
cd spec-to-db
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