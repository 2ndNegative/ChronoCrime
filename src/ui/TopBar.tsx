import { useGame } from './store';
import { t } from '../loc/loc';
import { UI, contentKey } from '../loc/keys';
import { formatMoney, formatNumber } from '../core/format';
import { dirtyCash } from '../core/inventory';
import { currentDate } from '../core/time';

export function TopBar() {
  const { run } = useGame();
  const items: [string, string][] = [
    ['dirtyCash', formatMoney(dirtyCash(run))],
    ['cleanMoney', formatMoney(run.cleanMoney)],
    ['heat', formatNumber(run.heat)],
    ['fear', formatNumber(run.fear)],
    ['respect', formatNumber(run.respect)],
  ];
  return (
    <header className="topbar">
      <strong>{t(UI.gameTitle)}</strong>
      {items.map(([id, value]) => (
        <span key={id} className="topbar-item" title={t(contentKey.coreDesc(id))}>
          {t(contentKey.coreName(id))}: {value}
        </span>
      ))}
      <span className="topbar-date">
        {t(UI.date)}: {currentDate(run).toISOString().slice(0, 10)}
      </span>
    </header>
  );
}
