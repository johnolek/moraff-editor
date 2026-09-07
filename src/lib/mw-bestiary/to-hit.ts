import { hitChance, totalNeededToBeatDefense } from '../bestiary/to-hit';
import { weaponById, type MwMonster } from './monsters';

/**
 * What it takes to land a swing in Moraff's World, from strike (exe 2000:5bef, mw.c "strike").
 *
 * The shape of the swing is the one Dungeons of the Unforgiven has: a roll of random(80) plus
 * the character's total, less what the monster takes off, and one roll of the weapon's damage
 * die for every full 40 points the result is over 40. Only the totals differ, so the counting
 * itself is `src/lib/bestiary/to-hit.ts` and this file only works out the two numbers to hand it.
 *
 * Two things strike does are left out. The 1-in-30 bonus of 40 points a swing past floor 75 can
 * roll is left out the same way the Dungeons of the Unforgiven side leaves it out. So is the
 * Power Weapon spell, which swaps the damage die for one of the four huge ones at the end of the
 * weapon table — it hardly moves how often a swing connects, and where in that table it lands is
 * off by one in the game itself.
 */

/** The pieces of a character that go into a swing. */
export interface MwFighter {
  lev: number;
  str: number;
  luck: number;
  /** Which of the twelve weapons is in hand, as the record's byte at 0x9b has it. */
  weapon: number;
  /** The plus on that weapon, from the eight bytes at 0x8e. */
  weaponPlus: number;
  /** The gauntlets, from the byte at 0x846. */
  gauntlet: number;
}

/**
 * The total a swing adds to its roll.
 *
 * strike adds two more bytes of the character record, at 0x7c7 and 0x7ce, that nothing has yet
 * named; they are left out here, so a character carrying whatever they hold hits a little more
 * often than these numbers say.
 */
export function toHitTotal(fighter: MwFighter): number {
  return (
    2 * fighter.lev +
    fighter.str +
    fighter.luck +
    weaponById(fighter.weapon).toHit +
    fighter.weaponPlus +
    fighter.gauntlet
  );
}

/** What the monster takes off the swing: twice its depth and its three defence bytes. */
export function monsterDefence(monster: MwMonster, depth: number): number {
  return 2 * depth + monster.defence + monster.extraDefence + monster.defenceAndAttack;
}

/**
 * The share of swings the game calls hits: the roll gets past the monster and at least one of
 * the damage dice it earns comes up over zero. Moraff's World prints "YOU MISSED THE MONSTER"
 * whenever the damage adds up to nothing, which on a small weapon is often.
 */
export function mwHitChance(total: number, monster: MwMonster, depth: number, damageDie: number): number {
  return hitChance(total, depth, monster.defence + monster.extraDefence, monster.defenceAndAttack, damageDie);
}

/** The smallest total that gets past the monster's defence this often. */
export function totalNeededFor(chance: number, monster: MwMonster, depth: number): number {
  return totalNeededToBeatDefense(chance, depth, monster.defence + monster.extraDefence, monster.defenceAndAttack);
}

/** Where the Moraff's World record keeps the pieces of a swing. */
const RECORD = { level: 0x7a8, strength: 0x812, luck: 0x81c, weapon: 0x9b, weaponPlus: 0x8e, gauntlet: 0x846 };

/** The character a Moraff's World save file holds, as a fighter. */
export function fighterFromRecord(bytes: Uint8Array): MwFighter {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const weapon = view.getUint8(RECORD.weapon);
  return {
    lev: view.getInt16(RECORD.level, true),
    str: view.getInt16(RECORD.strength, true),
    luck: view.getInt16(RECORD.luck, true),
    weapon,
    weaponPlus: weapon < 8 ? view.getInt8(RECORD.weaponPlus + weapon) : 0,
    gauntlet: view.getInt8(RECORD.gauntlet),
  };
}
