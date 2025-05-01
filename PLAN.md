# Implementation Plan for Deslopifier

## Overview
The Deslopifier will be a utility that cleans up text by removing or translating common "slop" patterns (unnecessary or non-standard characters and phrases) into cleaner output.

## Core Components

1. **Character Replacements**
   - Replace emdash/endash with regular dashes with spaces
   - Replace non-standard spaces with regular spaces
   - Implement a character mapping system for easy addition of new replacements

2. **Phrase Removals**
   - Remove phrases like "Certainly! " at the start of text
   - Remove phrases like "Honestly; " at the start of text
   - Implement a phrase removal system for easy addition of new patterns

3. **Processing Pipeline**
   - Create a modular pipeline architecture that:
     - Takes input text
     - Applies character replacements
     - Applies phrase removals
     - Returns cleaned text

4. **CLI Tool**
   - Implement command-line interface that accepts:
     - Text via stdin
     - Text via file input
     - Output to stdout or file

5. **Library Interface**
   - Create a clean API for programmatic use
   - Implement configuration options for customizing replacements

## Implementation Steps

1. Set up project structure
2. Implement character replacement module
3. Implement phrase removal module
4. Create processing pipeline to combine these modules
5. Build CLI interface
6. Write tests for all components
7. Add documentation
8. Package for distribution

## Future Enhancements

1. Allow for user-defined replacement/removal patterns
2. Add regex support for more complex replacements
3. Create a configuration file format for persistent settings
4. Add context-aware replacements
5. Implement batch processing for multiple files
6. Add bullet point and list formatting standardization
7. Improve handling of date/time formats
8. Add special character preservation for technical/scientific content
9. Implement smart handling of abbreviations and time zones
10. Add language-specific rules for non-English content

## New Pattern Proposals

Based on analysis of newer AI model outputs, these additional slop patterns should be addressed:

1. **Reasoning Trace Detection and Handling** (new option)
   - Add a configurable option `--remove-reasoning-traces` (enabled by default)
   - Detect sections with reasoning patterns (like those common in Phi and other models)
   - When enabled, completely remove these sections from output
   - When disabled, leave reasoning sections unmodified
   - Implement detection heuristics for phrases like "Let me think", "I can reason through this"

2. **Emoji Handling** (enhanced options)
   - Add `--remove-all-emoji` option (enabled by default) to remove all emoji characters
   - Keep current specific emoji filtering under `--remove-overused-emoji` option
   - Add rules for detecting emoji clusters/overuse

3. **Markdown Formatting Options**
   - Add a `--remove-markdown-formatting` option
   - Preserve structural markdown (headers, lists, code blocks) when enabled
   - Remove inline formatting (bold, italics, strikethrough)
   - Define heuristics for "excessive formatting" (e.g., > 3 formatting elements per paragraph)
   - Option to normalize but not remove formatting (consistent style)

4. **Transitional phrases cleanup**
   - Remove repetitive transitions like "That being said," "Here's why:"
   - Clean up bullet points that start with "Also," or "Alternatively,"
   - Standardize list item prefixes

5. **Punctuation normalization**
   - Reduce multiple exclamation marks to single marks
   - Standardize excessive question marks
   - Fix unbalanced quotes and parentheses

6. **Layout standardization**
   - Normalize inconsistent paragraph spacing
   - Standardize section headings format
   - Create consistent indentation for lists and quoted content

## CLI Configuration Options

Add flag options to allow users to customize slop removal:

```
--skip-char-replacements    Skip character replacements
--skip-phrase-removals      Skip phrase removals
--skip-date-formatting      Skip date/time formatting
--skip-abbreviations        Skip abbreviation handling
--remove-reasoning-traces   Remove reasoning trace sections (default: true)
--remove-all-emoji          Remove all emoji characters (default: true)  
--remove-overused-emoji     Remove only overused emoji (default: false)
--remove-markdown-formatting Remove bold/italics formatting (default: false)
```