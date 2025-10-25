import {mkdirSync, writeFileSync} from 'fs';
import {join} from 'path';
import {Schema} from '../types';

export async function generateQueries(
  schemas: Schema[],
  outputPath: string
): Promise<void> {
  const queriesDir = join(outputPath, 'queries');
  mkdirSync(queriesDir, {recursive: true});

  for (const schema of schemas) {
    const content = generateQueriesForSchema(schema);
    writeFileSync(
      join(queriesDir, `${schema.name.toLowerCase()}.sql`),
      content
    );
  }
}

function generateQueriesForSchema(schema: Schema): string {
  const tableName = schema.name.toLowerCase();
  const queries: string[] = [];

  // Select queries
  queries.push(`-- Basic select query
SELECT * FROM ${tableName};

-- Select with pagination
SELECT * FROM ${tableName}
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;

-- Select with specific columns
SELECT id, ${schema.properties.map(p => p.name).join(', ')}
FROM ${tableName};`);

  // Insert query
  const insertColumns = [
    'created_at',
    'updated_at',
    ...schema.properties.map(p => p.name),
  ];
  const insertValues = [
    'CURRENT_TIMESTAMP',
    'CURRENT_TIMESTAMP',
    ...schema.properties.map(p => `:${p.name}`),
  ];

  queries.push(`
-- Insert new record
INSERT INTO ${tableName} (${insertColumns.join(', ')})
VALUES (${insertValues.join(', ')});`);

  // Update query
  const updateColumns = schema.properties.map(p => `${p.name} = :${p.name}`);
  queries.push(`
-- Update record
UPDATE ${tableName}
SET ${updateColumns.join(',\n    ')},
    updated_at = CURRENT_TIMESTAMP
WHERE id = :id;`);

  // Delete query
  queries.push(`
-- Delete record
DELETE FROM ${tableName}
WHERE id = :id;`);

  // Search queries
  const searchableColumns = schema.properties
    .filter(p => p.type === 'string' || p.type === 'text')
    .map(p => p.name);

  if (searchableColumns.length > 0) {
    const searchConditions = searchableColumns
      .map(col => `${col} LIKE :search`)
      .join('\n       OR ');

    queries.push(`
-- Search in text columns
SELECT *
FROM ${tableName}
WHERE ${searchConditions};`);
  }

  // Join queries for relationships
  if (schema.relations?.length) {
    schema.relations.forEach(relation => {
      const targetTable = relation.targetSchema.toLowerCase();

      if (relation.type === 'manyToMany') {
        const joinTable = relation.joinTable || `${tableName}_${targetTable}`;
        queries.push(`
-- Get all ${targetTable} for ${tableName}
SELECT t.*
FROM ${targetTable} t
JOIN ${joinTable} j ON j.${targetTable}_id = t.id
WHERE j.${tableName}_id = :id;`);
      } else {
        queries.push(`
-- Get ${relation.type === 'oneToMany' ? 'all' : ''} ${targetTable} for ${tableName}
SELECT t.*
FROM ${targetTable} t
JOIN ${tableName} s ON t.${relation.foreignKey} = s.id
WHERE s.id = :id;`);
      }
    });
  }

  return queries.join('\n');
}
