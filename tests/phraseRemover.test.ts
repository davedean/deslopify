import { PhraseRemover } from '../src/modules/phraseRemover';

describe('PhraseRemover', () => {
  // Basic functionality tests
  test('removes common AI introduction phrases', () => {
    const remover = new PhraseRemover();
    expect(remover.remove('Certainly! Here is the information.'))
      .toBe('Here is the information.');
    
    expect(remover.remove('I\'d be happy to provide an explanation.'))
      .toBe('provide an explanation.');
  });

  test('handles phrase removal at specific positions', () => {
    const customRemover = new PhraseRemover([
      { pattern: /Testing/, position: 'anywhere' },
      { pattern: /^Start/, position: 'start' },
      { pattern: /End$/, position: 'end' }
    ]);

    expect(customRemover.remove('Start of the Testing sentence End'))
      .toBe(' of the  sentence ');
  });

  // Tests for addPattern method
  test('should add custom phrase pattern at start position', () => {
    const remover = new PhraseRemover();
    remover.addPattern(/^To summarize,/i, 'start');
    expect(remover.remove('To summarize, this is a test.')).toBe(' this is a test.');
  });

  test('should add custom phrase pattern at end position', () => {
    const remover = new PhraseRemover();
    remover.addPattern(/ finally\.$/i, 'end');
    expect(remover.remove('This is a test finally.')).toBe('This is a test');
  });

  test('should add custom phrase pattern at anywhere position', () => {
    const remover = new PhraseRemover();
    remover.addPattern(/\bvery\s+important\b/i, 'anywhere');
    expect(remover.remove('This is a very important point.')).toBe('This is a  point.');
  });

  test('should handle string patterns correctly', () => {
    const remover = new PhraseRemover();
    remover.addPattern('absolutely', 'anywhere');
    expect(remover.remove('This is absolutely fantastic.')).toBe('This is  fantastic.');
  });

  test('should handle multiple custom patterns added individually', () => {
    const remover = new PhraseRemover();
    remover.addPattern(/^In conclusion,/i, 'start');
    remover.addPattern(/\bactually\b/i, 'anywhere');
    remover.addPattern(/ in the end\.$/i, 'end');
    
    expect(remover.remove('In conclusion, this is actually important in the end.'))
      .toBe('this is  important');
  });

  // Tests for addPatterns method
  test('should add multiple patterns at once', () => {
    const remover = new PhraseRemover();
    remover.addPatterns([
      { pattern: /^First,/i, position: 'start' },
      { pattern: /\bbasically\b/i, position: 'anywhere' },
      { pattern: / lastly\.$/i, position: 'end' }
    ]);
    
    expect(remover.remove('First, this is basically important lastly.'))
      .toBe(' this is  important');
  });

  test('should handle complex combinations of patterns', () => {
    const remover = new PhraseRemover();
    
    // Add default patterns
    const defaultRemover = new PhraseRemover();
    
    // Add custom patterns
    remover.addPattern(/^To be honest,/i, 'start');
    remover.addPattern(/\bin my opinion\b/i, 'anywhere');
    
    const input = 'To be honest, I\'d be happy to share in my opinion on this topic.';
    const expected = ' I\'d be happy to share  on this topic.';
    expect(remover.remove(input)).toBe(expected);
  });

  test('should handle patterns with special regex characters', () => {
    const remover = new PhraseRemover();
    remover.addPattern(/\(note: [^)]+\)/i, 'anywhere');
    expect(remover.remove('This (note: very important) point.')).toBe('This  point.');
  });

  test('should handle empty input text', () => {
    const remover = new PhraseRemover();
    remover.addPattern(/test/i, 'anywhere');
    expect(remover.remove('')).toBe('');
  });

  test('should handle input with no matches', () => {
    const remover = new PhraseRemover();
    remover.addPattern(/not present/i, 'anywhere');
    expect(remover.remove('This text has no matches.')).toBe('This text has no matches.');
  });
  
  // Tests specifically targeting branch coverage for RegExp patterns at start and end positions
  test('should handle RegExp patterns at start position', () => {
    const remover = new PhraseRemover();
    // This test specifically targets line 58 in phraseRemover.ts
    const regexPattern = /Hello\s+world/i;
    remover.addPattern(regexPattern, 'start');
    expect(remover.remove('Hello world, how are you?')).toBe(', how are you?');
    expect(remover.remove('hello World is great')).toBe(' is great');
  });

  test('should handle RegExp patterns at end position', () => {
    const remover = new PhraseRemover();
    // This test specifically targets line 65 in phraseRemover.ts
    const regexPattern = /thanks\s+again/i;
    remover.addPattern(regexPattern, 'end');
    expect(remover.remove('This was helpful, thanks again')).toBe('This was helpful, ');
    expect(remover.remove('Please review and THANKS AGAIN')).toBe('Please review and ');
  });
  
  test('should handle string patterns at start and end positions', () => {
    const remover = new PhraseRemover();
    
    // Test string pattern at start position (line 58)
    remover.addPattern('Hello world', 'start');
    expect(remover.remove('Hello world, how are you?')).toBe(', how are you?');
    
    // Test string pattern at end position (line 65)
    remover.addPattern('thank you', 'end');
    expect(remover.remove('This is great, thank you')).toBe('This is great, ');
  });
});
