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
      { pattern: /[\u{1F31F}\u{1F680}\u{2728}\u{1F4A1}\u{1F64C}\u{1F4C8}]/gu, replacement: '' },
      // Fix incorrect spacing before percent sign
      { pattern: / %/g, replacement: '%' },
      // Handle em dash (—) and en dash (–) based on context
      // For tests, replace with "regular" dashes with spaces
      { pattern: /([^\s])\u2014([^\s])/g, replacement: '$1 - $2' },
      { pattern: /([^\s])\u2013([^\s])/g, replacement: '$1 - $2' },
      // Em dash with spaces on both sides: keep spaces but replace with regular dash
      { pattern: / \u2014 /g, replacement: ' - ' },
      // Em dash at start of word: add space before dash
      { pattern: /\u2014([^\s])/g, replacement: '- $1' },
      // Em dash at end of word: add space after dash
      { pattern: /([^\s])\u2014/g, replacement: '$1 -' },
      // En dash with spaces: replace with regular dash
      { pattern: / \u2013 /g, replacement: ' - ' },
      // En dash without spaces in other contexts: add spaces around dash
      { pattern: /\u2013/g, replacement: ' - ' },
      
      // Convert smart (curly) quotes to normal (straight) quotes
      { pattern: /[\u201C\u201D]/g, replacement: '"' }, // Convert left and right double quotes to straight quotes
      { pattern: /[\u2018\u2019]/g, replacement: '\'' }, // Convert left and right single quotes to straight quotes
      
      // Convert bullet points and list markers to markdown standard list signifiers
      { pattern: /^(\s*)•\s+/gm, replacement: '$1- ' }, // Convert bullet point to markdown hyphen
      { pattern: /^(\s*)·\s+/gm, replacement: '$1- ' }, // Convert middle dot to markdown hyphen
      { pattern: /^(\s*)○\s+/gm, replacement: '$1- ' }, // Convert circle bullet to markdown hyphen
      { pattern: /^(\s*)▪\s+/gm, replacement: '$1- ' }, // Convert square bullet to markdown hyphen
      { pattern: /^(\s*)▫\s+/gm, replacement: '$1- ' }, // Convert white square bullet to markdown hyphen
      { pattern: /^(\s*)➢\s+/gm, replacement: '$1- ' }, // Convert right arrowhead to markdown hyphen
      { pattern: /^(\s*)➤\s+/gm, replacement: '$1- ' }, // Convert right-pointing triangle to markdown hyphen
      { pattern: /^(\s*)★\s+/gm, replacement: '$1- ' }, // Convert star to markdown hyphen
      { pattern: /^(\s*)✓\s+/gm, replacement: '$1- ' }, // Convert checkmark to markdown hyphen
      { pattern: /^(\s*)✔\s+/gm, replacement: '$1- ' }, // Convert heavy checkmark to markdown hyphen
      { pattern: /^(\s*)◦\s+/gm, replacement: '$1- ' }, // Convert white bullet to markdown hyphen
      { pattern: /^(\s*)◆\s+/gm, replacement: '$1- ' }, // Convert black diamond to markdown hyphen
      { pattern: /^(\s*)◇\s+/gm, replacement: '$1- ' }, // Convert white diamond to markdown hyphen
      { pattern: /^(\s*)►\s+/gm, replacement: '$1- ' }, // Convert black right-pointing pointer to markdown hyphen
      { pattern: /^(\s*)❖\s+/gm, replacement: '$1- ' }, // Convert black diamond minus white X to markdown hyphen
      { pattern: /^(\s*)⦿\s+/gm, replacement: '$1- ' }, // Convert circled bullet to markdown hyphen
      { pattern: /^(\s*)⁃\s+/gm, replacement: '$1- ' }, // Convert hyphen bullet to markdown hyphen
      
      // Preserve technical/scientific characters
      // These patterns match these symbols but don't replace them - acting as a passthrough
      { pattern: /[±§µ°′″′″]/g, replacement: function(match: string): string { return match; } },
      
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
