import { VARIANTS } from '../data';
import type { RunState } from '../core/state';
import type { GoodFamilyId, VariantId } from '../core/types';

export interface FamilyTotal {
  total: number;
  variants: { id: VariantId; amount: number }[];
}

/** Collapses variants into their family for display; the breakdown goes in the hover. */
export function familyTotal(run: RunState, family: GoodFamilyId): FamilyTotal {
  const variants = VARIANTS.filter((v) => v.family === family).map((v) => ({ id: v.id, amount: run.inventory[v.id] ?? 0 }));
  return { total: variants.reduce((sum, v) => sum + v.amount, 0), variants };
}
