import {mkdirSync, writeFileSync} from 'fs';
import {join} from 'path';
import {Schema, SchemaProperty} from '../types';

export async function generateTypes(
  schema: Schema[],
  outputPath: string
): Promise<void> {
  const typesDir = join(outputPath, 'types');
  mkdirSync(typesDir, {recursive: true});

  const content = generateTypeDefinitions(schema);
  writeFileSync(join(typesDir, 'index.ts'), content);
}

function generateTypeDefinitions(schemas: Schema[]): string {
  const imports = "import { Timestamp } from './timestamp';\n\n";

  const types = schemas
    .map(schema => {
      const properties = schema.properties
        .map(prop => generatePropertyDefinition(prop))
        .join('\n  ');
      const relations =
        schema.relations
          ?.map(relation => {
            const type =
              relation.type === 'oneToMany'
                ? `${relation.targetSchema}[]`
                : relation.targetSchema;
            return `  ${relation.targetSchema.toLowerCase()}: ${type};`;
          })
          .join('\n') || '';

      return (
        `export interface ${schema.name} {\n` +
        '  id: number;\n' +
        `  ${properties}\n` +
        (relations ? `${relations}\n` : '') +
        '  createdAt: Timestamp;\n' +
        '  updatedAt: Timestamp;\n' +
        '}\n'
      );
    })
    .join('\n');

  const timestampType = 'export type Timestamp = string;\n\n';

  return imports + timestampType + types;
}

function generatePropertyDefinition(prop: SchemaProperty): string {
  const type = mapToTypeScriptType(prop.type);
  const optional = !prop.required ? '?' : '';
  return `${prop.name}${optional}: ${type};`;
}

function mapToTypeScriptType(type: string): string {
  switch (type) {
    case 'integer':
    case 'bigint':
    case 'decimal':
    case 'float':
      return 'number';
    case 'string':
    case 'text':
      return 'string';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'Date';
    case 'timestamp':
      return 'Timestamp';
    case 'json':
      return 'any';
    case 'blob':
      return 'Buffer';
    default:
      return 'any';
  }
}
