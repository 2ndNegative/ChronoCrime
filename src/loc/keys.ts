import { ACTIONS, CONTACTS, MISSIONS, ERAS, GOOD_FAMILIES, STORAGE_BUILDINGS, STORAGE_TYPES, VARIANTS } from '../data';
import type { CoreResourceId, MissionCondition } from '../core/types';

/**
 * Every piece of display text has a key. Content keys are derived from data ids;
 * UI keys are listed here. `npm run loc:sync` adds any missing key to loc/strings.csv.
 */

export const CORE_RESOURCES: CoreResourceId[] = ['dirtyCash', 'cleanMoney', 'heat', 'fear', 'respect'];

export const UI = {
  gameTitle: 'ui.gameTitle',
  tabResources: 'ui.tab.resources',
  tabBuildings: 'ui.tab.buildings',
  tabStorage: 'ui.tab.storage',
  tabSettings: 'ui.tab.settings',
  tabActions: 'ui.tab.actions',
  tabContacts: 'ui.tab.contacts',
  actionStart: 'ui.action.start',
  actionStop: 'ui.action.stop',
  actionLevel: 'ui.action.level',
  actionDuration: 'ui.action.duration',
  actionCompletions: 'ui.action.completions',
  actionNeeds: 'ui.action.needs',
  actionGives: 'ui.action.gives',
  actionStalledInputs: 'ui.action.stalledInputs',
  actionStalledStorage: 'ui.action.stalledStorage',
  actionIdle: 'ui.action.idle',
  missionHeader: 'ui.mission.header',
  missionProgress: 'ui.mission.progress',
  missionReward: 'ui.mission.reward',
  missionComplete: 'ui.mission.complete',
  missionAllDone: 'ui.mission.allDone',
  contactLevel: 'ui.contact.level',
  contactRequires: 'ui.contact.requires',
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
  locProgressHeader: 'ui.loc.header',
  locProgress: 'ui.loc.progress',
  devHeader: 'ui.dev.header',
  devPassword: 'ui.dev.password',
  devUnlock: 'ui.dev.unlock',
  devWrongPassword: 'ui.dev.wrongPassword',
  devActive: 'ui.dev.active',
  devLock: 'ui.dev.lock',
  devEditorSave: 'ui.dev.editorSave',
  devEditorCancel: 'ui.dev.editorCancel',
  devSaveFailed: 'ui.dev.saveFailed',
  easterEggInfinity: 'ui.easterEgg.infinity',
} as const;

/** Context shown in the CSV next to each UI key, to help whoever writes the text. */
const UI_CONTEXT: Record<string, string> = {
  [UI.gameTitle]: 'Game title in the header',
  [UI.tabResources]: 'Tab name',
  [UI.tabBuildings]: 'Tab name',
  [UI.tabStorage]: 'Tab name',
  [UI.tabSettings]: 'Tab name: settings, saving, import and export',
  [UI.tabActions]: 'Tab name: what the player character is doing',
  [UI.tabContacts]: 'Tab name: named contacts you cultivate',
  [UI.actionStart]: 'Button: make the character do this action (repeats until changed)',
  [UI.actionStop]: 'Button: stop the current action',
  [UI.actionLevel]: 'Action level and XP. Placeholders {level}, {xp}, {next} = XP needed for the next level',
  [UI.actionDuration]: 'Time per action. Placeholder {seconds} = seconds, already formatted',
  [UI.actionCompletions]: 'How often the action was completed. Placeholder {count}',
  [UI.actionNeeds]: 'Label before the inputs an action uses up',
  [UI.actionGives]: 'Label before what an action produces',
  [UI.actionStalledInputs]: 'Status: the action waits because its inputs are missing',
  [UI.actionStalledStorage]: 'Status: the action waits because storage for its output is full',
  [UI.actionIdle]: 'Status: the character is doing nothing',
  [UI.missionHeader]: 'Header of the current-goal panel above the tabs',
  [UI.missionProgress]: 'Progress toward the current mission. Placeholders {current} and {target}, already formatted',
  [UI.missionReward]: 'Label before the reward of the current mission',
  [UI.missionComplete]: 'Notice after a mission completes. Placeholder {mission} = the mission name (already written)',
  [UI.missionAllDone]: 'Shown in the goal panel once every mission of this era is done',
  [UI.contactLevel]: 'Contact level. Placeholders {level} and {max}',
  [UI.contactRequires]: 'Requirement to meet a contact. Placeholders {meter} = Fear or Respect (already written), {amount}',
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
  [UI.locProgressHeader]: 'Settings section header for the text-writing tool (only shown while the game is in development)',
  [UI.locProgress]: 'Text-writing progress. Placeholders {written} and {total} = number of texts',
  [UI.devHeader]: 'Dev mode: Settings section header (local dev server only)',
  [UI.devPassword]: 'Dev mode: placeholder in the password field',
  [UI.devUnlock]: 'Dev mode: button to unlock with the password',
  [UI.devWrongPassword]: 'Dev mode: error for a wrong password',
  [UI.devActive]: 'Dev mode: explanation shown while unlocked (click unwritten text to write it)',
  [UI.devLock]: 'Dev mode: button to leave dev mode',
  [UI.devEditorSave]: 'Dev mode text editor: save button (Enter also saves)',
  [UI.devEditorCancel]: 'Dev mode text editor: cancel button (Escape also cancels)',
  [UI.devSaveFailed]: 'Dev mode text editor: error when writing the CSV failed, e.g. open in Excel. Placeholder {error} = technical reason',
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
  actionName: (id: string) => `action.${id}.name`,
  actionDesc: (id: string) => `action.${id}.desc`,
  missionName: (id: string) => `mission.${id}.name`,
  missionDesc: (id: string) => `mission.${id}.desc`,
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
  for (const a of ACTIONS) {
    specs.push({ key: k.actionName(a.id), context: 'Action name (what the player character does)' });
    specs.push({ key: k.actionDesc(a.id), context: 'Action tooltip' });
  }
  for (const m of MISSIONS) {
    specs.push({ key: k.missionName(m.id), context: `Main mission ${MISSIONS.indexOf(m) + 1} of ${m.era}. Goal: ${describeCondition(m.condition)}` });
    specs.push({ key: k.missionDesc(m.id), context: 'Mission text: hint at what to do and why' });
  }
  for (const c of CONTACTS) {
    specs.push({ key: k.contactName(c.id), context: `Contact, responds to ${c.gate}` });
    specs.push({ key: k.contactDesc(c.id), context: 'Contact tooltip' });
  }
  return specs;
}

function describeCondition(c: MissionCondition): string {
  switch (c.kind) {
    case 'actionLevel':
      return `${c.action} to level ${c.level}`;
    case 'hold':
      return `hold ${c.amount} ${c.variant}`;
    case 'building':
      return `own ${c.count} ${c.building}`;
    case 'meter':
      return `${c.meter} ${c.amount}`;
    case 'cleanMoney':
      return `${c.amount} clean money`;
  }
}
