import { CharacterReplacer } from '../src/modules/characterReplacer';
import { PhraseRemover } from '../src/modules/phraseRemover';
import { DateTimeFormatter } from '../src/modules/dateTimeFormatter';
import { AbbreviationHandler } from '../src/modules/abbreviationHandler';

describe('CharacterReplacer', () => {
  const replacer = new CharacterReplacer();

  test('handles bullet point standardization', () => {
    expect(replacer.replace('• First item\n○ Second item\n▪ Third item'))
      .toBe('• First item\n• Second item\n• Third item');
  });

  test('preserves technical characters', () => {
    expect(replacer.replace('Temperature: 23.5 ± 0.2 °C'))
      .toBe('Temperature: 23.5 ± 0.2 °C');
  });

  test('handles emoji removal', () => {
    expect(replacer.replace('Great job! 🚀'))
      .toBe('Great job! ');
  });
  
  test('converts smart quotes to normal quotes', () => {
    const input = '\u201CSmart double quotes\u201D and \u2018smart single quotes\u2019';
    expect(replacer.replace(input))
      .toBe('"Smart double quotes" and \'smart single quotes\'');
  });
});

describe('PhraseRemover', () => {
  const remover = new PhraseRemover();

  test('removes common AI introduction phrases', () => {
    expect(remover.remove('Certainly! Here is the information.'))
      .toBe('Here is the information.');
    
    expect(remover.remove('I\'d be happy to provide an explanation.'))
      .toBe('provide an explanation.');
  });

  test('handles phrase removal at specific positions', () => {
    const customRemover = new PhraseRemover([
      { pattern: /Testing/, position: 'anywhere' as 'anywhere' },
      { pattern: /^Start/, position: 'start' as 'start' },
      { pattern: /End$/, position: 'end' as 'end' }
    ]);

    expect(customRemover.remove('Start of the Testing sentence End'))
      .toBe(' of the  sentence ');
  });
});

describe('DateTimeFormatter', () => {
  const formatter = new DateTimeFormatter();

  test('standardizes date formats', () => {
    expect(formatter.format('The date is 12/25/2024'))
      .toBe('The date is 2024-12-25');
  });

  test('preserves month name date formats', () => {
    expect(formatter.format('Event on 20 March 2024'))
      .toBe('Event on 20 March 2024');
    
    expect(formatter.format('Due by 15 Dec 2024'))
      .toBe('Due by 15 Dec 2024');
  });

  test('standardizes time with AM/PM', () => {
    expect(formatter.format('Meeting at 3:30PM'))
      .toBe('Meeting at 3:30 PM');
  });

  test('standardizes time zones', () => {
    expect(formatter.format('Call at 14:30EST'))
      .toBe('Call at 14:30 EST');
  });
});

describe('AbbreviationHandler', () => {
  const handler = new AbbreviationHandler();

  test('standardizes time zone abbreviations', () => {
    expect(handler.process('The time zone is utc'))
      .toBe('The time zone is UTC');
  });

  test('respects case for certain terms', () => {
    expect(handler.process('during the vernal equinox'))
      .toBe('during the Vernal Equinox');
    
    expect(handler.process('Vernal equinox occurs in spring'))
      .toBe('Vernal Equinox occurs in Spring');
  });

  test('handles month abbreviations', () => {
    expect(handler.process('jan, feb, mar'))
      .toBe('Jan, Feb, Mar');
  });

  test('handles full month names', () => {
    expect(handler.process('january and february'))
      .toBe('January and February');
  });
});