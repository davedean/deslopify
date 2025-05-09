/**
 * Date Time Formatter Module
 * 
 * Handles standardizing date and time formats in text
 */
import { TextProcessingModule } from './moduleInterface';

export interface DateTimeMapping {
  pattern: RegExp;
  replacement: string | ((match: string, ...args: any[]) => string);
}

export class DateTimeFormatter implements TextProcessingModule<DateTimeMapping> {
  private mappings: DateTimeMapping[];

  constructor(mappings?: DateTimeMapping[]) {
    // Default mappings if none provided
    this.mappings = mappings || [
      // Standardize date formats (MM/DD/YYYY to YYYY-MM-DD)
      {
        pattern: /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g,
        replacement: (match, month, day, year) => {
          const m = month.padStart(2, '0');
          const d = day.padStart(2, '0');
          return `${year}-${m}-${d}`;
        }
      },
      
      // Handle date formats with month names
      // e.g., "20 March 2024" remains as is
      {
        pattern: /\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b/gi,
        replacement: (match, day, month, year) => {
          return match; // Keep as is - these are already readable
        }
      },
      
      // Handle common date formats with month abbreviations
      // e.g., "20 Mar 2024" remains as is
      {
        pattern: /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\b/gi,
        replacement: (match, day, month, year) => {
          return match; // Keep as is - these are already readable
        }
      },
      
      // Standardize 12-hour time format by ensuring space between time and AM/PM
      // e.g., "3:45PM" -> "3:45 PM"
      {
        pattern: /(\d{1,2}:\d{2})([AP]M)/gi,
        replacement: '$1 $2'
      },
      
      // Standardize time zones by ensuring space before abbreviation
      // e.g., "15:30EST" -> "15:30 EST"
      {
        pattern: /(\d{1,2}:\d{2})([A-Z]{3,4})/g,
        replacement: '$1 $2'
      },
      
      // Preserve common time zone abbreviations
      {
        pattern: /\b(UTC|GMT|EST|CST|MST|PST|CET|CEST|EET|IST|JST|AEST|WET|WEST)\b/g,
        replacement: (match) => match
      }
    ];
  }

  /**
   * Add a new date/time format mapping
   */
  public addMapping(pattern: RegExp, replacement: string | ((match: string, ...args: any[]) => string)): void {
    this.mappings.push({ pattern, replacement });
  }

  /**
   * Add multiple date/time format mappings
   */
  public addMappings(mappings: DateTimeMapping[]): void {
    this.mappings.push(...mappings);
  }

  /**
   * Process the input text by applying all date/time format standardizations
   * Implements TextProcessingModule.process
   */
  public process(text: string): string {
    return this.format(text);
  }
  
  /**
   * Apply all date/time format standardizations to the input text
   */
  public format(text: string): string {
    let result = text;
    
    for (const mapping of this.mappings) {
      result = result.replace(mapping.pattern, mapping.replacement as any);
    }
    
    return result;
  }
}
