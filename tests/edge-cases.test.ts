import deslopify from '../src/index';

describe('Edge Cases', () => {
  test('handles empty input', () => {
    expect(deslopify('')).toBe('');
  });
  
  test('handles extremely long input text', () => {
    // Generate a very long text with repeated patterns
    const longText = 'This is a test. '.repeat(1000);
    
    // Should process without errors or excessive time
    expect(() => deslopify(longText)).not.toThrow();
    expect(deslopify(longText)).toBe('This is a test. '.repeat(1000).trim());
  });

  test('handles various Unicode characters correctly', () => {
    const input = 'Unicode test: ♠ ♥ ♦ ♣ ★ ☆ ☺ ☻ ♂ ♀ ♪ ♫ ☼ ↕ ‼ ¶ § ▬ ↨ ↑ ↓ → ← ∟ ↔ ▲ ▼';
    const result = deslopify(input);
    
    // Verify that technical symbols are preserved
    expect(result).toContain('♠ ♥ ♦ ♣');
    expect(result).toContain('§');  // Section symbol should be preserved
  });

  test('handles malformed or incomplete text', () => {
    const inputs = [
      'Unbalanced "quote',
      'Unbalanced (parenthesis',
      'Text with\nunbalanced\ncode ```block',
      'Text with incomplete list:\n• Item 1\n•'
    ];
    
    // Should process all without errors
    inputs.forEach(input => {
      expect(() => deslopify(input)).not.toThrow();
    });
    
    // Check specific fixes
    expect(deslopify('Unbalanced "quote')).toContain('"quote"');
    expect(deslopify('Unbalanced (parenthesis')).toContain('(parenthesis)');
  });
  
  test('handles text with mixed encodings', () => {
    // Text with a mix of ASCII, Latin-1, and Unicode characters
    const input = 'Café Résumé • Naïve';
    expect(() => deslopify(input)).not.toThrow();
    
    // Verify diacritics are preserved
    const result = deslopify(input);
    expect(result).toContain('Café');
    expect(result).toContain('Résumé');
    expect(result).toContain('Naïve');
  });
  
  test('handles text with control characters', () => {
    // Text with control characters like tabs, form feeds, etc.
    const input = 'Line 1\tTabbed\fForm feed\vVertical tab\bBackspace';
    expect(() => deslopify(input)).not.toThrow();
  });
});
