import type { StorageBuildingDef } from '../core/types';
import { costTier } from '../core/ladders';

export const STORAGE_BUILDINGS: StorageBuildingDef[] = [
  { id: 'mattress', storageType: 'cash', capacity: 2_000, heatMultiplier: 0.8, cost: { dirty: costTier(2) }, costGrowth: 'standard', eras: [] },
  { id: 'safe', requiresMission: 'makeAName', storageType: 'cash', capacity: 20_000, heatMultiplier: 0.4, cost: { clean: costTier(5) }, costGrowth: 'standard', eras: [] },
  { id: 'buriedCache', requiresMission: 'makeAName', storageType: 'cash', capacity: 100_000, heatMultiplier: 0.02, cost: { dirty: costTier(6) }, costGrowth: 'steep', eras: [] },
  { id: 'stashHouse', requiresMission: 'firstDeal', storageType: 'narcotics', capacity: 500, heatMultiplier: 0.6, cost: { dirty: costTier(4) }, costGrowth: 'standard', eras: [] },
  { id: 'gunLocker', requiresMission: 'makeAName', storageType: 'weapons', capacity: 50, heatMultiplier: 0.5, cost: { dirty: costTier(5) }, costGrowth: 'standard', eras: [] },
  { id: 'vault', requiresMission: 'makeAName', storageType: 'valuables', capacity: 500, heatMultiplier: 0.1, cost: { clean: costTier(7) }, costGrowth: 'steep', eras: [] },
];
