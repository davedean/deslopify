# Claude Instructions

This file contains important commands and information for Claude to use when working on this project.

## Project Commands

### Linting and Typechecking
When making code changes, run these commands to verify correctness:

```bash
# Run ESLint to check for code style issues
npm run lint

# Run TypeScript compiler to check for type errors
npm run build -- --noEmit
```

### Testing
To run tests:

```bash
# Run all tests with Jest
npm test

# Run tests with coverage report
npm test -- --coverage
```

### Build
To build the project:

```bash
# Build TypeScript files to JavaScript in the dist directory
npm run build
```

### Running
To run the deslopify tool:

```bash
# Process stdin to stdout
node dist/cli.js < input.txt > output.txt

# Process a file with the CLI arguments
node dist/cli.js --input input.txt --output output.txt

# After npm link or install globally
deslopify < input.txt > output.txt
```

## Quick Test
To quickly test the deslopify tool with the sample file:

```bash
# Build the project
npm run build

# Process the sample input file
node dist/cli.js < tests/sample-input.txt
```

## Notes

- This is a text processing utility for removing common "slop" patterns
- Follow the implementation plan in PLAN.md
- Keep code modular to allow for easy addition of new replacement patterns
- The deslopify tool processes text through two main components:
  1. Character Replacer: Handles character-level replacements (dashes, spaces, etc.)
  2. Phrase Remover: Removes common phrases that add verbosity
- When adding new patterns, use the appropriate module based on pattern type