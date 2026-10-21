import { storageBuilding } from '../data';
import type { RunState } from './state';
import type { BuildingCost, BuildingId } from './types';
import { DIRTY_CASH, dirtyCash, spendGood } from './inventory';

export function buildingCost(run: RunState, id: BuildingId): BuildingCost {
  const def = storageBuilding(id);
  const scale = Math.pow(def.costGrowth, run.buildings[id] ?? 0);
  return {
    dirty: def.cost.dirty ? def.cost.dirty * scale : undefined,
    clean: def.cost.clean ? def.cost.clean * scale : undefined,
  };
}

export function canAfford(run: RunState, cost: BuildingCost): boolean {
  return dirtyCash(run) >= (cost.dirty ?? 0) && run.cleanMoney >= (cost.clean ?? 0);
}

export function buyBuilding(run: RunState, id: BuildingId): boolean {
  const cost = buildingCost(run, id);
  if (!canAfford(run, cost)) return false;
  if (cost.dirty) spendGood(run, DIRTY_CASH, cost.dirty);
  if (cost.clean) run.cleanMoney -= cost.clean;
  run.buildings[id] = (run.buildings[id] ?? 0) + 1;
  return true;
}
