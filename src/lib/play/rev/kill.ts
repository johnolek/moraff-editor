import { GRID_STRIDE } from './monsters';
import { REV_UNBANKED_EXPERIENCE_VALUE, revValue, setRevValue } from './record';
import type { RevGame } from './state';

/** 1000:A4E7: what a kill says. */
export const YOU_KILLED_IT = 'YOU KILLED IT!!';

/**
 * 1000:A335: the monster is dead.
 *
 * The experience worked out when it was met is banked, the fight is put down, the monster comes
 * off the occupancy grid — and then **the slot is refilled rather than emptied**: a fresh number
 * of hit points for the depth, and a fresh square. So a level always holds its forty monsters and
 * the ones a character clears come back at the depth they were cleared at.
 */
export function revKillMonster(game: RevGame): void {
  const fight = game.fight;
  if (!fight) return;
  const pc = game.pc;
  const slot = fight.slot;
  setRevValue(pc, REV_UNBANKED_EXPERIENCE_VALUE, revValue(pc, REV_UNBANKED_EXPERIENCE_VALUE) + fight.experience);
  game.fight = null;
  game.monsters.grid[GRID_STRIDE * pc.row + pc.column] = 0;
  // 1000:A3C8: what the clock reads as "the monster's level" becomes the dungeon level.
  game.lastMonsterLevel = pc.dungeonLevel;
  const level = pc.dungeonLevel;
  game.monsters.strengths[slot] = Math.round(game.rng.random(8 * level) + 2 * level + 1);
  for (;;) {
    // 1000:A408: a fresh square, columns 2 to 19 and rows 2 to 18, rerolled while one is taken.
    const column = game.rng.random(18) + 2;
    const row = game.rng.random(17) + 2;
    if (game.monsters.slotOn(column, row) > 0) continue;
    game.monsters.positions[slot] = 32 * row + column;
    game.monsters.grid[GRID_STRIDE * row + column] = slot;
    break;
  }
  // 1000:A4CD: `Go Away!' leaves the monster's treasure behind and the monster alive somewhere
  // else, so the kill it runs says nothing.
  if (game.monsterLeft) game.monsterLeft = false;
  else game.say(YOU_KILLED_IT);
  game.killed = true;
}
