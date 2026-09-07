import { showHint } from '../game/port/drops';
import { relocate } from '../game/port/moment';
import type { Turn } from './engine';

/**
 * change_module (exe 2000:c0a5, unf.c "change_module"): the module teleporter, the wall the
 * character walks into that leads out of one module and into the next.
 *
 * Module I only goes onward and module V only back; in between the snake asks which. A character
 * rolled under the normal difficulty is turned back at the door of module V. Whatever happens,
 * the character arrives in the new module's town on a random open square.
 */

/** The snake's teleporter menu, the refusal at module V's door, and the arrival. */
const TELEPORTER_MENU = 0x7d;
const TOO_EASY = 0x68;
const ARRIVED = 0x6b;

/** The three keys the teleporter menu takes: onward, retreat, stay. */
const ONWARD = 0x31;
const RETREAT = 0x32;
const STAY = 0x33;

/** The module the extended episodes end at, which normal difficulty may not enter. */
const LAST_MODULE = 4;

/**
 * Take the teleporter. Returns whether the character went anywhere, which is what tells
 * movecontrol to load the new module's town.
 */
export async function changeModule(turn: Turn): Promise<boolean> {
  const { game, session } = turn;
  const pc = game.pc;
  let direction = 0;
  if (pc.module === 0) direction = 1;
  else if (pc.module === LAST_MODULE) direction = -1;
  else {
    showHint(game, TELEPORTER_MENU);
    const chosen = await session.choice([ONWARD, RETREAT, STAY]);
    if (chosen === ONWARD) direction = 1;
    else if (chosen === RETREAT) direction = -1;
    else return false;
  }
  if (pc.hard === 0 && pc.module === LAST_MODULE - 1 && direction === 1) {
    showHint(game, TOO_EASY);
    game.pressAnyKey();
    return false;
  }
  pc.level = 0;
  pc.module += direction;
  relocate(game);
  session.save();
  session.enterFloor(0);
  showHint(game, ARRIVED);
  game.pressAnyKey();
  return true;
}
