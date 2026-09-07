import { expNeeded } from '../game/port/combat';
import { newGame } from '../game/port/state';

/** One line of the screen: a level, and the experience it takes to reach it. */
export interface ExpNeededRow {
  level: number;
  exp: number;
}

/** The heading the screen prints (exe DS:12de). */
export const EXP_NEEDED_HEADING = 'EXPERIENCE NEEDED FOR LEVEL:';

/** How many levels the screen lists: the seven lines print_menu_only has left under the heading. */
const LEVELS_SHOWN = 7;

/**
 * FUN_2000_7bcd (exe 2000:7bcd, unf.c "FUN_2000_7bcd"): the screen the E key puts up in the
 * dungeon. It prints the next seven levels, each as its number, ") " (exe DS:080c, the tail of
 * the menu line "1) ") and the experience that level takes, and waits for a key.
 *
 * The experience on the line for level L is `exp_needed(L - 1)`: the loop counts from the
 * character's own level and prints `exp_needed(lev + i)` beside level `lev + i + 1`.
 */
export function expNeededRows(lev: number, hard: boolean): ExpNeededRow[] {
  const game = newGame({ pc: { hard: hard ? 1 : 0 } });
  return Array.from({ length: LEVELS_SHOWN }, (_, index) => ({
    level: lev + index + 1,
    exp: expNeeded(game, lev + index),
  }));
}
