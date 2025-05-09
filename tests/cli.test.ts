import fs from 'fs';
import path from 'path';
import { Deslopifier } from '../src/index';

// Mock fs module
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn().mockResolvedValue(undefined),
  },
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  readdirSync: jest.fn(),
}));

// Mock process.stdout.write
const originalWrite = process.stdout.write;
let mockWrite: jest.Mock;

// Mock for stdin
jest.mock('process', () => ({
  ...jest.requireActual('process'),
  stdin: {
    on: jest.fn(),
    resume: jest.fn(),
    pause: jest.fn(),
    setEncoding: jest.fn(),
    [Symbol.asyncIterator]: jest.fn().mockImplementation(function* () {
      yield Buffer.from('Test input');
    }),
  },
}));

describe('CLI Tests', () => {
  // Save original process.argv
  const originalArgv = process.argv;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock stdout.write
    mockWrite = jest.fn();
    process.stdout.write = mockWrite;
  });
  
  afterEach(() => {
    // Restore process.argv
    process.argv = originalArgv;
    
    // Restore stdout.write
    process.stdout.write = originalWrite;
  });
  
  test('should process input from file to output file', async () => {
    // Mock file content
    const mockContent = 'Certainly! This is a test.';
    const expectedOutput = 'This is a test.';
    
    // Mock fs.promises.readFile
    (fs.promises.readFile as jest.Mock).mockResolvedValue(mockContent);
    
    // Set up process.argv
    process.argv = ['node', 'cli.js', '--input', 'input.txt', '--output', 'output.txt'];
    
    // Import CLI module (this will execute the main function)
    const importCLI = async () => {
      // We need to use dynamic import to ensure the CLI module is loaded after we've set up our mocks
      await import('../src/cli');
    };
    
    // Execute CLI
    await importCLI();
    
    // Verify fs.promises.readFile was called with the correct path
    expect(fs.promises.readFile).toHaveBeenCalledWith(expect.stringContaining('input.txt'), 'utf8');
    
    // Verify fs.promises.writeFile was called with the correct path and processed content
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.stringContaining('output.txt'),
      expect.any(String),
      'utf8'
    );
    
    // Get the actual processed content from the writeFile mock
    const actualOutput = (fs.promises.writeFile as jest.Mock).mock.calls[0][1];
    
    // Verify the content was processed correctly by checking if the AI introduction phrase was removed
    expect(actualOutput).not.toContain('Certainly!');
  });
  
  test('should process input from stdin to stdout', async () => {
    // Set up process.argv without input/output options
    process.argv = ['node', 'cli.js'];
    
    // Import CLI module (this will execute the main function)
    const importCLI = async () => {
      await import('../src/cli');
    };
    
    // Execute CLI
    await importCLI();
    
    // Verify process.stdout.write was called
    expect(mockWrite).toHaveBeenCalled();
    
    // Get the actual processed content from the stdout mock
    const actualOutput = mockWrite.mock.calls[0][0];
    
    // Verify the content was processed correctly
    expect(actualOutput).toBe('Test input');
  });
  
  test('should respect skip options', async () => {
    // Mock file content with phrases that would normally be removed
    const mockContent = 'Certainly! This is a test.';
    
    // Mock fs.promises.readFile
    (fs.promises.readFile as jest.Mock).mockResolvedValue(mockContent);
    
    // Set up process.argv with skip-phrases option
    process.argv = ['node', 'cli.js', '--input', 'input.txt', '--output', 'output.txt', '--skip-phrases'];
    
    // Import CLI module (this will execute the main function)
    const importCLI = async () => {
      await import('../src/cli');
    };
    
    // Execute CLI
    await importCLI();
    
    // Get the actual processed content from the writeFile mock
    const actualOutput = (fs.promises.writeFile as jest.Mock).mock.calls[0][1];
    
    // Verify the content still contains the phrase that would normally be removed
    expect(actualOutput).toContain('Certainly!');
  });
});
