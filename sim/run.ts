// Headless balance simulator. Plays the game with a scripted policy using the same tick() as the UI
// and reports when each pacing milestone was reached, against its target.
//
//   npm run sim                 one simulated first run of era 1
//   npm run sim -- --hours 12   simulate a different length
//
// Policies are deliberately simple stand-ins for a player. Add milestone checks as systems are built.

import { newGame, type GameState } from '../src/core/state';
import { tick } from '../src/core/tick';
import { hustle } from '../src/core/actions';
import { dirtyCash } from '../src/core/inventory';
import { buildingCost, buyBuilding, canAfford } from '../src/core/buildings';
import { STORAGE_BUILDINGS } from '../src/data';
import { ERA1_TARGETS } from './targets';

const STEP = 1; // seconds per simulated tick
const hoursArg = process.argv.indexOf('--hours');
const hours = hoursArg > 0 ? Number(process.argv[hoursArg + 1]) : 4 * 24;

/** Milestone checks by id. Return true once reached. Unbuilt systems simply never trigger. */
const MILESTONES: Record<string, (s: GameState) => boolean> = {
  firstWorker: (s) => s.run.workers.length > 0,
  firstFront: () => false,
  crewBoss: () => false,
  gangLeader: () => false,
  syndicateBoss: () => false,
  timeMachine: () => false,
};

/** A player who hustles once a second while active and buys the cheapest affordable building. */
function policy(state: GameState, t: number): void {
  const active = t % (8 * 3600) < 3600; // active one hour in every eight
  if (active) hustle(state);
  const affordable = STORAGE_BUILDINGS.filter((b) => canAfford(state.run, buildingCost(state.run, b.id)));
  const cheapest = affordable.sort((a, b) => (buildingCost(state.run, a.id).dirty ?? Infinity) - (buildingCost(state.run, b.id).dirty ?? Infinity))[0];
  if (cheapest) buyBuilding(state.run, cheapest.id);
}

const state = newGame(0);
const reached = new Map<string, number>();
for (let t = 0; t < hours * 3600; t += STEP) {
  policy(state, t);
  tick(state, STEP);
  for (const target of ERA1_TARGETS) {
    if (!reached.has(target.id) && MILESTONES[target.id]?.(state)) reached.set(target.id, t);
  }
}

const fmt = (s: number) => (s < 3600 ? `${(s / 60).toFixed(0)} min` : `${(s / 3600).toFixed(1)} h`);
console.table(
  ERA1_TARGETS.map((target) => {
    const at = reached.get(target.id);
    return {
      milestone: target.label,
      target: fmt(target.targetSeconds),
      reached: at === undefined ? 'not reached' : fmt(at),
      ratio: at === undefined ? '' : (at / target.targetSeconds).toFixed(2),
    };
  }),
);
console.log(`End: dirty cash ${dirtyCash(state.run).toFixed(0)}, heat ${state.run.heat.toFixed(2)}, buildings ${JSON.stringify(state.run.buildings)}`);
