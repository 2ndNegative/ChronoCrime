import { BALANCE } from './balance';
import { goodFamily, variant } from '../data';
import type { VariantId } from './types';

/** Price level relative to the reference year (2026 = 1). */
export function priceLevel(year: number): number {
  const { yearlyInflation, referenceYear } = BALANCE.prices;
  return Math.pow(1 + yearlyInflation, year - referenceYear);
}

/** Heat per unit per second before storage multipliers. */
export function heatPerUnit(id: VariantId): number {
  const v = variant(id);
  return goodFamily(v.family).baseHeatPerUnit * Math.pow(v.quality, BALANCE.variants.heatQualityExponent);
}

/** Bonus for know-how from the future: engineered 2050 cocaine sells better in 2010. */
export function futureBonus(originYear: number, year: number): number {
  const { futureBonusPerYear, futureBonusCap } = BALANCE.variants;
  return Math.min(futureBonusCap, 1 + futureBonusPerYear * Math.max(0, originYear - year));
}

/** Sale value of one unit in the given year. Cash keeps its face value; commodities follow the price level. */
export function unitValue(id: VariantId, year: number): number {
  const v = variant(id);
  const family = goodFamily(v.family);
  if (family.valueKind === 'faceValue') return family.baseValue;
  return (
    family.baseValue *
    Math.pow(v.quality, BALANCE.variants.qualityExponent) *
    futureBonus(v.originYear, year) *
    priceLevel(year)
  );
}
