import { describe, expect, it } from 'vitest';
import { parseLocCsv, serializeLocCsv } from '../src/loc/csv';

describe('localization CSV', () => {
  it('round-trips commas, quotes and line breaks', () => {
    const rows = [
      { key: 'a', context: 'plain', text: 'Hello' },
      { key: 'b', context: 'tricky', text: 'He said "run", then\nran.' },
      { key: 'c', context: 'empty', text: '' },
    ];
    expect(parseLocCsv(serializeLocCsv(rows))).toEqual(rows);
  });

  it('reads semicolon files saved by Excel', () => {
    const text = 'key;context;text\r\nui.buy;Button;Kaufen\r\n';
    expect(parseLocCsv(text)).toEqual([{ key: 'ui.buy', context: 'Button', text: 'Kaufen' }]);
  });
});
