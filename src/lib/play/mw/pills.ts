import { drawPillMenu, takeAPill } from '../../game/mw-port/items';
import type { MwGameSession } from './engine';

/**
 * take_pill (WORLD.EXE 3000:9ac0): the I key's fourth answer, the six vitamin pills a level
 * drainer leaves behind.
 *
 * The menu is one box and one key, and the pill is swallowed where the player stands: nothing
 * here spends a moment or lets the monsters move, which is what movecontrol does with the whole
 * of the I key.
 */

/** The lines of the box the choice is read off, which are the six pills. */
const PILL_LINES = { first: 1, last: 6 };

export async function swallowAPill(session: MwGameSession): Promise<void> {
  const game = session.game;
  session.box = session.takeBoxes(() => drawPillMenu(game))[0] ?? [];
  const key = await session.menuKey(PILL_LINES.first, PILL_LINES.last);
  session.clearBox();
  takeAPill(game, key - 0x30);
  await session.settle();
}
