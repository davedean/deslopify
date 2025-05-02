import { Deslopifier } from '../src/index';
import { InteractiveMode } from '../src/interactive';

// Mock the dependencies
jest.mock('readline-sync', () => ({
  question: jest.fn(),
  keyInYNStrict: jest.fn(),
  keyInSelect: jest.fn(),
}));
jest.mock('clipboardy', () => ({
  writeSync: jest.fn(),
  readSync: jest.fn(),
}));
jest.mock('chalk', () => ({
  green: jest.fn((text) => `GREEN:${text}`),
  yellow: jest.fn((text) => `YELLOW:${text}`),
  blue: jest.fn((text) => `BLUE:${text}`),
  red: jest.fn((text) => `RED:${text}`),
  cyan: jest.fn((text) => `CYAN:${text}`),
  bold: jest.fn((text) => `BOLD:${text}`),
  dim: jest.fn((text) => `DIM:${text}`)
}));

describe('InteractiveMode', () => {
  let mockDeslopifier: Deslopifier;
  let interactiveMode: InteractiveMode;
  let mockStdout: jest.SpyInstance;
  let mockStdin: jest.SpyInstance;
  let mockConsoleLog: jest.SpyInstance;
  let mockExit: jest.SpyInstance;
  
  beforeEach(() => {
    mockDeslopifier = new Deslopifier();
    jest.spyOn(mockDeslopifier, 'process').mockImplementation((text) => `processed:${text}`);
    
    // Mock process.exit
    mockExit = jest.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`Process.exit called with code: ${code}`);
    });
    
    // Mock stdout write
    mockStdout = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    
    // Mock console.log
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    
    interactiveMode = new InteractiveMode(mockDeslopifier);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('should initialize correctly', () => {
    expect(interactiveMode).toBeInstanceOf(InteractiveMode);
  });
  
  test('should show welcome message when started', () => {
    interactiveMode.start();
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Deslopifier Interactive Mode'));
  });
  
  test('should process input text correctly', () => {
    const inputText = 'Test input';
    const processedText = interactiveMode.processText(inputText);
    
    expect(mockDeslopifier.process).toHaveBeenCalledWith(inputText);
    expect(processedText).toBe('processed:Test input');
  });
  
  test('should copy processed text to clipboard', () => {
    const clipboardy = require('clipboardy');
    
    const inputText = 'Test input';
    interactiveMode.processText(inputText);
    interactiveMode.copyToClipboard('processed:Test input');
    
    expect(clipboardy.writeSync).toHaveBeenCalledWith('processed:Test input');
  });
  
  test('should handle keyboard shortcuts correctly', () => {
    const readlineSync = require('readline-sync');
    readlineSync.keyInYNStrict.mockReturnValue(true);
    
    // We need to mock the quit functionality for tests
    // Skip testing 'q' key since it calls process.exit(0)
    
    // Simulate 'h' key press for help
    interactiveMode.handleKeyPress('h');
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('HELP'));
    
    // Simulate 'v' key to toggle verbose mode
    const initialVerboseState = interactiveMode.isVerboseMode();
    interactiveMode.handleKeyPress('v');
    expect(interactiveMode.isVerboseMode()).toBe(!initialVerboseState);
    
    // Simulate 'b' key to toggle batch mode
    const initialBatchState = interactiveMode.isBatchMode();
    interactiveMode.handleKeyPress('b');
    expect(interactiveMode.isBatchMode()).toBe(!initialBatchState);
    
    // Simulate 'c' key to clear input buffer
    interactiveMode.handleKeyPress('c');
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Input buffer cleared'));
  });
  
  test('should display status line with current settings', () => {
    interactiveMode.showStatusLine();
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('STATUS'));
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Batch Mode'));
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Verbose'));
  });
  
  test('should show progress indicator for longer texts', () => {
    const longText = 'a'.repeat(1000);
    interactiveMode.processText(longText);
    
    // Check that progress indicators were shown
    expect(mockStdout.mock.calls.some(call => 
      call[0] && call[0].toString().includes('Processing')
    )).toBeTruthy();
  });
  
  test('should clear input buffer when requested', () => {
    interactiveMode.clearInputBuffer();
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Input buffer cleared'));
  });
});