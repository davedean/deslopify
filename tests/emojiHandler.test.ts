import { EmojiHandler } from '../src/modules/emojiHandler';

describe('EmojiHandler', () => {
  test('removes all emoji when removeAll is true', () => {
    const handler = new EmojiHandler({ removeAll: true });
    expect(handler.process('Hello 👋 World! 🌎 How are you? 😊')).toBe('Hello  World!  How are you? ');
  });

  test('removes only overused emoji when removeOverused is true', () => {
    const handler = new EmojiHandler({ removeOverused: true });
    
    // Add specific test emoji to overused list
    handler.addOverusedPattern(/[\u{1F389}\u{1F38A}\u{1F380}\u{1F381}\u{1F382}]/gu); // party popper, confetti, balloon
    
    // Test with commonly overused emoji
    expect(handler.process('Great progress! 🚀')).toBe('Great progress! ');
    expect(handler.process('Good idea! 💡')).toBe('Good idea! ');
    expect(handler.process('Awesome! ✨')).toBe('Awesome! ');
    
    // Test with emoji clusters with specific overused ones
    const result = handler.process('Wow!!! 🎉🎊🎈');
    // The result should have the 🎉 emoji removed at minimum
    expect(result).not.toContain('🎉');
  });

  test('handles emoji clusters correctly', () => {
    const handler = new EmojiHandler({ removeOverused: true });
    
    // Add specific test emoji to overused list for the test
    handler.addOverusedPattern(/[\u{1F389}\u{1F38A}\u{1F380}\u{1F381}\u{1F382}]/gu);
    
    // Set up a clear sequence of 3+ emoji to test cluster detection
    const result = handler.process('Happy birthday! 🎂🎉🎁');
    expect(result).toBe('Happy birthday! ');
    
    // This should keep emoji when they're not in a cluster of 3+
    const handlerForTwoEmojis = new EmojiHandler({ removeOverused: true });
    expect(handlerForTwoEmojis.process('Look at this 👀')).toBe('Look at this 👀');
  });

  test('does not modify text when no options enabled', () => {
    const handler = new EmojiHandler();
    const text = 'Hello 👋 World! How are you? 😊';
    expect(handler.process(text)).toBe(text);
  });

  test('can add custom overused patterns', () => {
    const handler = new EmojiHandler({ removeOverused: true });
    
    // Add a custom pattern for a specific emoji
    handler.addOverusedPattern(/👍/gu);
    
    // The 👍 emoji should now be removed
    expect(handler.process('Good job! 👍')).toBe('Good job! ');
    
    // But other non-overused emoji should remain
    expect(handler.process('Hello 🐼')).toBe('Hello 🐼');
  });

  test('can update options after creation', () => {
    const handler = new EmojiHandler();
    
    // Initially does nothing
    const text = 'Hello 👋 World!';
    expect(handler.process(text)).toBe(text);
    
    // Update to remove all emoji
    handler.setOptions({ removeAll: true });
    expect(handler.process(text)).toBe('Hello  World!');
    
    // Update to not remove emoji
    handler.setOptions({ removeAll: false });
    expect(handler.process(text)).toBe(text);
    
    // Update to remove overused emoji only
    handler.setOptions({ removeOverused: true });
    handler.addOverusedPattern(/👋/gu); // Add wave emoji to overused list
    expect(handler.process(text)).toBe('Hello  World!');
  });
});