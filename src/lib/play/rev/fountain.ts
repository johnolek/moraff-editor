import { LEVELS } from '../../game/revmap.js';
import type { RevMagicDesk } from './desk';
import { REV_FOUR_SECONDS } from './held';
import { REV_MAGIC } from './magic';
import { REV_STAT_COUNT, REV_UNBANKED_EXPERIENCE_VALUE, revValue, setRevValue, type RevPc } from './record';
import { revArriveInTheTown, revEndPreppedSpells } from './spells';
import type { RevGame } from './state';

/**
 * The fountain of youth: DUNSMALL.EXE 1000:3D83, which is the only thing on the seventieth level
 * worth walking to.
 *
 * It stands on one square of the deepest level, rolled once for each character and rolled again
 * every time they drink from it, and drinking starts the character over: level 0, no experience,
 * five points on every characteristic, hit points rolled fresh, the whole dungeon forgotten, and
 * the treasure they were carrying turned into money at face value rather than at the bank's
 * rate.
 *
 * What it costs is the generation: two more on the number the wall rule is worked out with, so
 * the dungeon they walk back into is not the one they walked out of.
 */

/** 1000:3D94: the two lines the square puts up, which is what the D key answers. */
export const REV_FOUNTAIN_PROMPT = [
  'You have found the fountain of youth.   ',
  "   Hit `D' to drink.                    ",
];

/** 1000:3DB7: what the drink says. */
export const REV_YOU_FEEL_STRANGE = 'YOU FEEL STRANGE...';

/** 1000:0844: the character is standing on it — the deepest level, and the square the two
 *  numbers of their own record name. */
export function revAtTheFountain(game: RevGame): boolean {
  const pc = game.pc;
  if (pc.dungeonLevel !== LEVELS) return false;
  return pc.column === revValue(pc, REV_MAGIC.fountainColumn) && pc.row === revValue(pc, REV_MAGIC.fountainRow);
}

/**
 * 1000:B2CF: where the fountain stands, which is two rolls of `INT(RND * 15) + 2`.
 *
 * It is rolled at 1000:B98F for a character whose column is still 0 — a character who has never
 * been played — and again by every drink, so no two characters share a fountain and no character
 * finds the same one twice.
 */
export function revRollTheFountain(game: RevGame): void {
  setRevValue(game.pc, REV_MAGIC.fountainColumn, game.rng.random(15) + 2);
  setRevValue(game.pc, REV_MAGIC.fountainRow, game.rng.random(15) + 2);
}

/** Whether the character has a fountain yet (1000:B98F). */
export function revNeedsAFountain(pc: RevPc): boolean {
  return revValue(pc, REV_MAGIC.fountainColumn) === 0;
}

/**
 * 1000:2115: the spell points a character has, worked out from scratch.
 *
 * Intelligence and wisdom set the base, the class multiplies it by the level two different ways,
 * and the class adds its own again on top. It is not a gain but a replacement, so a character
 * who has spent their spell points gets them all back here.
 *
 * It does its working in the compiler's scratch cell: 1000:2145 puts the base there and
 * 1000:2173 (a wizard) or 1000:2197 (anyone else) writes the level's share over it, so what the
 * routine leaves behind for the next monster's d20 to start from (`attack.ts`) is the second
 * number, not the base.
 */
export function revWorkOutSpellPoints(game: RevGame): void {
  const pc = game.pc;
  const base = Math.floor((pc.stats[1] - 12) / 3 + pc.stats[2] * 0.25 - 3);
  const wizard = pc.cls === 2;
  const fromLevel = wizard ? Math.floor((pc.level * base) / 3) + base : Math.floor((base * pc.level) / 6) + base;
  game.scratch = fromLevel;
  pc.spellPoints = fromLevel + (wizard ? pc.level * 3 + 2 : pc.level - 4);
  if (pc.spellPoints < 1) pc.spellPoints = 0;
}

/** 1000:3DAE: the drink. */
export function revDrinkFromTheFountain(game: RevGame, desk: RevMagicDesk): void {
  const pc = game.pc;
  game.say(REV_YOU_FEEL_STRANGE);
  // 1000:3DC0: four seconds on a screen the drink has just cleared, which is the whole of what
  // the player is shown before they are back in the town.
  game.delay(REV_FOUR_SECONDS);
  game.memory.forgetTheDungeon();
  revRollTheFountain(game);
  pc.level = 0;
  pc.experience = 0;
  pc.column = 10;
  pc.row = 10;
  // 1000:3E5A: the treasure becomes money at face value, which is more than the bank pays for it.
  pc.money = pc.treasure;
  pc.treasure = 0;
  pc.fromHealth = Math.floor(2 * pc.stats[3] - 26);
  if (pc.fromHealth < 1) pc.fromHealth = Math.trunc(0.5 * pc.fromHealth);
  pc.maxHp = game.rng.random(10) + pc.fromHealth + 5;
  pc.hp = pc.maxHp;
  pc.generation += 2;
  setRevValue(pc, REV_UNBANKED_EXPERIENCE_VALUE, 0);
  for (let stat = 0; stat < REV_STAT_COUNT; stat++) pc.stats[stat] += 5;
  revWorkOutSpellPoints(game);
  revEndPreppedSpells(game);
  pc.dungeonLevel = 0;
  desk.save();
  revArriveInTheTown(game);
  desk.enterLevel(0);
}
