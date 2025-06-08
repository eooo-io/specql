import { OpenAPIV3 } from 'openapi-types';
import { PropertyConstraints, Schema, SchemaProperty } from '../types';

export async function processOpenApiSpec(spec: OpenAPIV3.Document): Promise<Schema[]> {
  const schemas: Schema[] = [];
  
  if (!spec.components?.schemas) {
    return schemas;
  }

  for (const [schemaName, schemaObj] of Object.entries(spec.components.schemas)) {
    if (!isSchemaObject(schemaObj)) continue;

    const schema: Schema = {
      name: schemaName,
      properties: [],
      relations: []
    };

    for (const [propName, propObj] of Object.entries(schemaObj.properties || {})) {
      if (!isSchemaObject(propObj)) continue;

      const property: SchemaProperty = {
        name: propName,
        type: mapOpenApiType(propObj),
        required: (schemaObj.required || []).includes(propName),
        constraints: extractConstraints(propObj)
      };

      if (propObj.default !== undefined) {
        property.defaultValue = propObj.default;
      }

      // Handle relationships
      if (propObj.$ref || (propObj.type === 'array' && propObj.items?.$ref)) {
        const targetSchema = extractRefName(propObj.$ref || (propObj.items?.$ref as string));
        if (targetSchema) {
          schema.relations?.push({
            type: propObj.type === 'array' ? 'oneToMany' : 'oneToOne',
            targetSchema,
            foreignKey: `${targetSchema.toLowerCase()}_id`
          });
          continue;
        }
      }

      schema.properties.push(property);
    }

    schemas.push(schema);
  }

  return schemas;
}

function isSchemaObject(obj: any): obj is OpenAPIV3.SchemaObject {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

function mapOpenApiType(prop: OpenAPIV3.SchemaObject): string {
  switch (prop.type) {
    case 'integer':
      return prop.format === 'int64' ? 'bigint' : 'integer';
    case 'number':
      return prop.format === 'float' ? 'float' : 'decimal';
    case 'string':
      switch (prop.format) {
        case 'date':
          return 'date';
        case 'date-time':
          return 'timestamp';
        case 'binary':
          return 'blob';
        default:
          return 'string';
      }
    case 'boolean':
      return 'boolean';
    case 'array':
      return 'json';
    case 'object':
      return 'json';
    default:
      return 'string';
  }
}

function extractConstraints(prop: OpenAPIV3.SchemaObject): PropertyConstraints {
  const constraints: PropertyConstraints = {};

  if (prop.unique) constraints.unique = true;
  if (prop.minLength) constraints.minLength = prop.minLength;
  if (prop.maxLength) constraints.maxLength = prop.maxLength;
  if (prop.minimum) constraints.minimum = prop.minimum;
  if (prop.maximum) constraints.maximum = prop.maximum;
  if (prop.pattern) constraints.pattern = prop.pattern;

  return Object.keys(constraints).length > 0 ? constraints : undefined;
}

function extractRefName(ref: string | undefined): string | undefined {
  if (!ref) return undefined;
  const parts = ref.split('/');
  return parts[parts.length - 1];
} 