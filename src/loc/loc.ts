import { parseLocCsv } from './csv';
import csvText from '../../loc/strings.csv?raw';

const table = new Map<string, string>();
for (const row of parseLocCsv(csvText)) table.set(row.key, row.text);

/**
 * Looks up display text. Unwritten text shows as ‹key› so gaps are visible in game.
 * Placeholders use {name}: t('ui.offlineReport', { seconds: 120 }).
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const text = table.get(key);
  if (!text) return `‹${key}›`;
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
}
