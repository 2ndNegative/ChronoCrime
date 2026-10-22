import type { GameState } from './state';
import { newRun } from './state';
import type { EraId } from './types';
import { empireValue } from './heat';

/** Prestige points for using the time machine now. Placeholder curve until the simulator tunes it. */
export function prestigePointsForRun(state: GameState): number {
  return Math.floor(Math.sqrt(empireValue(state.run) / 10_000));
}

/** Uses the time machine: awards prestige points and starts a fresh run in the target era. */
export function timeTravel(state: GameState, target: EraId): void {
  state.meta.prestigePoints += prestigePointsForRun(state);
  state.meta.totalJumps += 1;
  state.meta.characterAgeless = true;
  state.run = newRun(target);
}
