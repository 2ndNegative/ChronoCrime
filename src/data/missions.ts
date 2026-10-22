import type { MissionDef } from '../core/types';
import { costTier } from '../core/ladders';

// Placeholder main chain for the modern era: introduces one system at a time.

export const MISSIONS: MissionDef[] = [
  {
    id: 'firstJob',
    era: 'modern',
    condition: { kind: 'actionLevel', action: 'pettyTheft', level: 2 },
    rewards: [{ target: { meter: 'respect' }, amount: 1 }],
    unlocksTabs: ['resources'],
  },
  {
    id: 'pocketsFull',
    era: 'modern',
    condition: { kind: 'hold', variant: 'dirtyCash', amount: 400 },
    rewards: [{ target: { meter: 'fear' }, amount: 1 }],
    unlocksTabs: ['buildings', 'storage'],
  },
  {
    id: 'firstStash',
    era: 'modern',
    condition: { kind: 'building', building: 'mattress', count: 1 },
    rewards: [{ target: { variant: 'dirtyCash' }, amount: costTier(2) }],
  },
  {
    id: 'firstDeal',
    era: 'modern',
    condition: { kind: 'actionLevel', action: 'dealWeed', level: 1 },
    rewards: [{ target: { meter: 'respect' }, amount: 2 }],
  },
  {
    id: 'makeAName',
    era: 'modern',
    condition: { kind: 'meter', meter: 'fear', amount: 5 },
    rewards: [{ target: { meter: 'respect' }, amount: 1 }],
    unlocksTabs: ['contacts'],
  },
];
