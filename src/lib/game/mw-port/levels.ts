import { HINT, loadHBin } from './hints';
import type { MwGame } from './state';

/**
 * Going up a level, going down one, and what happens when the hit points run out.
 *
 * The curve and the per-class rolls are the ones `mw-tools/docs/DUNGEON.md` writes out under
 * "What a kill is worth"; both are constant for constant the same as Dungeons of the
 * Unforgiven's, which is why the numbers here read like `../port/combat.ts`'s.
 */

/** The doubles and floats experience_needed and can_level_up work from. */
const EXP_BASE = 1.36; // DS:269d
const EXP_SCALE = 250; // DS:26a5
const EXP_OFFSET = 130; // DS:26a9

/**
 * experience_needed (WORLD.EXE 2000:59fd, mw.c "experience_needed"): the experience a character
 * needs before level `level` is behind them.
 *
 * Ghidra kept the `pow` base at DS:269d and dropped the FPU arithmetic around it; the 250 and
 * the 130 are the floats at DS:26a5 and DS:26a9, which experience_for_level (exe 2000:5a42) and
 * can_level_up put back.
 */
export function experienceNeeded(level: number): number {
  return EXP_SCALE * Math.pow(EXP_BASE, level - 1) - EXP_OFFSET;
}

/**
 * can_level_up (WORLD.EXE 2000:5ae2, mw.c "can_level_up"): whether a night at the inn would
 * make the character more powerful.
 *
 * It hands its own level to {@link experienceNeeded}, so a level 0 character is ready at 54
 * experience, a level 1 character at 210, and so on.
 */
export function canLevelUp(game: MwGame): boolean {
  return experienceNeeded(game.pc.lev) < game.pc.exp;
}

/**
 * The level-up (WORLD.EXE 3000:e5f5, mw.c "FUN_3000_e5f5"): one more level, its hit points and
 * its spell points.
 *
 * The hit points are a roll on constitution and luck plus a flat amount, both of which the class
 * sets; a fighter is the only class that gets no spell points, and a sage the only one whose
 * roll leans on constitution rather than dividing it. The spell points are not rolled at all.
 * Every hit point the maximum gains is handed to the character on the spot, and the spell points
 * go all the way back to full.
 */
export function levelUp(game: MwGame): void {
  const pc = game.pc;
  const before = pc.maxHp;
  pc.lev += 1;
  switch (pc.cls) {
    case 0:
      pc.maxHp += game.rng.random(pc.con * 2 + Math.trunc(pc.luck / 2) + 10) + 35;
      break;
    case 1:
      pc.maxHp += game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 2) + 10) + 15;
      pc.maxSp += Math.trunc((pc.wis * 2 + pc.iq) / 3);
      break;
    case 2:
      pc.maxHp += game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 3) + 5) + 14;
      pc.maxSp += Math.trunc((pc.wis + pc.iq) / 13);
      break;
    case 3:
      pc.maxHp += game.rng.random(Math.trunc(pc.con / 3) + Math.trunc(pc.luck / 5) + 4) + 13;
      pc.maxSp += Math.trunc((pc.wis + pc.iq * 2) / 5);
      break;
    case 4:
      pc.maxHp += game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 3) + 4) + 14;
      pc.maxSp += Math.trunc((pc.wis * 2 + pc.iq) / 5);
      break;
    case 5:
      pc.maxHp += game.rng.random(pc.con * 3 + pc.luck + 17) + 55;
      pc.maxSp += Math.trunc((pc.wis + pc.iq) / 14);
      break;
    case 6:
      pc.maxHp += game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 3) + 7) + 14;
      pc.maxSp += Math.trunc((pc.wis + pc.iq * 2) / 8);
      break;
  }
  pc.sp = pc.maxSp;
  pc.hp += pc.maxHp - before;
}

/**
 * Going down a level (WORLD.EXE 3000:e8ee, mw.c "FUN_3000_e8ee"): take back one level's worth of
 * maximum hit points and spell points, rolled the same way {@link levelUp} gives them out.
 *
 * It does not touch the level itself; monster_turn (exe 2000:615c) takes the levels off before
 * it calls this once per level lost.
 */
export function goDownLevel(game: MwGame): void {
  const pc = game.pc;
  switch (pc.cls) {
    case 0:
      pc.maxHp -= game.rng.random(pc.con * 2 + Math.trunc(pc.luck / 2) + 10) + 35;
      break;
    case 1:
      pc.maxHp -= game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 2) + 10) + 15;
      pc.maxSp -= Math.trunc((pc.wis * 2 + pc.iq) / 3);
      break;
    case 2:
      pc.maxHp -= game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 3) + 5) + 14;
      pc.maxSp -= Math.trunc((pc.wis + pc.iq) / 13);
      break;
    case 3:
      pc.maxHp -= game.rng.random(Math.trunc(pc.con / 3) + Math.trunc(pc.luck / 5) + 4) + 13;
      pc.maxSp -= Math.trunc((pc.wis + pc.iq * 2) / 5);
      break;
    case 4:
      pc.maxHp -= game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 3) + 4) + 14;
      pc.maxSp -= Math.trunc((pc.wis * 2 + pc.iq) / 5);
      break;
    case 5:
      pc.maxHp -= game.rng.random(pc.con * 3 + pc.luck + 17) + 55;
      pc.maxSp -= Math.trunc((pc.wis + pc.iq) / 14);
      break;
    case 6:
      pc.maxHp -= game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 3) + 7) + 14;
      pc.maxSp -= Math.trunc((pc.wis + pc.iq * 2) / 8);
      break;
  }
  if (pc.maxSp < pc.sp) pc.sp = pc.maxSp;
  if (pc.maxHp < pc.hp) pc.hp = pc.maxHp;
}

/** The loop in level_from_experience gives up after this many levels. */
const LEVEL_LIMIT = 999;

/**
 * level_from_experience (WORLD.EXE 2000:5b41, mw.c "level_from_experience"): level the character
 * up as far as their experience reaches, and hand back the level they end on.
 *
 * It counts from 0 and calls the level-up for every step past the level the character is
 * already on, so the whole night's worth of levels is rolled here rather than in the inn. Past
 * level 999 it stops and hands back 0, which the inn writes straight over the character's level.
 */
export function levelFromExperience(game: MwGame): number {
  let level = 0;
  for (;;) {
    if (level > LEVEL_LIMIT) return 0;
    if (game.pc.lev < level) levelUp(game);
    if (game.pc.exp < experienceNeeded(level)) return level;
    level += 1;
  }
}

/** What death did with the character. */
export type MwDeath =
  /** The temple's contract was in force, and the character is back in the town alive. */
  | 'raised'
  /** No contract. The original deletes the character's files here. */
  | 'dead';

/** The hit points the original leaves on a character it has just deleted the file of. */
const DEAD_HP = -100;

/**
 * Death (WORLD.EXE 2000:726f, mw.c "FUN_2000_726f"): what movecontrol does when the hit points
 * have gone below zero.
 *
 * With a raise-dead contract the character wakes on floor 0 of the dungeon the contract names,
 * on the square it names, a point of constitution poorer and otherwise whole; the contract is
 * spent. Coming back to a different dungeon from the one they died in throws away every explored
 * floor, because the maps on disk belong to the old dungeon's hash.
 *
 * Without one the original deletes the character's file, its monster cache and its six explored
 * map blocks. MORF-66 says a dead character keeps its bytes and the roster entry is marked
 * instead, so the port records the deletion and leaves the record where it lands: hit points at
 * -100, which is what the original writes so that movecontrol's next test still finds them
 * below zero and leaves the game.
 */
export function die(game: MwGame): MwDeath {
  const pc = game.pc;
  if (pc.returnX === -1) {
    game.events.push({ kind: 'characterFilesDeleted', slot: game.slot });
    pc.hp = DEAD_HP;
    loadHBin(game, HINT.death);
    loadHBin(game, HINT.noContract);
    game.events.push({ kind: 'levelEntered', floor: 0 });
    return 'dead';
  }
  pc.x = pc.returnX;
  pc.y = pc.returnY;
  pc.floor = 0;
  if (pc.dungeon !== pc.returnDungeon) {
    // The original also deletes the six .DUN blocks and wipes the 32 explored-map buffers it
    // holds in memory. Nothing of the explored map is ported.
    game.events.push({ kind: 'characterFilesDeleted', slot: game.slot });
  }
  pc.dungeon = pc.returnDungeon;
  pc.returnX = -1;
  game.engaged = -1;
  game.redrawView = true;
  if (pc.con > 2) pc.con -= 1;
  pc.hp = pc.maxHp;
  pc.sp = pc.maxSp;
  game.events.push({ kind: 'playerSaved' });
  loadHBin(game, HINT.death);
  loadHBin(game, HINT.raised);
  loadHBin(game, HINT.buyAnotherContract);
  game.events.push({ kind: 'levelEntered', floor: 0 });
  return 'raised';
}
