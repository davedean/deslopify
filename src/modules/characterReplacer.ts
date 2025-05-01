/**
 * Character Replacer Module
 * 
 * Handles replacing problematic characters with their clean equivalents
 */

export interface CharacterMapping {
  pattern: string | RegExp;
  replacement: string | ((match: string) => string);
}

export class CharacterReplacer {
  private mappings: CharacterMapping[];

  constructor(mappings?: CharacterMapping[]) {
    // Default mappings if none provided
    this.mappings = mappings || [
      // Handle emojis
      { pattern: /[🌟🚀✨💡🙌📈]/g, replacement: '' },
      // Fix incorrect spacing before percent sign
      { pattern: / %/g, replacement: '%' },
      // Handle em dash (—) and en dash (–) based on context
      // Em dash with spaces on both sides: keep spaces but replace with en dash 
      { pattern: / \u2014 /g, replacement: ' – ' },
      // Em dash attached to words: replace with en dash without spaces
      { pattern: /([^\s])\u2014([^\s])/g, replacement: '$1–$2' },
      // Em dash at start of word: keep attached to word but use en dash
      { pattern: /\u2014([^\s])/g, replacement: '–$1' },
      // Em dash at end of word: keep attached to word but use en dash
      { pattern: /([^\s])\u2014/g, replacement: '$1–' },
      // En dash with spaces: preserve as is
      { pattern: / \u2013 /g, replacement: ' – ' },
      // En dash without spaces: preserve as is
      { pattern: /\u2013/g, replacement: '–' },
      
      // Replace non-standard spaces with regular spaces
      { pattern: /\u00A0/g, replacement: ' ' }, // non-breaking space
      { pattern: /\u2002/g, replacement: ' ' }, // en space
      { pattern: /\u2003/g, replacement: ' ' }, // em space
      { pattern: /\u2004/g, replacement: ' ' }, // three-per-em space
      { pattern: /\u2005/g, replacement: ' ' }, // four-per-em space
      { pattern: /\u2006/g, replacement: ' ' }, // six-per-em space
      { pattern: /\u2007/g, replacement: ' ' }, // figure space
      { pattern: /\u2008/g, replacement: ' ' }, // punctuation space
      { pattern: /\u2009/g, replacement: ' ' }, // thin space
      { pattern: /\u200A/g, replacement: ' ' }, // hair space
      { pattern: /\u200B/g, replacement: '' },  // zero-width space
      { pattern: /\u3000/g, replacement: ' ' }, // ideographic space
      
      // Better handling of multiple spaces - replace 2+ spaces with a single space
      // But exclude spaces at the beginning of lines (to preserve indentation)
      // This matches only multiple spaces that aren't at the beginning of a line
      { pattern: /(?<=\S) {2,}(?=\S)/g, replacement: ' ' }, // Between words
      { pattern: /(?<=\S) {2,}$/gm, replacement: ' ' }, // At end of line after a word
      { pattern: /^ +(?=\S)/gm, replacement: function(match: string): string { return match; } } // Preserve indentation
    ];
  }

  /**
   * Add a new character mapping
   */
  public addMapping(pattern: string | RegExp, replacement: string | ((match: string) => string)): void {
    this.mappings.push({ pattern, replacement });
  }

  /**
   * Add multiple character mappings
   */
  public addMappings(mappings: CharacterMapping[]): void {
    this.mappings.push(...mappings);
  }

  /**
   * Apply all character replacements to the input text
   */
  public replace(text: string): string {
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
}