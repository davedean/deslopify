/**
 * Ultra-simplified Interactive Mode for Deslopifier
 * No fancy readline, just simple stdin processing
 * 
 * Using dynamic imports for ESM modules to maintain compatibility with CommonJS
 */

import { Deslopifier } from './index';

// Define types for dynamically imported modules
type ClipboardyType = {
  writeSync: (text: string) => void;
};

type ChalkType = {
  green: (text: string) => string;
  cyan: (text: string) => string;
  red: (text: string) => string;
};

// Placeholder for chalk functions until the module is loaded
const chalkPlaceholder: ChalkType = {
  green: (text: string) => text,
  cyan: (text: string) => text,
  red: (text: string) => text
};

export class InteractiveMode {
  private deslopifier: Deslopifier;
  private chalk: ChalkType = chalkPlaceholder;
  private clipboardy: ClipboardyType | null = null;

  constructor(deslopifier: Deslopifier) {
    this.deslopifier = deslopifier;
  }

  /**
   * Start the interactive mode session
   */
  public async start(): Promise<void> {
    // Dynamically import ESM modules
    try {
      const [clipboardyModule, chalkModule] = await Promise.all([
        import('clipboardy'),
        import('chalk')
      ]);
      
      this.clipboardy = clipboardyModule.default;
      this.chalk = chalkModule.default;
    } catch (error) {
      console.error('Failed to load required modules:', error);
      // Continue with placeholder functions
    }

    console.log(this.chalk.green('\n=== Deslopifier Interactive Mode ===\n'));
    console.log('Enter or paste text. Auto-processes after 0.5s inactivity.');
    console.log('Press Ctrl+C to exit.\n');
    console.log('> ');
    
    // Don't run in test mode
    if (process.env.NODE_ENV !== 'test') {
      this.collectInput();
    }
  }

  /**
   * Collect and process input with timeout detection
   */
  private collectInput(): void {
    let buffer = '';
    let timer: NodeJS.Timeout | null = null;
    const TIMEOUT = 500; // 0.5 seconds

    // Make stdin emit data events
    process.stdin.setEncoding('utf8');
    process.stdin.resume();
    
    // Handle data events directly
    process.stdin.on('data', (data) => {
      const chunk = data.toString();
      
      // Add to buffer
      buffer += chunk;
      
      // Reset timer
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      
      // Set new timer
      timer = setTimeout(() => {
        if (buffer.trim().length > 0) {
          // Process and copy
          const processed = this.deslopifier.process(buffer);
          
          try {
            if (this.clipboardy) {
              this.clipboardy.writeSync(processed);
              console.log(this.chalk.cyan('\nProcessed text copied to clipboard!'));
            } else {
              console.log('\nProcessed text (clipboard functionality not available):');
              console.log(processed);
            }
          } catch (error) {
            console.error(this.chalk.red('Failed to copy to clipboard: '), error);
          }
          
          // Clear buffer
          buffer = '';
        }
        
        // Show prompt for next input
        console.log(this.chalk.green('\nWaiting for input...'));
        console.log('> ');
      }, TIMEOUT);
    });
    
    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
      console.log('\nExiting...');
      process.exit(0);
    });
  }
  
  /**
   * Process text through the deslopifier (for testing)
   */
  public processText(text: string): string {
    return this.deslopifier.process(text);
  }
}
