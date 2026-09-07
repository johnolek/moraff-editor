import { viewBattleSpells, viewPrepSpells } from '../game/port/screens';
import type { Turn } from './engine';

/**
 * The two lists of what is standing on the character, which movecontrol (exe 2000:c308) puts up
 * for the 1 and the 2 keys.
 *
 * Neither waits for a key: the original draws the lines and goes straight back to waiting for the
 * next key of the game, and what it drew stays on the screen until something is drawn over it.
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
