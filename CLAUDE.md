# ChronoCrime

Crime incremental with time travel. Web only, TypeScript + Vite + React.

**Read `docs/DESIGN.md` before changing anything.** It is the source of truth for both design and code conventions. Any change to a system updates DESIGN.md in the same change (and its change log).

Hard rules:
- Never write display text. Magnus writes all prose. Use `t(key)`, add keys via `src/loc/keys.ts` or data ids, then run `npm run loc:sync`. Leave the `text` column empty.
- Game logic only in `src/core`, content only in `src/data`, tunable numbers only in `src/core/balance.ts`.
- `tick()` is the only thing that advances time. No DOM, clock reads or unseeded randomness in `src/core`.
- Idle-safe: nothing may take resources, workers or buildings away as time passes.
- Changing the shape of `GameState` means bumping `SAVE_VERSION` and adding a migration.

Commands: `npm run dev`, `npm test`, `npm run sim`, `npm run loc:check`, `npm run loc:sync`, `npm run build`.
Before finishing a change: `npm test`, `npx tsc --noEmit`, `npm run loc:check`, and `npm run sim` if balance could be affected.
