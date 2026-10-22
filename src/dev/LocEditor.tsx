import { useEffect, useState } from 'react';
import { t } from '../loc/loc';
import { UI, requiredKeys } from '../loc/keys';
import { closeEditor, saveText, useDevMode } from './devMode';

/** Modal for writing one text in game. Saves straight into loc/strings.csv. */
export function LocEditor() {
  const { editing } = useDevMode();
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setText('');
    setError(null);
  }, [editing]);

  if (!editing) return null;
  const context = requiredKeys().find((s) => s.key === editing)?.context ?? '';

  const save = async () => {
    try {
      await saveText(editing, text);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeEditor}>
      <div className="modal card" onClick={(e) => e.stopPropagation()}>
        <code>{editing}</code>
        <span className="muted">{context}</span>
        <textarea
          autoFocus
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void save();
            }
            if (e.key === 'Escape') closeEditor();
          }}
        />
        <div className="row">
          <button disabled={!text.trim()} onClick={() => void save()}>
            {t(UI.devEditorSave)}
          </button>
          <button onClick={closeEditor}>{t(UI.devEditorCancel)}</button>
        </div>
        {error && <span className="error">{t(UI.devSaveFailed, { error })}</span>}
      </div>
    </div>
  );
}
