import { describe, expect, it } from 'vitest';
import { newGame } from '../src/core/state';
import { tick } from '../src/core/tick';
import { currentYear } from '../src/core/time';
import { heatMultiplier } from '../src/core/heat';
import { unitValue } from '../src/core/variants';
import { bury, canDigUp, digUp } from '../src/core/capsule';
import { timeTravel } from '../src/core/prestige';

describe('time', () => {
  it('passes one in-game year in about six real hours', () => {
    const state = newGame(0);
    for (let i = 0; i < 6 * 3600 * 1.01389; i += 10) tick(state, 10); // 365 / 360 of six hours
    expect(currentYear(state.run)).toBeCloseTo(2027, 1);
  });
});

describe('heat', () => {
  it('slows output smoothly and never reaches zero', () => {
    expect(heatMultiplier(0)).toBe(1);
    expect(heatMultiplier(100)).toBe(0.5);
    expect(heatMultiplier(1e9)).toBeGreaterThan(0);
  });
});

describe('values across eras', () => {
  it('keeps cash at face value and gives commodities their real value', () => {
    expect(unitValue('dirtyCash', 1980)).toBe(unitValue('dirtyCash', 2020));
    expect(unitValue('gold.bullion', 2020)).toBeGreaterThan(unitValue('gold.bullion', 1850));
  });

  it('makes future variants worth more in the past', () => {
    expect(unitValue('cocaine.engineered2050', 2010) / unitValue('cocaine.pure', 2010)).toBeGreaterThan(
      unitValue('cocaine.engineered2050', 2050) / unitValue('cocaine.pure', 2050),
    );
  });
});

describe('time capsules', () => {
  it('survive a jump and can only be dug up after the year they were buried', () => {
    const state = newGame(0);
    state.run.inventory['gold.bullion'] = 10;
    const capsule = bury(state, { 'gold.bullion': 10 });
    expect(capsule).not.toBeNull();
    timeTravel(state, 'prohibition');
    expect(canDigUp(state, capsule!)).toBe(false);
    state.run.eraId = 'modern';
    state.run.gameDays = 365 * 5;
    expect(digUp(state, capsule!.id)).toBe(true);
    expect(state.run.inventory['gold.bullion']).toBe(10);
    expect(state.meta.capsules).toHaveLength(0);
  });
});
