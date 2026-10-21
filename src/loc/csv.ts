// Minimal RFC 4180 CSV: fields with the delimiter, quotes or newlines are quoted, "" escapes a quote.
// Reads comma- or semicolon-separated files (Excel uses semicolons in some locales); always writes commas
// with a UTF-8 byte order mark so Excel opens the file as UTF-8.

export interface LocRow {
  key: string;
  context: string;
  text: string;
}

export const CSV_HEADER = ['key', 'context', 'text'] as const;

export function parseCsv(input: string): string[][] {
  const firstLine = input.split(/\r?\n/, 1)[0] ?? '';
  const delimiter = firstLine.includes(';') && !firstLine.includes(',') ? ';' : ',';
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const text = input.replace(/^﻿/, '');

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === delimiter) {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f !== ''));
}

export function parseLocCsv(input: string): LocRow[] {
  const [header, ...rows] = parseCsv(input);
  if (!header || header.join(',') !== CSV_HEADER.join(',')) {
    throw new Error(`Localization CSV must start with the header: ${CSV_HEADER.join(',')}`);
  }
  return rows.map((r) => ({ key: r[0] ?? '', context: r[1] ?? '', text: r[2] ?? '' }));
}

function quote(field: string): string {
  return /[",\r\n]/.test(field) ? `"${field.replace(/"/g, '""')}"` : field;
}

export function serializeLocCsv(rows: LocRow[]): string {
  const lines = [CSV_HEADER.join(','), ...rows.map((r) => [r.key, r.context, r.text].map(quote).join(','))];
  return '\uFEFF' + lines.join('\r\n') + '\r\n';
}
