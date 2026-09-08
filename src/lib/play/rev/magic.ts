import { REV_STAT_COUNT, revValue, setRevValue, type RevPc } from './record';

/**
 * Everything a Moraff's Revenge character owns that is magic, by the number of the record it is
 * kept in.
 *
 * `record.ts` names the numbers the dungeon loop itself reads; these are the ones the spells,
 * the scrolls, the potions, the pills and the wands read, and they come out of the same five
 * arrays. Element `I` of the ten singles at DGROUP 6020 is value `26 + I`, of the ten at B41E
 * value `36 + I`, of the seventy at B2D2 value `46 + I` and of the two hundred at 1B92 value
 * `140 + I`, which is how the load at 1000:B674 lays them out.
 */

/** The record's numbers this file names, each by the DGROUP address the game reads it at. */
export const REV_MAGIC = {
  /** DGROUP 6024: the passes left on the fight's own Speed spell (1000:928C). */
  battleSpeed: 27,
  /** DGROUP 6028: the passes left on the fight's own Strength spell (1000:92EF). */
  battleStrength: 28,
  /** DGROUP 602C: the dungeon's Strength spell has been cast, which lasts until the town
   *  (1000:36F4). */
  preppedStrength: 29,
  /** DGROUP 6030: the same for the dungeon's Speed spell (1000:3729). */
  preppedSpeed: 30,
  /** DGROUP B422: how much treasure the bag of holding holds (1000:17D6). */
  bagOfHolding: 37,
  /** DGROUP B426: how many rings of health the character wears (1000:3B54). */
  ringsOfHealth: 38,
  /** DGROUP B436: what the magic armour adds (1000:3C00). */
  magicArmour: 42,
  /** DGROUP B43A: how many holy hand grenades are left (1000:9A21). */
  holyHandGrenades: 43,
  /** DGROUP 1BBA and 1BBE: the square on level 70 the fountain of youth stands on, rolled once
   *  for the character and rolled again every time they drink (1000:B2CF). */
  fountainColumn: 150,
  fountainRow: 151,
  /** DGROUP 1BC2, 1BC6 and 1BCA: the `TIMER` reading each of the three potions that wear off
   *  runs out at (1000:993A, 995D and 9925). */
  fireUntil: 152,
  shieldingUntil: 153,
  speedUntil: 154,
} as const;

/** DGROUP B2D2's element 1: the first of the nine items the game keeps a count of, which are
 *  values 47 to 55 (1000:18EA). */
const FIRST_ITEM_VALUE = 47;

/** DGROUP 1B92's element 22: the first of the six pill colours (1000:7C79). */
const FIRST_PILL_VALUE = 162;

/** DGROUP 1B92's element 28: the first of the nine wand colours (1000:7ACB). */
const FIRST_WAND_VALUE = 168;

/**
 * The nine items the game counts, in the order `F2.COM` names them and the two menus offer
 * them: the four scrolls the dungeon uses (1000:16E4) and the five potions a fight uses
 * (1000:98ED).
 */
export const REV_ITEM_COUNT = 9;

/** How many pill colours and wand colours there are (1000:7CCE and 1000:7B25). */
export const REV_PILL_COLOURS = 6;
export const REV_WAND_COLOURS = 9;

/**
 * The six pill colours and the nine wand colours, which are one string array the game fills at
 * start-up (1000:033E onward, DGROUP 1B56).
 *
 * The pills read it forwards, `C$(colour)`, and the wands backwards, `C$(10 - colour)`
 * (1000:7CA7 and 1000:7AFC), so wand 1 is the last colour of the list and wand 9 the first.
 */
const COLOURS = ['BLUE', 'RED', 'GREEN', 'YELLOW', 'ORANGE', 'WHITE', 'BLACK', 'BROWN', 'PURPLE'];

/** What a pill of this colour is called (1000:7CA7). */
export function revPillColour(colour: number): string {
  return COLOURS[colour - 1] ?? '';
}

/** What a wand of this colour is called (1000:7AFC). */
export function revWandColour(colour: number): string {
  return COLOURS[COLOURS.length - colour] ?? '';
}

/** How many of one of the nine counted items the character has (1000:18EA). */
export function revItemsHeld(pc: RevPc, item: number): number {
  return revValue(pc, FIRST_ITEM_VALUE + item - 1);
}

/** One more of one of them, which is what a kill leaves (1000:B01D). */
export function revGainItem(pc: RevPc, item: number): void {
  setRevValue(pc, FIRST_ITEM_VALUE + item - 1, revItemsHeld(pc, item) + 1);
}

/** One of them is used up (1000:16FA and the eight like it). */
export function revSpendItem(pc: RevPc, item: number): void {
  setRevValue(pc, FIRST_ITEM_VALUE + item - 1, revItemsHeld(pc, item) - 1);
}

/** How many pills of a colour are left (1000:7C79). */
export function revPillsHeld(pc: RevPc, colour: number): number {
  return revValue(pc, FIRST_PILL_VALUE + colour - 1);
}

export function revSpendPill(pc: RevPc, colour: number): void {
  setRevValue(pc, FIRST_PILL_VALUE + colour - 1, revPillsHeld(pc, colour) - 1);
}

/** One more pill of a colour, which is what a kill leaves (1000:B14F). */
export function revGainPill(pc: RevPc, colour: number): void {
  setRevValue(pc, FIRST_PILL_VALUE + colour - 1, revPillsHeld(pc, colour) + 1);
}

/** How many charges a wand of a colour has left (1000:7ACB). */
export function revWandCharges(pc: RevPc, colour: number): number {
  return revValue(pc, FIRST_WAND_VALUE + colour - 1);
}

export function revSpendWandCharge(pc: RevPc, colour: number): void {
  setRevValue(pc, FIRST_WAND_VALUE + colour - 1, revWandCharges(pc, colour) - 1);
}

/** Charges added to a wand of a colour, which is what a kill leaves (1000:B1D8). */
export function revGainWandCharges(pc: RevPc, colour: number, many: number): void {
  setRevValue(pc, FIRST_WAND_VALUE + colour - 1, revWandCharges(pc, colour) + many);
}

/**
 * The bits of value 16, the record's own bitfield of the magic the character wears rather than
 * spends, as `CINT(B558) AND n` reads them.
 */
export const REV_WORN = {
  /** 1000:1E5C: the rings of health, which the two cheaper inns heal in full for. */
  ringsOfHealth: 1,
  /** 1000:13ED: the bag of holding. */
  bagOfHolding: 2,
  /** 1000:ADF5 and 1000:AE81: the magic sword and mace, whose pluses are values 39 and 40. The
   *  table at 1000:AC87 is the only place either bit is ever written and nothing reads them
   *  back; the pluses are what the fight goes by. */
  magicSword: 4,
  magicMace: 8,
  /** 1000:3BE7: the magic ring, whose bonus is value 41. */
  magicRing: 16,
  /** 1000:3C15: the magic armour, whose bonus is value 42. */
  magicArmour: 32,
  /** 1000:141E: the floor slosher. */
  floorSlosher: 64,
} as const;

/** Whether the character wears one of them (`CINT(B558) AND n`). */
export function revWears(pc: RevPc, what: number): boolean {
  return (Math.round(pc.rings) & what) !== 0;
}

/**
 * 1000:2F43: every characteristic is floored at 1.
 *
 * It is the tail of the game's own blocking wait for a key (1000:2F71), so anything that lowers
 * a characteristic and then waits gets this for nothing — which is how a pill that takes two off
 * a 1 leaves it at 1 rather than at -1.
 */
export function revFloorStats(pc: RevPc): void {
  for (let index = 0; index < REV_STAT_COUNT; index++) {
    if (pc.stats[index] < 1) pc.stats[index] = 1;
  }
}

/**
 * A number the way BASIC's `PRINT` writes one: a space where the sign would be, and a space
 * after it, which is why so many of the game's lines have a gap in the middle of them.
 */
export function revBasicNumber(value: number): string {
  const number = Math.trunc(value);
  return `${number < 0 ? number : ` ${number}`} `;
}

/**
 * `RND` itself, which the game writes where it wants a fraction rather than `INT(RND * n)`.
 *
 * The run's generator hands out whole numbers, since that is all `INT(RND * n)` ever needs; a
 * bare `RND` is one draw of the same fifteen bits read as the fraction it is, so a spell or a
 * pile of treasure costs the run's sequence exactly what the original costs it.
 */
export function revFraction(rng: { random(n: number): number }): number {
  return rng.random(RND_BITS) / RND_BITS;
}

/** The fifteen bits `rand()` gives the port's generator (`../../game/port/rng.ts`). */
const RND_BITS = 0x8000;
