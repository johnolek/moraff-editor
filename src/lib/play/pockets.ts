import {
  drawMagicItems,
  drawPocketsMenu,
  drawSpellInventoryPage,
  POCKETS_MAGIC_ITEMS,
} from '../game/port/inventory';
import { clearStatsScreen, getChoice } from '../game/port/screens';
import type { Game } from '../game/port/state';
import type { Turn } from './engine';

/**
 * FUN_3000_7545 (exe 3000:7545), the P key: the menu of the five things the character carries,
 * and the pages behind each of them.
 *
 * The menu's own lines are message 91 of UH.BIN rather than strings in the executable, which is
 * why they read as a question. Its first four lines are the four spell sources in the order
 * cast_a_spell numbers them, so the line picked is the source as it stands.
 */

/** How many pages of spells FUN_3000_71e6 (exe 3000:71e6) draws, one key apart. */
const SPELL_PAGES = 2;

export async function lookInPockets(turn: Turn): Promise<void> {
  const { game } = turn;
  drawPocketsMenu(game);
  const chosen = await readMenu(game);
  if (chosen === 'escape') return;
  if (chosen === POCKETS_MAGIC_ITEMS) {
    drawMagicItems(game);
    await game.key();
    clearStatsScreen(game);
    return;
  }
  for (let page = 0; page < SPELL_PAGES; page += 1) {
    drawSpellInventoryPage(game, chosen, page);
    await game.key();
  }
  game.eraseScreen();
}

/** get_choice (exe 2000:2d93) over the five lines of the menu. */
async function readMenu(game: Game): Promise<number | 'escape'> {
  for (;;) {
    const chosen = getChoice(1, 5, await game.key());
    if (chosen !== null) return chosen;
  }
}
