import { useSyncExternalStore } from 'react';
import { requiredKeys } from '../loc/keys';
import { MISSING_CLOSE, MISSING_OPEN, setText } from '../loc/loc';

const PASSWORD = import.meta.env.VITE_DEV_PASSWORD;
const UNLOCK_KEY = 'chronocrime.devMode';

/**
 * Dev mode exists only on the local dev server with a password in .env.local.
 * The Pages build has neither, so players never see it.
 */
export const DEV_MODE_AVAILABLE = import.meta.env.DEV && !!PASSWORD;

interface DevState {
  unlocked: boolean;
  /** Key open in the text editor, or null. */
  editing: string | null;
}

let state: DevState = { unlocked: DEV_MODE_AVAILABLE && readUnlocked(), editing: null };
const listeners = new Set<() => void>();

function readUnlocked(): boolean {
  try {
    return localStorage.getItem(UNLOCK_KEY) === '1';
  } catch {
    return false;
  }
}

function set(next: Partial<DevState>): void {
  state = { ...state, ...next };
  for (const l of listeners) l();
}

export function useDevMode(): DevState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

export function unlock(password: string): boolean {
  if (!DEV_MODE_AVAILABLE || password.trim() !== PASSWORD) return false;
  try {
    localStorage.setItem(UNLOCK_KEY, '1');
  } catch {
    // Unlocked for this session only.
  }
  set({ unlocked: true });
  return true;
}

export function lock(): void {
  try {
    localStorage.removeItem(UNLOCK_KEY);
  } catch {
    // Nothing stored.
  }
  set({ unlocked: false, editing: null });
}

export function openEditor(key: string): void {
  if (state.unlocked) set({ editing: key });
}

export function closeEditor(): void {
  set({ editing: null });
}

/** Writes the text into loc/strings.csv through the dev server, then shows it in game. */
export async function saveText(key: string, text: string): Promise<void> {
  const context = requiredKeys().find((s) => s.key === key)?.context ?? '';
  const res = await fetch('/__loc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, text, context }),
  });
  if (!res.ok) throw new Error(await res.text());
  setText(key, text);
  set({ editing: null });
}

/**
 * In dev mode, a click on unwritten text (‹key›) opens the editor for that key instead of
 * doing whatever the click would normally do.
 */
export function installClickToEdit(): void {
  if (!DEV_MODE_AVAILABLE) return;
  document.addEventListener(
    'click',
    (e) => {
      if (!state.unlocked) return;
      const key = missingKeyAt(e.clientX, e.clientY);
      if (!key) return;
      e.preventDefault();
      e.stopPropagation();
      openEditor(key);
    },
    true,
  );
}

function missingKeyAt(x: number, y: number): string | null {
  const hit = caretAt(x, y);
  if (!hit || hit.node.nodeType !== Node.TEXT_NODE) return null;
  const text = hit.node.textContent ?? '';
  const offset = hit.offset;
  const start = text.lastIndexOf(MISSING_OPEN, offset);
  if (start === -1) return null;
  const end = text.indexOf(MISSING_CLOSE, start);
  if (end === -1 || end + 1 < offset) return null;
  return text.slice(start + 1, end);
}

/** Text node and character offset under a point. Older browsers only have caretRangeFromPoint. */
function caretAt(x: number, y: number): { node: Node; offset: number } | null {
  if (document.caretPositionFromPoint) {
    const pos = document.caretPositionFromPoint(x, y);
    return pos ? { node: pos.offsetNode, offset: pos.offset } : null;
  }
  const range = document.caretRangeFromPoint?.(x, y);
  return range ? { node: range.startContainer, offset: range.startOffset } : null;
}
