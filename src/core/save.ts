import type { GameState } from './state';

export const SAVE_VERSION = 1;
const STORAGE_KEY = 'chronocrime.save';

interface SaveFile {
  version: number;
  state: GameState;
}

/**
 * Migrations from version N to N+1. Add one whenever the shape of GameState changes,
 * and bump SAVE_VERSION. Never edit an old migration.
 */
const MIGRATIONS: Record<number, (state: any) => any> = {};

export function serialize(state: GameState): string {
  const file: SaveFile = { version: SAVE_VERSION, state };
  return JSON.stringify(file);
}

export function deserialize(text: string): GameState {
  const file = JSON.parse(text) as SaveFile;
  let state: any = file.state;
  for (let v = file.version; v < SAVE_VERSION; v++) {
    const migrate = MIGRATIONS[v];
    if (!migrate) throw new Error(`No save migration from version ${v}`);
    state = migrate(state);
  }
  return state as GameState;
}

export function saveToBrowser(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, serialize(state));
  } catch {
    // Storage can be unavailable (private mode); the game keeps running.
  }
}

export function loadFromBrowser(): GameState | null {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    return text ? deserialize(text) : null;
  } catch {
    return null;
  }
}

export function exportSave(state: GameState): string {
  return btoa(serialize(state));
}

export function importSave(text: string): GameState {
  return deserialize(atob(text.trim()));
}
