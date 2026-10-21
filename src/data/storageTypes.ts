import type { StorageTypeDef } from '../core/types';

export const STORAGE_TYPES: StorageTypeDef[] = [
  { id: 'cash', baseCapacity: 500, baseHeatMultiplier: 1 },
  { id: 'narcotics', baseCapacity: 50, baseHeatMultiplier: 1 },
  { id: 'weapons', baseCapacity: 10, baseHeatMultiplier: 1 },
  { id: 'valuables', baseCapacity: 20, baseHeatMultiplier: 0.5 },
];
