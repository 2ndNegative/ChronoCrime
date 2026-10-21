import { GOOD_FAMILIES } from '../data';
import { useGame, store } from './store';
import { t } from '../loc/loc';
import { UI } from '../loc/keys';
import { GoodRow } from './GoodRow';

export function ResourcesTab() {
  const state = useGame();
  const pinned = new Set(state.settings.pinnedFamilies);
  const togglePin = (family: string) =>
    store.act((s) => {
      s.settings.pinnedFamilies = pinned.has(family)
        ? s.settings.pinnedFamilies.filter((f) => f !== family)
        : [...s.settings.pinnedFamilies, family];
    });
  return (
    <section className="grid">
      {GOOD_FAMILIES.filter((g) => g.id !== 'dirtyCash').map((g) => (
        <div key={g.id} className="card">
          <GoodRow run={state.run} family={g.id} />
          <button onClick={() => togglePin(g.id)}>{t(pinned.has(g.id) ? UI.unpin : UI.pin)}</button>
        </div>
      ))}
    </section>
  );
}
