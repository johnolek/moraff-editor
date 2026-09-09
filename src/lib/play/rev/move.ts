import { COLUMNS, ROWS, blocked } from '../../game/revmap.js';
import { REV_EAST, REV_NORTH, REV_SOUTH, REV_WEST } from './keys';
import type { RevGame } from './state';

/**
 * 1000:30C7: the character's step, one square in the direction they face.
 *
 * The four branches at 1000:30D9, 3192, 3254 and 3316 differ only in which wall they ask for and
 * which coordinate they change, so this is the four of them written once.
 */

/** What each direction tests and does: the wall's kind, and the step. */
const DIRECTIONS: Record<number, { kind: number; dColumn: number; dRow: number }> = {
  [REV_NORTH]: { kind: 1, dColumn: 0, dRow: -1 },
  [REV_EAST]: { kind: 2, dColumn: 1, dRow: 0 },
  [REV_SOUTH]: { kind: 1, dColumn: 0, dRow: 1 },
  [REV_WEST]: { kind: 2, dColumn: -1, dRow: 0 },
};

/** What the wall test asks about: the side between the square and the one being entered. */
function sideAsked(direction: number, column: number, row: number): { kind: number; column: number; row: number } {
  const step = DIRECTIONS[direction];
  // North and west ask for the square's own side; east and south ask for the one beyond it,
  // which is the same wall by its other name.
  return {
    kind: step.kind,
    column: direction === REV_EAST ? column + 1 : column,
    row: direction === REV_SOUTH ? row + 1 : row,
  };
}

/** The message the move prints when something is standing in the way (the literal at 1000:33F9). */
export const MONSTER_BLOCKS_WAY = 'MONSTER BLOCKS WAY';

/** Where it goes: `LOCATE 6, 22` at 1000:33EA, over the top of the FRONT box, and the same spot
 *  is blanked with eighteen spaces at 1000:340C. */
const BLOCKS_ROW = 6;
const BLOCKS_COLUMN = 22;

/** What a step did: whether the character moved, and why not. */
export type RevStep = 'moved' | 'wall' | 'edge' | 'monster';

/**
 * One step. The order is the original's and matters: **the square being entered is tested for a
 * monster before it is tested for a wall** (1000:310D against 1000:3149), so walking into a wall
 * that happens to have a monster behind it says a monster is in the way — reporting a monster
 * that cannot be seen, and refusing the move for the wrong reason.
 *
 * **A monster only ever blocks a step made from inside a fight.** Each of the four branches ANDs
 * the occupied square with DGROUP B50E standing at 1 (1000:30DF, 3198, 325A and 331C), and B50E
 * says which of the two places the arrow came from: the dungeon's own dispatch clears it before
 * every key (1000:099F) and the fight prompt sets it before handing the arrow to the same
 * routine (1000:8716). So walking at a monster in a corridor takes the step, and the redraw the
 * per-key routine falls into opens the fight against whatever is standing there (1000:4969).
 */
export function revStep(game: RevGame, direction: number): RevStep {
  const step = DIRECTIONS[direction];
  if (!step) return 'edge';
  const pc = game.pc;
  const column = pc.column + step.dColumn;
  const row = pc.row + step.dRow;
  if (game.fight !== null && game.monsters.slotOn(column, row) > 0) {
    game.kept.printAt(BLOCKS_ROW, BLOCKS_COLUMN, MONSTER_BLOCKS_WAY);
    game.say(MONSTER_BLOCKS_WAY);
    return 'monster';
  }
  // 1000:3121: a step nothing is standing in the way of rubs the line out before it goes on to
  // ask about the wall, with as many spaces as the line has characters.
  game.kept.blank(BLOCKS_ROW, BLOCKS_COLUMN, MONSTER_BLOCKS_WAY.length);
  const side = sideAsked(direction, pc.column, pc.row);
  if (blocked(side.kind, side.column, side.row, pc.dungeonLevel, pc.generation)) return 'wall';
  // The edge is the last test the original makes, after the wall and after the monster
  // (1000:3167, 3223, 32E5, 33A3), which is why a wall on the outside of the floor is still
  // asked about.
  if (column < 1 || column > COLUMNS || row < 1 || row > ROWS) return 'edge';
  pc.column = column;
  pc.row = row;
  game.events.push({ kind: 'stepped' });
  // 1000:3187: the same four branches count the step, which is what the fight's Speed and
  // Strength spells run out on.
  game.steps += 1;
  return 'moved';
}
