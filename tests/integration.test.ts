import fs from 'fs';
import path from 'path';
import deslopify, { Deslopifier } from '../src/index';

describe('Integration Tests', () => {
  test('processes complex text through the entire pipeline', () => {
    const input = `Certainly! Here's an example—with various slop patterns!!!

• First item with extra  spaces
• Second item with emoji 🚀

The date is 12/25/2024 at 3:30pm est.`;

    const result = deslopify(input, { 
      emojiOptions: { removeAll: true } 
    });

    // Test specific transformations rather than exact output
    expect(result).not.toContain('Certainly!');
    expect(result).toContain('Here\'s an example - with various slop patterns!');
    expect(result).not.toContain('•');
    expect(result).toContain('- First item with extra spaces');
    expect(result).not.toContain('🚀');
    expect(result).toContain('EST'); // Check that EST is uppercase
  });

  test('handles real-world AI output samples', () => {
    // Use one of the sample files
    const samplePath = path.join(__dirname, '..', 'samples', 'sample-o3.txt');
    const sampleText = fs.readFileSync(samplePath, 'utf8');
    const result = deslopify(sampleText);
    
    // Verify key transformations
    expect(result).not.toContain('🌟');
    expect(result).not.toContain('🚀');
    expect(result).not.toContain('!!!');
    expect(result).not.toContain('—'); // Em dash should be replaced
    expect(result).toContain('-'); // Should contain regular dash
    
    // Verify bullet points are standardized if present
    expect(result).not.toContain('•');
    
    // Verify percentage formatting
    expect(result).not.toContain('700 %');
    expect(result).toContain('700%');
  });
  
  test('processes all sample files without errors', () => {
    const samplesDir = path.join(__dirname, '..', 'samples');
    const sampleFiles = fs.readdirSync(samplesDir)
      .filter(file => file.endsWith('.txt'))
      .map(file => path.join(samplesDir, file));
    
    for (const file of sampleFiles) {
      const content = fs.readFileSync(file, 'utf8');
      expect(() => deslopify(content)).not.toThrow();
    }
  });
  
  test('applies all modules in correct sequence', () => {
    // Create a test instance with spies on each module
    const deslopifier = new Deslopifier();
    
    // Spy on each module's process/replace method
    const characterSpy = jest.spyOn(deslopifier['characterReplacer'], 'replace');
    const phraseSpy = jest.spyOn(deslopifier['phraseRemover'], 'remove');
    const dateTimeSpy = jest.spyOn(deslopifier['dateTimeFormatter'], 'format');
    const abbreviationSpy = jest.spyOn(deslopifier['abbreviationHandler'], 'process');
    const punctuationSpy = jest.spyOn(deslopifier['punctuationNormalizer'], 'normalize');
    const layoutSpy = jest.spyOn(deslopifier['layoutStandardizer'], 'standardize');
    const emojiSpy = jest.spyOn(deslopifier['emojiHandler'], 'process');
    
    // Process some text
    deslopifier.process('Test text');
    
    // Verify all modules were called in the correct order
    expect(characterSpy).toHaveBeenCalled();
    expect(phraseSpy).toHaveBeenCalled();
    expect(dateTimeSpy).toHaveBeenCalled();
    expect(abbreviationSpy).toHaveBeenCalled();
    expect(punctuationSpy).toHaveBeenCalled();
    expect(layoutSpy).toHaveBeenCalled();
    expect(emojiSpy).toHaveBeenCalled();
    
    // Verify the order of calls
    const calls = [
      characterSpy.mock.invocationCallOrder[0],
      phraseSpy.mock.invocationCallOrder[0],
      dateTimeSpy.mock.invocationCallOrder[0],
      abbreviationSpy.mock.invocationCallOrder[0],
      punctuationSpy.mock.invocationCallOrder[0],
      layoutSpy.mock.invocationCallOrder[0],
      emojiSpy.mock.invocationCallOrder[0]
    ];
    
    // Verify calls are in ascending order (each module called after the previous)
    for (let i = 1; i < calls.length; i++) {
      expect(calls[i]).toBeGreaterThan(calls[i-1]);
    }
  });
});
