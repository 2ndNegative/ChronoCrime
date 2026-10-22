// Definition types. Content lives in src/data and is plain data: no logic, no display text.
// Every id doubles as the stem of its localization keys (see src/loc/keys.ts).
// Costs, durations and growth rates come from the ladders in src/core/ladders.ts, never raw numbers.

import type { GrowthRate } from './ladders';

export type StorageTypeId = string;
export type GoodFamilyId = string;
export type VariantId = string;
export type BuildingId = string;
export type EraId = string;
export type ContactId = string;

/** Topbar resources: permanent in every era. */
export type CoreResourceId = 'dirtyCash' | 'cleanMoney' | 'heat' | 'fear' | 'respect';
export type ActionId = string;

/** Something an action can change: a good (by variant id) or a meter. */
export type ActionTarget = { variant: VariantId } | { meter: 'fear' | 'respect' | 'heat' };

export interface ActionAmount {
  target: ActionTarget;
  amount: number;
}

/**
 * Something the player character does. Runs for a duration, then applies its outcome and repeats.
 * Duration falls strongly and outcome rises mildly with the action's own level.
 */
export interface ActionDef {
  id: ActionId;
  /** Rung on the duration ladder at level 0. */
  durationTier: number;
  /** Consumed when an iteration starts. The action waits if they are missing. */
  inputs: ActionAmount[];
  /** Gained when an iteration completes, scaled by level. */
  outputs: ActionAmount[];
  xpPerCompletion: number;
  /** Another action that must reach a level before this one appears. */
  unlock?: { action: ActionId; level: number };
  /** Main-chain mission that must be complete before this action appears. */
  requiresMission?: MissionId;
}

export type MissionId = string;

/** The tabs that missions can unlock. Actions and Settings are always visible. */
export type TabId = 'resources' | 'buildings' | 'storage' | 'contacts';

/** What a mission asks for. Checked every tick against the current run. */
export type MissionCondition =
  | { kind: 'actionLevel'; action: ActionId; level: number }
  | { kind: 'hold'; variant: VariantId; amount: number }
  | { kind: 'building'; building: BuildingId; count: number }
  | { kind: 'meter'; meter: 'fear' | 'respect'; amount: number }
  | { kind: 'cleanMoney'; amount: number };

/**
 * A step of an era's main chain. Missions complete in order; completing one grants its reward
 * and unlocks what it introduces. Systems appear one at a time, never all at once.
 */
export interface MissionDef {
  id: MissionId;
  era: EraId;
  condition: MissionCondition;
  rewards: ActionAmount[];
  /** Clean money reward, separate because clean money is not a good. */
  rewardClean?: number;
  unlocksTabs?: TabId[];
}

export interface StorageTypeDef {
  id: StorageTypeId;
  /** Free storage every run starts with. Small, and high heat. */
  baseCapacity: number;
  baseHeatMultiplier: number;
}

/**
 * A good family (weed, cocaine, gold) groups variants that share storage.
 * The UI shows the family total; hovering shows the variants.
 */
export interface GoodFamilyDef {
  id: GoodFamilyId;
  storageType: StorageTypeId;
  /** Heat per unit per second before building multipliers, for a quality-1 variant. */
  baseHeatPerUnit: number;
  /** Sale value of a quality-1 variant at the 2026 price level. */
  baseValue: number;
  /** Cash keeps face value across eras; commodities keep real value. */
  valueKind: 'faceValue' | 'commodity';
}

/**
 * Variants are defined by a few parameters. Value, demand and heat are derived
 * from them by the formulas in src/core/variants.ts, never hand-tuned per variant.
 */
export interface VariantDef {
  id: VariantId;
  family: GoodFamilyId;
  /** 1 = baseline. Higher = purer / stronger / better. */
  quality: number;
  /** The year this variant's know-how comes from. Future tech sells better in the past. */
  originYear: number;
}

export interface BuildingCost {
  clean?: number;
  dirty?: number;
}

export interface StorageBuildingDef {
  id: BuildingId;
  storageType: StorageTypeId;
  capacity: number;
  /** Multiplies the heat of goods stored here. Lower is better. */
  heatMultiplier: number;
  cost: BuildingCost;
  /** Growth rate name from GROWTH in ladders.ts, applied per building already owned. */
  costGrowth: GrowthRate;
  /** Eras where this building exists. Empty = every era. */
  eras: EraId[];
  /** Main-chain mission that must be complete before this building appears. */
  requiresMission?: MissionId;
}

export interface EraDef {
  id: EraId;
  startYear: number;
  /** Order in the fixed opening sequence; later eras are chosen freely. */
  order: number;
}

export interface ContactDef {
  id: ContactId;
  /** Which reputation the contact responds to. */
  gate: 'fear' | 'respect';
  gateThreshold: number;
  maxLevel: number;
}
