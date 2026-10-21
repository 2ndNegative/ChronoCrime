import { useSyncExternalStore } from 'react';
import type { GameState } from '../core/state';
import { newGame } from '../core/state';
import { catchUp, tick } from '../core/tick';
import { loadFromBrowser, saveToBrowser } from '../core/save';

const TICK_MS = 100;
const SAVE_MS = 10_000;

/** Owns the live game state, runs the loop and tells React when something changed. */
class GameStore {
  state: GameState;
  offlineSeconds = 0;
  private version = 0;
  private listeners = new Set<() => void>();

  constructor() {
    const now = Date.now();
    const loaded = loadFromBrowser();
    this.state = loaded ?? newGame(now);
    if (loaded) this.offlineSeconds = catchUp(this.state, now);
  }

  start(): void {
    setInterval(() => {
      const now = Date.now();
      tick(this.state, (now - this.state.lastTickAt) / 1000);
      this.state.lastTickAt = now;
      this.changed();
    }, TICK_MS);
    setInterval(() => saveToBrowser(this.state), SAVE_MS);
    window.addEventListener('beforeunload', () => saveToBrowser(this.state));
  }

  /** Runs a player action and re-renders. */
  act(action: (state: GameState) => unknown): void {
    action(this.state);
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
