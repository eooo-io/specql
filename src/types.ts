export enum Language {
  Python = 'python',
  PHP = 'php',
  TypeScript = 'typescript'
}

export enum DatabaseType {
  SQLite = 'sqlite',
  MySQL = 'mysql',
  MariaDB = 'mariadb',
  PostgreSQL = 'postgresql'
}

export interface Config {
  language: Language;
  database: DatabaseType;
  output?: string;
  force?: boolean;
  dryRun?: boolean;
}

export interface Schema {
  name: string;
  properties: SchemaProperty[];
  required?: string[];
}

export interface SchemaProperty {
  name: string;
  type: string;
  format?: string;
  nullable?: boolean;
  unique?: boolean;
  default?: any;
  items?: SchemaProperty; // For array types
  properties?: SchemaProperty[]; // For object types
  ref?: string; // For $ref types
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