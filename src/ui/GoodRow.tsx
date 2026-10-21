import { t } from '../loc/loc';
import { contentKey } from '../loc/keys';
import { formatNumber } from '../core/format';
import type { RunState } from '../core/state';
import { familyTotal } from './goods';

/** One good family: the total, with the variant breakdown on hover. */
export function GoodRow({ run, family }: { run: RunState; family: string }) {
  const { total, variants } = familyTotal(run, family);
  const breakdown = variants.map((v) => `${t(contentKey.variantName(v.id))}: ${formatNumber(v.amount)}`).join('\n');
  return (
    <div className="good-row" title={breakdown}>
      <span>{t(contentKey.goodName(family))}</span>
      <span>{formatNumber(total)}</span>
    </div>
  );
}
