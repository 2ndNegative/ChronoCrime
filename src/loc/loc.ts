import { parseLocCsv } from './csv';
import csvText from '../../loc/strings.csv?raw';
import { requiredKeys, type KeySpec } from './keys';

const table = new Map<string, string>();
// Text is trimmed, so a space typed after the comma in the CSV does not show up in game.
for (const row of parseLocCsv(csvText)) table.set(row.key, row.text.trim());

/** Updates text in memory, so an edit made in game shows at once. */
export function setText(key: string, text: string): void {
  table.set(key, text.trim());
}

/**
 * Looks up display text. Unwritten text shows as ‹key› so gaps are visible in game.
 * Placeholders use {name}: t('ui.offlineReport', { seconds: 120 }).
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const text = table.get(key);
  if (!text) return `${MISSING_OPEN}${key}${MISSING_CLOSE}`;
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
}

/** Marks wrapped around unwritten text. The highlighter looks for these. */
export const MISSING_OPEN = '‹';
export const MISSING_CLOSE = '›';

/** Keys the game needs whose text is not written yet, in CSV order. */
export function missingKeys(): KeySpec[] {
  return requiredKeys().filter((spec) => !table.get(spec.key));
}

export function requiredKeyCount(): number {
  return requiredKeys().length;
}
