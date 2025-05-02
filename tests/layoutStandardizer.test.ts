import { LayoutStandardizer } from '../src/modules/layoutStandardizer';

describe('LayoutStandardizer', () => {
  describe('Paragraph spacing normalization', () => {
    it('should normalize multiple blank lines to a single blank line by default', () => {
      const input = 'This is paragraph 1.\n\n\n\nThis is paragraph 2.';
      
      const standardizer = new LayoutStandardizer();
      const result = standardizer.standardize(input);
      
      // Check that there are not more than 2 consecutive newlines
      expect(result).not.toMatch(/\n{3,}/);
    });

    it('should respect double paragraph spacing when configured', () => {
      const input = 'This is paragraph 1.\n\n\n\n\nThis is paragraph 2.';
      
      const standardizer = new LayoutStandardizer([], { paragraphSpacing: 'double' });
      const result = standardizer.standardize(input);
      
      // Check that there are not more than 3 consecutive newlines for double spacing
      expect(result).not.toMatch(/\n{4,}/);
    });
  });

  describe('Heading format standardization', () => {
    it('should ensure single space after # in ATX headings', () => {
      const input = '#Heading 1\n##Heading 2\n###Heading 3';
      const expected = '# Heading 1\n## Heading 2\n### Heading 3';
      
      const standardizer = new LayoutStandardizer();
      expect(standardizer.standardize(input)).toBe(expected);
    });

    it('should standardize setext headings to consistent format', () => {
      const input = 'Heading 1\n========\n\nHeading 2\n--------';
      
      // Test with atx style (default)
      const standardizer1 = new LayoutStandardizer();
      const result1 = standardizer1.standardize(input);
      
      // Check for ATX style headings
      expect(result1).toContain('# Heading 1');
      expect(result1).toContain('## Heading 2');
      
      // Test with setext style
      const standardizer2 = new LayoutStandardizer([], { headingStyle: 'setext' });
      const result2 = standardizer2.standardize(input);
      
      // Check for setext style headings
      expect(result2).toMatch(/Heading 1\n={5,}/);
      expect(result2).toMatch(/Heading 2\n-{5,}/);
    });
  });

  describe('List and quote indentation', () => {
    it('should standardize list item spacing', () => {
      const input = '- Item 1\n-    Item with extra spaces\n+  Another item\n*       Last item';
      const expected = '- Item 1\n- Item with extra spaces\n+ Another item\n* Last item';
      
      const standardizer = new LayoutStandardizer();
      expect(standardizer.standardize(input)).toBe(expected);
    });

    it('should standardize quote indentation', () => {
      const input = '> Quote line 1\n>    Quote with extra spaces';
      const expected = '> Quote line 1\n> Quote with extra spaces';
      
      const standardizer = new LayoutStandardizer();
      expect(standardizer.standardize(input)).toBe(expected);
    });
  });

  describe('Code block preservation', () => {
    it('should preserve whitespace in fenced code blocks', () => {
      const input = 'Regular text.\n\n```\nfunction   test() {\n    console.log("Hello");\n}\n```\n\nMore text.';
      
      const standardizer = new LayoutStandardizer();
      const result = standardizer.standardize(input);
      
      // The code block should remain unchanged
      expect(result).toContain('```\nfunction   test() {\n    console.log("Hello");\n}\n```');
    });

    it('should preserve whitespace in indented code blocks', () => {
      const input = 'Regular text.\n\n    function   test() {\n        console.log("Hello");\n    }\n\nMore text.';
      
      const standardizer = new LayoutStandardizer();
      const result = standardizer.standardize(input);
      
      // The indented code block should remain unchanged
      expect(result).toContain('    function   test() {\n        console.log("Hello");\n    }');
    });
  });

  describe('Line ending normalization', () => {
    it('should normalize CRLF to LF line endings', () => {
      const input = 'Line 1\r\nLine 2\r\nLine 3';
      const expected = 'Line 1\nLine 2\nLine 3';
      
      const standardizer = new LayoutStandardizer();
      expect(standardizer.standardize(input)).toBe(expected);
    });
  });

  describe('Spacing after punctuation', () => {
    it('should normalize spacing after punctuation', () => {
      const input = 'Hello,  world. This is a test;   this is only a test!  Is it working?  Yes.';
      
      const standardizer = new LayoutStandardizer();
      const result = standardizer.standardize(input);
      
      // Check that excessive spaces after punctuation are normalized
      expect(result).not.toMatch(/,\s{2,}/);
      expect(result).not.toMatch(/\.\s{2,}/);
      expect(result).not.toMatch(/;\s{2,}/);
      expect(result).not.toMatch(/!\s{2,}/);
      expect(result).not.toMatch(/\?\s{2,}/);
    });
  });

  describe('Custom mappings', () => {
    it('should apply custom mappings', () => {
      const standardizer = new LayoutStandardizer();
      standardizer.addMapping(/FIXME:/g, 'TODO:');
      
      const input = 'FIXME: this needs to be fixed';
      const expected = 'TODO: this needs to be fixed';
      
      expect(standardizer.standardize(input)).toBe(expected);
    });
    
    it('should handle multiple custom mappings', () => {
      const standardizer = new LayoutStandardizer();
      
      standardizer.addMappings([
        { pattern: /FIXME:/g, replacement: 'TODO:' },
        { pattern: /bug/gi, replacement: 'issue' }
      ]);
      
      const input = 'FIXME: there is a BUG here';
      const expected = 'TODO: there is a issue here';
      
      expect(standardizer.standardize(input)).toBe(expected);
    });
  });
  
  describe('Complex text standardization', () => {
    it('should handle complex text with multiple layout issues', () => {
      const input = `#Title with no space

Paragraph 1.     This has extra spaces.


Paragraph 2.   This also has too  many spaces.




Paragraph 3 after too many blank lines.

- List item 1
-    List item with extra spaces
-   Another item

> A blockquote
>    With inconsistent spacing

\`\`\`
function preserveThisCode() {
    // This should be preserved exactly
    console.log("Hello   World");  // Extra spaces in string and after statement
}
\`\`\`

Paragraph,  with weird  spacing after punctuation!  Very strange.`;

      const standardizer = new LayoutStandardizer();
      const result = standardizer.standardize(input);
      
      // Check that specific issues are fixed
      expect(result).toContain('# Title with no space'); // Space after #
      expect(result).not.toMatch(/\n{4,}/); // No more than 3 consecutive newlines
      expect(result).toMatch(/- List item 1/); // Standardized list spacing
      expect(result).toMatch(/> With inconsistent spacing/); // Standardized quote spacing
      
      // Code block should be preserved exactly
      expect(result).toContain('```\nfunction preserveThisCode() {');
      expect(result).toContain('console.log("Hello   World");');
      
      // Check that code blocks are preserved
      expect(result).toContain('Hello   World');
    });
  });
});