import { useSyncExternalStore } from 'react';
import type { GameState } from '../core/state';
import { newGame } from '../core/state';
import { advanceTo } from '../core/tick';
import { clearBrowserSave, exportSave, importSave, loadFromBrowser, saveToBrowser } from '../core/save';

const AUTOSAVE_MS = 15_000;
/** Offline time shorter than this is not worth a message. */
const OFFLINE_REPORT_MIN_SECONDS = 60;

/** Owns the live game state, runs the loop, autosaves and tells React when something changed. */
class GameStore {
  state: GameState;
  /** Seconds simulated after the last load, for the welcome-back message. 0 once dismissed. */
  offlineSeconds = 0;
  lastSavedAt: number | null = null;
  private version = 0;
  private listeners = new Set<() => void>();

  constructor() {
    const now = Date.now();
    const loaded = loadFromBrowser();
    this.state = loaded ?? newGame(now);
    if (loaded) {
      const away = advanceTo(this.state, now);
      this.offlineSeconds = away >= OFFLINE_REPORT_MIN_SECONDS ? away : 0;
    }
  }

  start(): void {
    const worker = new Worker(new URL('./ticker.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = () => this.step();

    setInterval(() => this.save(), AUTOSAVE_MS);
    // Hidden tabs can be discarded without warning, so save whenever the tab is hidden.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.save();
      else this.step();
    });
    window.addEventListener('pagehide', () => this.save());
  }

  /** Brings the game up to the current time. Renders only while the tab is visible. */
  private step(): void {
    advanceTo(this.state, Date.now());
    if (!document.hidden) this.changed();
  }

  /** Runs a player action and re-renders. */
  act(action: (state: GameState) => unknown): void {
    action(this.state);
    this.changed();
  }

  save(): boolean {
    const ok = saveToBrowser(this.state);
    if (ok) this.lastSavedAt = Date.now();
    this.changed();
    return ok;
  }

  exportString(): string {
    return exportSave(this.state);
  }

  /** Replaces the game with an imported save. Throws SaveError and changes nothing if it is invalid. */
  importString(text: string): void {
    const imported = importSave(text);
    const away = advanceTo(imported, Date.now());
    this.state = imported;
    this.offlineSeconds = away >= OFFLINE_REPORT_MIN_SECONDS ? away : 0;
    this.save();
  }

  hardReset(): void {
    clearBrowserSave();
    this.state = newGame(Date.now());
    this.offlineSeconds = 0;
    this.save();
  }

  dismissOfflineReport(): void {
    this.offlineSeconds = 0;
    this.changed();
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getVersion = (): number => this.version;

  private changed(): void {
    this.version++;
    for (const l of this.listeners) l();
  }
}

export const store = new GameStore();

/** Re-renders the component on every tick and returns the live state. */
export function useGame(): GameState {
  useSyncExternalStore(store.subscribe, store.getVersion);
  return store.state;
}
