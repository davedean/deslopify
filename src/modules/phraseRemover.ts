/**
 * Phrase Remover Module
 * 
 * Handles removing common phrases that add "slop" to the text
 */

export interface PhrasePattern {
  pattern: string | RegExp;
  position: 'start' | 'end' | 'anywhere';
}

export class PhraseRemover {
  private patterns: PhrasePattern[];

  constructor(patterns?: PhrasePattern[]) {
    // Default patterns if none provided
    this.patterns = patterns || [
      // Remove common AI introduction slop
      { pattern: /^Certainly! /i, position: 'start' },
      { pattern: /^I'd be happy to /i, position: 'start' },
      { pattern: /^I'll help you /i, position: 'start' },
      { pattern: /^Hey there,? /i, position: 'start' },
      { pattern: /^In conclusion,? /i, position: 'start' },
      
      // Remove common filler phrases
      { pattern: /super thrilled|incredible journey/i, position: 'anywhere' },
      { pattern: /quick deep dive/i, position: 'anywhere' },
      { pattern: /But wait, there's more!/i, position: 'anywhere' },
      { pattern: /—and this is crucial—/i, position: 'anywhere' },
      { pattern: /–and this is crucial–/i, position: 'anywhere' }
    ];
  }

  /**
   * Add a new phrase pattern to remove
   */
  public addPattern(pattern: string | RegExp, position: 'start' | 'end' | 'anywhere'): void {
    this.patterns.push({ pattern, position });
  }

  /**
   * Add multiple phrase patterns
   */
  public addPatterns(patterns: PhrasePattern[]): void {
    this.patterns.push(...patterns);
  }

  /**
   * Remove all matching phrases from the input text based on their position
   */
  public remove(text: string): string {
    let result = text;
    
    for (const { pattern, position } of this.patterns) {
      if (position === 'start') {
        // Create a regex that only matches at the start of the text
        const startPattern = pattern instanceof RegExp 
          ? new RegExp(`^${pattern.source}`, pattern.flags)
          : new RegExp(`^${pattern}`);
        
        result = result.replace(startPattern, '');
      } else if (position === 'end') {
        // Create a regex that only matches at the end of the text
        const endPattern = pattern instanceof RegExp
          ? new RegExp(`${pattern.source}$`, pattern.flags)
          : new RegExp(`${pattern}$`);
        
        result = result.replace(endPattern, '');
      } else {
        // Replace anywhere in the text
        result = result.replace(pattern, '');
      }
    }
    
    return result;
  }
}