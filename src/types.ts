/**
 * Supported programming languages for code generation.
 * @category Types
 */
export enum Language {
  /** Python language target */
  Python = 'python',
  /** PHP language target */
  PHP = 'php',
  /** TypeScript language target */
  TypeScript = 'typescript',
}

/**
 * Supported database types for schema generation.
 * Each database type has specific SQL syntax and features.
 * @category Types
 */
export enum DatabaseType {
  /** PostgreSQL database (recommended for production) */
  PostgreSQL = 'postgresql',
  /** MySQL database */
  MySQL = 'mysql',
  /** SQLite database (lightweight, ideal for development) */
  SQLite = 'sqlite',
  /** Microsoft SQL Server database */
  MSSQL = 'mssql',
}

/**
 * Strategy for generating table names from OpenAPI schemas.
 * @category Types
 */
export enum NamingStrategy {
  /** Use schema title for table names (human-readable) */
  SchemaTitle = 'schema_title',
  /** Use schema ID for table names (consistent) */
  SchemaId = 'schema_id',
  /** Custom naming pattern (advanced) */
  Custom = 'custom',
}

/**
 * Strategy for generating database schemas from OpenAPI specs.
 * @category Types
 */
export enum SchemaStrategy {
  /** Create one table per schema (normalized) */
  OneTablePerSchema = 'one_table_per_schema',
  /** Flatten nested objects into single tables (denormalized) */
  Denormalized = 'denormalized',
  /** Custom schema mapping (advanced) */
  Custom = 'custom',
}

/**
 * Global configuration for the specql tool.
 * @category Configuration
 */
export interface Config {
  /** Target programming language for code generation */
  language: Language;
  /** Target database type */
  database: DatabaseType;
  /** Output directory for generated files */
  output?: string;
  /** Force overwrite of existing files */
  force?: boolean;
  /** Perform dry run without writing files */
  dryRun?: boolean;
}

/**
 * Configuration for database schema generation.
 * Specifies how OpenAPI schemas should be transformed into database schemas.
 * @category Configuration
 */
export interface DatabaseConfig {
  /** Target database type for schema generation */
  databaseType: DatabaseType;
  /** Strategy for generating table names */
  namingStrategy: NamingStrategy;
  /** Strategy for schema structure */
  schemaStrategy: SchemaStrategy;
}

/**
 * Represents an OpenAPI schema parsed into an internal format.
 * This is the primary data structure for schema processing.
 * @category Schema
 */
export interface Schema {
  /** Schema name (derived from OpenAPI schema key) */
  name: string;
  /** List of properties in the schema */
  properties: SchemaProperty[];
  /** Optional relationships to other schemas */
  relations?: SchemaRelation[];
}

/**
 * Represents a property within a schema.
 * Maps to a column in the generated database table.
 * @category Schema
 */
export interface SchemaProperty {
  /** Property name */
  name: string;
  /** Property type (internal representation) */
  type: string;
  /** Whether the property is required */
  required: boolean;
  /** Default value for the property */
  defaultValue?: unknown;
  /** Optional validation constraints */
  constraints?: PropertyConstraints;
}

/**
 * Represents a relationship between two schemas.
 * Used to generate foreign keys and join tables.
 * @category Schema
 */
export interface SchemaRelation {
  /** Type of relationship */
  type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany';
  /** Target schema name */
  targetSchema: string;
  /** Foreign key column name */
  foreignKey: string;
  /** Join table name (for many-to-many relationships) */
  joinTable?: string;
}

/**
 * Validation constraints for a property.
 * Derived from OpenAPI schema validation keywords.
 * @category Schema
 */
export interface PropertyConstraints {
  /** Whether the property must be unique */
  unique?: boolean;
  /** Minimum length for string properties */
  minLength?: number;
  /** Maximum length for string properties */
  maxLength?: number;
  /** Minimum value for numeric properties */
  minimum?: number;
  /** Maximum value for numeric properties */
  maximum?: number;
  /** Regular expression pattern for validation */
  pattern?: string;
}

/**
 * Complete database schema representation.
 * Contains all tables and their relationships.
 * @category Database
 */
export interface DatabaseSchema {
  /** List of database tables */
  tables: Table[];
  /** List of relationships between tables */
  relationships: Relationship[];
}

/**
 * Represents a database table.
 * @category Database
 */
export interface Table {
  /** Table name */
  name: string;
  /** List of columns in the table */
  columns: Column[];
  /** List of indices for the table */
  indices: Index[];
}

/**
 * Represents a database table column.
 * @category Database
 */
export interface Column {
  /** Column name */
  name: string;
  /** Database-specific column type */
  type: string;
  /** Whether the column can contain NULL values */
  nullable: boolean;
  /** Whether this column is a primary key */
  primaryKey?: boolean;
  /** Whether this column must have unique values */
  unique?: boolean;
  /** Default value for the column */
  default?: unknown;
  /** Foreign key constraint information */
  foreignKey?: ForeignKey;
}

/**
 * Represents a database index.
 * @category Database
 */
export interface Index {
  /** Index name */
  name: string;
  /** Columns included in the index */
  columns: string[];
  /** Whether the index enforces uniqueness */
  unique?: boolean;
}

/**
 * Foreign key constraint definition.
 * @category Database
 */
export interface ForeignKey {
  /** Referenced table name */
  table: string;
  /** Referenced column name */
  column: string;
  /** Action to take on delete */
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  /** Action to take on update */
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}

/**
 * Represents a relationship between two database tables.
 * @category Database
 */
export interface Relationship {
  /** Source table name */
  fromTable: string;
  /** Target table name */
  toTable: string;
  /** Type of relationship */
  type: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY';
  /** Join table name (for many-to-many relationships) */
  throughTable?: string;
}
