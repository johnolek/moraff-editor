import { loseItem, useMagicItem } from '../game/port/drops';
import type { Turn } from './engine';
import { notBuiltYet } from './screens';

/** The I key, which is everything the character carries, and the L key, which throws one away. */

/**
 * The heading movecontrol draws over the I key's menu (exe 2000:d5b0): one line above the message
 * box, in the colour at DS:0435, which is white and nothing ever writes to it.
 */
const MAGIC_MENU_HEADING = { text: 'USE MAGIC MENU:', x: 0x3a2, y: 0x301, font: 0, colour: 15 };

/**
 * movecontrol (exe 2000:c308, unf.c "movecontrol"), case 0x69 of its letter switch at 2000:d5a8:
 * the I key asks what kind of thing is being used before it does anything with it.
 *
 * The first three answers cast the spell written on the scroll, wand or paper through
 * `cast_a_spell` (exe 2000:e017) and pay the time it costs; the fourth drinks a potion of the
 * character's own making. Neither of those is ported yet. The fifth is `use_magic_item`, which
 * is the six things a kill turns up.
 */
export async function useAnItem(turn: Turn): Promise<void> {
  const game = turn.game;
  game.draw(MAGIC_MENU_HEADING);
  // DS:1ed7 06f0 1eeb 1ef5 1efd 1f06 1f16 06f0
  game.say(
    'WHICH TYPE OF ITEM?',
    '',
    '1) SCROLL',
    '2) WAND',
    '3) PAPER',
    '4) MAGIC POTION',
    '5) OTHER',
  );
  const answer = await game.choice([0x31, 0x32, 0x33, 0x34, 0x35]);
  game.eraseScreen(MAGIC_MENU_HEADING.y);
  if (answer === 0x31 || answer === 0x32 || answer === 0x33) {
    notBuiltYet(game, 'CAST THE SPELL ON A SCROLL, WAND OR PAPER');
    return;
  }
  if (answer === 0x34) {
    notBuiltYet(game, 'DRINK A POTION YOU MIXED YOURSELF');
    return;
  }
  if (answer === 0x35) await useMagicItem(game);
}

/**
 * movecontrol (exe 2000:c308, unf.c "movecontrol"), case 3 of the same switch: the L key throws
 * a suit of armor, a weapon or the money away. `lose_item` asks both of its own menus.
 */
export async function dropSomething(turn: Turn): Promise<void> {
  await loseItem(turn.game);
}
