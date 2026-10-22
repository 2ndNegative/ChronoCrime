import type { GameState } from './state';
import { advanceTime } from './time';
import { updateHeat } from './heat';
import { BALANCE } from './balance';
import { runCharacter } from './actions';
import { checkMissions } from './missions';

/** Smoothing factor for the dirty cash flow average, per second. */
const FLOW_SMOOTHING = 0.2;

/** Gaps longer than this are simulated in steps instead of one big tick. */
const MAX_LIVE_STEP_SECONDS = 1;

/**
 * Advances the game by dtSeconds. Pure game logic: no DOM, no clock reads, no randomness
 * without a seeded source. The UI, offline catch-up and the simulator all call this.
 */
export function tick(state: GameState, dtSeconds: number): void {
  const run = state.run;
  advanceTime(run, dtSeconds);

  // Systems run here in a fixed order as they are added: character, workers, operations, laundering, contacts.
  runCharacter(run, dtSeconds);

  const instantFlow = run.dirtyMovedThisTick / Math.max(dtSeconds, 1e-6);
  const k = Math.min(1, FLOW_SMOOTHING * dtSeconds);
  run.dirtyFlowPerSecond += (instantFlow - run.dirtyFlowPerSecond) * k;
  run.dirtyMovedThisTick = 0;

  updateHeat(run, dtSeconds);
  checkMissions(run);
  checkOverflow(state);
}

/**
 * Simulates `seconds` in fixed steps. Steps stay at BALANCE.offline.stepSeconds unless that
 * would exceed maxSteps, in which case they get longer so loading stays fast.
 */
export function simulate(state: GameState, seconds: number): void {
  const { stepSeconds, maxSteps } = BALANCE.offline;
  const step = Math.max(stepSeconds, seconds / maxSteps);
  let left = seconds;
  while (left > 0) {
    const dt = Math.min(left, step);
    tick(state, dt);
    left -= dt;
  }
}

/**
 * Brings the game up to `now` (ms). Used by the live loop, by background tabs whose timers the
 * browser slows down, and after loading. Short gaps are one tick; longer ones are simulated in
 * steps, capped at BALANCE.offline.maxSeconds. Returns the seconds simulated.
 */
export function advanceTo(state: GameState, now: number): number {
  const elapsed = Math.min(Math.max(0, (now - state.lastTickAt) / 1000), BALANCE.offline.maxSeconds);
  if (elapsed <= MAX_LIVE_STEP_SECONDS) tick(state, elapsed);
  else simulate(state, elapsed);
  state.lastTickAt = now;
  return elapsed;
}

function checkOverflow(state: GameState): void {
  const run = state.run;
  const values = [run.cleanMoney, run.heat, run.fear, run.respect, ...Object.values(run.inventory)];
  if (values.some((v) => !Number.isFinite(v) || v >= 1e308)) state.meta.reachedInfinity = true;
}
