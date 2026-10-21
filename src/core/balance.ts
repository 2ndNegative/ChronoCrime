// Every tunable constant lives here, so the simulator and DESIGN.md have one place to point at.
// Values are placeholders until the balance simulator has been run against the pacing targets.

export const BALANCE = {
  time: {
    /** In-game days per real second: 1 day per real minute, about 6 real hours per in-game year. */
    daysPerSecond: 1 / 60,
    daysPerYear: 365,
  },
  heat: {
    /** H0 in output = base / (1 + heat / H0). */
    softCap: 100,
    /** Fraction of the gap to the floor that decays per second. */
    decayRate: 0.01,
    /** Heat floor grows with empire size: floor = floorPerLogEmpire * log10(1 + empireValue). */
    floorPerLogEmpire: 2,
    /** Heat per second per unit of dirty cash flow (earned + spent per second). */
    perCashFlow: 0.001,
  },
  variants: {
    /** value = baseValue * quality ^ qualityExponent * futureBonus * priceLevel */
    qualityExponent: 1.5,
    /** Bonus per year a variant's origin is ahead of the current year. */
    futureBonusPerYear: 0.02,
    futureBonusCap: 5,
    /** Heat grows more slowly than value with quality. */
    heatQualityExponent: 0.5,
  },
  prices: {
    /** Yearly inflation used for the era price level relative to 2026. Placeholder for a real price table. */
    yearlyInflation: 0.03,
    referenceYear: 2026,
  },
  offline: {
    /** Maximum offline time that is simulated, in seconds. */
    maxSeconds: 7 * 24 * 3600,
    /** Simulation step for offline catch-up, in seconds. */
    stepSeconds: 10,
    /** Upper bound on catch-up steps, so a long absence loads quickly. Steps get longer instead. */
    maxSteps: 20_000,
  },
} as const;
