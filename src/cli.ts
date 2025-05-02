#!/usr/bin/env node

/**
 * Deslopify CLI
 * 
 * Command-line interface for the deslopify tool
 */

import fs from 'fs';
import path from 'path';
import { Deslopifier, DeslopifierOptions } from './index';

// Parse command line arguments
const args = process.argv.slice(2);
let inputFile: string | null = null;
let outputFile: string | null = null;
let skipCharacterReplacement = false;
let skipPhraseRemoval = false;
let skipDateTimeFormatting = false;
let skipAbbreviationHandling = false;
let skipPunctuationNormalization = false;
let skipLayoutStandardization = false;
let fixUnbalancedDelimiters = true; // Default to true
let paragraphSpacing: 'single' | 'double' = 'single';
let preserveCodeBlocks = true;
let headingStyle: 'atx' | 'setext' = 'atx';

// Process arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--input' || arg === '-i') {
    inputFile = args[++i];
  } else if (arg === '--output' || arg === '-o') {
    outputFile = args[++i];
  } else if (arg === '--skip-chars') {
    skipCharacterReplacement = true;
  } else if (arg === '--skip-phrases') {
    skipPhraseRemoval = true;
  } else if (arg === '--skip-datetime') {
    skipDateTimeFormatting = true;
  } else if (arg === '--skip-abbreviations') {
    skipAbbreviationHandling = true;
  } else if (arg === '--skip-punctuation') {
    skipPunctuationNormalization = true;
  } else if (arg === '--skip-layout') {
    skipLayoutStandardization = true;
  } else if (arg === '--no-fix-unbalanced') {
    fixUnbalancedDelimiters = false;
  } else if (arg === '--paragraph-spacing') {
    const value = args[++i];
    if (value === 'single' || value === 'double') {
      paragraphSpacing = value;
    } else {
      console.error('Error: paragraph-spacing must be "single" or "double"');
      process.exit(1);
    }
  } else if (arg === '--no-preserve-codeblocks') {
    preserveCodeBlocks = false;
  } else if (arg === '--heading-style') {
    const value = args[++i];
    if (value === 'atx' || value === 'setext') {
      headingStyle = value;
    } else {
      console.error('Error: heading-style must be "atx" or "setext"');
      process.exit(1);
    }
  } else if (arg === '--help' || arg === '-h') {
    printHelp();
    process.exit(0);
  }
}

// Print help message
function printHelp(): void {
  console.log(`
Deslopify - Clean up text by removing/translating common "slop" patterns

Usage: deslopify [options]

Options:
  -i, --input <file>         Input file (if not provided, reads from stdin)
  -o, --output <file>        Output file (if not provided, writes to stdout)
  --skip-chars               Skip character replacements
  --skip-phrases             Skip phrase removals
  --skip-datetime            Skip date/time format standardization
  --skip-abbreviations       Skip abbreviation and time zone handling
  --skip-punctuation         Skip punctuation normalization
  --skip-layout              Skip layout standardization
  --no-fix-unbalanced        Don't fix unbalanced quotes and parentheses
  --paragraph-spacing <opt>  Set paragraph spacing to "single" or "double" (default: single)
  --heading-style <opt>      Set heading style to "atx" or "setext" (default: atx)
  --no-preserve-codeblocks   Don't preserve whitespace in code blocks
  -h, --help                 Show this help message
  
Examples:
  deslopify < input.txt > output.txt
  deslopify --input input.txt --output output.txt
  deslopify --paragraph-spacing double < input.txt > output.txt
  cat input.txt | deslopify > output.txt
  `);
}

// Main function
async function main(): Promise<void> {
  try {
    // Get input text
    const inputText = await getInputText(inputFile);
    
    // Configure options
    const options: DeslopifierOptions = {
      skipCharacterReplacement,
      skipPhraseRemoval,
      skipDateTimeFormatting,
      skipAbbreviationHandling,
      skipPunctuationNormalization,
      skipLayoutStandardization,
      fixUnbalancedDelimiters,
      layoutOptions: {
        paragraphSpacing,
        preserveCodeBlocks,
        headingStyle
      }
    };
    
    // Process the text
    const deslopifier = new Deslopifier(options);
    const outputText = deslopifier.process(inputText);
    
    // Output the processed text
    await outputResult(outputText, outputFile);
    
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Get input text from file or stdin
async function getInputText(filePath: string | null): Promise<string> {
  if (filePath) {
    return fs.promises.readFile(path.resolve(filePath), 'utf8');
  } else {
    // Read from stdin
    const chunks: Buffer[] = [];
    
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks).toString('utf8');
  }
}

// Output result to file or stdout
async function outputResult(text: string, filePath: string | null): Promise<void> {
  if (filePath) {
    await fs.promises.writeFile(path.resolve(filePath), text, 'utf8');
  } else {
    process.stdout.write(text);
  }
}

// Run the main function
main().catch(error => {
  console.error(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});