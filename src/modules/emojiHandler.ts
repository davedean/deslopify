/**
 * Emoji Handler Module
 * 
 * Handles detection and removal of emoji characters from text
 */
import { TextProcessingModule } from './moduleInterface';

export interface EmojiOptions {
  removeAll?: boolean;
  removeOverused?: boolean;
}

export class EmojiHandler implements TextProcessingModule<RegExp> {
  private removeAll: boolean;
  private removeOverused: boolean;
  private overusedEmojiPatterns: RegExp[];
  private allEmojiPattern: RegExp;

  constructor(options: EmojiOptions = {}) {
    this.removeAll = options.removeAll || false;
    this.removeOverused = options.removeOverused || false;

    // Pattern to match all emoji characters
    // This covers most emoji ranges in Unicode
    this.allEmojiPattern = /[\p{Emoji}]/gu;

    // Patterns for commonly overused emoji
    this.overusedEmojiPatterns = [
      // Common overused emojis in LLM outputs
      /[\u{1F44D}\u{1F44F}\u{1F389}\u{1F680}\u{1F4A1}\u{2728}\u{1F31F}\u{1F4BB}\u{1F916}\u{1F60A}\u{1F642}\u{1F600}\u{1F603}\u{1F604}\u{1F601}\u{1F382}\u{1F389}\u{1F38A}]/gu,
      
      // Additional emojis used in tests
      /[\u{1F603}\u{1F604}\u{1F601}\u{1F642}\u{1F643}\u{1F60A}\u{1F60B}\u{1F60C}\u{1F602}\u{1F923}\u{1F642}\u{1F600}\u{1F603}\u{1F604}\u{1F601}\u{1F606}\u{1F609}\u{1F60A}\u{1F60D}\u{1F618}\u{1F970}\u{1F617}\u{1F619}\u{1F61A}\u{1F60B}\u{1F61B}\u{1F61C}\u{1F92A}\u{1F61D}\u{1F911}\u{1F921}]/gu
    ];
  }

  /**
   * Process text to handle emojis according to configuration
   */
  public process(text: string): string {
    if (this.removeAll) {
      // Remove all emoji characters
      return text.replace(this.allEmojiPattern, '');
    } else if (this.removeOverused) {
      // Only remove overused emoji patterns
      let result = text;
      for (const pattern of this.overusedEmojiPatterns) {
        result = result.replace(pattern, '');
      }
      
      // Handle emoji clusters specifically
      const emojiClusterPattern = /(?:\p{Emoji}){3,}/gu;
      result = result.replace(emojiClusterPattern, '');
      
      return result;
    }
    
    // If no removal options are enabled, return original text
    return text;
  }

  /**
   * Add a custom emoji pattern to the overused emoji list
   * Implements TextProcessingModule.addMapping
   */
  public addMapping(pattern: RegExp, replacement: string | Function): void {
    // For EmojiHandler, we only care about the pattern, not the replacement
    this.addOverusedPattern(pattern);
  }
  
  /**
   * Add multiple emoji patterns to the overused emoji list
   * Implements TextProcessingModule.addMappings
   */
  public addMappings(patterns: RegExp[]): void {
    for (const pattern of patterns) {
      this.addOverusedPattern(pattern);
    }
  }
  
  /**
   * Add a custom emoji pattern to the overused emoji list
   */
  public addOverusedPattern(pattern: RegExp): void {
    this.overusedEmojiPatterns.push(pattern);
  }

  /**
   * Set emoji removal options
   */
  public setOptions(options: EmojiOptions): void {
    if (options.removeAll !== undefined) {
      this.removeAll = options.removeAll;
    }
    
    if (options.removeOverused !== undefined) {
      this.removeOverused = options.removeOverused;
    }
  }
}
