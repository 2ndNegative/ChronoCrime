import { CONTACTS } from '../data';
import { useGame } from './store';
import { t } from '../loc/loc';
import { UI, contentKey } from '../loc/keys';
import { formatNumber } from '../core/format';

/** Placeholder: lists contacts and their requirements. Cultivating them is not built yet. */
export function ContactsTab() {
  const { run } = useGame();
  return (
    <section className="grid">
      {CONTACTS.map((c) => (
        <div key={c.id} className="card" title={t(contentKey.contactDesc(c.id))}>
          <strong>{t(contentKey.contactName(c.id))}</strong>
          <span>{t(UI.contactLevel, { level: run.contacts[c.id] ?? 0, max: c.maxLevel })}</span>
          <span className="muted">
            {t(UI.contactRequires, { meter: t(contentKey.coreName(c.gate)), amount: formatNumber(c.gateThreshold) })}
          </span>
        </div>
      ))}
    </section>
  );
}
