import { REV_VALUE_COUNT, formatRevRecord, parseRevRecord } from '../../game/rev-port/record';

/**
 * `<n>.EXE`, the character record, as the dungeon reads it and writes it back.
 *
 * The load is the run of `INPUT #3` statements at DUNSMALL.EXE 1000:B674 and the save the run of
 * `WRITE #3` statements at 1000:B308, which put the same 340 numbers back in the same order with
 * the same amounts added to them again. `../../game/rev-port/record.ts` is the text format
 * itself; this is what the numbers mean.
 *
 * Everything the dungeon never touches is carried through untouched, so a character saved here
 * is the character that was loaded except where the game itself changed it.
 */

/** Where each named field sits, counting the values from one the way the record layout does. */
const VALUE = {
  /** The six characteristics, `(stored - 237) / 3` (1000:B6BF): strength, intelligence, wisdom,
   *  health, agility, laziness. */
  firstStat: 1,
  /** 1000:B6F7's first field, which CHCHAR sets from strength and the swing adds to damage. */
  fromStrength: 7,
  /** DGROUP B59E, which gaining a level adds to the hit points it hands out (1000:2065). */
  fromHealth: 8,
  /** DGROUP B5A2, which is part of the armour class a monster has to beat (1000:9B1E). */
  fromAgility: 9,
  /** 1 for a fighter and anything else a wizard (1000:1A65). */
  cls: 10,
  experience: 12,
  level: 13,
  maxHp: 14,
  hp: 15,
  /** The bitfield of rings the character wears; bit 0 is the rings of health (1000:1E5C). */
  rings: 16,
  weight: 17,
  /** The treasure carried, which the bank exchanges for jewel pieces (1000:0838). */
  treasure: 18,
  money: 19,
  bank: 20,
  spellPoints: 22,
  column: 23,
  row: 24,
  level0: 25,
  /** The divisor the wall rule is generated with, which the fountain of youth raises
   *  (`rev-tools/docs/DUNGEON.md` section 5). */
  generation: 26,
} as const;

/** How many characteristics there are, and how the six are stored. */
export const REV_STAT_COUNT = 6;
const STAT_SHIFT = 237;
const STAT_SCALE = 3;

/** What each shifted field has added to it on the way out (1000:B74A onwards). */
const SHIFTS: Record<number, number> = {
  [VALUE.experience]: 12316,
  [VALUE.level]: 476,
  [VALUE.maxHp]: 376,
  [VALUE.hp]: 176,
  [VALUE.weight]: 71,
  [VALUE.treasure]: 4434,
  [VALUE.money]: 223,
};

/** A character the dungeon is being played with. */
export interface RevPc {
  /** Every one of the 340 numbers, as the file holds them, so that the fields nothing here
   *  names survive a save. */
  values: number[];
  /** Strength, intelligence, wisdom, health, agility and laziness, in that order. */
  stats: number[];
  fromStrength: number;
  fromHealth: number;
  fromAgility: number;
  cls: number;
  experience: number;
  level: number;
  maxHp: number;
  hp: number;
  rings: number;
  weight: number;
  treasure: number;
  money: number;
  bank: number;
  spellPoints: number;
  /** Where the character stands: columns 1 to 20, rows 1 to 19, level 0 the town. */
  column: number;
  row: number;
  dungeonLevel: number;
  generation: number;
  /** The way the character faces, 1 north to 4 west. The record has no room for it — the game
   *  starts every session facing north (DGROUP B47C is a BASIC single nothing initialises). */
  facing: number;
}

/** The character the bytes of a `<n>.EXE` describe, or null when they are not one. */
export function loadRevPlayer(bytes: Uint8Array): RevPc | null {
  const values = parseRevRecord(bytes);
  return values === null ? null : revPlayerFromValues(values);
}

/** The same over numbers already parsed. */
export function revPlayerFromValues(values: number[]): RevPc {
  const at = (value: number) => values[value - 1] - (SHIFTS[value] ?? 0);
  const stats: number[] = [];
  for (let index = 0; index < REV_STAT_COUNT; index++) {
    stats.push((values[VALUE.firstStat - 1 + index] - STAT_SHIFT) / STAT_SCALE);
  }
  return {
    values: values.slice(),
    stats,
    fromStrength: at(VALUE.fromStrength),
    fromHealth: at(VALUE.fromHealth),
    fromAgility: at(VALUE.fromAgility),
    cls: at(VALUE.cls),
    experience: at(VALUE.experience),
    level: at(VALUE.level),
    maxHp: at(VALUE.maxHp),
    hp: at(VALUE.hp),
    rings: at(VALUE.rings),
    weight: at(VALUE.weight),
    treasure: at(VALUE.treasure),
    money: at(VALUE.money),
    bank: at(VALUE.bank),
    spellPoints: at(VALUE.spellPoints),
    column: at(VALUE.column),
    row: at(VALUE.row),
    dungeonLevel: at(VALUE.level0),
    generation: at(VALUE.generation),
    facing: 1,
  };
}

/** The 340 numbers a character saves as (1000:B308). */
export function revValuesFor(pc: RevPc): number[] {
  const values = pc.values.slice();
  const put = (value: number, number: number) => {
    values[value - 1] = number + (SHIFTS[value] ?? 0);
  };
  for (let index = 0; index < REV_STAT_COUNT; index++) {
    values[VALUE.firstStat - 1 + index] = STAT_SCALE * pc.stats[index] + STAT_SHIFT;
  }
  put(VALUE.fromStrength, pc.fromStrength);
  put(VALUE.fromHealth, pc.fromHealth);
  put(VALUE.fromAgility, pc.fromAgility);
  put(VALUE.cls, pc.cls);
  put(VALUE.experience, pc.experience);
  put(VALUE.level, pc.level);
  put(VALUE.maxHp, pc.maxHp);
  put(VALUE.hp, pc.hp);
  put(VALUE.rings, pc.rings);
  put(VALUE.weight, pc.weight);
  put(VALUE.treasure, pc.treasure);
  put(VALUE.money, pc.money);
  put(VALUE.bank, pc.bank);
  put(VALUE.spellPoints, pc.spellPoints);
  put(VALUE.column, pc.column);
  put(VALUE.row, pc.row);
  put(VALUE.level0, pc.dungeonLevel);
  put(VALUE.generation, pc.generation);
  return values;
}

/** The bytes of the character file this character saves as. */
export function saveRevPlayer(pc: RevPc): Uint8Array<ArrayBuffer> {
  const values = revValuesFor(pc);
  if (values.length !== REV_VALUE_COUNT) throw new Error(`a character holds ${REV_VALUE_COUNT} numbers, not ${values.length}`);
  return formatRevRecord(values);
}

/** Whether the character owns the rings of health, which heal in full at the two cheaper inns
 *  (`CINT(B558) AND 1` at 1000:1E5C and 1000:1F92). */
export function wearsRingsOfHealth(pc: RevPc): boolean {
  return (Math.round(pc.rings) & 1) !== 0;
}

/**
 * The values of the record the dungeon reads out of its five arrays, each named by the DGROUP
 * address the game reads it at.
 *
 * The arrays are laid out element `I` at `<base> + 4 * I`, so element 1 of the ten singles at
 * 6020 is value 27, element 1 of the ten at B41E is value 37, and element 1 of the two hundred
 * at 1B92 is value 141.
 */
export const REV_VALUE = {
  /** DGROUP 6034: the moves left on the invisibility spell (1000:7342). */
  invisibility: 31,
  /** DGROUP B42A: what the sword's magic adds to a swing (1000:8A5F). */
  swordPlus: 39,
  /** DGROUP B42E: what the mace's magic adds — to the armour class rather than to the swing,
   *  which is one of the two slips in the fight code (1000:9B12). */
  macePlus: 40,
  /** DGROUP B432: the other thing the armour class is built from (1000:9B18). */
  armourBonus: 41,
  /** DGROUP 1B96: the knife (1000:8830 and the store at 1000:29D4). */
  knife: 141,
  /** DGROUP 1B9A: the sword (1000:87DB and 1000:2A40). */
  sword: 142,
  /** DGROUP 1B9E: the mace (1000:8805 and 1000:2A0A). */
  mace: 143,
} as const;

/** DGROUP B56C: which armour the character wears, 0 to 4 as the store sells it (1000:2A9A). */
export const REV_ARMOUR_VALUE = 11;

/** DGROUP B4DE: the experience a kill banks, which is added to the record's own experience
 *  wherever the two are compared (1000:A37A, read at 1000:0736). */
export const REV_UNBANKED_EXPERIENCE_VALUE = 21;

/** One of the record's numbers the dungeon reads by address. */
export function revValue(pc: RevPc, value: number): number {
  return pc.values[value - 1] ?? 0;
}

export function setRevValue(pc: RevPc, value: number, number: number): void {
  pc.values[value - 1] = number;
}
