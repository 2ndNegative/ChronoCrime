import type { GameState, TimeCapsule } from './state';
import type { VariantId } from './types';
import { spendGood, addGood } from './inventory';
import { currentYear } from './time';

/**
 * Buries goods in a new capsule. The capsule lists its contents; goods carry no capsule flag.
 * Value on retrieval follows the variant's value kind: cash keeps face value, commodities keep real value.
 */
export function bury(state: GameState, contents: Record<VariantId, number>): TimeCapsule | null {
  const run = state.run;
  for (const [id, amount] of Object.entries(contents)) {
    if ((run.inventory[id] ?? 0) < amount) return null;
  }
  for (const [id, amount] of Object.entries(contents)) spendGood(run, id, amount);
  const capsule: TimeCapsule = {
    id: `capsule-${state.meta.capsules.length + 1}-${Math.floor(run.gameDays)}`,
    buriedYear: Math.floor(currentYear(run)),
    contents: { ...contents },
  };
  state.meta.capsules.push(capsule);
  return capsule;
}

/** A capsule can only be dug up in a year after it was buried. Travelling backward, it does not exist yet. */
export function canDigUp(state: GameState, capsule: TimeCapsule): boolean {
  return currentYear(state.run) >= capsule.buriedYear;
}

/** Moves capsule contents into inventory, limited by storage. Whatever does not fit stays buried. */
export function digUp(state: GameState, capsuleId: string): boolean {
  const capsule = state.meta.capsules.find((c) => c.id === capsuleId);
  if (!capsule || !canDigUp(state, capsule)) return false;
  for (const [id, amount] of Object.entries(capsule.contents)) {
    capsule.contents[id] = amount - addGood(state.run, id, amount);
  }
  if (Object.values(capsule.contents).every((a) => a <= 0)) {
    state.meta.capsules = state.meta.capsules.filter((c) => c !== capsule);
  }
  return true;
}
