# LLM Hints for Deslopify

This document contains helpful hints about the code structure, methods, and tips on running/testing the Deslopify project for future LLMs.

## Project Structure

- `src/`: Contains the main source code
  - `src/index.ts`: Main entry point for the library, exports the Deslopifier class and default function
  - `src/cli.ts`: Command-line interface implementation
  - `src/interactive.ts`: Interactive mode implementation
  - `src/modules/`: Contains individual modules for different types of text processing
    - `characterReplacer.ts`: Handles replacing problematic characters with clean equivalents
    - `phraseRemover.ts`: Removes common unnecessary phrases
    - `dateTimeFormatter.ts`: Standardizes date and time formats
    - `abbreviationHandler.ts`: Handles standardization of abbreviations
    - `punctuationNormalizer.ts`: Normalizes excessive or inconsistent punctuation
    - `layoutStandardizer.ts`: Standardizes text layout including paragraph spacing, heading formats, etc.
    - `emojiHandler.ts`: Handles emoji removal and standardization

- `tests/`: Contains test files
  - `tests/deslopifier.test.ts`: Tests for the main Deslopifier class
  - `tests/modules.test.ts`: Tests for individual modules
  - `tests/*.test.ts`: Other specific test files for different modules

- `samples/`: Contains sample text files for testing

## Code Structure

### Deslopifier Class

The main `Deslopifier` class in `src/index.ts` orchestrates the text processing pipeline. It initializes all the modules and applies them in sequence to process the input text.

```typescript
export class Deslopifier {
  private characterReplacer: CharacterReplacer;
  private phraseRemover: PhraseRemover;
  private dateTimeFormatter: DateTimeFormatter;
  private abbreviationHandler: AbbreviationHandler;
  private punctuationNormalizer: PunctuationNormalizer;
  private layoutStandardizer: LayoutStandardizer;
  private emojiHandler: EmojiHandler;
  private options: DeslopifierOptions;

  constructor(options: DeslopifierOptions = {}) {
    // Initialize modules
  }

  public process(text: string): string {
    // Apply modules in sequence
  }

  // Methods to add custom mappings
}
```

### Module Pattern

Each module follows a similar pattern:

1. Define interfaces for mappings and options
2. Implement a class with a constructor that accepts custom mappings/options
3. Provide methods to add custom mappings
4. Implement a main processing method that applies the mappings to the input text

Example from `characterReplacer.ts`:

```typescript
export interface CharacterMapping {
  pattern: string | RegExp;
  replacement: string | ((match: string) => string);
}

export class CharacterReplacer {
  private mappings: CharacterMapping[];

  constructor(mappings?: CharacterMapping[]) {
    // Initialize with default or custom mappings
  }

  public addMapping(pattern: string | RegExp, replacement: string | ((match: string) => string)): void {
    // Add a new mapping
  }

  public replace(text: string): string {
    // Apply mappings to input text
  }
}
```

## Adding New Rules

To add a new rule to Deslopify:

1. Identify the appropriate module for your rule (e.g., `characterReplacer.ts` for character replacements)
2. Add a new mapping to the module's default mappings in the constructor
3. Update or add tests in the corresponding test file

Example of adding a new character replacement rule:

```typescript
// In characterReplacer.ts constructor
this.mappings = mappings || [
  // Existing mappings...
  
  // New rule
  { pattern: /your-pattern/g, replacement: 'your-replacement' },
  
  // More existing mappings...
];
```

## Running and Testing

### Running the CLI

```bash
# Basic usage with stdin/stdout
npx ts-node src/cli.ts < input.txt > output.txt

# Using file arguments
npx ts-node src/cli.ts --input input.txt --output output.txt

# With options
npx ts-node src/cli.ts --skip-chars --input input.txt
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/modules.test.ts

# Run with coverage
npm test -- --coverage
```

### Creating Test Files

Create test files in the `tests/` directory to test specific functionality:

```typescript
// Example test for a new feature
test('handles my new feature', () => {
  const processor = new MyModule();
  expect(processor.process('input with feature')).toBe('expected output');
});
```

## Common Patterns and Gotchas

### Regular Expressions

- Use the `g` flag for global replacement: `/pattern/g`
- Use the `m` flag for multi-line matching: `/pattern/gm`
- Use the `i` flag for case-insensitive matching: `/pattern/gi`
- Use the `u` flag for Unicode support: `/pattern/gu`

### Capturing Groups

- Use capturing groups to preserve parts of the matched text: `/(capture this)/g`
- Reference captured groups in the replacement: `'$1'`

### Line Beginnings and Endings

- Use `^` to match the beginning of a line (with the `m` flag): `/^pattern/gm`
- Use `$` to match the end of a line (with the `m` flag): `/pattern$/gm`

### Whitespace

- Use `\s` to match any whitespace character
- Use `\S` to match any non-whitespace character
- Use `{n,m}` to match a specific number of occurrences: `/ {2,}/g` matches 2 or more spaces

### Testing Tips

- Create specific test files for new functionality
- Test edge cases and boundary conditions
- Use the test files in the `samples/` directory for integration testing
