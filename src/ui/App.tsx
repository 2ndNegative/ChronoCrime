import { useState } from 'react';
import { useGame, store } from './store';
import { t } from '../loc/loc';
import { UI } from '../loc/keys';
import { TopBar } from './TopBar';
import { ActionsTab } from './ActionsTab';
import { ContactsTab } from './ContactsTab';
import { Sidebar } from './Sidebar';
import { ResourcesTab } from './ResourcesTab';
import { BuildingsTab } from './BuildingsTab';
import { StorageTab } from './StorageTab';
import { SettingsTab } from './SettingsTab';
import { formatDuration } from '../core/format';
import { LocEditor } from '../dev/LocEditor';
import { MissionPanel } from './MissionPanel';
import { isTabUnlocked } from '../core/missions';
import type { TabId } from '../core/types';

const TABS = [
  { id: 'actions', label: UI.tabActions, Component: ActionsTab },
  { id: 'resources', label: UI.tabResources, Component: ResourcesTab },
  { id: 'buildings', label: UI.tabBuildings, Component: BuildingsTab },
  { id: 'storage', label: UI.tabStorage, Component: StorageTab },
  { id: 'contacts', label: UI.tabContacts, Component: ContactsTab },
  { id: 'settings', label: UI.tabSettings, Component: SettingsTab },
] as const;

export function App() {
  const state = useGame();
  const [tab, setTab] = useState<string>('actions');
  // Actions and Settings are always there; the other tabs appear as the main chain unlocks them.
  const visible = TABS.filter((x) => x.id === 'actions' || x.id === 'settings' || isTabUnlocked(state.run, x.id as TabId));
  const Active = visible.find((x) => x.id === tab)?.Component ?? ActionsTab;
  return (
    <div className="app">
      <TopBar />
      <div className="body">
        {isTabUnlocked(state.run, 'resources') && <Sidebar />}
        <main>
          {store.offlineSeconds > 0 && (
            <p className="notice">
              {t(UI.offlineReport, { duration: formatDuration(store.offlineSeconds), seconds: Math.floor(store.offlineSeconds) })}{' '}
              <button onClick={() => store.dismissOfflineReport()}>{t(UI.dismiss)}</button>
            </p>
          )}
          {state.meta.reachedInfinity && <p className="notice">{t(UI.easterEggInfinity)}</p>}
          <MissionPanel />
          <nav className="tabs">
            {visible.map((x) => (
              <button key={x.id} className={x.id === tab ? 'active' : ''} onClick={() => setTab(x.id)}>
                {t(x.label)}
              </button>
            ))}
          </nav>
          <Active />
        </main>
      </div>
      <LocEditor />
    </div>
  );
}
