import { Column, DatabaseSchema, DatabaseType, Relationship, Schema, Table } from '../types';

export async function generateDatabaseSchema(
  schemas: Schema[],
  databaseType: DatabaseType
): Promise<DatabaseSchema> {
  const tables: Table[] = [];
  const relationships: Relationship[] = [];

  for (const schema of schemas) {
    const table = generateTable(schema, databaseType);
    tables.push(table);

    // Process relationships
    for (const property of schema.properties) {
      if (property.ref) {
        relationships.push({
          fromTable: schema.name,
          toTable: property.ref,
          type: property.type === 'array' ? 'ONE_TO_MANY' : 'ONE_TO_ONE'
        });
      }
    }
  }

  return { tables, relationships };
}

function generateTable(schema: Schema, databaseType: DatabaseType): Table {
  const columns: Column[] = [];
  
  // Add primary key
  columns.push({
    name: 'id',
    type: getPrimaryKeyType(databaseType),
    nullable: false,
    primaryKey: true
  });

  // Add timestamps
  columns.push({
    name: 'created_at',
    type: getTimestampType(databaseType),
    nullable: false,
    default: 'CURRENT_TIMESTAMP'
  });

  columns.push({
    name: 'updated_at',
    type: getTimestampType(databaseType),
    nullable: false,
    default: 'CURRENT_TIMESTAMP'
  });

  // Process properties
  for (const property of schema.properties) {
    const column = generateColumn(property, databaseType);
    if (column) {
      columns.push(column);
    }
  }

  return {
    name: schema.name.toLowerCase(),
    columns,
    indices: generateIndices(schema)
  };
}

function generateColumn(property: any, databaseType: DatabaseType): Column | null {
  if (property.ref) {
    // Handle foreign key
    return {
      name: `${property.name}_id`,
      type: getPrimaryKeyType(databaseType),
      nullable: property.nullable ?? true,
      foreignKey: {
        table: property.ref.toLowerCase(),
        column: 'id'
      }
    };
  }

  if (property.type === 'array' || property.type === 'object') {
    // Handle complex types based on database support
    if (databaseType === DatabaseType.PostgreSQL) {
      return {
        name: property.name,
        type: 'JSONB',
        nullable: property.nullable ?? true
      };
    }
    return null; // Skip complex types for other databases
  }

  return {
    name: property.name,
    type: mapType(property.type, property.format, databaseType),
    nullable: property.nullable ?? true,
    default: property.default
  };
}

function generateIndices(schema: Schema): any[] {
  const indices = [];

  // Add unique constraints
  for (const property of schema.properties) {
    if (property.unique) {
      indices.push({
        name: `${schema.name}_${property.name}_unique`,
        columns: [property.name],
        unique: true
      });
    }
  }

  return indices;
}

function getPrimaryKeyType(databaseType: DatabaseType): string {
  switch (databaseType) {
    case DatabaseType.PostgreSQL:
      return 'SERIAL PRIMARY KEY';
    case DatabaseType.MySQL:
    case DatabaseType.MariaDB:
      return 'BIGINT AUTO_INCREMENT';
    case DatabaseType.SQLite:
      return 'INTEGER PRIMARY KEY AUTOINCREMENT';
    default:
      return 'INTEGER PRIMARY KEY';
  }
}

function getTimestampType(databaseType: DatabaseType): string {
  switch (databaseType) {
    case DatabaseType.PostgreSQL:
      return 'TIMESTAMP WITH TIME ZONE';
    case DatabaseType.MySQL:
    case DatabaseType.MariaDB:
      return 'DATETIME';
    case DatabaseType.SQLite:
      return 'DATETIME';
    default:
      return 'TIMESTAMP';
  }
}

function mapType(type: string, format: string | undefined, databaseType: DatabaseType): string {
  switch (type) {
    case 'string':
      if (format === 'date-time') {
        return getTimestampType(databaseType);
      }
      if (format === 'date') {
        return 'DATE';
      }
      if (format === 'time') {
        return 'TIME';
      }
      if (format === 'email') {
        return 'VARCHAR(255)';
      }
      if (format === 'uuid') {
        return databaseType === DatabaseType.PostgreSQL ? 'UUID' : 'VARCHAR(36)';
      }
      return 'VARCHAR(255)';
    
    case 'number':
      if (format === 'float' || format === 'double') {
        return 'DOUBLE PRECISION';
      }
      return 'INTEGER';
    
    case 'integer':
      return 'INTEGER';
    
    case 'boolean':
      return databaseType === DatabaseType.PostgreSQL ? 'BOOLEAN' : 'TINYINT(1)';
    
    default:
      return 'VARCHAR(255)';
  }
} 