import { PunctuationNormalizer } from '../src/modules/punctuationNormalizer';

describe('PunctuationNormalizer', () => {
  const normalizer = new PunctuationNormalizer();

  test('converts multiple exclamation marks to a single one', () => {
    expect(normalizer.normalize('Wow!!!')).toBe('Wow!');
    expect(normalizer.normalize('Amazing!!!!!')).toBe('Amazing!');
  });

  test('converts multiple question marks to a single one', () => {
    expect(normalizer.normalize('Really???')).toBe('Really?');
    expect(normalizer.normalize('What?????')).toBe('What?');
  });

  test('normalizes mixed exclamation and question marks', () => {
    expect(normalizer.normalize('Seriously?!')).toBe('Seriously?!');
    expect(normalizer.normalize('What?!?!')).toBe('What?!');
    expect(normalizer.normalize('How!?!?')).toBe('How?!');
  });

  test('normalizes ellipsis with more than 3 dots', () => {
    expect(normalizer.normalize('And then........')).toBe('And then...');
    expect(normalizer.normalize('Continue....')).toBe('Continue...');
  });

  test('normalizes multiple dashes', () => {
    expect(normalizer.normalize('Section ---- Title')).toBe('Section - Title');
    expect(normalizer.normalize('Word-------Word')).toBe('Word-Word');
  });

  test('adds missing closing parentheses', () => {
    expect(normalizer.normalize('This is a test (with unbalanced parenthesis')).toBe('This is a test (with unbalanced parenthesis)');
    expect(normalizer.normalize('Nested (example (with) missing')).toBe('Nested (example (with) missing)');
  });

  test('adds missing closing square brackets', () => {
    expect(normalizer.normalize('An [example')).toBe('An [example]');
    expect(normalizer.normalize('[First] and [second')).toBe('[First] and [second]');
  });

  test('adds missing closing curly braces', () => {
    expect(normalizer.normalize('Code block {')).toBe('Code block {}');
    expect(normalizer.normalize('{outer {inner} missing')).toBe('{outer {inner} missing}');
  });

  test('adds missing double quotes', () => {
    expect(normalizer.normalize('He said "hello')).toBe('He said "hello"');
    expect(normalizer.normalize('"First quote" and "second quote')).toBe('"First quote" and "second quote"');
  });

  test('handles custom mappings', () => {
    const customNormalizer = new PunctuationNormalizer([
      { pattern: /\bvery\s+very\b/g, replacement: 'extremely' }
    ]);
    
    expect(customNormalizer.normalize('It was very very good')).toBe('It was extremely good');
  });

  test('balances quotes while recognizing apostrophes', () => {
    expect(normalizer.normalize("It's not the 'complete phrase")).toContain("'complete phrase'");
    expect(normalizer.normalize("Don't add quotes to words like don't and isn't")).toBe("Don't add quotes to words like don't and isn't");
  });

  test('option to disable fixing unbalanced delimiters', () => {
    const noFixNormalizer = new PunctuationNormalizer(undefined, { fixUnbalanced: false });
    expect(noFixNormalizer.normalize('Example (text')).toBe('Example (text');
    expect(noFixNormalizer.normalize('"Quoted text')).toBe('"Quoted text');
  });
});