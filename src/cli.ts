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
let skipEmojiHandling = false;
let fixUnbalancedDelimiters = true; // Default to true
let removeAllEmoji = false;
let removeOverusedEmoji = false;

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
  } else if (arg === '--no-fix-unbalanced') {
    fixUnbalancedDelimiters = false;
  } else if (arg === '--skip-emoji') {
    skipEmojiHandling = true;
  } else if (arg === '--remove-all-emoji') {
    removeAllEmoji = true;
  } else if (arg === '--remove-overused-emoji') {
    removeOverusedEmoji = true;
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
  -i, --input <file>     Input file (if not provided, reads from stdin)
  -o, --output <file>    Output file (if not provided, writes to stdout)
  --skip-chars           Skip character replacements
  --skip-phrases         Skip phrase removals
  --skip-datetime        Skip date/time format standardization
  --skip-abbreviations   Skip abbreviation and time zone handling
  --skip-punctuation     Skip punctuation normalization
  --skip-emoji           Skip emoji handling
  --no-fix-unbalanced    Don't fix unbalanced quotes and parentheses
  --remove-all-emoji     Remove all emoji characters from text
  --remove-overused-emoji Remove commonly overused emoji and emoji clusters
  -h, --help             Show this help message
  
Examples:
  deslopify < input.txt > output.txt
  deslopify --input input.txt --output output.txt
  cat input.txt | deslopify > output.txt
  deslopify --remove-all-emoji < input.txt > output.txt
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
      skipEmojiHandling,
      fixUnbalancedDelimiters,
      emojiOptions: {
        removeAll: removeAllEmoji,
        removeOverused: removeOverusedEmoji
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