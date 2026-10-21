import { useGame } from './store';
import { t } from '../loc/loc';
import { UI, contentKey } from '../loc/keys';
import { formatNumber } from '../core/format';
import { allocateAll } from '../core/storage';

export function StorageTab() {
  const { run } = useGame();
  return (
    <section className="grid">
      {allocateAll(run).map((report) => (
        <div key={report.storageType} className="card">
          <strong>{t(contentKey.storageType(report.storageType))}</strong>
          <div>
            {t(UI.capacity)}: {formatNumber(report.used)} / {formatNumber(report.capacity)}
            {report.used >= report.capacity && report.capacity > 0 ? ` · ${t(UI.storageFull)}` : ''}
          </div>
          <div>
            {t(UI.heatPerSecond)}: {report.heatPerSecond.toFixed(3)}
          </div>
          <ul>
            {report.placements.map((p) => (
              <li key={`${p.variantId}-${p.source}`}>
                {t(contentKey.variantName(p.variantId))}: {formatNumber(p.amount)} →{' '}
                {p.source === 'base' ? t(UI.baseStorage) : t(contentKey.buildingName(p.source))}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
