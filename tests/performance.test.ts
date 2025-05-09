import deslopify from '../src/index';
import fs from 'fs';
import path from 'path';

describe('Performance Tests', () => {
  test('processes large text within reasonable time', () => {
    // Generate a large text (500KB+)
    const largeText = 'This is a test. '.repeat(25000);
    
    // Measure processing time
    const startTime = process.hrtime.bigint();
    deslopify(largeText);
    const endTime = process.hrtime.bigint();
    
    const durationMs = Number(endTime - startTime) / 1_000_000;
    
    // Processing should be reasonably fast (adjust threshold as needed)
    expect(durationMs).toBeLessThan(1000); // Should process in less than 1 second
  });
  
  test('processes all sample files efficiently', () => {
    const samplesDir = path.join(__dirname, '..', 'samples');
    const sampleFiles = fs.readdirSync(samplesDir)
      .filter(file => file.endsWith('.txt'))
      .map(file => path.join(samplesDir, file));
    
    for (const file of sampleFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      const startTime = process.hrtime.bigint();
      deslopify(content);
      const endTime = process.hrtime.bigint();
      
      const durationMs = Number(endTime - startTime) / 1_000_000;
      
      // Each sample should process quickly
      expect(durationMs).toBeLessThan(100); // Should process in less than 100ms
      console.log(`Processed ${path.basename(file)} in ${durationMs.toFixed(2)}ms`);
    }
  });
  
  test('memory usage remains reasonable', () => {
    // Generate a very large text
    const veryLargeText = 'This is a test. '.repeat(50000); // ~1MB
    
    // Measure memory before
    const memBefore = process.memoryUsage().heapUsed;
    
    // Process text
    deslopify(veryLargeText);
    
    // Measure memory after
    const memAfter = process.memoryUsage().heapUsed;
    
    // Calculate memory increase in MB
    const memIncreaseMB = (memAfter - memBefore) / (1024 * 1024);
    
    // Memory increase should be reasonable (adjust threshold as needed)
    expect(memIncreaseMB).toBeLessThan(10); // Should use less than 10MB additional memory
    console.log(`Memory usage increase: ${memIncreaseMB.toFixed(2)}MB`);
  });
  
  test('handles repeated processing efficiently', () => {
    // Generate a medium-sized text
    const text = 'Certainly! This is a test with some slop. '.repeat(1000);
    
    // Process multiple times and measure average time
    const iterations = 10;
    let totalDuration = 0;
    
    for (let i = 0; i < iterations; i++) {
      const startTime = process.hrtime.bigint();
      deslopify(text);
      const endTime = process.hrtime.bigint();
      
      totalDuration += Number(endTime - startTime);
    }
    
    const avgDurationMs = (totalDuration / iterations) / 1_000_000;
    
    // Average processing time should be reasonable
    expect(avgDurationMs).toBeLessThan(50); // Should process in less than 50ms on average
    console.log(`Average processing time over ${iterations} iterations: ${avgDurationMs.toFixed(2)}ms`);
  });
  
  test('processes text with many replacements efficiently', () => {
    // Generate text with many patterns that will trigger replacements
    const textWithManyReplacements = [
      'Certainly! I\'d be happy to help you with that.',
      'This text has multiple bullet points:',
      '• First point',
      '• Second point',
      '• Third point',
      'The date is 12/25/2024 and the time is 3:30PM EST.',
      'This sentence has "smart quotes" and \'single quotes\'.',
      'This sentence has multiple exclamation marks!!!',
      'This sentence has multiple question marks???',
      'This sentence has multiple spaces   between   words.',
      'This sentence has an em-dash—right here.',
      'This sentence has an en-dash–right here.'
    ].join('\n').repeat(100);
    
    // Measure processing time
    const startTime = process.hrtime.bigint();
    deslopify(textWithManyReplacements);
    const endTime = process.hrtime.bigint();
    
    const durationMs = Number(endTime - startTime) / 1_000_000;
    
    // Processing should be reasonably fast even with many replacements
    expect(durationMs).toBeLessThan(500); // Should process in less than 500ms
    console.log(`Processed text with many replacements in ${durationMs.toFixed(2)}ms`);
  });
});
