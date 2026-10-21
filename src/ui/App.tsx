import { useState } from 'react';
import { useGame, store } from './store';
import { t } from '../loc/loc';
import { UI } from '../loc/keys';
import { hustle } from '../core/actions';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { ResourcesTab } from './ResourcesTab';
import { BuildingsTab } from './BuildingsTab';
import { StorageTab } from './StorageTab';

const TABS = [
  { id: 'resources', label: UI.tabResources, Component: ResourcesTab },
  { id: 'buildings', label: UI.tabBuildings, Component: BuildingsTab },
  { id: 'storage', label: UI.tabStorage, Component: StorageTab },
] as const;

export function App() {
  const state = useGame();
  const [tab, setTab] = useState<string>('resources');
  const Active = TABS.find((x) => x.id === tab)?.Component ?? ResourcesTab;
  return (
    <div className="app">
      <TopBar />
      <div className="body">
        <Sidebar />
        <main>
          {store.offlineSeconds > 60 && <p className="notice">{t(UI.offlineReport, { seconds: Math.floor(store.offlineSeconds) })}</p>}
          {state.meta.reachedInfinity && <p className="notice">{t(UI.easterEggInfinity)}</p>}
          <button className="action" onClick={() => store.act(hustle)}>
            {t(UI.actionHustle)}
          </button>
          <nav className="tabs">
            {TABS.map((x) => (
              <button key={x.id} className={x.id === tab ? 'active' : ''} onClick={() => setTab(x.id)}>
                {t(x.label)}
              </button>
            ))}
          </nav>
          <Active />
        </main>
      </div>
    </div>
  );
}
