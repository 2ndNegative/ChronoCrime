import { t } from '../loc/loc';
import { contentKey } from '../loc/keys';
import { formatNumber } from '../core/format';
import type { ActionAmount } from '../core/types';
import { VARIANTS, variant } from '../data';

/** "5 Weed (Haze)" style label for an amount of a good or meter. */
export function amountLabel(a: ActionAmount, scale = 1): string {
  let name: string;
  if ('variant' in a.target) {
    const family = variant(a.target.variant).family;
    const single = VARIANTS.filter((v) => v.family === family).length === 1;
    name = t(contentKey.goodName(family)) + (single ? '' : ` (${t(contentKey.variantName(a.target.variant))})`);
  } else {
    name = t(contentKey.coreName(a.target.meter));
  }
  return `${formatNumber(a.amount * scale)} ${name}`;
}
