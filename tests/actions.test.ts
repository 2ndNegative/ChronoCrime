import { describe, expect, it } from 'vitest';
import { newGame } from '../src/core/state';
import { actionDuration, outcomeScale, setAction, skill, unlockedActions } from '../src/core/actions';
import { tick, simulate } from '../src/core/tick';
import { action } from '../src/data';
import { deserialize } from '../src/core/save';
import { costTier, grownCost, GROWTH } from '../src/core/ladders';

describe('actions', () => {
  it('level strongly lowers duration and mildly raises outcome', () => {
    const def = action('pettyTheft');
    expect(actionDuration(def, 10) / actionDuration(def, 0)).toBeLessThan(0.3);
    expect(outcomeScale(10)).toBeGreaterThan(1.2);
    expect(outcomeScale(10)).toBeLessThan(1.6);
  });

  it('repeats, earns output and XP, and unlocks the next action', () => {
    const state = newGame(0);
    expect(unlockedActions(state.run).map((a) => a.id)).toEqual(['pettyTheft']);
    setAction(state, 'pettyTheft');
    for (let i = 0; i < 600; i++) tick(state, 0.1);
    expect(skill(state.run, 'pettyTheft').completions).toBeGreaterThan(20);
    expect(state.run.inventory.dirtyCash).toBeGreaterThan(100);
    // buyWeed's level requirement is met, but it also waits for the firstStash mission.
    expect(unlockedActions(state.run).map((a) => a.id)).not.toContain('buyWeed');
    state.run.missions.completed.push('firstStash');
    expect(unlockedActions(state.run).map((a) => a.id)).toContain('buyWeed');
  });

  it('gives the same result live or caught up', () => {
    const live = newGame(0);
    setAction(live, 'pettyTheft');
    const later = structuredClone(live);
    for (let i = 0; i < 3000; i++) tick(live, 0.1);
    simulate(later, 300);
    expect(skill(later.run, 'pettyTheft')).toEqual(skill(live.run, 'pettyTheft'));
    expect(later.run.inventory.dirtyCash).toBeCloseTo(live.run.inventory.dirtyCash ?? 0, 6);
  });

  it('waits when inputs are missing, without losing anything', () => {
    const state = newGame(0);
    state.run.actionSkills.buyWeed = { xp: 0, level: 1, completions: 0 };
    state.run.actionSkills.pettyTheft = { xp: 0, level: 3, completions: 0 };
    state.run.inventory.dirtyCash = 10;
    state.run.missions.completed = ['firstJob', 'pocketsFull', 'firstStash'];
    setAction(state, 'buyWeed');
    tick(state, 60);
    expect(state.run.character.stalled).toBe('inputs');
    expect(state.run.inventory.dirtyCash).toBe(10);
  });

  it('waits when storage for its output is full', () => {
    const state = newGame(0);
    state.run.inventory.dirtyCash = 500; // base cash storage is 500
    setAction(state, 'pettyTheft');
    tick(state, 60);
    expect(state.run.character.stalled).toBe('storage');
  });

  it('refuses locked actions', () => {
    expect(setAction(newGame(0), 'streetFight')).toBe(false);
  });
});

describe('ladders', () => {
  it('two cost rungs make a factor of ten', () => {
    expect(costTier(2) / costTier(0)).toBeCloseTo(10);
    expect(grownCost(100, 'standard', 2)).toBeCloseTo(100 * GROWTH.standard ** 2);
  });
});

describe('save migration', () => {
  it('upgrades a version 1 save', () => {
    const v1: any = newGame(0);
    delete v1.run.character;
    delete v1.run.actionSkills;
    delete v1.meta.characterAgeless;
    const loaded = deserialize(JSON.stringify({ version: 1, state: v1 }));
    expect(loaded.run.character.actionId).toBeNull();
    expect(loaded.meta.characterAgeless).toBe(false);
  });
});
