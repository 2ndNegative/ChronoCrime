# ChronoCrime

A crime incremental game with time travel.

## Play locally

Double-click **Start ChronoCrime.bat**. The first launch installs dependencies (needs [Node.js](https://nodejs.org) 20 or newer, LTS recommended). The game opens in your browser; close the console window to stop it.

## Write text

All display text lives in `loc/strings.csv` (columns `key`, `context`, `text`). Fill in the `text` column. Unwritten text shows in game as `‹key›`. After code adds new keys, run `npm run loc:sync` to add their rows.

## For development

See `docs/DESIGN.md` for the design and coding rules, and `CLAUDE.md` for the short version.
