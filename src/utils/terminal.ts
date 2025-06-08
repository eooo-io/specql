import boxen from 'boxen';
import chalk from 'chalk';
import figlet from 'figlet';
import { Options as OraOptions } from 'ora';
import { promisify } from 'util';

const textSync = promisify(figlet.text);

// Modern color palette using ANSI colors
export const palette = {
  // Primary colors
  primary: chalk.rgb(129, 140, 248),   // Indigo
  secondary: chalk.rgb(167, 139, 250), // Purple
  accent: chalk.rgb(236, 72, 153),     // Pink

  // Status colors
  success: chalk.rgb(34, 197, 94),     // Green
  warning: chalk.rgb(234, 179, 8),     // Yellow
  error: chalk.rgb(239, 68, 68),       // Red
  info: chalk.rgb(59, 130, 246),       // Blue

  // Grayscale
  white: chalk.rgb(255, 255, 255),
  lightGray: chalk.rgb(209, 213, 219),
  gray: chalk.rgb(107, 114, 128),
  darkGray: chalk.rgb(55, 65, 81),
  black: chalk.rgb(17, 24, 39),

  // Special effects
  gradient: {
    blue: (text: string): string => text.split('').map(char => 
      chalk.rgb(
        Math.floor(Math.random() * 50 + 50),
        Math.floor(Math.random() * 100 + 100),
        Math.floor(Math.random() * 50 + 200)
      )(char)
    ).join(''),
    purple: (text: string): string => text.split('').map(char => 
      chalk.rgb(
        Math.floor(Math.random() * 50 + 150),
        Math.floor(Math.random() * 50 + 50),
        Math.floor(Math.random() * 50 + 200)
      )(char)
    ).join('')
  }
};

export const styles = {
  // Text styles
  heading: (text: string): string => palette.primary.bold(text),
  subheading: (text: string): string => palette.secondary(text),
  body: (text: string): string => palette.white(text),
  dim: (text: string): string => palette.gray(text),
  code: (text: string): string => chalk.bgRgb(30, 41, 59)(palette.lightGray(` ${text} `)),
  link: (text: string): string => palette.info.underline(text),
  error: (text: string): string => palette.error(text),
  
  // Status indicators
  check: palette.success('✓'),
  cross: palette.error('✗'),
  arrow: palette.primary('→'),
  bullet: palette.secondary('•'),
  
  // Special elements
  banner: (text: string): string => palette.gradient.purple(text),
  highlight: (text: string): string => chalk.bgRgb(59, 130, 246).white(` ${text} `),
  subtle: (text: string): string => palette.darkGray(text)
};

export const boxes = {
  success: (text: string): string => boxen(text, {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: '#22c55e',
    backgroundColor: '#22c55e0f'
  }),
  
  error: (text: string): string => boxen(text, {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: '#ef4444',
    backgroundColor: '#ef44440f'
  }),
  
  info: (text: string): string => boxen(text, {
    padding: 1,
    margin: 1,
    borderStyle: 'single',
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f60f'
  })
};

export async function createBanner(text: string): Promise<string> {
  const figletText = await textSync(text, {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  });
  
  return styles.banner(figletText || text);
}

export function formatSection(title: string, content: string): string {
  const line = '─'.repeat(title.length);
  return `${styles.heading(title)}\n${styles.dim(line)}\n${content}\n`;
}

export function formatList(items: string[]): string {
  return items.map(item => `${styles.bullet} ${item}`).join('\n');
}

export function formatPath(path: string): string {
  return styles.code(path);
}

export function formatTable(headers: string[], rows: string[][]): string {
  // Calculate column widths
  const widths = headers.map((h, i) => 
    Math.max(
      h.length,
      ...rows.map(row => (row[i] || '').length)
    )
  );

  // Format headers
  const headerRow = headers
    .map((h, i) => h.padEnd(widths[i]))
    .join(' │ ');
  
  // Format separator
  const separator = widths
    .map(w => '─'.repeat(w))
    .join('─┼─');

  // Format data rows
  const formattedRows = rows
    .map(row =>
      row
        .map((cell, i) => cell.padEnd(widths[i]))
        .join(' │ ')
    )
    .join('\n');

  return `${styles.heading(headerRow)}\n${styles.dim(separator)}\n${formattedRows}`;
}

export const spinnerFrames = [
  '⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'
].map(frame => palette.secondary(frame));

export function getSpinnerStyle(text: string): OraOptions {
  return {
    text: palette.white(text),
    spinner: {
      interval: 80,
      frames: spinnerFrames
    },
    color: 'cyan'
  };
} 