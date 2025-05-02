/**
 * Ultra-simplified Interactive Mode for Deslopifier
 * No fancy readline, just simple stdin processing
 */

import clipboardy from 'clipboardy';
import chalk from 'chalk';
import { Deslopifier } from './index';

export class InteractiveMode {
  private deslopifier: Deslopifier;

  constructor(deslopifier: Deslopifier) {
    this.deslopifier = deslopifier;
  }

  /**
   * Start the interactive mode session
   */
  public start(): void {
    console.log(chalk.green('\n=== Deslopifier Interactive Mode ===\n'));
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
            clipboardy.writeSync(processed);
            console.log(chalk.cyan('\nProcessed text copied to clipboard!'));
          } catch (error) {
            console.error(chalk.red('Failed to copy to clipboard: '), error);
          }
          
          // Clear buffer
          buffer = '';
        }
        
        // Show prompt for next input
        console.log(chalk.green('\nWaiting for input...'));
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