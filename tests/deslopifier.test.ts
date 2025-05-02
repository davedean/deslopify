import deslopify, { Deslopifier } from '../src/index';

describe('Deslopify', () => {
  describe('Default functionality', () => {
    it('should remove common phrases at the start of text', () => {
      const input = 'Certainly! This is a test.';
      const expected = 'This is a test.';
      expect(deslopify(input)).toBe(expected);
    });

    it('should replace em-dashes with regular dashes with spaces', () => {
      const input = 'This—is a test.';
      const expected = 'This - is a test.';
      expect(deslopify(input)).toBe(expected);
    });

    it('should replace en-dashes with regular dashes with spaces', () => {
      const input = 'This–is a test.';
      const expected = 'This - is a test.';
      expect(deslopify(input)).toBe(expected);
    });

    it('should replace non-standard spaces with regular spaces', () => {
      const input = 'This\u00A0is\u2003a test.';
      const expected = 'This is a test.';
      expect(deslopify(input)).toBe(expected);
    });

    it('should condense multiple spaces into a single space', () => {
      const input = 'This  is    a test.';
      const expected = 'This is a test.';
      expect(deslopify(input)).toBe(expected);
    });

    it('should handle multiple slop patterns in the same text', () => {
      const input = 'Honestly; This—is  a\u00A0test.';
      const expected = 'This - is a test.';
      expect(deslopify(input)).toBe(expected);
    });
    
    it('should normalize excessive punctuation', () => {
      const input = 'This is amazing!!! Is it really???';
      const expected = 'This is amazing! Is it really?';
      expect(deslopify(input)).toBe(expected);
    });
    
    it('should fix unbalanced delimiters', () => {
      const input = 'This is a (parenthetical example with "a quote';
      
      // Just verify that it adds closing parenthesis and quote
      const result = deslopify(input);
      expect(result).toContain(')');
      expect(result).toContain('"a quote"');
    });
  });

  describe('Configuration options', () => {
    it('should skip character replacement when configured', () => {
      const input = 'This—is a test.';
      const expected = 'This—is a test.';
      expect(deslopify(input, { skipCharacterReplacement: true })).toBe(expected);
    });

    it('should skip phrase removal when configured', () => {
      const input = 'Certainly! This is a test.';
      const expected = 'Certainly! This is a test.';
      expect(deslopify(input, { skipPhraseRemoval: true })).toBe(expected);
    });
    
    it('should skip punctuation normalization when configured', () => {
      const input = 'This is amazing!!! Is it really???';
      const expected = 'This is amazing!!! Is it really???';
      expect(deslopify(input, { skipPunctuationNormalization: true })).toBe(expected);
    });
    
    it('should not fix unbalanced delimiters when configured', () => {
      const input = 'This is a (parenthetical example';
      const expected = 'This is a (parenthetical example';
      expect(deslopify(input, { fixUnbalancedDelimiters: false })).toBe(expected);
    });

    it('should use custom character mappings when provided', () => {
      const input = 'This * is a test.';
      const expected = 'This • is a test.';
      const options = {
        customCharacterMappings: [
          { pattern: /\*/g, replacement: '•' }
        ]
      };
      expect(deslopify(input, options)).toBe(expected);
    });

    it('should use custom phrase patterns when provided', () => {
      const input = 'In summary, this is a test.';
      const expected = 'this is a test.';
      const options = {
        customPhrasePatterns: [
          { pattern: /^In summary, /i, position: 'start' as const }
        ]
      };
      expect(deslopify(input, options)).toBe(expected);
    });
    
    it('should use custom punctuation mappings when provided', () => {
      const input = 'Very very exciting.';
      const expected = 'Extremely exciting.';
      const options = {
        customPunctuationMappings: [
          { pattern: /[Vv]ery\s+very\b/g, replacement: 'Extremely' }
        ]
      };
      expect(deslopify(input, options)).toBe(expected);
    });
  });

  describe('Advanced usage', () => {
    it('should allow adding custom mappings after initialization', () => {
      const processor = new Deslopifier();
      processor.addCharacterMapping(/\*/g, '•');
      processor.addPhrasePattern(/^In conclusion, /i, 'start');
      processor.addPunctuationMapping(/\bvery\s+very\b/g, 'extremely');

      const input = 'In conclusion, this * is very very good.';
      const expected = 'this • is extremely good.';
      expect(processor.process(input)).toBe(expected);
    });

    it('should trim leading and trailing whitespace', () => {
      const input = '  This is a test.  ';
      const expected = 'This is a test.';
      expect(deslopify(input)).toBe(expected);
    });
    
    it('should normalize mixed exclamation and question marks', () => {
      const input = 'What!?!?! Really?!?!';
      const expected = 'What?! Really?!';
      expect(deslopify(input)).toBe(expected);
    });
    
    it('should normalize ellipsis with too many dots', () => {
      const input = 'And then.......... it stopped.';
      const expected = 'And then... it stopped.';
      expect(deslopify(input)).toBe(expected);
    });
  });
});