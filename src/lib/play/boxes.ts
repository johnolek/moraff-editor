import type { GameSession } from './engine';
import { MESSAGE_BOX_LINES } from './screens';

/**
 * The message box while a building of the town is open, one box at a time.
 *
 * The game keeps one buffer of eight strings at DS:c694 and every box it shows fills all eight,
 * so nothing of the box before ever shows through. `game.say` drops the empty lines off the end
 * of a box, so a box goes up by emptying the message box first rather than by appending to it.
 */

/** Put one box up, with nothing of the box before it left underneath. */
export function showBox(session: GameSession, print: () => void): void {
  session.box = [];
  print();
}

/**
 * The boxes a ported function printed, one array of lines each.
 *
 * print_menu_only (exe 2000:309e) shows eight lines and waits for a key, so a function that
 * prints three boxes stops three times over. Nothing in the port is asynchronous and none of it
 * can wait, so all three are printed at once; this keeps them apart so that the play side can
 * show them one after another.
 */
export function boxesOf(session: GameSession, print: () => void): string[][] {
  const game = session.game;
  const boxes: string[][] = [];
  const said = game.say;
  game.say = (...lines: string[]) => {
    boxes.push(lines);
    said(...lines);
  };
  try {
    print();
  } finally {
    game.say = said;
  }
  return boxes;
}

/** Every box a ported function printed, shown in turn, each one waiting for a key. */
export async function printMenus(session: GameSession, print: () => void): Promise<void> {
  for (const box of boxesOf(session, print)) {
    session.box = box.slice(0, MESSAGE_BOX_LINES);
    await session.game.key();
  }
  session.box = [];
}

/**
 * The same, except that the last box stays up: the inn prints four boxes in a row and reads its
 * menu key off the last of them, so that one is not waited on twice.
 */
export async function printMenusEndingInAMenu(
  session: GameSession,
  print: () => void,
): Promise<void> {
  const boxes = boxesOf(session, print);
  for (const box of boxes.slice(0, -1)) {
    session.box = box.slice(0, MESSAGE_BOX_LINES);
    await session.game.key();
  }
  session.box = (boxes[boxes.length - 1] ?? []).slice(0, MESSAGE_BOX_LINES);
}
