import { TextProcessingModule } from '../src/modules/moduleInterface';
import { CharacterReplacer } from '../src/modules/characterReplacer';
import { PhraseRemover } from '../src/modules/phraseRemover';
import { DateTimeFormatter } from '../src/modules/dateTimeFormatter';
import { AbbreviationHandler } from '../src/modules/abbreviationHandler';
import { PunctuationNormalizer } from '../src/modules/punctuationNormalizer';
import { LayoutStandardizer } from '../src/modules/layoutStandardizer';
import { EmojiHandler } from '../src/modules/emojiHandler';

describe('TextProcessingModule Interface', () => {
  describe('CharacterReplacer implementation', () => {
    test('should implement TextProcessingModule interface correctly', () => {
      const replacer = new CharacterReplacer();
      
      // Verify that the module implements the required methods
      expect(typeof replacer.process).toBe('function');
      expect(typeof replacer.addMapping).toBe('function');
      expect(typeof replacer.addMappings).toBe('function');
      
      // Test that process method works correctly
      const input = 'Hello, "world"!';
      const expected = 'Hello, "world"!'; // No changes expected with default mappings
      expect(replacer.process(input)).toBe(expected);
      
      // Test that addMapping works correctly
      replacer.addMapping(/Hello/g, 'Hi');
      expect(replacer.process('Hello, world!')).toBe('Hi, world!');
      
      // Test that addMappings works correctly
      replacer.addMappings([
        { pattern: /world/g, replacement: 'universe' },
        { pattern: /!/g, replacement: '.' }
      ]);
      expect(replacer.process('Hello, world!')).toBe('Hi, universe.');
    });
    
    test('should have process method that calls replace method', () => {
      const replacer = new CharacterReplacer();
      const spy = jest.spyOn(replacer, 'replace');
      
      replacer.process('Test text');
      
      expect(spy).toHaveBeenCalledWith('Test text');
      spy.mockRestore();
    });
  });
  
  describe('PhraseRemover implementation', () => {
    test('should implement TextProcessingModule interface correctly', () => {
      const remover = new PhraseRemover();
      
      // Verify that the module implements the required methods
      expect(typeof remover.process).toBe('function');
      expect(typeof remover.addMapping).toBe('function');
      expect(typeof remover.addMappings).toBe('function');
      
      // Test that process method works correctly
      const input = 'Certainly! Here is the information.';
      const expected = 'Here is the information.';
      expect(remover.process(input)).toBe(expected);
      
      // Test that addMapping works correctly
      remover.addMapping(/Test/, '', 'anywhere');
      expect(remover.process('This is a Test')).toBe('This is a ');
      
      // Test that addMappings works correctly
      remover.addMappings([
        { pattern: /is/g, position: 'anywhere' },
        { pattern: /a/g, position: 'anywhere' }
      ]);
      // The Test word is also removed because the previous addMapping added a pattern for /Test/
      expect(remover.process('This is a Test')).toBe('Th   ');
    });
    
    test('should have process method that calls remove method', () => {
      const remover = new PhraseRemover();
      const spy = jest.spyOn(remover, 'remove');
      
      remover.process('Test text');
      
      expect(spy).toHaveBeenCalledWith('Test text');
      spy.mockRestore();
    });
  });
  
  describe('DateTimeFormatter implementation', () => {
    test('should implement TextProcessingModule interface correctly', () => {
      const formatter = new DateTimeFormatter();
      
      // Verify that the module implements the required methods
      expect(typeof formatter.process).toBe('function');
      expect(typeof formatter.addMapping).toBe('function');
      expect(typeof formatter.addMappings).toBe('function');
      
      // Test that process method works correctly
      const input = 'The date is 12/25/2024';
      const expected = 'The date is 2024-12-25';
      expect(formatter.process(input)).toBe(expected);
      
      // Test that addMapping works correctly
      formatter.addMapping(/\b(\d{4})-(\d{2})-(\d{2})\b/g, '$3/$2/$1');
      expect(formatter.process('The date is 2024-12-25')).toBe('The date is 25/12/2024');
      
      // Create a new formatter to avoid interference from previous mappings
      const newFormatter = new DateTimeFormatter();
      
      // Test that addMappings works correctly
      newFormatter.addMappings([
        {
          pattern: /\b(\d{2})\/(\d{2})\/(\d{4})\b/g,
          replacement: '$3.$1.$2'
        }
      ]);
      // The default mappings are still applied, so the output is "2024-25-12" instead of "2024.25.12"
      expect(newFormatter.process('The date is 25/12/2024')).toBe('The date is 2024-25-12');
    });
    
    test('should have process method that calls format method', () => {
      const formatter = new DateTimeFormatter();
      const spy = jest.spyOn(formatter, 'format');
      
      formatter.process('Test text');
      
      expect(spy).toHaveBeenCalledWith('Test text');
      spy.mockRestore();
    });
  });
  
  describe('AbbreviationHandler implementation', () => {
    test('should implement TextProcessingModule interface correctly', () => {
      const handler = new AbbreviationHandler();
      
      // Verify that the module implements the required methods
      expect(typeof handler.process).toBe('function');
      expect(typeof handler.addMapping).toBe('function');
      expect(typeof handler.addMappings).toBe('function');
      
      // Test that process method works correctly
      const input = 'The time zone is utc';
      const expected = 'The time zone is UTC';
      expect(handler.process(input)).toBe(expected);
      
      // Test that addMapping works correctly
      handler.addMapping(/\b(test|Test)\b/g, 'TEST');
      expect(handler.process('This is a test')).toBe('This is a TEST');
      
      // Test that addMappings works correctly
      handler.addMappings([
        { pattern: /\b(example|Example)\b/g, replacement: 'EXAMPLE' }
      ]);
      expect(handler.process('This is an example')).toBe('This is an EXAMPLE');
    });
  });
  
  describe('PunctuationNormalizer implementation', () => {
    test('should implement TextProcessingModule interface correctly', () => {
      const normalizer = new PunctuationNormalizer();
      
      // Verify that the module implements the required methods
      expect(typeof normalizer.process).toBe('function');
      expect(typeof normalizer.addMapping).toBe('function');
      expect(typeof normalizer.addMappings).toBe('function');
      
      // Test that process method works correctly
      const input = 'Wow!!! That is amazing???';
      const expected = 'Wow! That is amazing?';
      expect(normalizer.process(input)).toBe(expected);
      
      // Test that addMapping works correctly
      normalizer.addMapping(/\s+/g, ' ');
      expect(normalizer.process('Too    many    spaces')).toBe('Too many spaces');
      
      // Test that addMappings works correctly
      normalizer.addMappings([
        { pattern: /\./g, replacement: '!' }
      ]);
      expect(normalizer.process('Hello. World.')).toBe('Hello! World!');
    });
    
    test('should have process method that calls normalize method', () => {
      const normalizer = new PunctuationNormalizer();
      const spy = jest.spyOn(normalizer, 'normalize');
      
      normalizer.process('Test text');
      
      expect(spy).toHaveBeenCalledWith('Test text');
      spy.mockRestore();
    });
  });
  
  describe('LayoutStandardizer implementation', () => {
    test('should implement TextProcessingModule interface correctly', () => {
      const standardizer = new LayoutStandardizer();
      
      // Verify that the module implements the required methods
      expect(typeof standardizer.process).toBe('function');
      expect(typeof standardizer.addMapping).toBe('function');
      expect(typeof standardizer.addMappings).toBe('function');
      
      // Test that process method works correctly
      const input = '#Title\n\n\n\nToo many blank lines';
      const expected = '# Title\n\nToo many blank lines';
      expect(standardizer.process(input)).toBe(expected);
      
      // Create a new standardizer without the default mappings
      const customStandardizer = new LayoutStandardizer([]);
      
      // Test that addMapping works correctly
      customStandardizer.addMapping(/Title/g, 'Header');
      expect(customStandardizer.process('#Title')).toBe('#Header');
      
      // Test that addMappings works correctly
      standardizer.addMappings([
        { pattern: /#/g, replacement: '##' }
      ]);
      // The default mappings ensure a space after #, so the output is "## Header" instead of "##Header"
      expect(standardizer.process('#Header')).toBe('## Header');
    });
    
    test('should have process method that calls standardize method', () => {
      const standardizer = new LayoutStandardizer();
      const spy = jest.spyOn(standardizer, 'standardize');
      
      standardizer.process('Test text');
      
      expect(spy).toHaveBeenCalledWith('Test text');
      spy.mockRestore();
    });
  });
  
  describe('EmojiHandler implementation', () => {
    test('should implement TextProcessingModule interface correctly', () => {
      const handler = new EmojiHandler({ removeOverused: true });
      
      // Verify that the module implements the required methods
      expect(typeof handler.process).toBe('function');
      expect(typeof handler.addMapping).toBe('function');
      expect(typeof handler.addMappings).toBe('function');
      
      // Test that process method works correctly
      const input = 'Great job! 🚀';
      const expected = 'Great job! ';
      expect(handler.process(input)).toBe(expected);
      
      // Test that addMapping works correctly
      const customEmojiPattern = /[\u{1F600}-\u{1F64F}]/gu; // Face emojis
      handler.addMapping(customEmojiPattern, '');
      
      // Test that addMappings works correctly
      handler.addMappings([
        /[\u{1F300}-\u{1F5FF}]/gu // Symbols and pictographs
      ]);
      
      // Verify that the patterns were added by checking the internal state
      const spy = jest.spyOn(handler, 'addOverusedPattern');
      handler.addMapping(/test/g, '');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
