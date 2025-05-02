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

## Git Workflow

- Always create a new feature branch for changes
- Name branches with a descriptive prefix like `feature/`, `fix/`, or `docs/`
- After making changes, commit them with a descriptive message
- Push the branch to GitHub before merging
- After completing a feature, return to the main branch

```bash
# Create a new feature branch
git checkout -b feature/new-feature-name

# After making changes, commit them
git add .
git commit -m "Add descriptive commit message"

# Push the branch to GitHub
git push -u origin feature/new-feature-name

# When feature is complete, return to main branch
git checkout main
```

## Notes

- This is a text processing utility for removing common "slop" patterns
- Follow the implementation plan in PLAN.md
- Keep code modular to allow for easy addition of new replacement patterns
- The deslopify tool processes text through five main components:
  1. Character Replacer: Handles character-level replacements (dashes, spaces, bullet points, etc.)
  2. Phrase Remover: Removes common phrases that add verbosity
  3. Date/Time Formatter: Standardizes date and time formats
  4. Abbreviation Handler: Ensures consistent handling of abbreviations and technical terms
  5. Punctuation Normalizer: Standardizes punctuation usage
- When adding new patterns, use the appropriate module based on pattern type

## Development Process

- Always research the problem first before implementing
- Think through the approach and create a plan
- Before starting work on a plan, confirm with the user unless running in full-auto mode

## Sample Files
The `samples/` directory contains various text samples from different models to test deslopification:

```bash
# Process a sample file
npm run build && node dist/cli.js < samples/sample-o3-equinox.txt
```