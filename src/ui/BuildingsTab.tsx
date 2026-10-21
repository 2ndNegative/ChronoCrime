import { STORAGE_BUILDINGS } from '../data';
import { useGame, store } from './store';
import { t } from '../loc/loc';
import { UI, contentKey } from '../loc/keys';
import { formatMoney, formatNumber } from '../core/format';
import { buildingCost, buyBuilding, canAfford } from '../core/buildings';

export function BuildingsTab() {
  const { run } = useGame();
  return (
    <section className="grid">
      {STORAGE_BUILDINGS.map((b) => {
        const cost = buildingCost(run, b.id);
        return (
          <div key={b.id} className="card" title={t(contentKey.buildingDesc(b.id))}>
            <strong>{t(contentKey.buildingName(b.id))}</strong>
            <div>
              {t(UI.owned)}: {run.buildings[b.id] ?? 0}
            </div>
            <div>
              {t(UI.capacity)}: {formatNumber(b.capacity)} {t(contentKey.storageType(b.storageType))}
            </div>
            <div>
              {t(UI.heatMultiplier)}: ×{b.heatMultiplier}
            </div>
            <div>
              {t(UI.cost)}: {cost.dirty ? `${formatMoney(cost.dirty)} (${t(contentKey.coreName('dirtyCash'))})` : ''}
              {cost.clean ? `${formatMoney(cost.clean)} (${t(contentKey.coreName('cleanMoney'))})` : ''}
            </div>
            <button disabled={!canAfford(run, cost)} onClick={() => store.act((s) => buyBuilding(s.run, b.id))}>
              {t(UI.buy)}
            </button>
          </div>
        );
      })}
    </section>
  );
}
