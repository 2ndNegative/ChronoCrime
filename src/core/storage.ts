import { STORAGE_TYPES, VARIANTS, storageBuilding, storageType, goodFamily, variant } from '../data';
import type { RunState } from './state';
import type { StorageTypeId, VariantId } from './types';
import { heatPerUnit } from './variants';

export interface StorageSlot {
  /** 'base' or a building id. */
  source: string;
  capacity: number;
  heatMultiplier: number;
}

export interface Placement {
  variantId: VariantId;
  source: string;
  amount: number;
}

export interface StorageReport {
  storageType: StorageTypeId;
  capacity: number;
  used: number;
  placements: Placement[];
  heatPerSecond: number;
}

export function slotsFor(run: RunState, typeId: StorageTypeId): StorageSlot[] {
  const type = storageType(typeId);
  const slots: StorageSlot[] = [{ source: 'base', capacity: type.baseCapacity, heatMultiplier: type.baseHeatMultiplier }];
  for (const [buildingId, count] of Object.entries(run.buildings)) {
    const def = storageBuilding(buildingId);
    if (def.storageType !== typeId || count <= 0) continue;
    slots.push({ source: buildingId, capacity: def.capacity * count, heatMultiplier: def.heatMultiplier });
  }
  return slots;
}

export function storageTypeOf(id: VariantId): StorageTypeId {
  return goodFamily(variant(id).family).storageType;
}

/**
 * Places goods to minimise total heat: the hottest goods go into the coolest slots.
 * Buildings hold a single storage type, so sorting both lists is optimal (rearrangement inequality).
 */
export function allocate(run: RunState, typeId: StorageTypeId): StorageReport {
  const slots = slotsFor(run, typeId).sort((a, b) => a.heatMultiplier - b.heatMultiplier);
  const goods = VARIANTS.filter((v) => storageTypeOf(v.id) === typeId && (run.inventory[v.id] ?? 0) > 0)
    .map((v) => ({ id: v.id, amount: run.inventory[v.id] ?? 0, heat: heatPerUnit(v.id) }))
    .sort((a, b) => b.heat - a.heat);

  const placements: Placement[] = [];
  let heatPerSecond = 0;
  let slotIndex = 0;
  let slotLeft = slots[0]?.capacity ?? 0;

  for (const good of goods) {
    let left = good.amount;
    while (left > 0 && slotIndex < slots.length) {
      const slot = slots[slotIndex]!;
      const amount = Math.min(left, slotLeft);
      if (amount > 0) {
        placements.push({ variantId: good.id, source: slot.source, amount });
        heatPerSecond += amount * good.heat * slot.heatMultiplier;
        left -= amount;
        slotLeft -= amount;
      }
      if (slotLeft <= 0) {
        slotIndex++;
        slotLeft = slots[slotIndex]?.capacity ?? 0;
      }
    }
  }

  const capacity = slots.reduce((sum, s) => sum + s.capacity, 0);
  const used = goods.reduce((sum, g) => sum + g.amount, 0);
  return { storageType: typeId, capacity, used, placements, heatPerSecond };
}

export function allocateAll(run: RunState): StorageReport[] {
  return STORAGE_TYPES.map((t) => allocate(run, t.id));
}

/** Free space for a variant's storage type. Production clamps to this: full storage pauses, never loses. */
export function freeCapacity(run: RunState, id: VariantId): number {
  const typeId = storageTypeOf(id);
  const capacity = slotsFor(run, typeId).reduce((sum, s) => sum + s.capacity, 0);
  const used = VARIANTS.filter((v) => storageTypeOf(v.id) === typeId).reduce(
    (sum, v) => sum + (run.inventory[v.id] ?? 0),
    0,
  );
  return Math.max(0, capacity - used);
}
