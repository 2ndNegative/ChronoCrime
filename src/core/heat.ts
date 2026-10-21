import { BALANCE } from './balance';
import type { RunState } from './state';
import { allocateAll } from './storage';
import { unitValue } from './variants';
import { currentYear } from './time';

/** Smooth production drag. No cliffs, never confiscates. */
export function heatMultiplier(heat: number): number {
  return 1 / (1 + heat / BALANCE.heat.softCap);
}

/** Rough size of the empire, used for the heat floor (anti-snowball). */
export function empireValue(run: RunState): number {
  const year = currentYear(run);
  let total = run.cleanMoney;
  for (const [id, amount] of Object.entries(run.inventory)) total += amount * unitValue(id, year);
  return total;
}

export function heatFloor(run: RunState): number {
  return BALANCE.heat.floorPerLogEmpire * Math.log10(1 + empireValue(run));
}

export function heatSources(run: RunState): { storage: number; cashFlow: number } {
  const storage = allocateAll(run).reduce((sum, r) => sum + r.heatPerSecond, 0);
  const cashFlow = run.dirtyFlowPerSecond * BALANCE.heat.perCashFlow;
  return { storage, cashFlow };
}

/**
 * Heat rises with its sources and decays toward the floor:
 *   dHeat/dt = sources − decayRate × (heat − floor)
 * Solved exactly for the step, so a 10 s offline step lands where a hundred 0.1 s live ticks would.
 */
export function updateHeat(run: RunState, dtSeconds: number): void {
  const { storage, cashFlow } = heatSources(run);
  const rate = BALANCE.heat.decayRate;
  const equilibrium = heatFloor(run) + (storage + cashFlow) / rate;
  run.heat = Math.max(0, equilibrium + (run.heat - equilibrium) * Math.exp(-rate * dtSeconds));
}
