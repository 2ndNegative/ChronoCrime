import { useGame, store } from './store';
import { t } from '../loc/loc';
import { UI, contentKey } from '../loc/keys';
import { formatMoney, formatNumber } from '../core/format';
import { currentMission, progress } from '../core/missions';
import { amountLabel } from './amount';

/** The current main-chain goal, plus a notice for the mission that just completed. */
export function MissionPanel() {
  const { run } = useGame();
  const m = currentMission(run);
  const recent = run.missions.recent;
  const p = m && progress(run, m.condition);
  const rewards = m ? m.rewards.map((r) => amountLabel(r)) : [];
  if (m?.rewardClean) rewards.push(`${formatMoney(m.rewardClean)} ${t(contentKey.coreName('cleanMoney'))}`);
  return (
    <>
      {recent && (
        <p className="notice">
          {t(UI.missionComplete, { mission: t(contentKey.missionName(recent)) })}{' '}
          <button onClick={() => store.act((s) => void (s.run.missions.recent = null))}>{t(UI.dismiss)}</button>
        </p>
      )}
      <div className="mission">
        <span className="muted">{t(UI.missionHeader)}</span>
        {m && p ? (
          <>
            <strong title={t(contentKey.missionDesc(m.id))}>{t(contentKey.missionName(m.id))}</strong>
            <span>{t(contentKey.missionDesc(m.id))}</span>
            <progress max={p.target} value={Math.min(p.current, p.target)} />
            <span className="muted">
              {t(UI.missionProgress, { current: formatNumber(Math.min(p.current, p.target)), target: formatNumber(p.target) })}
            </span>
            {rewards.length > 0 && (
              <span>
                {t(UI.missionReward)} {rewards.join(', ')}
              </span>
            )}
          </>
        ) : (
          <span>{t(UI.missionAllDone)}</span>
        )}
      </div>
    </>
  );
}
