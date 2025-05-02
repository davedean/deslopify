/**
 * Interactive Mode for Deslopifier
 * 
 * Provides a persistent terminal interface for processing text
 */

import readlineSync from 'readline-sync';
import clipboardy from 'clipboardy';
import chalk from 'chalk';
import { Deslopifier } from './index';

export class InteractiveMode {
  private deslopifier: Deslopifier;
  private running = true;
  private verbose = false;
  private batchMode = false;
  private inputBuffer = '';

  constructor(deslopifier: Deslopifier) {
    this.deslopifier = deslopifier;
  }

  /**
   * Start the interactive mode session
   */
  public start(): void {
    this.showWelcomeMessage();
    this.showHelp();
    
    // In test environment, don't start the main loop
    if (process.env.NODE_ENV !== 'test') {
      this.mainLoop();
    }
  }

  /**
   * Display welcome message
   */
  private showWelcomeMessage(): void {
    console.log(chalk.bold(chalk.green('\n=== Deslopifier Interactive Mode ===\n')));
    console.log(`Paste text to process it, or type ${chalk.cyan('h')} for help.`);
    console.log('For multiline input, paste all at once or enter line by line (empty lines are included).');
    console.log(`Input mode will exit after ~0.5 seconds of inactivity, or when you press ${chalk.cyan('Ctrl+D')} or ${chalk.cyan('Ctrl+C')}.`);
    console.log(`Type ${chalk.cyan('q')} to quit the interactive mode completely.`);
    console.log('Processed text will be copied to your clipboard automatically.\n');
  }

  /**
   * Display help information
   */
  private showHelp(): void {
    console.log(chalk.bold(chalk.yellow('\n=== HELP ===\n')));
    console.log(`${chalk.cyan('q')}: Quit interactive mode (recommended way to exit completely)`);
    console.log(`${chalk.cyan('h')}: Show this help information`);
    console.log(`${chalk.cyan('v')}: Toggle verbose mode`);
    console.log(`${chalk.cyan('b')}: Toggle batch mode`);
    console.log(`${chalk.cyan('c')}: Clear input buffer`);
    console.log(`${chalk.cyan('Ctrl+D')}: Finish multiline input and process it (works in most terminals)`);
    console.log(`${chalk.cyan('Ctrl+C')}: Exit immediately (may not work in all terminals)\n`);
    
    console.log(`${chalk.bold('Input Behavior')}:`);
    console.log(`- Empty lines are included in your input (not used as input termination)`);
    console.log(`- Input mode will exit after ~0.5 seconds of inactivity`);
    console.log(`- You can press ${chalk.cyan('Ctrl+D')} or ${chalk.cyan('Ctrl+C')} to finish input manually\n`);
    
    console.log(`${chalk.bold('Batch Mode')}: When enabled, stays in input mode after processing`);
    console.log(`${chalk.bold('Verbose Mode')}: When enabled, shows additional processing details\n`);
  }

  /**
   * Main interactive loop
   */
  private mainLoop(): void {
    // Set up process handlers
    this.setupKeyboardHandlers();
    
    // Show initial status
    this.showStatusLine();
    
    while (this.running) {
      console.log(chalk.green('Waiting for input...') + chalk.dim(' (Paste text or type a command)'));
      
      // Get initial input from user
      let input = '';
      const line = readlineSync.question('> ');
      
      // Check if it's a single character command
      if (line.length === 1) {
        this.handleKeyPress(line);
        continue;
      }
      
      // If it's not a command, collect all input
      input = line;
      
      // Allow the user to continue pasting or adding more lines
      // Keep reading lines until timeout or Ctrl+D/Ctrl+C
      let multilineInput = false;
      
      if (input.includes('\n')) {
        // Handle pasted multiline text
        multilineInput = true;
      } else {
        console.log(chalk.dim('Continue entering text. Press Ctrl+D or Ctrl+C to finish input.'));
        console.log(chalk.dim('Empty lines are included in the input. Input will finish after ~0.5 seconds of inactivity.'));
        
        let collectingInput = true;
        let lastInputTime = Date.now();
        const inputTimeoutMs = 500; // 0.5 seconds of inactivity timeout
        
        while (collectingInput) {
          // Set a non-blocking timeout to check for inactivity
          const timeoutId = setTimeout(() => {
            // Check if we've been inactive for the timeout period
            if (Date.now() - lastInputTime >= inputTimeoutMs) {
              collectingInput = false;
              // We can't interrupt readline, but we'll stop adding lines after this
              console.log(chalk.yellow('\nInactivity detected. Processing input...'));
            }
          }, inputTimeoutMs + 100); // Add a little buffer
          
          try {
            const additionalLine = readlineSync.question('');
            clearTimeout(timeoutId); // Clear the timeout since we got input
            
            // Update the last input time regardless of empty line or not
            lastInputTime = Date.now();
            
            // Add the line to the input (even if empty)
            input += '\n' + additionalLine;
            multilineInput = true;
          } catch (err) {
            // Catch any errors like Ctrl+D/Ctrl+C
            clearTimeout(timeoutId);
            collectingInput = false;
            console.log(chalk.yellow('\nInput terminated. Processing available input...'));
          }
        }
      }
      
      if (multilineInput) {
        console.log(chalk.dim('Processing multiline input...'));
      }
      
      // Process the text
      if (input.trim().length > 0) {
        this.inputBuffer = input;
        const processed = this.processText(input);
        this.copyToClipboard(processed);
        
        // Display processed result
        console.log(chalk.green('\n=== Processed Text ==='));
        console.log(processed);
        console.log(chalk.green('=================='));
        console.log(chalk.cyan('Text copied to clipboard!'));
        
        // If not in batch mode, ask if user wants to continue
        if (!this.batchMode) {
          const continueSession = readlineSync.keyInYNStrict(
            '\nProcess another text? (y/n)'
          );
          if (!continueSession) {
            this.running = false;
          }
        }
      }
      
      // Newline for visual separation
      console.log('');
    }
    
    console.log(chalk.yellow('Exiting interactive mode. Goodbye!'));
    process.exit(0);
  }

  /**
   * Set up keyboard event handlers
   */
  private setupKeyboardHandlers(): void {
    // Handle Ctrl+C to exit
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\nExiting interactive mode. Goodbye!'));
      process.exit(0);
    });
    
    // Handle process termination signals
    process.on('SIGTERM', () => {
      console.log(chalk.yellow('\nProcess terminated. Exiting interactive mode.'));
      process.exit(0);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error(chalk.red('\nAn error occurred:'), error);
      console.log(chalk.yellow('Exiting interactive mode.'));
      process.exit(1);
    });
  }

  /**
   * Handle single-key commands
   */
  public handleKeyPress(key: string): void {
    switch (key.toLowerCase()) {
      case 'q':
        console.log(chalk.yellow('Exiting interactive mode. Goodbye!'));
        process.exit(0);
        break;
      case 'h':
        this.showHelp();
        break;
      case 'v':
        this.verbose = !this.verbose;
        console.log(chalk.blue(`Verbose mode ${this.verbose ? 'enabled' : 'disabled'}`));
        this.showStatusLine();
        break;
      case 'b':
        this.batchMode = !this.batchMode;
        console.log(chalk.blue(`Batch mode ${this.batchMode ? 'enabled' : 'disabled'}`));
        this.showStatusLine();
        break;
      case 'c':
        this.clearInputBuffer();
        break;
      default:
        break;
    }
  }

  /**
   * Process text through the deslopifier
   */
  public processText(text: string): string {
    if (this.verbose) {
      console.log(chalk.dim('Processing text...'));
    }
    
    // Show progress indicator for longer texts
    if (text.length > 500) {
      process.stdout.write('Processing');
      const dots = setInterval(() => {
        process.stdout.write('.');
      }, 300);
      
      const result = this.deslopifier.process(text);
      
      clearInterval(dots);
      process.stdout.write('\n');
      
      return result;
    }
    
    return this.deslopifier.process(text);
  }

  /**
   * Copy text to clipboard
   */
  public copyToClipboard(text: string): void {
    try {
      clipboardy.writeSync(text);
      if (this.verbose) {
        console.log(chalk.dim('Copied to clipboard'));
      }
    } catch (error) {
      console.error(chalk.red('Failed to copy to clipboard: '), error);
    }
  }

  /**
   * Clear the input buffer
   */
  public clearInputBuffer(): void {
    this.inputBuffer = '';
    console.log(chalk.blue('Input buffer cleared'));
  }

  /**
   * Show current status and settings
   */
  public showStatusLine(): void {
    console.log(chalk.cyan('\n=== STATUS ==='));
    console.log(`Batch Mode: ${this.batchMode ? chalk.green('ON') : chalk.red('OFF')}`);
    console.log(`Verbose: ${this.verbose ? chalk.green('ON') : chalk.red('OFF')}`);
    console.log(chalk.cyan('=============\n'));
  }

  /**
   * Check if verbose mode is enabled
   */
  public isVerboseMode(): boolean {
    return this.verbose;
  }

  /**
   * Check if batch mode is enabled
   */
  public isBatchMode(): boolean {
    return this.batchMode;
  }
}