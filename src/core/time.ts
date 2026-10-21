import { BALANCE } from './balance';
import { era } from '../data';
import type { RunState } from './state';

/** Fractional in-game year, e.g. 1920.5. */
export function currentYear(run: RunState): number {
  return era(run.eraId).startYear + run.gameDays / BALANCE.time.daysPerYear;
}

export function advanceTime(run: RunState, dtSeconds: number): void {
  run.gameDays += dtSeconds * BALANCE.time.daysPerSecond;
}

/** Calendar date for display. Day-level precision is enough. */
export function currentDate(run: RunState): Date {
  const start = Date.UTC(era(run.eraId).startYear, 0, 1);
  return new Date(start + Math.floor(run.gameDays) * 86_400_000);
}
