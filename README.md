# Deslopify

A utility that cleans up text by removing or translating common "slop" patterns (unnecessary or non-standard characters and phrases) into cleaner output.

## Features

### Character Replacements:
* Intelligently handles em-dashes (—) and en-dashes (–) based on context
* Replaces non-standard spaces with regular spaces
* Condenses multiple spaces while preserving indentation
* Standardizes bullet points and list formatting
* Preserves technical and scientific characters (±, §, µ, °, etc.)

### Phrase Removals:
* Selectively removes only the most egregious phrases like "Certainly! " at the start of text
* Maintains most natural phrasing while removing unnecessary verbosity
* Configurable to add custom phrase removal patterns

### Date/Time Formatting:
* Standardizes date formats for consistency
* Preserves human-readable month names and abbreviations
* Ensures proper spacing in time formats with AM/PM and time zones

### Abbreviation Handling:
* Standardizes case for time zone abbreviations (UTC, GMT, EST, etc.)
* Ensures consistent capitalization for months, seasons, and astronomical terms
* Maintains appropriate capitalization based on context

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
deslopify --skip-datetime < input.txt > output.txt-no-datetime-formatting
deslopify --skip-abbreviations < input.txt > output.txt-no-abbreviation-handling
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
  skipDateTimeFormatting: false,
  skipAbbreviationHandling: false,
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
  ]
});

// Add more custom patterns if needed
processor.addCharacterMapping(/\?\?\?/g, '?');
processor.addPhrasePattern(/^To be honest,/i, 'start');
processor.addDateTimeMapping(/\b(\d{1,2})\.(\d{1,2})\.(\d{4})\b/g, '$3-$2-$1');
processor.addAbbreviationMapping(/\bcentral european time\b/gi, 'CET', false);

const result = processor.process('To be honest, this text has ??? many stars *** in it.');
console.log(result); // 'this text has ? many stars ••• in it.'
```

## Options

The Deslopifier accepts the following options:

- `customCharacterMappings`: Custom character mappings to use instead of defaults
- `customPhrasePatterns`: Custom phrase patterns to use instead of defaults
- `customDateTimeMappings`: Custom date/time format mappings to use
- `customAbbreviationMappings`: Custom abbreviation mappings to use
- `skipCharacterReplacement`: Skip the character replacement step
- `skipPhraseRemoval`: Skip the phrase removal step
- `skipDateTimeFormatting`: Skip the date/time formatting step
- `skipAbbreviationHandling`: Skip the abbreviation handling step

## License

MIT

