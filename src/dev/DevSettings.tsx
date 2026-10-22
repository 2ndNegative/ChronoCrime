import { useState } from 'react';
import { t } from '../loc/loc';
import { UI } from '../loc/keys';
import { DEV_MODE_AVAILABLE, lock, unlock, useDevMode } from './devMode';

/** Settings card for dev mode. Renders nothing outside the local dev server. */
export function DevSettings() {
  const { unlocked } = useDevMode();
  const [password, setPassword] = useState('');
  const [wrong, setWrong] = useState(false);
  if (!DEV_MODE_AVAILABLE) return null;

  return (
    <div className="card">
      <strong>{t(UI.devHeader)}</strong>
      {unlocked ? (
        <>
          <span className="muted">{t(UI.devActive)}</span>
          <button onClick={lock}>{t(UI.devLock)}</button>
        </>
      ) : (
        <>
          <input
            type="password"
            value={password}
            placeholder={t(UI.devPassword)}
            onChange={(e) => {
              setPassword(e.target.value);
              setWrong(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && setWrong(!unlock(password))}
          />
          <button onClick={() => setWrong(!unlock(password))}>{t(UI.devUnlock)}</button>
          {wrong && <span className="error">{t(UI.devWrongPassword)}</span>}
        </>
      )}
    </div>
  );
}
