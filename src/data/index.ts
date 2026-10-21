import { STORAGE_TYPES } from './storageTypes';
import { GOOD_FAMILIES, VARIANTS } from './goods';
import { STORAGE_BUILDINGS } from './buildings';
import { ERAS } from './eras';
import { CONTACTS } from './contacts';

export { STORAGE_TYPES, GOOD_FAMILIES, VARIANTS, STORAGE_BUILDINGS, ERAS, CONTACTS };

function byId<T extends { id: string }>(list: T[], kind: string): (id: string) => T {
  const map = new Map(list.map((d) => [d.id, d]));
  if (map.size !== list.length) throw new Error(`Duplicate ${kind} id`);
  return (id) => {
    const def = map.get(id);
    if (!def) throw new Error(`Unknown ${kind}: ${id}`);
    return def;
  };
}

export const storageType = byId(STORAGE_TYPES, 'storage type');
export const goodFamily = byId(GOOD_FAMILIES, 'good family');
export const variant = byId(VARIANTS, 'variant');
export const storageBuilding = byId(STORAGE_BUILDINGS, 'storage building');
export const era = byId(ERAS, 'era');
export const contact = byId(CONTACTS, 'contact');
