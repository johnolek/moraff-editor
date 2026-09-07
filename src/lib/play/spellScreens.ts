import {
  clearStatsScreen,
  expNeededScreen,
  viewBattleSpells,
  viewPrepSpells,
  viewStats,
} from '../game/port/screens';
import type { Turn } from './engine';

/**
 * The four screens movecontrol (exe 2000:c308) puts up about the character rather than about the
 * dungeon: the two lists of what is standing on them, their vital statistics, and what the next
 * seven levels cost.
 *
 * The first two do not wait for a key — the original draws the lines and goes straight back to
 * waiting for the next key of the game, and what it drew stays on the screen until something is
 * drawn over it.
 */

/**
 * movecontrol's 0x31 branch: view_prep_spells (exe 2000:92b1), the preparation spells in effect,
 * down the menu column.
 */
export function showPrepSpells(turn: Turn): void {
  viewPrepSpells(turn.game);
}

/**
 * movecontrol's 0x32 branch: view_battle_spells (exe 2000:9417), the battle spells in effect and
 * how many moves each has left, in the panel under the map.
 *
 * The original keeps the twelve lines it has showing in globals and draws nothing when none of
 * them has changed; the port hands them back instead, so the session holds them.
 */
export function showBattleSpells(turn: Turn): void {
  turn.session.battleSpellsShown = viewBattleSpells(turn.game, turn.session.battleSpellsShown);
}

/**
 * movecontrol's 0x76 branch: view_stats (exe 3000:77e2), the V screen, which waits for a key and
 * takes the right-hand two thirds of the screen back afterwards.
 *
 * The disease and the poison lines are the moves left before the next bite, which is the only
 * place in the game either clock is shown.
 */
export async function showStats(turn: Turn): Promise<void> {
  viewStats(turn.game);
  await turn.game.key();
  clearStatsScreen(turn.game);
}

/**
 * movecontrol's 0x65 branch: FUN_2000_7bcd (exe 2000:7bcd), the experience the next seven levels
 * ask for, in the message box, with the wait every message box has behind it.
 */
export function showExpNeeded(turn: Turn): void {
  expNeededScreen(turn.game);
  turn.game.pressAnyKey();
}
