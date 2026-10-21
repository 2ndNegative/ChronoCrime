import { CONTACTS, ERAS, GOOD_FAMILIES, STORAGE_BUILDINGS, STORAGE_TYPES, VARIANTS } from '../data';
import type { CoreResourceId } from '../core/types';

/**
 * Every piece of display text has a key. Content keys are derived from data ids;
 * UI keys are listed here. `npm run loc:sync` adds any missing key to loc/strings.csv.
 */

export const CORE_RESOURCES: CoreResourceId[] = ['dirtyCash', 'cleanMoney', 'heat', 'fear', 'respect', 'contacts'];

export const UI = {
  gameTitle: 'ui.gameTitle',
  tabResources: 'ui.tab.resources',
  tabBuildings: 'ui.tab.buildings',
  tabStorage: 'ui.tab.storage',
  tabSettings: 'ui.tab.settings',
  actionHustle: 'ui.action.hustle',
  buy: 'ui.buy',
  owned: 'ui.owned',
  cost: 'ui.cost',
  capacity: 'ui.capacity',
  heatPerSecond: 'ui.heatPerSecond',
  heatMultiplier: 'ui.heatMultiplier',
  baseStorage: 'ui.storage.base',
  storageFull: 'ui.storage.full',
  sidebarPinned: 'ui.sidebar.pinned',
  pin: 'ui.pin',
  unpin: 'ui.unpin',
  date: 'ui.date',
  offlineReport: 'ui.offlineReport',
  dismiss: 'ui.dismiss',
  saveHeader: 'ui.save.header',
  saveNow: 'ui.save.now',
  savedAt: 'ui.save.savedAt',
  saveFailed: 'ui.save.failed',
  exportHeader: 'ui.save.exportHeader',
  exportCreate: 'ui.save.exportCreate',
  copy: 'ui.copy',
  copied: 'ui.copied',
  importHeader: 'ui.save.importHeader',
  importButton: 'ui.save.importButton',
  importDone: 'ui.save.importDone',
  importFailed: 'ui.save.importFailed',
  resetHeader: 'ui.reset.header',
  resetButton: 'ui.reset.button',
  resetConfirm: 'ui.reset.confirm',
  easterEggInfinity: 'ui.easterEgg.infinity',
} as const;

/** Context shown in the CSV next to each UI key, to help whoever writes the text. */
const UI_CONTEXT: Record<string, string> = {
  [UI.gameTitle]: 'Game title in the header',
  [UI.tabResources]: 'Tab name',
  [UI.tabBuildings]: 'Tab name',
  [UI.tabStorage]: 'Tab name',
  [UI.tabSettings]: 'Tab name: settings, saving, import and export',
  [UI.actionHustle]: 'Button: the first manual action that earns dirty cash',
  [UI.buy]: 'Button to buy a building',
  [UI.owned]: 'Label before the number of owned buildings',
  [UI.cost]: 'Label before a price',
  [UI.capacity]: 'Label before storage capacity',
  [UI.heatPerSecond]: 'Label before heat generated per second',
  [UI.heatMultiplier]: 'Label before a building heat multiplier',
  [UI.baseStorage]: 'Name of the free starting storage for each storage type',
  [UI.storageFull]: 'Warning when a storage type is full and production pauses',
  [UI.sidebarPinned]: 'Header of the pinned resources sidebar',
  [UI.pin]: 'Button: pin a resource to the sidebar',
  [UI.unpin]: 'Button: unpin a resource from the sidebar',
  [UI.date]: 'Label before the in-game date',
  [UI.offlineReport]: 'Message after loading. Placeholders: {duration} = time away as h:mm:ss, {seconds} = time away in seconds',
  [UI.dismiss]: 'Button: close a message',
  [UI.saveHeader]: 'Settings section header: saving',
  [UI.saveNow]: 'Button: save immediately',
  [UI.savedAt]: 'Status after saving. Placeholder {time} = local time of the last save',
  [UI.saveFailed]: 'Error: the browser refused to store the save',
  [UI.exportHeader]: 'Settings section header: export save as text',
  [UI.exportCreate]: 'Button: generate the export string',
  [UI.copy]: 'Button: copy to clipboard',
  [UI.copied]: 'Confirmation after copying',
  [UI.importHeader]: 'Settings section header: import a save string',
  [UI.importButton]: 'Button: load the pasted save string, replacing the current game',
  [UI.importDone]: 'Confirmation after a successful import',
  [UI.importFailed]: 'Error when the pasted save string is invalid. Placeholder {error} = technical reason, in English',
  [UI.resetHeader]: 'Settings section header: delete the save and start over',
  [UI.resetButton]: 'Button: start the hard reset',
  [UI.resetConfirm]: 'Button shown after the first click: confirm deleting everything',
  [UI.easterEggInfinity]: 'Easter egg shown once a number passes 1e308',
};

export interface KeySpec {
  key: string;
  context: string;
}

export const contentKey = {
  coreName: (id: string) => `core.${id}.name`,
  coreDesc: (id: string) => `core.${id}.desc`,
  storageType: (id: string) => `storageType.${id}.name`,
  goodName: (id: string) => `good.${id}.name`,
  goodDesc: (id: string) => `good.${id}.desc`,
  variantName: (id: string) => `variant.${id}.name`,
  buildingName: (id: string) => `building.${id}.name`,
  buildingDesc: (id: string) => `building.${id}.desc`,
  eraName: (id: string) => `era.${id}.name`,
  eraDesc: (id: string) => `era.${id}.desc`,
  contactName: (id: string) => `contact.${id}.name`,
  contactDesc: (id: string) => `contact.${id}.desc`,
};

/** The full list of keys the game needs, in a stable order. */
export function requiredKeys(): KeySpec[] {
  const k = contentKey;
  const specs: KeySpec[] = [];
  for (const [key, context] of Object.entries(UI_CONTEXT)) specs.push({ key, context });
  for (const id of CORE_RESOURCES) {
    specs.push({ key: k.coreName(id), context: 'Topbar resource name' });
    specs.push({ key: k.coreDesc(id), context: 'Topbar resource tooltip' });
  }
  for (const t of STORAGE_TYPES) specs.push({ key: k.storageType(t.id), context: 'Storage type name' });
  for (const g of GOOD_FAMILIES) {
    specs.push({ key: k.goodName(g.id), context: `Good family name (stored as ${g.storageType})` });
    specs.push({ key: k.goodDesc(g.id), context: 'Good family tooltip' });
  }
  for (const v of VARIANTS) {
    specs.push({ key: k.variantName(v.id), context: `Variant of ${v.family}, quality ${v.quality}, from ${v.originYear}` });
  }
  for (const b of STORAGE_BUILDINGS) {
    specs.push({ key: k.buildingName(b.id), context: `Storage building for ${b.storageType}` });
    specs.push({ key: k.buildingDesc(b.id), context: 'Storage building tooltip' });
  }
  for (const e of ERAS) {
    specs.push({ key: k.eraName(e.id), context: `Era starting ${e.startYear}` });
    specs.push({ key: k.eraDesc(e.id), context: 'Era description' });
  }
  for (const c of CONTACTS) {
    specs.push({ key: k.contactName(c.id), context: `Contact, responds to ${c.gate}` });
    specs.push({ key: k.contactDesc(c.id), context: 'Contact tooltip' });
  }
  return specs;
}
