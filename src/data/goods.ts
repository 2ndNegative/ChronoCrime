import type { GoodFamilyDef, VariantDef } from '../core/types';

// Placeholder content to exercise the systems. Replace freely.

export const GOOD_FAMILIES: GoodFamilyDef[] = [
  { id: 'dirtyCash', storageType: 'cash', baseHeatPerUnit: 0.0002, baseValue: 1, valueKind: 'faceValue' },
  { id: 'weed', storageType: 'narcotics', baseHeatPerUnit: 0.01, baseValue: 10, valueKind: 'commodity' },
  { id: 'cocaine', storageType: 'narcotics', baseHeatPerUnit: 0.05, baseValue: 80, valueKind: 'commodity' },
  { id: 'pistols', storageType: 'weapons', baseHeatPerUnit: 0.1, baseValue: 400, valueKind: 'commodity' },
  { id: 'gold', storageType: 'valuables', baseHeatPerUnit: 0.001, baseValue: 70, valueKind: 'commodity' },
];

export const VARIANTS: VariantDef[] = [
  { id: 'dirtyCash', family: 'dirtyCash', quality: 1, originYear: 2026 },
  { id: 'weed.street', family: 'weed', quality: 1, originYear: 2026 },
  { id: 'weed.premium', family: 'weed', quality: 2, originYear: 2026 },
  { id: 'cocaine.cut', family: 'cocaine', quality: 0.6, originYear: 2026 },
  { id: 'cocaine.pure', family: 'cocaine', quality: 1.5, originYear: 2026 },
  { id: 'cocaine.engineered2050', family: 'cocaine', quality: 3, originYear: 2050 },
  { id: 'pistols.standard', family: 'pistols', quality: 1, originYear: 2026 },
  { id: 'gold.bullion', family: 'gold', quality: 1, originYear: 1850 },
];
