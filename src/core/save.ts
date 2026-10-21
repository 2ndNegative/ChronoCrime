import type { GameState } from './state';
import { newGame } from './state';

export const SAVE_VERSION = 1;
const STORAGE_KEY = 'chronocrime.save';
/** Marks an export string as ours, so pasting something else gives a clear error. */
const EXPORT_PREFIX = 'CC';

interface SaveFile {
  version: number;
  state: GameState;
}

/**
 * Migrations from version N to N+1. Add one whenever the shape of GameState changes,
 * and bump SAVE_VERSION. Never edit an old migration.
 */
const MIGRATIONS: Record<number, (state: any) => any> = {};

export class SaveError extends Error {}

export function serialize(state: GameState): string {
  const file: SaveFile = { version: SAVE_VERSION, state };
  return JSON.stringify(file);
}

export function deserialize(text: string): GameState {
  let file: SaveFile;
  try {
    file = JSON.parse(text) as SaveFile;
  } catch {
    throw new SaveError('Save data is not valid JSON');
  }
  if (typeof file?.version !== 'number' || typeof file.state !== 'object' || file.state === null) {
    throw new SaveError('Save data has no version or state');
  }
  if (file.version > SAVE_VERSION) throw new SaveError(`Save is from a newer version (${file.version})`);
  let state: any = file.state;
  for (let v = file.version; v < SAVE_VERSION; v++) {
    const migrate = MIGRATIONS[v];
    if (!migrate) throw new SaveError(`No save migration from version ${v}`);
    state = migrate(state);
  }
  return withDefaults(state, newGame(Date.now()));
}

/**
 * Fills in any field missing from a loaded save with its default, recursively through plain
 * objects. A safety net, not a replacement for migrations: renamed or reshaped fields still need one.
 */
function withDefaults<T>(loaded: any, defaults: T): T {
  if (!isPlainObject(defaults) || !isPlainObject(loaded)) return (loaded ?? defaults) as T;
  const out: any = { ...loaded };
  for (const [key, value] of Object.entries(defaults as object)) {
    out[key] = key in loaded ? withDefaults(loaded[key], value) : value;
  }
  return out as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function saveToBrowser(state: GameState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, serialize(state));
    return true;
  } catch {
    // Storage can be unavailable (private mode, full quota); the game keeps running.
    return false;
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

export function clearBrowserSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}

/** A single-line string the player can copy, keep and paste back. UTF-8 safe base64. */
export function exportSave(state: GameState): string {
  const bytes = new TextEncoder().encode(serialize(state));
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return EXPORT_PREFIX + btoa(binary);
}

export function importSave(text: string): GameState {
  const trimmed = text.replace(/\s+/g, '');
  if (!trimmed.startsWith(EXPORT_PREFIX)) throw new SaveError('Not a ChronoCrime save string');
  let binary: string;
  try {
    binary = atob(trimmed.slice(EXPORT_PREFIX.length));
  } catch {
    throw new SaveError('Save string is damaged');
  }
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return deserialize(new TextDecoder().decode(bytes));
}
