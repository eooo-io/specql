/**
 * Database schema generator module.
 * Generates database-specific SQL DDL statements from internal schemas.
 * @module generators/database
 * @category Generators
 */

import {DatabaseConfig, DatabaseType, Schema, SchemaProperty} from '../types';

/**
 * Generates complete SQL DDL schema from parsed schemas.
 * Creates CREATE TABLE statements with appropriate database-specific syntax,
 * including primary keys, foreign keys, and constraints.
 *
 * @param schemas - Array of parsed schemas to generate tables for
 * @param config - Database configuration specifying target database and strategies
 * @returns Promise resolving to complete SQL DDL as a string
 *
 * @example
 * ```typescript
 * const config = {
 *   databaseType: DatabaseType.PostgreSQL,
 *   namingStrategy: NamingStrategy.SchemaTitle,
 *   schemaStrategy: SchemaStrategy.OneTablePerSchema
 * };
 * const sql = await generateDatabaseSchema(schemas, config);
 * await writeFile('schema.sql', sql);
 * ```
 */
export async function generateDatabaseSchema(
  schemas: Schema[],
  config: DatabaseConfig
): Promise<string> {
  const statements: string[] = [];

  for (const schema of schemas) {
    statements.push(generateTableSchema(schema, config));

    // Generate foreign key constraints
    if (schema.relations?.length) {
      statements.push(...generateRelations(schema, config.databaseType));
    }
  }

  return statements.join('\n\n');
}

function generateTableSchema(schema: Schema, config: DatabaseConfig): string {
  const columns = schema.properties.map(prop =>
    generateColumn(prop, config.databaseType)
  );

  const tableName = generateTableName(schema.name, config.namingStrategy);

  return (
    `CREATE TABLE ${tableName} (\n` +
    `  id ${getPrimaryKeyType(config.databaseType)} PRIMARY KEY${getAutoIncrement(config.databaseType)},\n` +
    `  ${columns.join(',\n  ')},\n` +
    `  created_at TIMESTAMP${getTimestampDefault(config.databaseType)},\n` +
    `  updated_at TIMESTAMP${getTimestampDefault(config.databaseType)}\n` +
    ');'
  );
}

function generateColumn(prop: SchemaProperty, dbType: DatabaseType): string {
  const type = mapToDbType(prop.type, dbType);
  const nullability = prop.required ? 'NOT NULL' : 'NULL';
  const defaultValue =
    prop.defaultValue !== undefined
      ? `DEFAULT ${formatDefaultValue(prop.defaultValue, type)}`
      : '';

  const constraints = generateConstraints(prop, dbType);

  return [prop.name, type, nullability, defaultValue, constraints]
    .filter(Boolean)
    .join(' ');
}

function generateRelations(schema: Schema, dbType: DatabaseType): string[] {
  const tableName = schema.name.toLowerCase();

  return (
    schema.relations?.map(relation => {
      const targetTable = relation.targetSchema.toLowerCase();

      if (relation.type === 'manyToMany') {
        const joinTable = relation.joinTable || `${tableName}_${targetTable}`;
        return (
          `CREATE TABLE ${joinTable} (\n` +
          `  ${tableName}_id ${getPrimaryKeyType(dbType)} REFERENCES ${tableName}(id),\n` +
          `  ${targetTable}_id ${getPrimaryKeyType(dbType)} REFERENCES ${targetTable}(id),\n` +
          `  PRIMARY KEY (${tableName}_id, ${targetTable}_id)\n` +
          ');'
        );
      }

      return (
        `ALTER TABLE ${tableName}\n` +
        `  ADD CONSTRAINT fk_${tableName}_${targetTable}\n` +
        `  FOREIGN KEY (${relation.foreignKey})\n` +
        `  REFERENCES ${targetTable}(id);`
      );
    }) || []
  );
}

function mapToDbType(type: string, dbType: DatabaseType): string {
  const typeMap: Record<DatabaseType, Record<string, string>> = {
    [DatabaseType.PostgreSQL]: {
      integer: 'INTEGER',
      bigint: 'BIGINT',
      decimal: 'DECIMAL',
      float: 'REAL',
      string: 'VARCHAR(255)',
      text: 'TEXT',
      boolean: 'BOOLEAN',
      date: 'DATE',
      timestamp: 'TIMESTAMP',
      json: 'JSONB',
      blob: 'BYTEA',
    },
    [DatabaseType.MySQL]: {
      integer: 'INT',
      bigint: 'BIGINT',
      decimal: 'DECIMAL',
      float: 'FLOAT',
      string: 'VARCHAR(255)',
      text: 'TEXT',
      boolean: 'TINYINT(1)',
      date: 'DATE',
      timestamp: 'TIMESTAMP',
      json: 'JSON',
      blob: 'BLOB',
    },
    [DatabaseType.SQLite]: {
      integer: 'INTEGER',
      bigint: 'INTEGER',
      decimal: 'REAL',
      float: 'REAL',
      string: 'TEXT',
      text: 'TEXT',
      boolean: 'INTEGER',
      date: 'TEXT',
      timestamp: 'TEXT',
      json: 'TEXT',
      blob: 'BLOB',
    },
    [DatabaseType.MSSQL]: {
      integer: 'INT',
      bigint: 'BIGINT',
      decimal: 'DECIMAL',
      float: 'FLOAT',
      string: 'NVARCHAR(255)',
      text: 'NTEXT',
      boolean: 'BIT',
      date: 'DATE',
      timestamp: 'DATETIME2',
      json: 'NVARCHAR(MAX)',
      blob: 'VARBINARY(MAX)',
    },
  };

  return typeMap[dbType][type] || typeMap[dbType]['string'];
}

function getPrimaryKeyType(dbType: DatabaseType): string {
  switch (dbType) {
    case DatabaseType.PostgreSQL:
    case DatabaseType.SQLite:
      return 'INTEGER';
    case DatabaseType.MySQL:
    case DatabaseType.MSSQL:
      return 'INT';
  }
}

function getAutoIncrement(dbType: DatabaseType): string {
  switch (dbType) {
    case DatabaseType.PostgreSQL:
      return ' GENERATED ALWAYS AS IDENTITY';
    case DatabaseType.MySQL:
      return ' AUTO_INCREMENT';
    case DatabaseType.SQLite:
      return ' AUTOINCREMENT';
    case DatabaseType.MSSQL:
      return ' IDENTITY(1,1)';
  }
}

function getTimestampDefault(dbType: DatabaseType): string {
  switch (dbType) {
    case DatabaseType.PostgreSQL:
      return ' DEFAULT CURRENT_TIMESTAMP';
    case DatabaseType.MySQL:
      return ' DEFAULT CURRENT_TIMESTAMP';
    case DatabaseType.SQLite:
      return ' DEFAULT CURRENT_TIMESTAMP';
    case DatabaseType.MSSQL:
      return ' DEFAULT GETDATE()';
  }
}

function generateTableName(name: string, strategy: string): string {
  return name.toLowerCase();
}

function formatDefaultValue(value: any, type: string): string {
  if (value === null) {
    return 'NULL';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }
  return String(value);
}

function generateConstraints(
  prop: SchemaProperty,
  dbType: DatabaseType
): string {
  const constraints: string[] = [];

  if (prop.constraints?.unique) {
    constraints.push('UNIQUE');
  }

  if (prop.constraints?.minLength && prop.type === 'string') {
    constraints.push(
      `CHECK (LENGTH(${prop.name}) >= ${prop.constraints.minLength})`
    );
  }

  if (prop.constraints?.maxLength && prop.type === 'string') {
    constraints.push(
      `CHECK (LENGTH(${prop.name}) <= ${prop.constraints.maxLength})`
    );
  }

  if (prop.constraints?.minimum !== undefined) {
    constraints.push(`CHECK (${prop.name} >= ${prop.constraints.minimum})`);
  }

  if (prop.constraints?.maximum !== undefined) {
    constraints.push(`CHECK (${prop.name} <= ${prop.constraints.maximum})`);
  }

  if (prop.constraints?.pattern) {
    const regexOp = dbType === DatabaseType.PostgreSQL ? '~' : 'REGEXP';
    constraints.push(
      `CHECK (${prop.name} ${regexOp} '${prop.constraints.pattern}')`
    );
  }

  return constraints.join(' ');
}
