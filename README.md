# Deslopify

[![CI](https://github.com/davedean/deslopify/actions/workflows/ci.yml/badge.svg)](https://github.com/davedean/deslopify/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/deslopify.svg)](https://www.npmjs.com/package/deslopify)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A utility that cleans up text by removing or translating common "slop" patterns (unnecessary or non-standard characters and phrases) into cleaner output. Particularly useful for cleaning up AI-generated text from various LLMs.

## Features

### Character Replacements
* Intelligently handles em-dashes (—) and en-dashes (–) based on context
* Replaces non-standard spaces with regular spaces
* Condenses multiple spaces while preserving indentation
* Standardizes bullet points and list formatting
* Preserves technical and scientific characters (±, §, µ, °, etc.)
* Removes common emoji or standardizes their usage

### Phrase Removals
* Selectively removes only the most egregious phrases like "Certainly! " at the start of text
* Maintains most natural phrasing while removing unnecessary verbosity
* Configurable to add custom phrase removal patterns
* Can optionally remove transitional phrases like "That being said," "Here's why:"

### Date/Time Formatting
* Standardizes date formats for consistency
* Preserves human-readable month names and abbreviations
* Ensures proper spacing in time formats with AM/PM and time zones

### Abbreviation Handling
* Standardizes case for time zone abbreviations (UTC, GMT, EST, etc.)
* Ensures consistent capitalization for months, seasons, and astronomical terms
* Maintains appropriate capitalization based on context

### Punctuation Normalization
* Reduces multiple exclamation marks to single marks
* Standardizes excessive question marks
* Fixes unbalanced quotes and parentheses
* Converts smart (curly) quotes to normal (straight) quotes
* Normalizes ellipsis with too many dots

## Installation

```bash
# Install from npm
npm install -g deslopify

# Or clone and build locally
git clone https://github.com/davedean/deslopify.git
cd deslopify
npm install
npm run build
npm link  # Makes the CLI available globally
```

## Usage

### Command Line

```bash
# Basic usage with stdin/stdout
deslopify < input.txt > output.txt

# Using file arguments
deslopify --input input.txt --output output.txt

# Pipe from another command
cat input.txt | deslopify > output.txt

# Skip specific processing
deslopify --skip-chars < input.txt > output.txt
deslopify --skip-phrases < input.txt > output.txt
deslopify --skip-datetime < input.txt > output.txt
deslopify --skip-abbreviations < input.txt > output.txt
deslopify --skip-punctuation < input.txt > output.txt

# Disable fixing unbalanced delimiters
deslopify --no-fix-unbalanced < input.txt > output.txt
```

### API Usage

```typescript
import deslopify, { Deslopifier } from 'deslopify';

// Simple usage
const cleanText = deslopify('Certainly! This text—has some slop in it!!!!');
console.log(cleanText); // 'This text - has some slop in it!'

// Advanced usage with options
const processor = new Deslopifier({
  skipCharacterReplacement: false,
  skipPhraseRemoval: false,
  skipDateTimeFormatting: false,
  skipAbbreviationHandling: false,
  skipPunctuationNormalization: false,
  fixUnbalancedDelimiters: true,
  
  // Add custom mappings if needed
  customCharacterMappings: [
    { pattern: /\*/g, replacement: '•' }
  ],
  customPhrasePatterns: [
    { pattern: /In conclusion,/g, position: 'anywhere' }
  ],
  customDateTimeMappings: [
    { pattern: /(\d{4})(\d{2})(\d{2})/g, replacement: '$1-$2-$3' }
  ],
  customAbbreviationMappings: [
    { pattern: /\bpst\b/g, replacement: 'PST', preserveCase: false }
  ],
  customPunctuationMappings: [
    { pattern: /\.{5,}/g, replacement: '...' }
  ]
});

// Add more custom patterns if needed
processor.addCharacterMapping(/\?\?\?/g, '?');
processor.addPhrasePattern(/^To be honest,/i, 'start');
processor.addDateTimeMapping(/\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b/g, '$3-$2-$1');
processor.addAbbreviationMapping(/\bcentral european time\b/gi, 'CET', false);
processor.addPunctuationMapping(/\!\?\!\?/g, '!?');

const result = processor.process('To be honest, this text has ??? many stars *** in it!!!');
console.log(result); // 'this text has ? many stars ••• in it!'
```

## Options

The Deslopifier accepts the following options:

- `customCharacterMappings`: Custom character mappings to use instead of defaults
- `customPhrasePatterns`: Custom phrase patterns to use instead of defaults
- `customDateTimeMappings`: Custom date/time format mappings to use
- `customAbbreviationMappings`: Custom abbreviation mappings to use
- `customPunctuationMappings`: Custom punctuation mappings to use
- `skipCharacterReplacement`: Skip the character replacement step
- `skipPhraseRemoval`: Skip the phrase removal step
- `skipDateTimeFormatting`: Skip the date/time formatting step
- `skipAbbreviationHandling`: Skip the abbreviation handling step
- `skipPunctuationNormalization`: Skip the punctuation normalization step
- `fixUnbalancedDelimiters`: Whether to fix unbalanced quotes and parentheses

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT

