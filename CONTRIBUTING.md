# Contributing to Deslopify

Thank you for your interest in contributing to Deslopify! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please be respectful and considerate of others when participating in this project. Be open to constructive feedback and willing to collaborate.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```
   git clone https://github.com/your-username/deslopify.git
   ```
3. Install dependencies:
   ```
   cd deslopify
   npm install
   ```
4. Build the project:
   ```
   npm run build
   ```
5. Run tests:
   ```
   npm test
   ```

## Development Workflow

1. Create a new branch for your feature or bug fix:
   ```
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Run tests to make sure everything still works:
   ```
   npm test
   ```

4. Run the type checker:
   ```
   npm run build -- --noEmit
   ```

5. Commit your changes with a clear and descriptive commit message

6. Push your changes to your fork:
   ```
   git push origin feature/your-feature-name
   ```

7. Create a pull request from your fork to the main repository

## Pull Request Guidelines

- Ensure your code follows the project's style and conventions
- Include tests for new features or bug fixes
- Update the documentation if necessary
- Keep your pull request focused on a single issue or feature
- Be responsive to feedback and questions

## Adding New Slop Patterns

When adding new slop patterns to remove or normalize:

1. Determine which module is appropriate for your pattern:
   - `CharacterReplacer`: For single character or character sequence replacements
   - `PhraseRemover`: For removing common phrases
   - `DateTimeFormatter`: For standardizing date and time formats
   - `AbbreviationHandler`: For handling abbreviations and technical terms
   - `PunctuationNormalizer`: For standardizing punctuation

2. Add appropriate test cases to verify your new pattern works correctly

3. Update documentation to include your new pattern if it's significant

## Running Tests

```
npm test
```

To run tests with coverage:

```
npm test -- --coverage
```

## Building the Project

```
npm run build
```

## License

By contributing to Deslopify, you agree that your contributions will be licensed under the project's MIT license.