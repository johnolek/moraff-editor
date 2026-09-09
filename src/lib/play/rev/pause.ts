import { revClearScreen, revDrawTheDungeonAgain } from './screens';
import type { RevGame } from './state';
import type { RevTownDesk } from './town';

/** 1000:8010: the one line the pause screen shows, in the middle of a cleared screen. */
export const PAUSE_LINE = 'PAUSE... (Q FOR DOS)';

/** Where it is printed: `LOCATE 10, 15` at 1000:8001. */
const PAUSE_ROW = 10;
const PAUSE_COLUMN = 15;

/** 1000:801C: the key the pause screen ends the game on. */
const QUIT = 'Q'.charCodeAt(0);

/**
 * 1000:7FFB: P stops everything until a key.
 *
 * Q there saves the character and the two monster files and ends the program, which is the same
 * ending the Q key of the dungeon reaches; any other key clears the screen and goes back to the
 * game. The pause spends no moment and no action: 1000:0EE5 comes back to the pass it was in.
 *
 * Nothing moves while it is up. The original's wait is `1000:2F71`, a plain blocking read that
 * never rolls a monster turn, so the level stands still exactly as it does in a building.
 */
export async function revPause(game: RevGame, desk: RevTownDesk, quit: () => void): Promise<void> {
  // 1000:7FFE and 1000:8036: the screen is cleared on the way in and again on the way out.
  revClearScreen(game);
  game.kept.locate(PAUSE_ROW, PAUSE_COLUMN);
  game.say(PAUSE_LINE);
  const key = await desk.key();
  // 1000:802A: Q signs off on the pause screen itself rather than clearing it first.
  if (key === QUIT) {
    quit();
    return;
  }
  // 1000:8036 clears the screen and 1000:0EE5 goes back to the top of the pass, which draws the
  // dungeon on it again.
  revClearScreen(game);
  revDrawTheDungeonAgain(game, 'afterAScreen');
}
