/**
 * Deslopifier - Main entry point
 * 
 * Removes/translates common slop output into less slop output
 */

import { CharacterReplacer, CharacterMapping } from './modules/characterReplacer';
import { PhraseRemover, PhrasePattern } from './modules/phraseRemover';

export interface DeslopifierOptions {
  customCharacterMappings?: CharacterMapping[];
  customPhrasePatterns?: PhrasePattern[];
  skipCharacterReplacement?: boolean;
  skipPhraseRemoval?: boolean;
}

export class Deslopifier {
  private characterReplacer: CharacterReplacer;
  private phraseRemover: PhraseRemover;
  private options: DeslopifierOptions;

  constructor(options: DeslopifierOptions = {}) {
    this.options = options;
    
    // Initialize modules with default or custom mappings
    this.characterReplacer = new CharacterReplacer(options.customCharacterMappings);
    this.phraseRemover = new PhraseRemover(options.customPhrasePatterns);
  }

  /**
   * Process text through the deslopifier pipeline
   */
  public process(text: string): string {
    let result = text;
    
    // Apply character replacements unless disabled
    if (!this.options.skipCharacterReplacement) {
      result = this.characterReplacer.replace(result);
    }
    
    // Apply phrase removals unless disabled
    if (!this.options.skipPhraseRemoval) {
      result = this.phraseRemover.remove(result);
    }
    
    // Trim any leading/trailing whitespace
    return result.trim();
  }

  /**
   * Add a custom character mapping
   */
  public addCharacterMapping(pattern: string | RegExp, replacement: string): void {
    this.characterReplacer.addMapping(pattern, replacement);
  }

  /**
   * Add a custom phrase pattern to remove
   */
  public addPhrasePattern(pattern: string | RegExp, position: 'start' | 'end' | 'anywhere'): void {
    this.phraseRemover.addPattern(pattern, position);
  }
}

// Default export for easier importing
export default function deslopify(text: string, options: DeslopifierOptions = {}): string {
  const processor = new Deslopifier(options);
  return processor.process(text);
}

// Export types and classes for advanced usage
export { CharacterMapping, PhrasePattern };