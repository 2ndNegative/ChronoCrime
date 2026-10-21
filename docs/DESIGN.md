# ChronoCrime: Design and Coding Document

This is the single source of truth for how ChronoCrime plays and how it is built. If code and this document disagree, one of them is a bug: fix whichever is wrong, in the same change.

**Status tags:** every rule is **Decided** (agreed, build it), **Proposed** (a working assumption, open to change) or **Open** (needs a decision before it is built). Untagged text inherits the tag of its section.

---

## 1. Vision and pillars (Decided)

You rise from street hustler to underworld kingpin, then build a time machine and rebuild your empire in a different era. Mostly idle, web only, built for months of play (on the scale of Evolve Idle).

1. **Idle-safe.** Nothing bad happens while you are away. Pressure slows you down; it never takes things from you. There are no failure states caused by lapsed attention.
2. **Dirty vs clean money is the central bottleneck.** Dirty money is easy to earn. Clean money is the gate, and laundering capacity is the main growth lever.
3. **People, not a muscle number.** Your crew are individuals you recruit, place into jobs and develop.
4. **Every era is a new puzzle on a shared skeleton.** Same core resources, new goods, new mechanics, distinct theme.
5. **Automation is a reward.** Anything the player has done by hand for a while can later be automated.
6. **Numbers are designed, not discovered.** Every system has a pacing target and is covered by the balance simulator before it ships.

**Lessons from Hive Incremental this design guards against:** too many resources that do not feel distinct (see the goods rules in section 3), and a game that is hard early and trivial once established (see heat floor in section 4 and the alternating bottleneck in section 2).

## 2. Core loop (Decided)

- **Dirty money** comes from operations. It pays for anything illegal: wages, recruitment, gear, bribes, black-market goods.
- **Clean money** comes only from laundering through fronts. It pays for anything legitimate: fronts, property, lawyers, promotions, contacts.
- **Laundering has a throughput cap and a fee.** Expanding capacity costs clean money: more fronts → more clean money → more fronts.
- **Moving dirty money creates heat** (section 4), so laundering is also how you keep heat down.

**Timescales.** Seconds: operations tick. Minutes: place workers, buy a building. Hours: a promotion. Days: a time machine jump.

**Balance rule (Proposed).** The binding constraint should alternate between "can't earn enough dirty money" and "can't launder fast enough". Neither should dominate for long. The simulator tracks which one binds.

## 3. Resources

### 3.1 Topbar resources (Decided)

Permanent in every era, always visible in the topbar.

| Resource | Kind | Main sources | What it does |
| --- | --- | --- | --- |
| Dirty cash | Currency, physical | Operations, heists | Wages, recruitment, gear, bribes. Needs storage (storage type `cash`). |
| Clean money | Currency, bank account | Laundering | Fronts, property, lawyers, promotions, contacts. No storage, no limit. |
| Heat | Meter, never spent | Dirty cash flow, stored goods | Slows output (section 4). |
| Fear | Meter, violent reputation | Violent jobs, enforcement | Cheaper extortion, rivals back off, workers obey. Adds heat, puts off respectable contacts. |
| Respect | Meter, reliability | Honoured deals, paid debts | Better recruits, higher-tier deals, unlocks key contacts. Slow to build. |
| Contacts | Named people, passives | Cultivated with clean money, gated by Fear or Respect | Specific perks, upgraded over time. |

Fear and Respect pull against each other (Proposed), so fear-heavy and respect-heavy runs play differently.

Topbar resources are fixed. Adding one needs a very strong reason and an entry here first.

### 3.2 Goods (Decided)

Everything that is not a topbar resource is a **good**: drugs, precursors, weapons, liquor, gold. Goods are shown in the **Resources tab**; the player pins some to the **left sidebar**.

- A good is a **family** (weed, cocaine) with **variants** (strains, purities). The UI shows the family total; hovering shows the breakdown.
- There is no fixed cap on goods per era.
- Every good needs a **registry entry**: family, storage type, base heat, base value, value kind, the production chain it belongs to and its sink. A good with no sink or no chain does not ship.

### 3.3 Variant formulas (Proposed)

Variants are defined by parameters, never hand-tuned values. Code: `src/core/variants.ts`. Constants: `BALANCE.variants` and `BALANCE.prices`.

- `quality`: 1 = baseline.
- `originYear`: the year the variant's know-how comes from.

```
priceLevel(year) = (1 + yearlyInflation) ^ (year − 2026)
futureBonus      = min(cap, 1 + futureBonusPerYear × max(0, originYear − year))
unitValue        = faceValue goods:  baseValue
                   commodities:      baseValue × quality^qualityExponent × futureBonus × priceLevel(year)
heatPerUnit      = baseHeatPerUnit × quality^heatQualityExponent
```

So engineered 2050 cocaine sells far better in 2010 than street-grade cocaine. Cash keeps its face value, which makes buried cash lose real value over time while gold keeps it. `priceLevel` is a placeholder for a per-era price table.

## 4. Storage and heat (Decided unless tagged)

### 4.1 Storage

- Every good has a **storage type** (`cash`, `narcotics`, `weapons`, `valuables`, …) and a **base heat per unit per second**.
- Every storage type has a small **base storage** from the start, with high heat.
- **Storage buildings** are built or bought in the Buildings tab. Each holds exactly one storage type and has a capacity and a heat multiplier.
- The **Storage tab** shows what sits where.
- **Auto-allocation** minimises heat: per storage type, sort goods by heat per unit (high first) and slots by heat multiplier (low first), then fill in order. Because buildings are single-type, this is optimal. Code: `allocate()` in `src/core/storage.ts`. There is no manual locking.
- **Full storage pauses production** of that storage type. Nothing is lost. Code: `addGood()` clamps to `freeCapacity()`.

### 4.2 Heat

- **Main source: dirty cash flow**, the smoothed rate of dirty cash earned plus spent per second, times `BALANCE.heat.perCashFlow`.
- **Smaller source: stored goods**, from storage allocation.
- **Decay:** heat moves toward a floor at `decayRate` per second, solved exactly per step: `dHeat/dt = sources − decayRate × (heat − floor)`. The **floor grows with empire size** (`floorPerLogEmpire × log10(1 + empireValue)`), which is the anti-snowball pressure.
- **Effect:** output multiplier, smooth, no cliffs:

```
heatMultiplier = 1 / (1 + heat / softCap)
```

- **Counters (Proposed):** lawyers and bribes lower the floor, lie-low orders speed up decay, clean fronts raise `softCap`.

## 5. Workers (Proposed)

- A worker has an archetype, three stats (Brawn, Cunning, Charm), a level that rises with time on the job, and maybe a trait.
- Job slots live on operations, fronts and special roles. Output = slot base × stat fit × level bonus.
- Recruitment costs dirty cash from a refreshing pool.
- **What you manage zooms out with rank:** individuals → crews → lieutenants running districts.
- Automation rewards: auto-fill, auto-recruit, lieutenants.
- Never lost while away. High heat makes them lie low (lower output).
- **Workers carry over between eras where it makes sense (Decided).** How many and which is set by time machine upgrades (Open).

## 6. Rank ladder within a run (Proposed)

1. **Street hustler:** small jobs, first worker, first front.
2. **Crew boss:** several rackets, more fronts, first crews.
3. **Gang leader:** territory by district.
4. **Syndicate boss:** lieutenants run districts; big heists.
5. **Kingpin:** political influence, era endgame, build the time machine.

Each promotion costs clean money and has Fear or Respect requirements, and changes what the player does.

## 7. Time

### 7.1 Time within a run (Decided)

In-game time always passes: **1 in-game day per real minute**, about 6 real hours per in-game year (`BALANCE.time`). Time drives historical events, inflation and era milestones (for example, Prohibition starts in 1920 and is repealed in 1933).

### 7.2 Eras (Decided for the first three)

| Order | Era | Start | Notes |
| --- | --- | --- | --- |
| 1 | Modern day | 2026 | The time machine is built here. |
| 2 | Prohibition | 1919 | Prohibition arrives in 1920. |
| 3 | 1980s | 1980 | |
| Later | Open | | Chosen by the player. |

Each era must feel thematically and mechanically distinct: new goods, at least one unique mechanic.

### 7.3 Time machine and prestige (Decided)

- Every use of the time machine awards **prestige points** based on how well the run went. Code: `prestigePointsForRun()` (placeholder curve).
- Prestige points **upgrade the time machine itself**, themed as gaining experience with time travel.
- A jump resets the run (`RunState`) and keeps the meta state (`MetaState`).
- **Backward:** the main benefit is knowledge. Upgrades later allow bringing equipment, then workers.
- A second prestige layer (paradoxes) is **Open**.

### 7.4 Time capsules (Decided)

- The player deliberately buries goods in a **time capsule**. The capsule lists its contents; goods carry no capsule property.
- A capsule can be dug up in any year at or after the year it was buried. Travelling back before that, it does not exist yet.
- Contents come back exactly as they went in. The gain comes from value kind: cash keeps face value ($100 in 1980 is $100 in 2020), commodities keep real value (200 g of gold from 1850 is worth far more in 2020).
- Digging up is limited by storage; what does not fit stays buried.
- Capsule construction and size limits are **Open**.

## 8. Events (Decided)

All events are optional. Active players get heat events and unrelated events (for example historical ones). Every event has a relatively neutral option that resolves on its own for idle players.

## 9. Pacing targets (Proposed)

First run of era 1, for a player who checks in a few times a day. Encoded in `sim/targets.ts`.

| Milestone | Target |
| --- | --- |
| First worker recruited | 2 min |
| First laundering front | 10 min |
| Crew boss | 45 min |
| Gang leader | 4 h |
| Syndicate boss | 1.5 days |
| Kingpin; time machine built | 4 days |
| Repeat run of era 1 | under 1 day |

## 10. Numbers (Decided)

- Plain JavaScript numbers. Nothing is designed to exceed 1e308.
- Reaching 1e308 or Infinity (by very long play or cheating) sets `meta.reachedInfinity` and shows an easter egg.
- Display via `formatNumber()`: suffixes up to `Dc`, then scientific.

## 10a. Saving, offline progress and background tabs (Decided)

- **Autosave** to browser storage every 15 s, whenever the tab is hidden, and when the page closes. **Save now** in the Settings tab saves on demand.
- **Export / import:** Settings shows the save as a single string (`CC` + UTF-8 base64 of the JSON save file) to copy and keep; pasting one back replaces the game. Whitespace and line breaks are ignored. Invalid strings are rejected with a reason and change nothing.
- **Hard reset** deletes the save after a second confirming click.
- **Loading** runs migrations, then fills any missing field with its default (`withDefaults` in `save.ts`). That is a safety net; reshaping a field still needs a migration. Saves from a newer version are refused.
- **Offline progress:** on load (and after an import) the game simulates the time away, capped at 7 days, in 10 s steps, or longer steps if that would exceed 20,000 (`BALANCE.offline`). The player sees how long they were away. Cap values are Proposed.
- **Background tabs keep running.** Browsers slow down page timers in hidden tabs, so the heartbeat comes from a Web Worker (`src/ui/ticker.worker.ts`). Every heartbeat calls `advanceTo(state, now)`, which uses real elapsed time and simulates any gap longer than 1 s in steps, so a slowed heartbeat never loses progress. Hidden tabs skip rendering.
- **Step-size independence:** systems should give the same result whether time arrives as many small ticks or a few large steps. Heat does this by solving its equation exactly for each step. New systems must either do the same or be tested against it (see `tests/save.test.ts`).

---

## 11. Code architecture (Decided)

Stack: TypeScript, Vite, React, Vitest. Run with `Start ChronoCrime.bat` or `npm run dev`.

```
src/
  core/     game logic. Pure TypeScript: no DOM, no React, no display text.
    types.ts      definition types
    balance.ts    every tunable constant
    state.ts      GameState = meta (survives jumps) + run (reset per jump) + settings
    tick.ts       tick(state, dt) and offline catch-up. The only way time moves.
    time.ts heat.ts storage.ts inventory.ts variants.ts capsule.ts prestige.ts buildings.ts actions.ts
    save.ts       versioned saves with migrations
    format.ts     number formatting
  data/     content definitions. Plain data only.
  loc/      localization: CSV parser, key registry, t()
  ui/       React components. Read state, call actions. No game rules here.
loc/strings.csv   all display text
sim/              headless balance simulator
scripts/          tooling (localization check)
tests/            Vitest tests
```

### 11.1 Rules

1. **Logic lives in `src/core`, content in `src/data`, text in `loc/strings.csv`.** UI components never compute game rules.
2. **`tick()` is the only thing that advances time.** UI, offline catch-up and the simulator all call it. No `Date.now()` or unseeded randomness inside core.
3. **Every tunable number lives in `BALANCE`** or in a data definition. No magic numbers in logic.
4. **Ids are camelCase**, variant ids are `family.variant` (for example `cocaine.pure`). Ids are permanent once saves exist; renaming one needs a save migration.
5. **Saves are versioned.** Any change to the shape of `GameState` bumps `SAVE_VERSION` and adds a migration in `save.ts`. Never edit an old migration.
6. **Player actions** are functions `(state) => boolean` in core, called from UI through `store.act()`.
7. **Idle-safety is a code rule:** no system may remove player resources, workers or buildings as a consequence of time passing. Pressure is expressed as multipliers.

### 11.2 Localization (Decided)

All prose is written by hand by Magnus. Code never contains display text.

- Every visible string comes from `t(key)`. Content keys are derived from ids (`good.weed.name`, `building.safe.desc`); UI keys are listed in `UI` in `src/loc/keys.ts`.
- `loc/strings.csv` has three columns: `key`, `context` (a hint for the writer, generated), `text` (written by hand).
- `npm run loc:sync` adds rows for any new keys with empty text and refreshes the context column. It never changes written text.
- `npm run loc:check` reports missing, unused and unwritten keys.
- Unwritten text shows in game as `‹key›`, so gaps are visible.
- Placeholders use `{name}`, for example `{seconds}`.
- The CSV can be edited in a text editor, VS Code or Excel. The file is written as UTF-8 with a byte order mark; semicolon-separated files saved by Excel are read correctly.

### 11.3 Balance simulator (Decided)

`npm run sim` plays the game headlessly with a scripted policy, using the same `tick()`, and prints when each pacing milestone was reached against its target. Every new system adds its milestone checks and a policy step. A system is not done until the simulator covers it.

## 12. Checklists

**Adding a good**
1. Add the family and its variants in `src/data/goods.ts`.
2. Add its registry row (storage type, chain, sink) to section 3 of this document.
3. Run `npm run loc:sync`, then write the text.
4. Make sure a production chain and a sink exist, and the simulator exercises them.

**Adding a building**
1. Add it in `src/data/buildings.ts`.
2. Run `npm run loc:sync`.
3. Check its cost curve in the simulator.

**Adding a system**
1. Write its section in this document first, tagged Proposed. Agree on it, then tag Decided.
2. Put its constants in `BALANCE`, its logic in `src/core`, and call it from `tick()` in a fixed order.
3. Add tests and simulator coverage.
4. If it changes `GameState`, bump the save version and add a migration.

## 13. Open questions

- Which eras come after the 1980s?
- Exact rules for which workers can travel through time.
- Worker stats: are three enough, and do traits exist from the start?
- Is a second prestige layer (paradoxes) wanted?
- Time capsules: how are they built, and how big can they get?
- Per-era price tables to replace the flat inflation placeholder.

## 14. Change log

| Date | Change |
| --- | --- |
| 2026-10-21 | Save system: autosave, string export/import, hard reset, offline catch-up, background ticking via a Web Worker. Heat now integrates exactly per step. |
| 2026-10-21 | First version: design brainstorm decisions and project skeleton. |
