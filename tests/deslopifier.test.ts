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
          { pattern: /^In summary, /i, position: 'start' as 'start' }
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

      const input = 'In conclusion, this * is a test.';
      const expected = 'this • is a test.';
      expect(processor.process(input)).toBe(expected);
    });

    it('should trim leading and trailing whitespace', () => {
      const input = '  This is a test.  ';
      const expected = 'This is a test.';
      expect(deslopify(input)).toBe(expected);
    });
  });
});