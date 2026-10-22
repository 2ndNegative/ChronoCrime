import { action as actionDef, ACTIONS } from '../data';
import type { ActionDef, ActionAmount, ActionId } from './types';
import type { ActionSkill, GameState, RunState } from './state';
import { addGood, spendGood } from './inventory';
import { freeCapacity } from './storage';
import { heatMultiplier } from './heat';
import { CURVES, durationTier, xpToNext } from './ladders';

/** Safety valve: completions handled per tick. Long offline steps are already split by simulate(). */
const MAX_COMPLETIONS_PER_TICK = 10_000;

export function skill(run: RunState, id: ActionId): ActionSkill {
  return run.actionSkills[id] ?? { xp: 0, level: 0, completions: 0 };
}

/** Seconds per iteration. Falls strongly with level. */
export function actionDuration(def: ActionDef, level: number): number {
  return durationTier(def.durationTier) * Math.pow(1 + level, CURVES.actionDuration);
}

/** Multiplier on outputs. Rises mildly with level. */
export function outcomeScale(level: number): number {
  return Math.pow(1 + level, CURVES.actionOutcome);
}

export function isUnlocked(run: RunState, def: ActionDef): boolean {
  return (
    (!def.unlock || skill(run, def.unlock.action).level >= def.unlock.level) &&
    (!def.requiresMission || run.missions.completed.includes(def.requiresMission))
  );
}

export function unlockedActions(run: RunState): ActionDef[] {
  return ACTIONS.filter((def) => isUnlocked(run, def));
}

/** Switches the character to an action (or to nothing). Starting over loses the current iteration. */
export function setAction(state: GameState, id: ActionId | null): boolean {
  const run = state.run;
  if (id !== null && !isUnlocked(run, actionDef(id))) return false;
  refundInputs(run);
  run.character = { actionId: id, progress: 0, inputsPaid: false, stalled: null };
  return true;
}

/** Advances the character's action by dt seconds, completing as many iterations as fit. */
export function runCharacter(run: RunState, dtSeconds: number): void {
  const c = run.character;
  if (!c.actionId) return;
  const def = actionDef(c.actionId);
  let left = dtSeconds;
  let completions = 0;
  while (left > 0 && completions < MAX_COMPLETIONS_PER_TICK) {
    if (!c.inputsPaid) {
      if (outputsBlocked(run, def)) return void (c.stalled = 'storage');
      if (!payInputs(run, def.inputs)) return void (c.stalled = 'inputs');
      c.inputsPaid = true;
      c.stalled = null;
    }
    const need = actionDuration(def, skill(run, def.id).level) - c.progress;
    if (left < need) {
      c.progress += left;
      return;
    }
    left -= need;
    complete(run, def);
    c.progress = 0;
    c.inputsPaid = false;
    completions++;
  }
}

function complete(run: RunState, def: ActionDef): void {
  const s = { ...skill(run, def.id) };
  const scale = outcomeScale(s.level) * heatMultiplier(run.heat);
  for (const out of def.outputs) apply(run, out, out.amount * scale);
  s.completions += 1;
  s.xp += def.xpPerCompletion;
  while (s.xp >= xpToNext(s.level)) {
    s.xp -= xpToNext(s.level);
    s.level += 1;
  }
  run.actionSkills[def.id] = s;
}

function apply(run: RunState, a: ActionAmount, amount: number): void {
  if ('variant' in a.target) addGood(run, a.target.variant, amount);
  else run[a.target.meter] = Math.max(0, run[a.target.meter] + amount);
}

/** Idle-safe: an action whose goods outputs all have no room waits instead of wasting its inputs. */
function outputsBlocked(run: RunState, def: ActionDef): boolean {
  const goods = def.outputs.filter((o) => 'variant' in o.target);
  return goods.length > 0 && goods.every((o) => 'variant' in o.target && freeCapacity(run, o.target.variant) <= 0);
}

function payInputs(run: RunState, inputs: ActionAmount[]): boolean {
  for (const i of inputs) {
    if (!('variant' in i.target) || (run.inventory[i.target.variant] ?? 0) < i.amount) return false;
  }
  for (const i of inputs) if ('variant' in i.target) spendGood(run, i.target.variant, i.amount);
  return true;
}

function refundInputs(run: RunState): void {
  const c = run.character;
  if (!c.actionId || !c.inputsPaid) return;
  for (const i of actionDef(c.actionId).inputs) if ('variant' in i.target) addGood(run, i.target.variant, i.amount);
}
