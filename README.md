# Deslopify

A utility that cleans up text by removing or translating common "slop" patterns (unnecessary or non-standard characters and phrases) into cleaner output.

## Features

### Character Replacements:
* Intelligently handles em-dashes (—) and en-dashes (–) based on context
* Replaces non-standard spaces with regular spaces
* Condenses multiple spaces while preserving indentation

### Phrase Removals:
* Selectively removes only the most egregious phrases like "Certainly! " at the start of text
* Maintains most natural phrasing while removing unnecessary verbosity
* Configurable to add custom phrase removal patterns

## Installation

```bash
# Install from npm
npm install -g deslopify

# Or clone and build locally
git clone https://github.com/yourusername/deslopify.git
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
deslopify --skip-chars < input.txt > output.txt-chars-only
deslopify --skip-phrases < input.txt > output.txt-phrases-only
```

### API Usage

```typescript
import deslopify, { Deslopifier } from 'deslopify';

// Simple usage
const cleanText = deslopify('Certainly! This text—has some slop in it.');
console.log(cleanText); // 'This text - has some slop in it.'

// Advanced usage with options
const processor = new Deslopifier({
  skipCharacterReplacement: false,
  skipPhraseRemoval: false,
  // Add custom mappings if needed
  customCharacterMappings: [
    { pattern: /\*/g, replacement: '•' }
  ],
  customPhrasePatterns: [
    { pattern: /In conclusion,/g, position: 'anywhere' }
  ]
});

// Add more custom patterns if needed
processor.addCharacterMapping(/\?\?\?/g, '?');
processor.addPhrasePattern(/^To be honest,/i, 'start');

const result = processor.process('To be honest, this text has ??? many stars *** in it.');
console.log(result); // 'this text has ? many stars ••• in it.'
```

## Options

The Deslopifier accepts the following options:

- `customCharacterMappings`: Custom character mappings to use instead of defaults
- `customPhrasePatterns`: Custom phrase patterns to use instead of defaults
- `skipCharacterReplacement`: Skip the character replacement step
- `skipPhraseRemoval`: Skip the phrase removal step

## License

MIT

