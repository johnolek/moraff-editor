import type { RevClearedScreen, RevGame } from './state';
import type { RevTownDesk } from './town';

/**
 * The screens the game takes the whole display over with, and what the tab says where the port
 * has not built what a key does.
 *
 * A `CLS` in `SCREEN 1` blacks the screen out and puts the cursor at 1, 1, and nothing draws the
 * dungeon again until the redraw at the end of the pass (1000:4275). So between the two, what is
 * on the screen is exactly what has been printed since, and `game.cleared` is that state.
 */

/** 1000:A890, A016, 0D8E, 7FFE and AC87: the screen is blacked out. */
export function revClearScreen(game: RevGame, keeping: RevClearedScreen = 'bare'): void {
  game.cleared = keeping;
  game.kept.clear();
  game.said = [];
}

/** The dungeon is drawn over whatever was cleared (1000:4275). */
export function revDrawTheDungeonAgain(game: RevGame): void {
  game.cleared = null;
  game.kept.clear();
}

/** 1000:020B, printed by 1000:C5B0: what a screen that has taken the display over waits with. */
export const REV_HIT_ANY_KEY = 'Hit any key';

/** Where it is printed: `LOCATE 25, <DGROUP B796> + 10` (1000:C5B0). B796 is 25 only while the
 *  help's 80-column screen is up (1000:C349) and 0 everywhere else, so here it is column 10. */
const HIT_ANY_KEY_ROW = 25;
const HIT_ANY_KEY_COLUMN = 10;

/**
 * 1000:2F3C: the prompt, the wait, and `SCREEN 1` put back afterwards.
 *
 * It is a plain blocking read (1000:2F71 through 1000:C5CC), so nothing walks about while it is
 * up, the same way nothing walks while a building's menu is waiting.
 */
export async function revHitAnyKey(game: RevGame, desk: RevTownDesk): Promise<void> {
  game.kept.printAt(HIT_ANY_KEY_ROW, HIT_ANY_KEY_COLUMN, REV_HIT_ANY_KEY);
  // The prompt has a `LOCATE` of its own, so it does not go through `say`, which would put it
  // wherever the cursor happened to be; the box the tab draws is told about it separately.
  game.said.push(REV_HIT_ANY_KEY);
  await desk.key();
}

/** 1000:B5E2 and B5F1: the two lines the game signs off with. */
export const REV_GRAB_A_SANDWICH = "Why don't you go grab a sandwich?";
export const REV_BETTER_LUCK = '   Better luck next time!';

/**
 * 1000:B5C8: the blank line and the sign-off, printed while `1.NUM` and `2.NUM` are written.
 *
 * Which of the two it is comes off DGROUP B734, and one place in the whole program writes it:
 * 1000:A22E, the death that has run out of raises, sets it to 1 just before calling this. So a
 * character who quits is told to go and get something to eat and a dead one is wished better
 * luck.
 *
 * The two monster files it writes are the state of the disk in the original; this port starts
 * every session from the shipped tables instead, which `README.md` has as a departure of its
 * own, so only the words are here.
 */
export function revSayGoodbye(game: RevGame, dead: boolean): void {
  game.say('', dead ? REV_BETTER_LUCK : REV_GRAB_A_SANDWICH);
}

/**
 * What the tab says where the port has not built what the key does.
 *
 * Nothing is ever silently nothing: a key the original dispatches on that this port does not
 * answer says what the game would have done with it, the way `../screens.ts` and
 * `../mw/screens.ts` do for the other two games.
 */
export function REV_NOT_BUILT(what: string): string[] {
  return ['NOT BUILT YET:', `   ${what}.`];
}
