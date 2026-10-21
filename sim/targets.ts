// Pacing targets from DESIGN.md, in real seconds. The simulator compares a run against these.

export interface PacingTarget {
  id: string;
  label: string;
  targetSeconds: number;
}

const MIN = 60;
const HOUR = 3600;
const DAY = 24 * HOUR;

export const ERA1_TARGETS: PacingTarget[] = [
  { id: 'firstWorker', label: 'First worker recruited', targetSeconds: 2 * MIN },
  { id: 'firstFront', label: 'First laundering front', targetSeconds: 10 * MIN },
  { id: 'crewBoss', label: 'Crew boss', targetSeconds: 45 * MIN },
  { id: 'gangLeader', label: 'Gang leader', targetSeconds: 4 * HOUR },
  { id: 'syndicateBoss', label: 'Syndicate boss', targetSeconds: 1.5 * DAY },
  { id: 'timeMachine', label: 'Kingpin; time machine built', targetSeconds: 4 * DAY },
];
