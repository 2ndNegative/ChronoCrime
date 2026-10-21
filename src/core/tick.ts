import type { GameState } from './state';
import { advanceTime } from './time';
import { updateHeat } from './heat';
import { BALANCE } from './balance';

/** Smoothing factor for the dirty cash flow average, per second. */
const FLOW_SMOOTHING = 0.2;

/**
 * Advances the game by dtSeconds. Pure game logic: no DOM, no clock reads, no randomness
 * without a seeded source. The UI, offline catch-up and the simulator all call this.
 */
export function tick(state: GameState, dtSeconds: number): void {
  const run = state.run;
  advanceTime(run, dtSeconds);

  // Systems run here in a fixed order as they are added: workers, operations, laundering, contacts.

  const instantFlow = run.dirtyMovedThisTick / Math.max(dtSeconds, 1e-6);
  const k = Math.min(1, FLOW_SMOOTHING * dtSeconds);
  run.dirtyFlowPerSecond += (instantFlow - run.dirtyFlowPerSecond) * k;
  run.dirtyMovedThisTick = 0;

  updateHeat(run, dtSeconds);
  checkOverflow(state);
}

/** Catches up after time away, in fixed steps, up to the offline cap. */
export function catchUp(state: GameState, now: number): number {
  const elapsed = Math.min((now - state.lastTickAt) / 1000, BALANCE.offline.maxSeconds);
  let left = Math.max(0, elapsed);
  while (left > 0) {
    const dt = Math.min(left, BALANCE.offline.stepSeconds);
    tick(state, dt);
    left -= dt;
  }
  state.lastTickAt = now;
  return elapsed;
}

function checkOverflow(state: GameState): void {
  const run = state.run;
  const values = [run.cleanMoney, run.heat, run.fear, run.respect, ...Object.values(run.inventory)];
  if (values.some((v) => !Number.isFinite(v) || v >= 1e308)) state.meta.reachedInfinity = true;
}
