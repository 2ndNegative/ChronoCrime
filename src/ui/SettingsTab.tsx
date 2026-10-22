import { useState } from 'react';
import { useGame, store } from './store';
import { t } from '../loc/loc';
import { UI } from '../loc/keys';
import { SHOW_LOC_TOOLS } from '../config';
import { LocProgress } from './LocProgress';
import { DevSettings } from '../dev/DevSettings';

export function SettingsTab() {
  useGame();
  const [exported, setExported] = useState('');
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importResult, setImportResult] = useState<{ ok: boolean; error?: string } | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exported);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the text is still selectable in the box.
    }
  };

  const runImport = () => {
    try {
      store.importString(importText);
      setImportText('');
      setImportResult({ ok: true });
    } catch (e) {
      setImportResult({ ok: false, error: e instanceof Error ? e.message : String(e) });
    }
  };

  return (
    <section className="settings">
      {SHOW_LOC_TOOLS && <LocProgress />}
      <DevSettings />
      <div className="card">
        <strong>{t(UI.saveHeader)}</strong>
        <button onClick={() => setSaveFailed(!store.save())}>{t(UI.saveNow)}</button>
        {store.lastSavedAt !== null && (
          <span className="muted">{t(UI.savedAt, { time: new Date(store.lastSavedAt).toLocaleTimeString() })}</span>
        )}
        {saveFailed && <span className="error">{t(UI.saveFailed)}</span>}
      </div>

      <div className="card">
        <strong>{t(UI.exportHeader)}</strong>
        <button
          onClick={() => {
            setExported(store.exportString());
            setCopied(false);
          }}
        >
          {t(UI.exportCreate)}
        </button>
        {exported && (
          <>
            <textarea readOnly value={exported} rows={4} onFocus={(e) => e.currentTarget.select()} />
            <button onClick={copy}>{t(copied ? UI.copied : UI.copy)}</button>
          </>
        )}
      </div>

      <div className="card">
        <strong>{t(UI.importHeader)}</strong>
        <textarea value={importText} rows={4} onChange={(e) => setImportText(e.target.value)} />
        <button disabled={!importText.trim()} onClick={runImport}>
          {t(UI.importButton)}
        </button>
        {importResult?.ok && <span className="muted">{t(UI.importDone)}</span>}
        {importResult && !importResult.ok && <span className="error">{t(UI.importFailed, { error: importResult.error ?? '' })}</span>}
      </div>

      <div className="card">
        <strong>{t(UI.resetHeader)}</strong>
        {confirmReset ? (
          <button
            className="danger"
            onClick={() => {
              store.hardReset();
              setConfirmReset(false);
            }}
          >
            {t(UI.resetConfirm)}
          </button>
        ) : (
          <button onClick={() => setConfirmReset(true)}>{t(UI.resetButton)}</button>
        )}
      </div>
    </section>
  );
}
