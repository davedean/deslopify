import { DateTimeFormatter } from '../src/modules/dateTimeFormatter';

describe('DateTimeFormatter', () => {
  // Basic functionality tests
  test('standardizes date formats', () => {
    const formatter = new DateTimeFormatter();
    expect(formatter.format('The date is 12/25/2024'))
      .toBe('The date is 2024-12-25');
  });

  test('preserves month name date formats', () => {
    const formatter = new DateTimeFormatter();
    expect(formatter.format('Event on 20 March 2024'))
      .toBe('Event on 20 March 2024');
    
    expect(formatter.format('Due by 15 Dec 2024'))
      .toBe('Due by 15 Dec 2024');
  });

  test('standardizes time with AM/PM', () => {
    const formatter = new DateTimeFormatter();
    expect(formatter.format('Meeting at 3:30PM'))
      .toBe('Meeting at 3:30 PM');
  });

  test('standardizes time zones', () => {
    const formatter = new DateTimeFormatter();
    expect(formatter.format('Call at 14:30EST'))
      .toBe('Call at 14:30 EST');
  });

  // Tests for addMapping method
  test('should add custom date format mapping with string replacement', () => {
    const formatter = new DateTimeFormatter();
    formatter.addMapping(/(\d{2})\.(\d{2})\.(\d{4})/g, '$3-$2-$1');
    expect(formatter.format('Date: 31.12.2023')).toBe('Date: 2023-12-31');
  });

  test('should add custom date format mapping with function replacement', () => {
    const formatter = new DateTimeFormatter();
    formatter.addMapping(
      /(\d{2})\/(\d{2})\/(\d{2})/g, 
      (match, month, day, year) => `20${year}-${month}-${day}`
    );
    expect(formatter.format('Date: 12/31/23')).toBe('Date: 2023-12-31');
  });

  test('should apply custom mapping after default mappings', () => {
    const formatter = new DateTimeFormatter();
    // Add a mapping that will transform the output of a default mapping
    formatter.addMapping(/(\d{4})-(\d{2})-(\d{2})/g, '$1/$2/$3');
    
    // The default mapping will first convert MM/DD/YYYY to YYYY-MM-DD
    // Then our custom mapping will convert YYYY-MM-DD to YYYY/MM/DD
    expect(formatter.format('Date: 12/31/2023')).toBe('Date: 2023/12/31');
  });

  // Tests for addMappings method
  test('should add multiple mappings at once', () => {
    const formatter = new DateTimeFormatter();
    formatter.addMappings([
      {
        pattern: /(\d{2})\.(\d{2})\.(\d{4})/g,
        replacement: '$3-$2-$1'
      },
      {
        pattern: /(\d{1,2}):(\d{2})([ap]m)/gi,
        replacement: '$1:$2 $3'
      }
    ]);
    
    expect(formatter.format('Date: 31.12.2023 at 2:30pm')).toBe('Date: 2023-12-31 at 2:30 pm');
  });

  test('should handle complex date-time format conversions', () => {
    const formatter = new DateTimeFormatter();
    formatter.addMapping(
      /(\d{1,2})\/(\d{1,2})\/(\d{4})\s+at\s+(\d{1,2}):(\d{2})([ap]m)/gi,
      (match, month, day, year, hour, minute, ampm) => {
        const m = month.padStart(2, '0');
        const d = day.padStart(2, '0');
        return `${year}-${m}-${d} ${hour}:${minute} ${ampm.toUpperCase()}`;
      }
    );
    
    expect(formatter.format('Meeting on 5/15/2024 at 3:30pm'))
      .toBe('Meeting on 2024-05-15 at 3:30 pm');
  });

  test('should preserve specific date formats when using function replacement', () => {
    const formatter = new DateTimeFormatter();
    formatter.addMapping(
      /\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\b/gi,
      (match) => {
        // Preserve the format but capitalize the month
        return match.replace(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i, 
          (m) => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase());
      }
    );
    
    expect(formatter.format('Due on 15 jan 2024')).toBe('Due on 15 Jan 2024');
    expect(formatter.format('Due on 15 JAN 2024')).toBe('Due on 15 Jan 2024');
  });
});
