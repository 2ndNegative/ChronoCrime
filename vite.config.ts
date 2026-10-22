import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseLocCsv, serializeLocCsv } from './src/loc/csv';

const LOC_PATH = resolve(import.meta.dirname, 'loc/strings.csv');

/**
 * Dev server only: lets the in-game text editor (dev mode) write into loc/strings.csv.
 * POST /__loc with {"key", "text", "context"}. Not part of the built game.
 */
function locWriter(): Plugin {
  let ownWriteAt = 0;
  return {
    name: 'chronocrime-loc-writer',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__loc', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          try {
            const { key, text, context } = JSON.parse(body) as { key: string; text: string; context?: string };
            if (typeof key !== 'string' || !key || typeof text !== 'string') throw new Error('key and text are required');
            const rows = parseLocCsv(readFileSync(LOC_PATH, 'utf8'));
            const row = rows.find((r) => r.key === key);
            if (row) row.text = text;
            else rows.push({ key, context: context ?? '', text });
            ownWriteAt = Date.now();
            writeFileSync(LOC_PATH, serializeLocCsv(rows), 'utf8');
            res.statusCode = 200;
            res.end('ok');
          } catch (e) {
            // Most likely cause: the CSV is open in Excel, which locks the file.
            res.statusCode = 500;
            res.end(e instanceof Error ? e.message : String(e));
          }
        });
      });
    },
    handleHotUpdate({ file }) {
      // The game already shows text it wrote itself, so skip the reload for our own writes.
      // Edits made in Excel or an editor still reload the page.
      if (resolve(file) === LOC_PATH && Date.now() - ownWriteAt < 2000) return [];
    },
  };
}

export default defineConfig({
  plugins: [react(), locWriter()],
  base: './',
});
