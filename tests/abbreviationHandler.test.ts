import { AbbreviationHandler } from '../src/modules/abbreviationHandler';

describe('AbbreviationHandler', () => {
  // Include existing tests from modules.test.ts for completeness
  const handler = new AbbreviationHandler();

  test('standardizes time zone abbreviations', () => {
    expect(handler.process('The time zone is utc'))
      .toBe('The time zone is UTC');
  });

  test('respects case for certain terms', () => {
    expect(handler.process('during the vernal equinox'))
      .toBe('during the Vernal Equinox');
    
    expect(handler.process('Vernal equinox occurs in spring'))
      .toBe('Vernal Equinox occurs in Spring');
  });

  test('handles month abbreviations', () => {
    expect(handler.process('jan, feb, mar'))
      .toBe('Jan, Feb, Mar');
  });

  test('handles full month names', () => {
    expect(handler.process('january and february'))
      .toBe('January and February');
  });

  // New tests from CLINE_PLAN.md
  test('should add a custom mapping correctly', () => {
    const customHandler = new AbbreviationHandler();
    customHandler.addMapping(/\bcdt\b/gi, 'CDT', false);
    expect(customHandler.process('The time is 3pm cdt')).toBe('The time is 3pm CDT');
  });

  test('should add multiple mappings at once', () => {
    const customHandler = new AbbreviationHandler();
    customHandler.addMappings([
      { pattern: /\bcdt\b/gi, replacement: 'CDT', preserveCase: false },
      { pattern: /\bmdt\b/gi, replacement: 'MDT', preserveCase: false }
    ]);
    expect(customHandler.process('Times: cdt and mdt')).toBe('Times: CDT and MDT');
  });

  test('should handle preserveCase correctly for custom mappings', () => {
    const customHandler = new AbbreviationHandler();
    customHandler.addMapping(/\b(spring)\b/gi, 'Spring', true);
    
    // Test both lowercase and capitalized versions
    expect(customHandler.process('during the spring')).toBe('during the Spring');
    expect(customHandler.process('Spring begins')).toBe('Spring begins');
  });
});
