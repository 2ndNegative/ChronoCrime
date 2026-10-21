import type { GameState } from './state';
import { addGood, DIRTY_CASH } from './inventory';
import { heatMultiplier } from './heat';

// Player actions. Each one mutates state and returns whether it did anything.

/** Placeholder first action so the skeleton has something to click. */
export function hustle(state: GameState): boolean {
  return addGood(state.run, DIRTY_CASH, 5 * heatMultiplier(state.run.heat)) > 0;
}
