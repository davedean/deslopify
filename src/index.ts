/**
 * Deslopifier - Main entry point
 * 
 * Removes/translates common slop output into less slop output
 */

import { CharacterReplacer, CharacterMapping } from './modules/characterReplacer';
import { PhraseRemover, PhrasePattern } from './modules/phraseRemover';
import { DateTimeFormatter, DateTimeMapping } from './modules/dateTimeFormatter';
import { AbbreviationHandler, AbbreviationMapping } from './modules/abbreviationHandler';

export interface DeslopifierOptions {
  customCharacterMappings?: CharacterMapping[];
  customPhrasePatterns?: PhrasePattern[];
  customDateTimeMappings?: DateTimeMapping[];
  customAbbreviationMappings?: AbbreviationMapping[];
  skipCharacterReplacement?: boolean;
  skipPhraseRemoval?: boolean;
  skipDateTimeFormatting?: boolean;
  skipAbbreviationHandling?: boolean;
}

export class Deslopifier {
  private characterReplacer: CharacterReplacer;
  private phraseRemover: PhraseRemover;
  private dateTimeFormatter: DateTimeFormatter;
  private abbreviationHandler: AbbreviationHandler;
  private options: DeslopifierOptions;

  constructor(options: DeslopifierOptions = {}) {
    this.options = options;
    
    // Initialize modules with default or custom mappings
    this.characterReplacer = new CharacterReplacer(options.customCharacterMappings);
    this.phraseRemover = new PhraseRemover(options.customPhrasePatterns);
    this.dateTimeFormatter = new DateTimeFormatter(options.customDateTimeMappings);
    this.abbreviationHandler = new AbbreviationHandler(options.customAbbreviationMappings);
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
    
    // Apply date/time formatting unless disabled
    if (!this.options.skipDateTimeFormatting) {
      result = this.dateTimeFormatter.format(result);
    }
    
    // Apply abbreviation handling unless disabled
    if (!this.options.skipAbbreviationHandling) {
      result = this.abbreviationHandler.process(result);
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
  
  /**
   * Add a custom date/time format mapping
   */
  public addDateTimeMapping(pattern: RegExp, replacement: string | ((match: string, ...args: any[]) => string)): void {
    this.dateTimeFormatter.addMapping(pattern, replacement);
  }
  
  /**
   * Add a custom abbreviation mapping
   */
  public addAbbreviationMapping(pattern: RegExp, replacement: string, preserveCase: boolean = false): void {
    this.abbreviationHandler.addMapping(pattern, replacement, preserveCase);
  }
}

// Default export for easier importing
export default function deslopify(text: string, options: DeslopifierOptions = {}): string {
  const processor = new Deslopifier(options);
  return processor.process(text);
}

// Export types and classes for advanced usage
export { CharacterMapping, PhrasePattern, DateTimeMapping, AbbreviationMapping };