import { useGame } from './store';
import { t } from '../loc/loc';
import { UI } from '../loc/keys';
import { GoodRow } from './GoodRow';

export function Sidebar() {
  const state = useGame();
  return (
    <aside className="sidebar">
      <h3>{t(UI.sidebarPinned)}</h3>
      {state.settings.pinnedFamilies.map((family) => (
        <GoodRow key={family} run={state.run} family={family} />
      ))}
    </aside>
  );
}
