// Checks loc/strings.csv against the keys the game needs.
//   npm run loc:check   report missing, unused and unwritten keys
//   npm run loc:sync    also append missing keys (empty text) and refresh contexts; never touches written text

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseLocCsv, serializeLocCsv, type LocRow } from '../src/loc/csv';
import { requiredKeys } from '../src/loc/keys';

const path = resolve(import.meta.dirname, '../loc/strings.csv');
const write = process.argv.includes('--write');

const rows: LocRow[] = existsSync(path) ? parseLocCsv(readFileSync(path, 'utf8')) : [];
const required = requiredKeys();
const requiredSet = new Set(required.map((s) => s.key));
const existing = new Map(rows.map((r) => [r.key, r]));

const missing = required.filter((s) => !existing.has(s.key));
const unused = rows.filter((r) => !requiredSet.has(r.key));
const unwritten = rows.filter((r) => requiredSet.has(r.key) && r.text.trim() === '');

console.log(`Keys needed: ${required.length}`);
console.log(`Missing from CSV: ${missing.length}`);
for (const s of missing) console.log(`  + ${s.key}`);
console.log(`In CSV but unused: ${unused.length}`);
for (const r of unused) console.log(`  ? ${r.key}`);
console.log(`Text not written yet: ${unwritten.length + missing.length}`);

if (write) {
  const contexts = new Map(required.map((s) => [s.key, s.context]));
  const updated = rows.map((r) => ({ ...r, context: contexts.get(r.key) ?? r.context }));
  for (const s of missing) updated.push({ key: s.key, context: s.context, text: '' });
  writeFileSync(path, serializeLocCsv(updated), 'utf8');
  console.log(`Wrote ${path}`);
} else if (missing.length > 0) {
  process.exitCode = 1;
}
