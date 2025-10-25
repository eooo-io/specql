import {readFileSync} from 'fs';
import inquirer from 'inquirer';
import {load as loadYaml} from 'js-yaml';
import ora from 'ora';
import {generateDatabaseSchema} from '../generators/database';
import {generateQueries} from '../generators/queries';
import {generateTypes} from '../generators/types';
import {processOpenApiSpec} from '../processors/openapi';
import {DatabaseType, NamingStrategy, SchemaStrategy} from '../types';
import {
  boxes,
  formatList,
  formatPath,
  formatSection,
  getSpinnerStyle,
  styles,
} from '../utils/terminal';

interface InitOptions {
  output: string;
}

interface UserChoices {
  databaseType: DatabaseType;
  namingStrategy: NamingStrategy;
  schemaStrategy: SchemaStrategy;
  generateTypes: boolean;
  generateQueries: boolean;
  outputPath: string;
}

export async function initializeProject(
  specPath: string,
  options: InitOptions
): Promise<void> {
  // Load and validate OpenAPI spec
  const spinner = ora(getSpinnerStyle('Loading OpenAPI specification')).start();
  try {
    const specContent = readFileSync(specPath, 'utf8');
    const spec =
      specPath.endsWith('.yaml') || specPath.endsWith('.yml')
        ? loadYaml(specContent)
        : JSON.parse(specContent);
    spinner.succeed(
      `OpenAPI specification loaded from ${styles.code(specPath)}`
    );

    // Interactive prompts
    console.log(
      '\n' +
        formatSection(
          'Configuration',
          `${styles.body('Please configure your database setup:')}\n` +
            `${styles.subtle('Your choices will determine how the database schema is generated.')}`
        )
    );

    const choices = await promptForChoices(options);

    // Process OpenAPI spec
    spinner.start('Processing OpenAPI specification');
    const schemas = await processOpenApiSpec(spec);
    spinner.succeed(
      `Found ${styles.highlight(schemas.length.toString())} schemas to process`
    );

    // Generate database schema
    spinner.start('Generating database schema');
    const dbSchema = await generateDatabaseSchema(schemas, {
      databaseType: choices.databaseType,
      namingStrategy: choices.namingStrategy,
      schemaStrategy: choices.schemaStrategy,
    });
    spinner.succeed(`Database schema generated ${styles.check}`);

    // Generate additional files if requested
    if (choices.generateTypes) {
      spinner.start('Generating TypeScript types');
      await generateTypes(schemas, choices.outputPath);
      spinner.succeed(`TypeScript types generated ${styles.check}`);
    }

    if (choices.generateQueries) {
      spinner.start('Generating sample queries');
      await generateQueries(schemas, choices.outputPath);
      spinner.succeed(`Sample queries generated ${styles.check}`);
    }

    // Show summary
    const generatedFiles = [
      `${formatPath(choices.outputPath)}/schema.sql`,
      ...(choices.generateTypes
        ? [`${formatPath(choices.outputPath)}/types/`]
        : []),
      ...(choices.generateQueries
        ? [`${formatPath(choices.outputPath)}/queries/`]
        : []),
    ];

    console.log(
      '\n' +
        boxes.success(
          formatSection(
            'Success!',
            `${styles.heading('Project initialized successfully!')} ${styles.check}\n\n` +
              formatSection('Generated Files', formatList(generatedFiles)) +
              `\n${styles.body('You can now start using your database schema.')}\n` +
              `${styles.subtle('Run')} ${styles.code('specql --help')} ${styles.subtle('for more commands.')}`
          )
        )
    );
  } catch (error) {
    spinner.fail(styles.error((error as Error).message));
    throw error;
  }
}

async function promptForChoices(options: InitOptions): Promise<UserChoices> {
  const questions = [
    {
      type: 'list',
      name: 'databaseType',
      message: styles.heading('Select target database:'),
      choices: [
        {
          name: `${styles.bullet} PostgreSQL ${styles.subtle('(recommended)')}`,
          value: DatabaseType.PostgreSQL,
        },
        {name: `${styles.bullet} MySQL`, value: DatabaseType.MySQL},
        {
          name: `${styles.bullet} SQLite ${styles.subtle('(lightweight)')}`,
          value: DatabaseType.SQLite,
        },
        {
          name: `${styles.bullet} Microsoft SQL Server`,
          value: DatabaseType.MSSQL,
        },
      ],
    },
    {
      type: 'list',
      name: 'namingStrategy',
      message: styles.heading('How should table names be generated?'),
      choices: [
        {
          name: `${styles.bullet} From schema titles ${styles.subtle('(human-readable)')}`,
          value: NamingStrategy.SchemaTitle,
        },
        {
          name: `${styles.bullet} From schema IDs ${styles.subtle('(consistent)')}`,
          value: NamingStrategy.SchemaId,
        },
        {
          name: `${styles.bullet} Custom naming pattern ${styles.subtle('(advanced)')}`,
          value: NamingStrategy.Custom,
        },
      ],
    },
    {
      type: 'list',
      name: 'schemaStrategy',
      message: styles.heading('Select schema generation strategy:'),
      choices: [
        {
          name: `${styles.bullet} One table per schema ${styles.subtle('(normalized)')}`,
          value: SchemaStrategy.OneTablePerSchema,
        },
        {
          name: `${styles.bullet} Denormalized ${styles.subtle('(flatten nested objects)')}`,
          value: SchemaStrategy.Denormalized,
        },
        {
          name: `${styles.bullet} Custom mapping ${styles.subtle('(advanced)')}`,
          value: SchemaStrategy.Custom,
        },
      ],
    },
    {
      type: 'confirm',
      name: 'generateTypes',
      message: styles.heading('Generate TypeScript types?'),
      default: true,
    },
    {
      type: 'confirm',
      name: 'generateQueries',
      message: styles.heading('Add sample queries?'),
      default: true,
    },
    {
      type: 'input',
      name: 'outputPath',
      message: styles.heading('Where should the output be saved?'),
      default: options.output,
      validate: (input: string) =>
        input.trim().length > 0 || styles.error('Please enter a valid path'),
    },
  ];

  return inquirer.prompt(questions);
}
