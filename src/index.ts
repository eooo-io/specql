#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../package.json';
import { initializeProject } from './commands/init';
import { boxes, createBanner, styles } from './utils/terminal';

async function main() {
  console.log(await createBanner('SpecQL'));
  console.log(boxes.info(
    `${styles.heading('Welcome to SpecQL!')}\n` +
    `${styles.secondary('Generate database setups from OpenAPI specifications.')}\n\n` +
    `${styles.dim('Version:')} ${styles.highlight(version)}`
  ));

  const program = new Command();

  program
    .name('specql')
    .description('Generate database setups from OpenAPI specifications')
    .version(version, '-v, --version', 'Output the current version');

  program
    .command('init')
    .description('Initialize a new database setup from an OpenAPI specification')
    .argument('<spec>', 'Path to OpenAPI specification file')
    .option('-o, --output <dir>', 'Output directory for generated files', './db')
    .action(async (spec, options) => {
      try {
        await initializeProject(spec, options);
      } catch (error) {
        console.error(boxes.error(
          `${styles.error('Error:')} ${(error as Error).message}`
        ));
        process.exit(1);
      }
    });

  program.parse();
}

main(); 