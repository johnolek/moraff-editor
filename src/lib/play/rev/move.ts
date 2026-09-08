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

/** What a step did: whether the character moved, and why not. */
export type RevStep = 'moved' | 'wall' | 'edge' | 'monster';

/**
 * One step. The order is the original's and matters: **the square being entered is tested for a
 * monster before it is tested for a wall** (1000:310D against 1000:3149), so walking into a wall
 * that happens to have a monster behind it says a monster is in the way — reporting a monster
 * that cannot be seen, and refusing the move for the wrong reason.
 */
export function revStep(game: RevGame, direction: number): RevStep {
  const step = DIRECTIONS[direction];
  if (!step) return 'edge';
  const pc = game.pc;
  const column = pc.column + step.dColumn;
  const row = pc.row + step.dRow;
  if (game.monsters.slotOn(column, row) > 0) {
    game.say(MONSTER_BLOCKS_WAY);
    return 'monster';
  }
  const side = sideAsked(direction, pc.column, pc.row);
  if (blocked(side.kind, side.column, side.row, pc.dungeonLevel, pc.generation)) return 'wall';
  // The edge is the last test the original makes, after the wall and after the monster
  // (1000:3167, 3223, 32E5, 33A3), which is why a wall on the outside of the floor is still
  // asked about.
  if (column < 1 || column > COLUMNS || row < 1 || row > ROWS) return 'edge';
  pc.column = column;
  pc.row = row;
  return 'moved';
}
