#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { prompt } from 'inquirer';
import { load as loadYaml } from 'js-yaml';
import { generateCode } from './generators/code';
import { generateDatabaseSchema } from './generators/database';
import { processOpenApiSpec } from './processors/openapi';
import { Config, DatabaseType, Language } from './types';

const program = new Command();

program
  .name('spec-to-db')
  .description('Generate database setups from OpenAPI specifications')
  .version('0.1.0')
  .option('-s, --spec <path>', 'Path to OpenAPI specification file')
  .option('-o, --output <path>', 'Output directory for generated files')
  .option('-c, --config <path>', 'Path to configuration file')
  .option('-f, --force', 'Overwrite existing files')
  .option('--dry-run', 'Preview changes without writing files');

async function promptForConfig(): Promise<Config> {
  const questions = [
    {
      type: 'list',
      name: 'language',
      message: 'Select the programming language:',
      choices: [
        { name: 'Python (FastAPI)', value: Language.Python },
        { name: 'PHP (Laravel)', value: Language.PHP },
        { name: 'TypeScript (TypeORM)', value: Language.TypeScript }
      ]
    },
    {
      type: 'list',
      name: 'database',
      message: 'Select the database type:',
      choices: [
        { name: 'SQLite', value: DatabaseType.SQLite },
        { name: 'MySQL', value: DatabaseType.MySQL },
        { name: 'MariaDB', value: DatabaseType.MariaDB },
        { name: 'PostgreSQL', value: DatabaseType.PostgreSQL }
      ]
    }
  ];

  return prompt(questions);
}

async function main() {
  program.parse();
  const options = program.opts();

  try {
    // Load configuration
    let config: Config;
    if (options.config) {
      const configFile = readFileSync(options.config, 'utf8');
      config = loadYaml(configFile) as Config;
    } else {
      config = await promptForConfig();
    }

    // Load and parse OpenAPI spec
    if (!options.spec) {
      console.error('Error: OpenAPI specification file is required');
      process.exit(1);
    }

    const specContent = readFileSync(options.spec, 'utf8');
    const spec = options.spec.endsWith('.yaml') || options.spec.endsWith('.yml')
      ? loadYaml(specContent)
      : JSON.parse(specContent);

    // Process the OpenAPI spec
    const schemas = await processOpenApiSpec(spec);

    // Generate database schema
    const dbSchema = await generateDatabaseSchema(schemas, config.database);

    // Generate code
    await generateCode(dbSchema, config);

    console.log('Generation completed successfully!');
  } catch (error) {
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

main(); 