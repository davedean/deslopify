/**
 * Layout Standardizer Module
 * 
 * Handles standardizing text layout including paragraph spacing, heading formats,
 * indentation for lists and quotes, while preserving whitespace in code blocks.
 */

export interface LayoutMapping {
  pattern: string | RegExp;
  replacement: string | ((match: string, ...args: any[]) => string);
}

export interface LayoutOptions {
  paragraphSpacing?: 'single' | 'double'; // Number of line breaks between paragraphs
  preserveCodeBlocks?: boolean; // Whether to preserve whitespace in code blocks
  headingStyle?: 'atx' | 'setext'; // Style for markdown headings (atx: #, setext: ===)
  listIndentation?: number; // Number of spaces for list indentation
  quoteIndentation?: number; // Number of spaces for quote indentation
}

export class LayoutStandardizer {
  private mappings: LayoutMapping[];
  private options: LayoutOptions;

  constructor(mappings?: LayoutMapping[], options?: LayoutOptions) {
    this.options = {
      paragraphSpacing: 'single',
      preserveCodeBlocks: true,
      headingStyle: 'atx',
      listIndentation: 2,
      quoteIndentation: 1,
      ...options
    };

    // Default mappings if none provided
    this.mappings = mappings || [
      // Normalize line endings first (not visible in the text but standardizes CRLF/LF)
      {
        pattern: /\r\n/g,
        replacement: '\n'
      },
      
      // Normalize paragraph spacing (multiple blank lines to single/double based on options)
      {
        pattern: /\n{3,}/g,
        replacement: (match) => {
          return this.options.paragraphSpacing === 'double' ? '\n\n\n' : '\n\n';
        }
      },
      
      // Standardize headings format (ensure single space after # in ATX headings)
      {
        pattern: /^(#{1,6})([^#\s])/gm,
        replacement: '$1 $2'
      },
      
      // Fix inconsistent setext headings (==== and ----) to have consistent length
      {
        pattern: /^([^\n]+)\n([=]{2,})$/gm,
        replacement: (match, text) => {
          return this.options.headingStyle === 'atx' 
            ? `# ${text.trim()}`
            : `${text.trim()}\n${'='.repeat(text.trim().length)}`;
        }
      },
      {
        pattern: /^([^\n]+)\n([-]{2,})$/gm,
        replacement: (match, text) => {
          return this.options.headingStyle === 'atx' 
            ? `## ${text.trim()}`
            : `${text.trim()}\n${'-'.repeat(text.trim().length)}`;
        }
      },
      
      // Standardize list indentation (Make sure lists have consistent indentation)
      {
        pattern: /^(\s*)([-*+•])(\s{2,})/gm,
        replacement: (match, indent, bullet) => {
          return `${indent}${bullet} `;
        }
      },
      
      // Create consistent indentation for block quotes
      {
        pattern: /^(\s*)>(\s{2,})/gm,
        replacement: (match, indent) => {
          return `${indent}> `;
        }
      },
      
      // Preserve paragraph breaks (replace with a placeholder and restore)
      {
        pattern: /([^\n])\n\n([^\n])/g,
        replacement: '$1\n[PARAGRAPH_BREAK]\n$2'
      },
      
      // Fix spacing after punctuation (ensure single space after period, comma, etc.)
      {
        pattern: /([.,:;!?])(\s{2,})/g,
        replacement: '$1 '
      },
      
      // Fix spaces between words
      {
        pattern: /(\S)[ \t]{2,}(\S)/g,
        replacement: '$1 $2'
      },
      
      // Fix trailing punctuation whitespace
      {
        pattern: /([.,:;!?])(\s*)$/gm,
        replacement: '$1'
      },
      
      // Restore paragraph breaks
      {
        pattern: /\[PARAGRAPH_BREAK\]/g,
        replacement: '\n\n'
      }
    ];
  }

  /**
   * Add a new layout mapping
   */
  public addMapping(pattern: string | RegExp, replacement: string | ((match: string, ...args: any[]) => string)): void {
    this.mappings.push({ pattern, replacement });
  }

  /**
   * Add multiple layout mappings
   */
  public addMappings(mappings: LayoutMapping[]): void {
    this.mappings.push(...mappings);
  }

  /**
   * Apply all layout standardizations to the input text
   */
  public standardize(text: string): string {
    // If preserve code blocks option is enabled, we need to protect code blocks from modification
    if (this.options.preserveCodeBlocks) {
      return this.processWithCodeBlockPreservation(text);
    }
    
    // Otherwise, apply all mappings directly
    return this.applyMappings(text);
  }

  /**
   * Process text with code block preservation
   */
  private processWithCodeBlockPreservation(text: string): string {
    // Extract code blocks and replace with placeholders
    const codeBlocks: string[] = [];
    const placeholderPattern = '___CODE_BLOCK_PLACEHOLDER_$INDEX___';
    
    // Replace fenced code blocks with placeholders
    let processedText = text.replace(/```[\s\S]*?```/g, (match) => {
      const index = codeBlocks.length;
      codeBlocks.push(match);
      return placeholderPattern.replace('$INDEX', index.toString());
    });
    
    // Replace indented code blocks with placeholders
    processedText = processedText.replace(/(?:^|\n)( {4}[^\n]+(?:\n+ {4}[^\n]+)*)/g, (match, codeBlock) => {
      const index = codeBlocks.length;
      codeBlocks.push(match);
      return placeholderPattern.replace('$INDEX', index.toString());
    });
    
    // Apply standardization mappings to non-code block content
    processedText = this.applyMappings(processedText);
    
    // Extra step to specifically enforce paragraph spacing
    if (this.options.paragraphSpacing === 'double') {
      // Ensure no more than three consecutive newlines (double paragraph spacing)
      processedText = processedText.replace(/\n{4,}/g, '\n\n\n');
    } else {
      // Ensure no more than two consecutive newlines (single paragraph spacing)
      processedText = processedText.replace(/\n{3,}/g, '\n\n');
    }
    
    // Restore code blocks
    for (let i = 0; i < codeBlocks.length; i++) {
      const placeholder = placeholderPattern.replace('$INDEX', i.toString());
      processedText = processedText.replace(placeholder, codeBlocks[i]);
    }
    
    return processedText;
  }

  /**
   * Apply all mappings to the text
   */
  private applyMappings(text: string): string {
    let result = text;
    
    for (const mapping of this.mappings) {
      if (typeof mapping.replacement === 'function') {
        result = result.replace(mapping.pattern, mapping.replacement);
      } else {
        result = result.replace(mapping.pattern, mapping.replacement);
      }
    }
    
    return result;
  }

  /**
   * Set layout options
   */
  public setOptions(options: LayoutOptions): void {
    this.options = {
      ...this.options,
      ...options
    };
    
    // Update paragraph spacing mapping when options change
    this.updateParagraphSpacingMapping();
  }

  /**
   * Update paragraph spacing mapping based on current options
   */
  private updateParagraphSpacingMapping(): void {
    const paragraphMapping = this.mappings.find(m => 
      m.pattern instanceof RegExp && m.pattern.toString() === '/\\n{3,}/g');
    
    if (paragraphMapping) {
      paragraphMapping.replacement = this.options.paragraphSpacing === 'double' ? '\n\n\n' : '\n\n';
    }
  }
}