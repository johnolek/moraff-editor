export const SAVE_SIZE: 2697;
export const SAVE_RECORD: 2695;

export function saveChecksum(bytes: Uint8Array): [number, number];
export function fixSaveChecksum(bytes: Uint8Array): void;

export interface SaveRecord {
  name: string;
  checksumOk: boolean;
  race: number;
  sex: number;
  cls: number;
  hp: number;
  maxHp: number;
  sp: number;
  maxSp: number;
  heightDiv4: number;
  weight: number;
  loadedWeight: number;
  weaponsOwned: number[];
  weaponPlus: number[];
  weapon: number;
  armorOwned: number[];
  armorPlus: number[];
  armor: number;
  potions: number[];
  spellbooks: number[];
  scrolls: number[];
  wands: number[];
  papers: number[];
  rubles: number;
  bank: number;
  cultureStock: number;
  children: number;
  crystals: number;
  dollars: number;
  exp: number;
  lev: number;
  /** Facing: 0 north, 1 south, 2 west, 3 east. */
  dir: number;
  x: number;
  y: number;
  level: number;
  module: number;
  realtime: number;
  regenRings: number;
  luckyCharms: number;
  grenades: number;
  seeingStones: number;
  disease: number;
  poison: number;
  tempWeaponPlus: number;
  tempArmorPlus: number;
  bodyArmor: number;
  protRing: number;
  antiMagicRing: number;
  feather: number;
  fastMove: number;
  invisible: number;
  age: number;
  powerWeapon: number;
  powerWeaponTime: number;
  protection: number;
  protectionTime: number;
  slosher: number;
  healingPotions: number;
  teleportStones: number;
  str: number;
  iq: number;
  wis: number;
  con: number;
  dex: number;
  luck: number;
  /** Trap door keys, indexed by destination floor / 5. */
  keys: number[];
  /** Per module: bits 1/2/4/8 = section 1-4 of that module beaten. */
  objective: number[];
  gauntlet: number;
  /** Indexed by bossIndex(); 0/0 = never placed. */
  bossX: number[];
  bossY: number[];
  hard: number;
  lowestLevel: number;
}

export function parseSave(bytes: Uint8Array): SaveRecord;
/** 45*type + 3*(level-1) + slot (0-based slot). */
export function spellIndex(type: number, level: number, slot: number): number;

export function dunFileName(slot: number, floor: number, module: number): string;
export function parseDunName(name: string): { slot: number; quarter: number; module: number };
/** floor within the quarter (0..31) -> 110*80 explored flags. */
export function parseDun(bytes: Uint8Array): Map<number, Uint8Array>;

export interface MonsterEntry {
  slot: number;
  x: number;
  y: number;
  hp: number;
  type: number;
  level: number;
}
export function parseMonMap(bytes: Uint8Array): { floor: number; monsters: MonsterEntry[] }[];

export interface MonsterNameData {
  builtinMonsters: { name: string }[];
  sections: { monsters: { name: string }[] }[];
}
export function monsterName(data: MonsterNameData, module: number, floor: number, type: number): string;
/** Section 1..20 for a module 0..4 and floor. */
export function sectionOf(module: number, floor: number): number;
/** Index into bossX/bossY for the boss of (module 0..4, section 0..3 within the module). */
export function bossIndex(module: number, sectionInModule: number): number;
