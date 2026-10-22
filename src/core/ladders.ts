// Ladders: the shared scales every cost, rate and duration in the game is placed on.
// Content never writes raw numbers for these; it names a rung (costTier(4), GROWTH.standard).
// Rebalancing a whole family of things then means changing one value here.

export const LADDERS = {
  /** Absolute costs: rung n = base × ratio^n. ratio √10 means two rungs per factor of ten. */
  cost: { base: 10, ratio: Math.sqrt(10) },
  /** Durations in seconds: rung n = base × ratio^n. ratio 2 means each rung takes twice as long. */
  duration: { base: 2, ratio: 2 },
  /** XP needed for the next level, rung n = base × ratio^n. */
  xp: { base: 10, ratio: 1.25 },
} as const;

/** Per-purchase cost growth. Every repeatable purchase uses one of these. */
export const GROWTH = {
  gentle: 1.07,
  standard: 1.15,
  steep: 1.25,
  brutal: 1.5,
} as const;

/** Exponents for diminishing-returns curves of the form (1 + level)^exponent. */
export const CURVES = {
  /** Action duration falls strongly with level. */
  actionDuration: -0.6,
  /** Action outcome rises mildly with level. */
  actionOutcome: 0.15,
} as const;

export type GrowthRate = keyof typeof GROWTH;

/** Cost on rung n of the cost ladder. Fractional rungs are allowed for fine placement. */
export function costTier(n: number): number {
  return LADDERS.cost.base * Math.pow(LADDERS.cost.ratio, n);
}

/** Duration in seconds on rung n of the duration ladder. */
export function durationTier(n: number): number {
  return LADDERS.duration.base * Math.pow(LADDERS.duration.ratio, n);
}

/** XP needed to go from `level` to `level + 1`. */
export function xpToNext(level: number): number {
  return LADDERS.xp.base * Math.pow(LADDERS.xp.ratio, level);
}

/** Price of the next purchase when `owned` are already owned. */
export function grownCost(base: number, rate: GrowthRate, owned: number): number {
  return base * Math.pow(GROWTH[rate], owned);
}
