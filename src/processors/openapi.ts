import { OpenAPI } from 'openapi-types';
import { Schema, SchemaProperty } from '../types';

export async function processOpenApiSpec(spec: OpenAPI.Document): Promise<Schema[]> {
  const schemas: Schema[] = [];

  if (!spec.components?.schemas) {
    return schemas;
  }

  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    if (schema.type === 'object') {
      schemas.push({
        name,
        properties: processProperties(schema.properties || {}, schema.required || []),
        required: schema.required
      });
    }
  }

  return schemas;
}

function processProperties(
  properties: Record<string, OpenAPI.SchemaObject>,
  required: string[]
): SchemaProperty[] {
  const result: SchemaProperty[] = [];

  for (const [name, property] of Object.entries(properties)) {
    const schemaProperty: SchemaProperty = {
      name,
      type: property.type || 'string',
      nullable: !required.includes(name)
    };

    if (property.format) {
      schemaProperty.format = property.format;
    }

    if (property.default !== undefined) {
      schemaProperty.default = property.default;
    }

    if (property.type === 'array' && property.items) {
      schemaProperty.items = processProperty(property.items as OpenAPI.SchemaObject);
    }

    if (property.type === 'object' && property.properties) {
      schemaProperty.properties = processProperties(
        property.properties,
        property.required || []
      );
    }

    if (property.$ref) {
      schemaProperty.ref = property.$ref.split('/').pop() || '';
    }

    result.push(schemaProperty);
  }

  return result;
}

function processProperty(property: OpenAPI.SchemaObject): SchemaProperty {
  const schemaProperty: SchemaProperty = {
    name: '',
    type: property.type || 'string'
  };

  if (property.format) {
    schemaProperty.format = property.format;
  }

  if (property.default !== undefined) {
    schemaProperty.default = property.default;
  }

  if (property.$ref) {
    schemaProperty.ref = property.$ref.split('/').pop() || '';
  }

  return schemaProperty;
} 