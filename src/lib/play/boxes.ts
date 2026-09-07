import type { GameSession } from './engine';

/**
 * The boxes a ported function prints, one after another.
 *
 * The game keeps one buffer of eight strings at DS:c694 and every box it shows fills all eight,
 * so nothing of the box before ever shows through; {@link GameSession.showBox} is where one box
 * goes up. What is here is the several boxes one call can print.
 */

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

/**
 * Everything a ported function said, as one box.
 *
 * A few of the game's messages are pfont calls down the message column rather than boxes of
 * their own: chute (exe 2000:b532) draws three lines there and waits once at the end, and strike
 * (exe 2000:7e36) draws two more under the battle banner and does not wait at all. The port has
 * them all going through `say`, so this puts them up together the way the screen has them.
 */
export function sayAsOneBox(session: GameSession, print: () => void): void {
  session.showBox(boxesOf(session, print).flat());
}

/** Every box a ported function printed, shown in turn, each one waiting for a key. */
export async function printMenus(session: GameSession, print: () => void): Promise<void> {
  for (const box of boxesOf(session, print)) {
    session.showBox(box);
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
    session.showBox(box);
    await session.game.key();
  }
  session.showBox(boxes[boxes.length - 1] ?? []);
}
