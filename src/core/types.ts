// Definition types. Content lives in src/data and is plain data: no logic, no display text.
// Every id doubles as the stem of its localization keys (see src/loc/keys.ts).

export type StorageTypeId = string;
export type GoodFamilyId = string;
export type VariantId = string;
export type BuildingId = string;
export type EraId = string;
export type ContactId = string;

/** Topbar resources: permanent in every era. */
export type CoreResourceId = 'dirtyCash' | 'cleanMoney' | 'heat' | 'fear' | 'respect' | 'contacts';

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
  /** Cost multiplier per building already owned. */
  costGrowth: number;
  /** Eras where this building exists. Empty = every era. */
  eras: EraId[];
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
