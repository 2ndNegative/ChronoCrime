import type { BuildingId, ContactId, EraId, GoodFamilyId, VariantId } from './types';
import { ERAS } from '../data';

export interface WorkerStats {
  brawn: number;
  cunning: number;
  charm: number;
}

export interface Worker {
  id: string;
  archetype: string;
  stats: WorkerStats;
  level: number;
  xp: number;
  /** Job slot the worker is placed in, or null when idle. */
  jobId: string | null;
}

/** A time capsule lists the goods buried in it. Goods themselves know nothing about capsules. */
export interface TimeCapsule {
  id: string;
  buriedYear: number;
  contents: Record<VariantId, number>;
}

/** Survives time machine jumps. */
export interface MetaState {
  prestigePoints: number;
  totalJumps: number;
  timeMachineUpgrades: Record<string, number>;
  capsules: TimeCapsule[];
  /** Set once any number overflows past 1e308. Unlocks the easter egg. */
  reachedInfinity: boolean;
}

/** Reset on every time machine jump. */
export interface RunState {
  eraId: EraId;
  /** In-game days since the run started. */
  gameDays: number;
  /** Clean money sits in a bank account and has no limit. */
  cleanMoney: number;
  /** Every physical good, dirty cash included, keyed by variant id. Needs storage. */
  inventory: Record<VariantId, number>;
  heat: number;
  fear: number;
  respect: number;
  buildings: Record<BuildingId, number>;
  contacts: Record<ContactId, number>;
  workers: Worker[];
  /** Dirty cash moved (earned + spent) since the last tick. Feeds cash-flow heat. */
  dirtyMovedThisTick: number;
  /** Smoothed dirty cash flow per second, for display and heat. */
  dirtyFlowPerSecond: number;
}

/** Player preferences stored with the save. */
export interface Settings {
  /** Good families shown in the left sidebar. Everything is always visible in the Resources tab. */
  pinnedFamilies: GoodFamilyId[];
}

export interface GameState {
  meta: MetaState;
  run: RunState;
  settings: Settings;
  /** Real-time timestamp (ms) of the last tick, for offline progress. */
  lastTickAt: number;
}

export function newRun(eraId: EraId): RunState {
  return {
    eraId,
    gameDays: 0,
    cleanMoney: 0,
    inventory: {},
    heat: 0,
    fear: 0,
    respect: 0,
    buildings: {},
    contacts: {},
    workers: [],
    dirtyMovedThisTick: 0,
    dirtyFlowPerSecond: 0,
  };
}

export function newGame(now: number): GameState {
  const first = [...ERAS].sort((a, b) => a.order - b.order)[0];
  if (!first) throw new Error('No eras defined');
  return {
    meta: { prestigePoints: 0, totalJumps: 0, timeMachineUpgrades: {}, capsules: [], reachedInfinity: false },
    run: newRun(first.id),
    settings: { pinnedFamilies: ['weed', 'cocaine'] },
    lastTickAt: now,
  };
}
