import { revMonsterSeen } from './fight';
import { GRID_STRIDE } from './monsters';
import { REV_UNBANKED_EXPERIENCE_VALUE, revValue, setRevValue } from './record';
import type { RevGame } from './state';

/** 1000:A4E7: what a kill says. */
export const YOU_KILLED_IT = 'YOU KILLED IT!!';

/** Where it says it: `LOCATE 16, 24` at 1000:A4D8, straight across the close-up of the monster
 *  it killed, which is drawn from (225, 112). */
const KILLED_ROW = 16;
const KILLED_COLUMN = 24;

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
  // The monster is read before the fight is put down below, which is where its name is lost.
  const killed = revMonsterSeen(fight, pc.dungeonLevel);
  // 1000:A335: what this kill can leave behind past the coins is read off the monster's kind
  // here, while the fight is still up, and spent by the treasure once it is down.
  game.dropsAWand = fight.kind === 5 || fight.kind === 7;
  game.dropsAPill = fight.kind === 5;
  setRevValue(pc, REV_UNBANKED_EXPERIENCE_VALUE, revValue(pc, REV_UNBANKED_EXPERIENCE_VALUE) + fight.experience);
  game.fight = null;
  // 1000:A4C1 empties the square and 1000:A4C7 asks 1000:6BAF to fill the box between the views
  // from it. It finds nothing standing there and returns at 1000:6BDE without rubbing anything
  // out, so the dead monster's picture is still on the screen for the next two lines to be
  // printed across it. Nothing blanks that box but 1000:58F7, which the kill never reaches.
  game.kept.picture = { name: fight.name, level: pc.dungeonLevel };
  game.monsters.grid[GRID_STRIDE * pc.row + pc.column] = 0;
  // 1000:A3C8: what the clock reads as "the monster's level" becomes the dungeon level, and
  // 1000:A36F puts the awake flag the monsters' turn shares between them back to nothing.
  game.lastMonsterLevel = pc.dungeonLevel;
  game.monsters.awake = 0;
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
  else {
    game.events.push({ kind: 'killed', monster: killed, experience: fight.experience });
    game.kept.printAt(KILLED_ROW, KILLED_COLUMN, YOU_KILLED_IT);
    game.say(YOU_KILLED_IT);
  }
  game.killed = true;
}
