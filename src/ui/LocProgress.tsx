import { useMemo } from 'react';
import { t, missingKeys, requiredKeyCount } from '../loc/loc';
import { UI } from '../loc/keys';
import { openEditor, useDevMode } from '../dev/devMode';

/** Settings card listing every unwritten text, grouped by key prefix. Development tool. */
export function LocProgress() {
  const { unlocked, editing } = useDevMode();
  // Recomputed when the editor closes, so written texts drop off the list.
  const missing = useMemo(missingKeys, [editing]);
  const total = requiredKeyCount();
  const groups = new Map<string, typeof missing>();
  for (const spec of missing) {
    const group = spec.key.split('.')[0] ?? '';
    groups.set(group, [...(groups.get(group) ?? []), spec]);
  }
  return (
    <div className="card loc-progress">
      <strong>{t(UI.locProgressHeader)}</strong>
      <span>{t(UI.locProgress, { written: total - missing.length, total })}</span>
      <progress max={total} value={total - missing.length} />
      {[...groups].map(([group, specs]) => (
        <details key={group}>
          <summary>
            {group} ({specs.length})
          </summary>
          <ul>
            {specs.map((s) => (
              <li key={s.key} title={s.context}>
                {unlocked ? (
                  <button className="link" onClick={() => openEditor(s.key)}>
                    {s.key}
                  </button>
                ) : (
                  <code>{s.key}</code>
                )}
                <span className="muted"> {s.context}</span>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
