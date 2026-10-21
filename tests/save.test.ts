import { describe, expect, it } from 'vitest';
import { newGame } from '../src/core/state';
import { SaveError, deserialize, exportSave, importSave, serialize } from '../src/core/save';
import { advanceTo, simulate } from '../src/core/tick';
import { BALANCE } from '../src/core/balance';

describe('save strings', () => {
  it('round-trips through export and import', () => {
    const state = newGame(1_000);
    state.run.cleanMoney = 1234.5;
    state.run.inventory['cocaine.pure'] = 7;
    state.meta.capsules.push({ id: 'c1', buriedYear: 2030, contents: { 'gold.bullion': 3 } });
    expect(importSave(exportSave(state))).toEqual(state);
  });

  it('ignores whitespace and line breaks from copy and paste', () => {
    const text = exportSave(newGame(0));
    const wrapped = text.match(/.{1,40}/g)!.join('\n  ');
    expect(importSave(` ${wrapped} `)).toEqual(newGame(0));
  });

  it('rejects strings that are not saves', () => {
    expect(() => importSave('hello')).toThrow(SaveError);
    expect(() => importSave('CC!!!not-base64')).toThrow(SaveError);
    expect(() => importSave('CC' + btoa('{"no":"version"}'))).toThrow(SaveError);
  });

  it('rejects saves from a newer version', () => {
    const text = JSON.stringify({ version: 999, state: newGame(0) });
    expect(() => deserialize(text)).toThrow(/newer version/);
  });

  it('fills in fields missing from an older save', () => {
    const state: any = newGame(0);
    delete state.settings;
    delete state.meta.reachedInfinity;
    const loaded = deserialize(serialize(state));
    expect(loaded.settings.pinnedFamilies).toEqual(newGame(0).settings.pinnedFamilies);
    expect(loaded.meta.reachedInfinity).toBe(false);
  });
});

describe('catching up', () => {
  it('simulates time away, capped at the offline maximum', () => {
    const state = newGame(0);
    const away = advanceTo(state, 30 * 24 * 3600 * 1000);
    expect(away).toBe(BALANCE.offline.maxSeconds);
    expect(state.run.gameDays).toBeCloseTo(BALANCE.offline.maxSeconds * BALANCE.time.daysPerSecond);
    expect(state.lastTickAt).toBe(30 * 24 * 3600 * 1000);
  });

  it('gives the same result whether the tab ticked live or caught up later', () => {
    const live = newGame(0);
    live.run.inventory.dirtyCash = 400;
    const later = structuredClone(live);
    for (let i = 0; i < 600; i++) advanceTo(live, (i + 1) * 100);
    simulate(later, 60);
    expect(later.run.gameDays).toBeCloseTo(live.run.gameDays);
    expect(later.run.heat).toBeCloseTo(live.run.heat, 3);
  });
});
