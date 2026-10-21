import { describe, expect, it } from 'vitest';
import { newGame } from '../src/core/state';
import { allocate, freeCapacity } from '../src/core/storage';
import { addGood } from '../src/core/inventory';
import { heatPerUnit } from '../src/core/variants';

describe('storage allocation', () => {
  it('puts the hottest goods in the coolest buildings', () => {
    const { run } = newGame(0);
    run.buildings.stashHouse = 1; // 500 capacity at x0.6, base is 50 at x1
    run.inventory['cocaine.pure'] = 400;
    run.inventory['weed.street'] = 140;
    const report = allocate(run, 'narcotics');
    const cocaine = report.placements.filter((p) => p.variantId === 'cocaine.pure');
    expect(cocaine).toEqual([{ variantId: 'cocaine.pure', source: 'stashHouse', amount: 400 }]);
    const weed = report.placements.filter((p) => p.variantId === 'weed.street');
    expect(weed).toEqual([
      { variantId: 'weed.street', source: 'stashHouse', amount: 100 },
      { variantId: 'weed.street', source: 'base', amount: 40 },
    ]);
    const expected = 400 * heatPerUnit('cocaine.pure') * 0.6 + 100 * heatPerUnit('weed.street') * 0.6 + 40 * heatPerUnit('weed.street') * 1;
    expect(report.heatPerSecond).toBeCloseTo(expected);
  });

  it('pauses instead of losing goods when storage is full', () => {
    const { run } = newGame(0);
    expect(freeCapacity(run, 'weed.street')).toBe(50);
    expect(addGood(run, 'weed.street', 80)).toBe(50);
    expect(addGood(run, 'weed.premium', 10)).toBe(0);
    expect(run.inventory['weed.street']).toBe(50);
  });
});
