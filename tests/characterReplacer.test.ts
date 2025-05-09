import { CharacterReplacer } from '../src/modules/characterReplacer';

describe('CharacterReplacer', () => {
  // Include existing tests from modules.test.ts for completeness
  const replacer = new CharacterReplacer();

  test('converts bullet points to markdown list signifiers', () => {
    expect(replacer.replace('• First item\n○ Second item\n▪ Third item'))
      .toBe('- First item\n- Second item\n- Third item');
  });

  test('preserves technical characters', () => {
    expect(replacer.replace('Temperature: 23.5 ± 0.2 °C'))
      .toBe('Temperature: 23.5 ± 0.2 °C');
  });

  test('handles emoji removal', () => {
    expect(replacer.replace('Great job! 🚀'))
      .toBe('Great job! ');
  });
  
  test('converts smart quotes to normal quotes', () => {
    const input = '\u201CSmart double quotes\u201D and \u2018smart single quotes\u2019';
    expect(replacer.replace(input))
      .toBe('"Smart double quotes" and \'smart single quotes\'');
  });

  // New test from CLINE_PLAN.md
  test('should add multiple mappings at once', () => {
    const customReplacer = new CharacterReplacer();
    customReplacer.addMappings([
      { pattern: /\*/g, replacement: '•' },
      { pattern: /#/g, replacement: '№' }
    ]);
    expect(customReplacer.replace('Test * and #')).toBe('Test • and №');
  });
  
  test('should handle function-based replacements', () => {
    const customReplacer = new CharacterReplacer();
    customReplacer.addMapping(/\d+/g, (match) => `[${match}]`);
    expect(customReplacer.replace('Numbers: 123 and 456')).toBe('Numbers: [123] and [456]');
  });
});
