# Project Commands

## Linting and Typechecking
```bash
npm run lint
npm run build -- --noEmit
```

## Testing
```bash
npm test
npm test -- --coverage
```

## Build and Run
```bash
npm run build
node dist/cli.js < input.txt > output.txt
node dist/cli.js --input input.txt --output output.txt
deslopify < input.txt > output.txt  # After npm link or install globally
```

## Quick Test
```bash
npm run build
node dist/cli.js < tests/sample-input.txt
```

## Git Workflow
- Create feature branches with prefixes like `feature/`, `fix/`, `docs/`
- Use descriptive commit messages

```bash
git checkout -b feature/new-feature-name
git add .
git commit -m "Add descriptive commit message"
git push -u origin feature/new-feature-name
```