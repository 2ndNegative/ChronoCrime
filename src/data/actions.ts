import type { ActionDef } from '../core/types';

// Placeholder actions to exercise the system: a small chain from theft to dealing.

export const ACTIONS: ActionDef[] = [
  {
    id: 'pettyTheft',
    durationTier: 0,
    inputs: [],
    outputs: [{ target: { variant: 'dirtyCash' }, amount: 5 }],
    xpPerCompletion: 1,
  },
  {
    id: 'buyWeed',
    durationTier: 1,
    inputs: [{ target: { variant: 'dirtyCash' }, amount: 40 }],
    outputs: [{ target: { variant: 'weed.street' }, amount: 5 }],
    xpPerCompletion: 1,
    requiresMission: 'firstStash',
  },
  {
    id: 'dealWeed',
    durationTier: 1,
    inputs: [{ target: { variant: 'weed.street' }, amount: 1 }],
    outputs: [
      { target: { variant: 'dirtyCash' }, amount: 15 },
      { target: { meter: 'respect' }, amount: 0.1 },
    ],
    xpPerCompletion: 2,
    unlock: { action: 'buyWeed', level: 1 },
  },
  {
    id: 'streetFight',
    durationTier: 2,
    inputs: [],
    outputs: [
      { target: { meter: 'fear' }, amount: 1 },
      { target: { meter: 'heat' }, amount: 0.5 },
    ],
    xpPerCompletion: 2,
    requiresMission: 'firstDeal',
  },
];
