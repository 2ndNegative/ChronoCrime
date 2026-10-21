import type { StorageBuildingDef } from '../core/types';

export const STORAGE_BUILDINGS: StorageBuildingDef[] = [
  { id: 'mattress', storageType: 'cash', capacity: 2_000, heatMultiplier: 0.8, cost: { dirty: 100 }, costGrowth: 1.15, eras: [] },
  { id: 'safe', storageType: 'cash', capacity: 20_000, heatMultiplier: 0.4, cost: { clean: 2_000 }, costGrowth: 1.2, eras: [] },
  { id: 'buriedCache', storageType: 'cash', capacity: 100_000, heatMultiplier: 0.02, cost: { dirty: 5_000 }, costGrowth: 1.25, eras: [] },
  { id: 'stashHouse', storageType: 'narcotics', capacity: 500, heatMultiplier: 0.6, cost: { dirty: 1_500 }, costGrowth: 1.2, eras: [] },
  { id: 'gunLocker', storageType: 'weapons', capacity: 50, heatMultiplier: 0.5, cost: { dirty: 3_000 }, costGrowth: 1.2, eras: [] },
  { id: 'vault', storageType: 'valuables', capacity: 500, heatMultiplier: 0.1, cost: { clean: 20_000 }, costGrowth: 1.3, eras: [] },
];
