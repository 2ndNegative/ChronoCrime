import { useGame, store } from './store';
import { t } from '../loc/loc';
import { UI, contentKey } from '../loc/keys';
import { formatNumber } from '../core/format';
import { actionDuration, outcomeScale, setAction, skill, unlockedActions } from '../core/actions';
import { amountLabel } from './amount';
import { xpToNext } from '../core/ladders';

export function ActionsTab() {
  const { run } = useGame();
  const c = run.character;
  return (
    <section className="grid">
      {unlockedActions(run).map((def) => {
        const s = skill(run, def.id);
        const duration = actionDuration(def, s.level);
        const active = c.actionId === def.id;
        return (
          <div key={def.id} className={`card${active ? ' active-card' : ''}`} title={t(contentKey.actionDesc(def.id))}>
            <strong>{t(contentKey.actionName(def.id))}</strong>
            <span>{t(UI.actionLevel, { level: s.level, xp: formatNumber(s.xp), next: formatNumber(xpToNext(s.level)) })}</span>
            <progress max={xpToNext(s.level)} value={s.xp} />
            <span className="muted">{t(UI.actionDuration, { seconds: duration.toFixed(1) })}</span>
            {def.inputs.length > 0 && (
              <span>
                {t(UI.actionNeeds)} {def.inputs.map((i) => amountLabel(i)).join(', ')}
              </span>
            )}
            <span>
              {t(UI.actionGives)} {def.outputs.map((o) => amountLabel(o, outcomeScale(s.level))).join(', ')}
            </span>
            <span className="muted">{t(UI.actionCompletions, { count: s.completions })}</span>
            {active && (
              <>
                <progress max={duration} value={c.progress} />
                {c.stalled === 'inputs' && <span className="error">{t(UI.actionStalledInputs)}</span>}
                {c.stalled === 'storage' && <span className="error">{t(UI.actionStalledStorage)}</span>}
              </>
            )}
            <button onClick={() => store.act((st) => setAction(st, active ? null : def.id))}>
              {t(active ? UI.actionStop : UI.actionStart)}
            </button>
          </div>
        );
      })}
      {!c.actionId && <p className="muted">{t(UI.actionIdle)}</p>}
    </section>
  );
}
