# Implementation Plan for Deslopifier

## Overview
The Deslopifier is a utility that cleans up text by removing or translating common "slop" patterns (unnecessary or non-standard characters and phrases) into cleaner output, particularly useful for cleaning up AI-generated text.

## Core Components (Implemented)

1. **Character Replacements**
   - Replace emdash/endash with regular dashes with spaces
   - Replace non-standard spaces with regular spaces
   - Condense multiple spaces while preserving indentation
   - Standardize bullet points and list formatting
   - Preserve technical and scientific characters

2. **Phrase Removals**
   - Remove phrases like "Certainly! " at the start of text
   - Selectively remove only the most egregious phrases
   - Maintain most natural phrasing while removing unnecessary verbosity

3. **Date/Time Formatting**
   - Standardize date formats for consistency
   - Preserve human-readable month names and abbreviations
   - Ensure proper spacing in time formats with AM/PM and time zones

4. **Abbreviation Handling**
   - Standardize case for time zone abbreviations (UTC, GMT, EST, etc.)
   - Ensure consistent capitalization for months, seasons, and astronomical terms
   - Maintain appropriate capitalization based on context

5. **Punctuation Normalization**
   - Reduce multiple exclamation marks to single marks
   - Standardize excessive question marks
   - Fix unbalanced quotes and parentheses
   - Convert smart (curly) quotes to normal (straight) quotes
   - Normalize ellipsis with too many dots

6. **Processing Pipeline**
   - Modular pipeline architecture that:
     - Takes input text
     - Applies character replacements
     - Applies phrase removals
     - Applies date/time formatting
     - Applies abbreviation handling
     - Applies punctuation normalization
     - Returns cleaned text

7. **CLI Tool**
   - Command-line interface that accepts:
     - Text via stdin
     - Text via file input
     - Output to stdout or file
     - Multiple configuration options

8. **Library Interface**
   - Clean API for programmatic use
   - Configuration options for customizing replacements
   - Methods for adding custom mappings

## Next Implementation Steps

1. ✅ Implement character replacement module
2. ✅ Implement phrase removal module
3. ✅ Implement date/time formatting module
4. ✅ Implement abbreviation handling module
5. ✅ Implement punctuation normalization module
6. ✅ Create processing pipeline to combine these modules
7. ✅ Build CLI interface
8. ✅ Write tests for all components
9. ✅ Add documentation
10. ✅ Package for distribution
11. Add more comprehensive test cases
12. Enhance documentation with more examples
13. Implement monitoring for patterns in newer LLM outputs

## Upcoming Features

1. **Interactive Mode**
   - Implement a persistent interactive mode with the `--interactive` or `-i` flag
   - Create a terminal-based interface that stays running and waits for input
   - When content is pasted into the window, automatically deslopify it
   - Place the processed text into the user's clipboard for immediate use
   - Add clear visual indicators of when input is expected and when processing is done
   - Implement a "batch mode" toggle to allow users to paste multiple texts sequentially
   - Add keyboard shortcuts for:
     - Quitting the interactive mode (Ctrl+C, q)
     - Clearing the current input buffer (Ctrl+K)
     - Toggling settings like verbose output (v)
     - Showing help information (h)
   - Provide a status line showing current settings and mode
   - Include progress indicator for longer texts

2. **Reasoning Trace Detection and Handling**
   - Add a configurable option `--remove-reasoning-traces` (enabled by default)
   - Detect sections with reasoning patterns (like those common in Phi and other models)
   - When enabled, completely remove these sections from output
   - When disabled, leave reasoning sections unmodified
   - Implement detection heuristics for phrases like "Let me think", "I can reason through this"

3. ✅ **Emoji Handling**
   - Add `--remove-all-emoji` option to remove all emoji characters
   - Keep current specific emoji filtering under `--remove-overused-emoji` option
   - Add rules for detecting emoji clusters/overuse

4. **Markdown Formatting Options**
   - Add a `--remove-markdown-formatting` option
   - Preserve structural markdown (headers, lists, code blocks) when enabled
   - Remove inline formatting (bold, italics, strikethrough)
   - Define heuristics for "excessive formatting" (e.g., > 3 formatting elements per paragraph)
   - Option to normalize but not remove formatting (consistent style)

5. **Layout standardization**
   - Normalize inconsistent paragraph spacing
   - Standardize section headings format
   - Create consistent indentation for lists and quoted content

6. **Custom Configuration Files**
   - Allow users to save custom configuration profiles
   - Support loading configurations from JSON/YAML files
   - Implement presets for different LLM providers

## CLI Configuration Options

Current flag options:

```
--skip-chars              Skip character replacements
--skip-phrases            Skip phrase removals
--skip-datetime           Skip date/time formatting
--skip-abbreviations      Skip abbreviation handling
--skip-punctuation        Skip punctuation normalization
--no-fix-unbalanced       Don't fix unbalanced quotes and parentheses
```

Current planned/implemented additional options:

```
--interactive, -i           Run in interactive mode that watches clipboard (default: false)
--remove-reasoning-traces   Remove reasoning trace sections (default: true)
--skip-emoji                Skip emoji handling
--remove-all-emoji          Remove all emoji characters (default: false)  
--remove-overused-emoji     Remove only overused emoji (default: false)
--remove-markdown-formatting Remove bold/italics formatting (default: false)
```

## Repository and CI/CD Setup

1. **GitHub Repository Setup** ✅
   - Repository available at https://github.com/davedean/deslopify/
   - Added README.md, LICENSE, and CONTRIBUTING.md files
   - Set up branch protection rules for main branch

2. **GitHub Workflows** ✅
   - Test/build workflow that runs on push and pull requests
     - Runs TypeScript type checking
     - Runs all tests
     - Reports test coverage
   - Package published to npm registry

## Development Workflow

1. Create a feature branch for each new feature or fix
2. Implement and test changes on the feature branch
3. Submit a pull request to merge changes into main
4. Ensure all tests pass before merging
5. Keep the documentation updated with new features
6. After completing a feature, return to the main branch
7. Update CLAUDE.md and PLAN.md to reflect completed work and update task status