import { MISSIONS } from '../data';
import type { MissionCondition, MissionDef, MissionId, TabId } from './types';
import type { RunState } from './state';
import { addGood } from './inventory';
import { skill } from './actions';

/** The main chain of the run's era, in order. */
export function chain(run: RunState): MissionDef[] {
  return MISSIONS.filter((m) => m.era === run.eraId);
}

export function isMissionDone(run: RunState, id: MissionId): boolean {
  return run.missions.completed.includes(id);
}

/** The next mission of the main chain, or null when the chain is finished. */
export function currentMission(run: RunState): MissionDef | null {
  return chain(run).find((m) => !isMissionDone(run, m.id)) ?? null;
}

/** Progress toward a condition as current / target, for display and completion. */
export function progress(run: RunState, c: MissionCondition): { current: number; target: number } {
  switch (c.kind) {
    case 'actionLevel':
      return { current: skill(run, c.action).level, target: c.level };
    case 'hold':
      return { current: run.inventory[c.variant] ?? 0, target: c.amount };
    case 'building':
      return { current: run.buildings[c.building] ?? 0, target: c.count };
    case 'meter':
      return { current: run[c.meter], target: c.amount };
    case 'cleanMoney':
      return { current: run.cleanMoney, target: c.amount };
  }
}

/** Completes the current mission (and any following ones already met), granting rewards. */
export function checkMissions(run: RunState): MissionId[] {
  const done: MissionId[] = [];
  for (let m = currentMission(run); m; m = currentMission(run)) {
    const p = progress(run, m.condition);
    if (p.current < p.target) break;
    for (const r of m.rewards) {
      if ('variant' in r.target) addGood(run, r.target.variant, r.amount);
      else run[r.target.meter] += r.amount;
    }
    run.cleanMoney += m.rewardClean ?? 0;
    run.missions.completed.push(m.id);
    run.missions.recent = m.id;
    done.push(m.id);
  }
  return done;
}

/** Gate for anything that names a required mission. */
export function missionGate(run: RunState, requires: MissionId | undefined): boolean {
  return !requires || isMissionDone(run, requires);
}

export function isTabUnlocked(run: RunState, tab: TabId): boolean {
  return chain(run).some((m) => isMissionDone(run, m.id) && m.unlocksTabs?.includes(tab));
}
