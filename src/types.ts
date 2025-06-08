export enum Language {
  Python = 'python',
  PHP = 'php',
  TypeScript = 'typescript'
}

export enum DatabaseType {
  PostgreSQL = 'postgresql',
  MySQL = 'mysql',
  SQLite = 'sqlite',
  MSSQL = 'mssql'
}

export enum NamingStrategy {
  SchemaTitle = 'schema_title',
  SchemaId = 'schema_id',
  Custom = 'custom'
}

export enum SchemaStrategy {
  OneTablePerSchema = 'one_table_per_schema',
  Denormalized = 'denormalized',
  Custom = 'custom'
}

export interface Config {
  language: Language;
  database: DatabaseType;
  output?: string;
  force?: boolean;
  dryRun?: boolean;
}

export interface DatabaseConfig {
  databaseType: DatabaseType;
  namingStrategy: NamingStrategy;
  schemaStrategy: SchemaStrategy;
}

export interface Schema {
  name: string;
  properties: SchemaProperty[];
  relations?: SchemaRelation[];
}

export interface SchemaProperty {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  constraints?: PropertyConstraints;
}

export interface SchemaRelation {
  type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany';
  targetSchema: string;
  foreignKey: string;
  joinTable?: string;
}

export interface PropertyConstraints {
  unique?: boolean;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
}

export interface DatabaseSchema {
  tables: Table[];
  relationships: Relationship[];
}

export interface Table {
  name: string;
  columns: Column[];
  indices: Index[];
}

export interface Column {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey?: boolean;
  unique?: boolean;
  default?: any;
  foreignKey?: ForeignKey;
}

export interface Index {
  name: string;
  columns: string[];
  unique?: boolean;
}

export interface ForeignKey {
  table: string;
  column: string;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}

export interface Relationship {
  fromTable: string;
  toTable: string;
  type: 'ONE_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_ONE' | 'MANY_TO_MANY';
  throughTable?: string; // For many-to-many relationships
} 