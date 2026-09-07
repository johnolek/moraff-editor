import { clearMenuBlock, clearMessageLine } from '../game/port/screens';
import { showMoney } from '../game/port/town';
import type { Turn } from './engine';

/**
 * movecontrol (exe 2000:c308, unf.c "movecontrol"), the keys that are one branch each.
 */

/**
 * show_money (exe 2000:438f, unf.c "show_money"), which movecontrol's 0x6d branch calls straight:
 * the statement goes up, the player reads it, and the column and the line above it are wiped.
 */
export async function countTheMoney(turn: Turn): Promise<void> {
  const { game, session } = turn;
  showMoney(game);
  await game.key();
  clearMenuBlock(game);
  clearMessageLine(game);
  session.box = [];
}
