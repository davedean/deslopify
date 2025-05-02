import { Deslopifier } from '../src/index';
import { InteractiveMode } from '../src/interactive';

// Mock dependencies
jest.mock('clipboardy', () => ({
  writeSync: jest.fn()
}));

jest.mock('chalk', () => ({
  green: jest.fn((text) => `GREEN:${text}`),
  cyan: jest.fn((text) => `CYAN:${text}`),
  red: jest.fn((text) => `RED:${text}`)
}));

// Mock process.stdin
const mockStdin = {
  setEncoding: jest.fn(),
  resume: jest.fn(),
  on: jest.fn()
};

// Original process.stdin
const originalStdin = process.stdin;

describe('InteractiveMode', () => {
  let mockDeslopifier: Deslopifier;
  let interactiveMode: InteractiveMode;
  let mockConsoleLog: jest.SpyInstance;
  let mockProcessOn: jest.SpyInstance;
  
  beforeEach(() => {
    // Replace process.stdin with our mock
    Object.defineProperty(process, 'stdin', {
      value: mockStdin,
      writable: true
    });
    
    mockDeslopifier = new Deslopifier();
    jest.spyOn(mockDeslopifier, 'process').mockImplementation((text) => `processed:${text}`);
    
    // Mock console.log
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    
    // Mock process.on
    mockProcessOn = jest.spyOn(process, 'on').mockImplementation();
    
    interactiveMode = new InteractiveMode(mockDeslopifier);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
    
    // Restore original process.stdin
    Object.defineProperty(process, 'stdin', {
      value: originalStdin,
      writable: true
    });
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
  
  test('should set up stdin event handlers correctly', () => {
    // Force NODE_ENV to not be 'test' so collectInput runs
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    interactiveMode.start();
    
    // Check that stdin was set up correctly
    expect(mockStdin.setEncoding).toHaveBeenCalledWith('utf8');
    expect(mockStdin.resume).toHaveBeenCalled();
    expect(mockStdin.on).toHaveBeenCalledWith('data', expect.any(Function));
    
    // Check that SIGINT handler was added
    expect(mockProcessOn).toHaveBeenCalledWith('SIGINT', expect.any(Function));
    
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });
  
  test('should process input after timeout and copy to clipboard', () => {
    // Setup
    jest.useFakeTimers();
    const clipboardy = require('clipboardy');
    
    // Force NODE_ENV to not be 'test' so collectInput runs
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    // Start interactive mode
    interactiveMode.start();
    
    // Capture the data callback
    const dataCallback = mockStdin.on.mock.calls.find(call => call[0] === 'data')[1];
    
    // Simulate input
    dataCallback('Sample input text');
    
    // Fast-forward timer
    jest.advanceTimersByTime(500);
    
    // Verify
    expect(mockDeslopifier.process).toHaveBeenCalledWith('Sample input text');
    expect(clipboardy.writeSync).toHaveBeenCalledWith('processed:Sample input text');
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('Processed text copied to clipboard!'));
    
    // Cleanup
    process.env.NODE_ENV = originalNodeEnv;
    jest.useRealTimers();
  });
});