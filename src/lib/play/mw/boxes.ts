import type { MwGameSession } from './engine';
import { MW_MESSAGE_BOX } from './screens';

/**
 * The message box while a menu is open, one box at a time.
 *
 * FUN_2000_216b (WORLD.EXE 2000:216b) copies eight strings into the buffers at DS:cd80 and prints
 * all eight, so nothing of the box before it ever shows through, and FUN_2000_22ff (exe 2000:22ff)
 * is the same thing with a wait for a key on the end. A ported function prints every box it has
 * in one go, because none of it can wait; {@link MwGameSession.takeBoxes} keeps them apart so
 * that the play side can show them one after another.
 */

/** Put one box up, with nothing of the box before it left underneath. */
export function showMwBox(session: MwGameSession, print: () => void): void {
  session.takeBoxes(print);
}

/** Every box a ported function printed, shown in turn, each one waiting for a key. */
export async function printMwMenus(session: MwGameSession, print: () => void): Promise<void> {
  for (const box of session.takeBoxes(print)) {
    session.box = box.slice(0, MW_MESSAGE_BOX.lines);
    await session.key();
  }
  session.box = [];
}

/**
 * The same, except that the last box stays up: a menu is the last thing its function prints and
 * the key that answers it is the wait, so that box is not waited on twice.
 */
export async function printMwMenusEndingInAMenu(
  session: MwGameSession,
  print: () => void,
): Promise<void> {
  const boxes = session.takeBoxes(print);
  for (const box of boxes.slice(0, -1)) {
    session.box = box.slice(0, MW_MESSAGE_BOX.lines);
    await session.key();
  }
  session.box = (boxes[boxes.length - 1] ?? []).slice(0, MW_MESSAGE_BOX.lines);
}
