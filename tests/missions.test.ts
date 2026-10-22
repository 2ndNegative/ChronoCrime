import { describe, expect, it } from 'vitest';
import { newGame } from '../src/core/state';
import { tick } from '../src/core/tick';
import { setAction, unlockedActions } from '../src/core/actions';
import { buyBuilding, isBuildingAvailable } from '../src/core/buildings';
import { checkMissions, currentMission, isTabUnlocked } from '../src/core/missions';
import { deserialize, serialize } from '../src/core/save';
import { MISSIONS } from '../src/data';

describe('missions', () => {
  it('start with only the first mission and no extra tabs', () => {
    const { run } = newGame(0);
    expect(currentMission(run)?.id).toBe(MISSIONS[0]?.id);
    expect(isTabUnlocked(run, 'resources')).toBe(false);
    expect(isTabUnlocked(run, 'buildings')).toBe(false);
  });

  it('complete in order and grant their rewards', () => {
    const state = newGame(0);
    setAction(state, 'pettyTheft');
    for (let i = 0; i < 600 && currentMission(state.run)?.id === 'firstJob'; i++) tick(state, 1);
    expect(state.run.missions.completed).toEqual(['firstJob']);
    expect(state.run.missions.recent).toBe('firstJob');
    expect(state.run.respect).toBeGreaterThanOrEqual(1);
    expect(isTabUnlocked(state.run, 'resources')).toBe(true);
  });

  it('never skip ahead, even when a later condition is already met', () => {
    const { run } = newGame(0);
    run.fear = 100; // makeAName's condition, but earlier missions are open
    checkMissions(run);
    expect(run.missions.completed).toEqual([]);
  });

  it('can complete several in one tick when all are met', () => {
    const { run } = newGame(0);
    run.actionSkills.pettyTheft = { xp: 0, level: 2, completions: 0 };
    run.inventory.dirtyCash = 450;
    expect(checkMissions(run)).toEqual(['firstJob', 'pocketsFull']);
  });

  it('gate buildings and actions', () => {
    const { run } = newGame(0);
    run.inventory.dirtyCash = 1e6;
    expect(isBuildingAvailable(run, 'stashHouse')).toBe(false);
    expect(buyBuilding(run, 'stashHouse')).toBe(false);
    expect(unlockedActions(run).map((a) => a.id)).not.toContain('streetFight');
    run.missions.completed.push('firstDeal');
    expect(isBuildingAvailable(run, 'stashHouse')).toBe(true);
    expect(unlockedActions(run).map((a) => a.id)).toContain('streetFight');
  });

  it('migrate a version 2 save with no missions', () => {
    const v2: any = newGame(0);
    delete v2.run.missions;
    const raw = JSON.stringify({ version: 2, state: v2 });
    const loaded = deserialize(raw);
    expect(loaded.run.missions).toEqual({ completed: [], recent: null });
    expect(deserialize(serialize(loaded)).run.missions).toEqual(loaded.run.missions);
  });
});
