import type { RunState } from './state';
import type { VariantId } from './types';
import { freeCapacity } from './storage';

export const DIRTY_CASH: VariantId = 'dirtyCash';

/** Adds up to `amount`, limited by free storage. Returns what was actually added. */
export function addGood(run: RunState, id: VariantId, amount: number): number {
  const added = Math.min(amount, freeCapacity(run, id));
  if (added <= 0) return 0;
  run.inventory[id] = (run.inventory[id] ?? 0) + added;
  if (id === DIRTY_CASH) run.dirtyMovedThisTick += added;
  return added;
}

/** Removes `amount` if available. Returns false and changes nothing otherwise. */
export function spendGood(run: RunState, id: VariantId, amount: number): boolean {
  const have = run.inventory[id] ?? 0;
  if (have < amount) return false;
  run.inventory[id] = have - amount;
  if (id === DIRTY_CASH) run.dirtyMovedThisTick += amount;
  return true;
}

export function dirtyCash(run: RunState): number {
  return run.inventory[DIRTY_CASH] ?? 0;
}
