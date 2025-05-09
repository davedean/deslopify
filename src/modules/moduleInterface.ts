/**
 * TextProcessingModule Interface
 * 
 * Defines a common interface for all text processing modules in the Deslopify project.
 * This standardizes the API across all modules, making the codebase more consistent
 * and easier to maintain.
 */

export interface TextProcessingModule<T = any> {
  /**
   * Process the input text according to the module's rules
   * @param text The input text to process
   * @returns The processed text
   */
  process(text: string): string;
  
  /**
   * Add a new mapping to the module
   * @param pattern The pattern to match (string or RegExp)
   * @param replacement The replacement (string or function)
   * @param args Additional arguments specific to the module
   */
  addMapping(pattern: RegExp | string, replacement: string | Function, ...args: any[]): void;
  
  /**
   * Add multiple mappings at once
   * @param mappings Array of mapping objects specific to the module
   */
  addMappings(mappings: T[]): void;
}
