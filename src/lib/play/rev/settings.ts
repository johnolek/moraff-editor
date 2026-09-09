import { PALETTE_COUNT } from '../../rev-bestiary/pictures';
import { REV_TWO_SECONDS } from './held';
import type { RevGame } from './state';
import type { RevTownDesk } from './town';

/**
 * The four keys that are about the screen rather than about the game: `#`, `@`, `O` and `E`.
 *
 * None of them spends a moment or an action — `#` and `@` go back to the top of the pass at
 * 1000:1052 and the other two fall through the dispatch chain — and every one of them only ever
 * writes a number the display is meant to read.
 */

/** 1000:1014: the background steps 0, 1, 2 ... 16 and then back to 0. */
const HIGHEST_BACKGROUND = 16;

/** 1000:0F53: the largest delay the game will take. */
export const LONGEST_ENTER_DELAY = 3000;

/** 1000:0F23 and 0F2F: what the enter delay asks. */
export const ENTER_DELAY_PROMPT = ['Try delays between 0 (Default) and 3000.', 'Enter delay and hit return:'];

/** 1000:108D and 109C: what the sound key says it has done. */
export const SOUND_ON = 'SOUND ON';
export const SOUND_OFF = 'SOUND OFF';
/** There is nothing to play here, so the box says as much under the game's own line. */
export const NO_SOUND_HERE = '   This site has no sound to play.';

/** 1000:0FF5: `#` steps the background colour on, and past the sixteenth back to none. */
export function revStepBackground(game: RevGame): void {
  game.background += 1;
  if (game.background > HIGHEST_BACKGROUND) game.background = 0;
}

/**
 * 1000:102A: `@` steps the palette on, and counts 4 back to 2.
 *
 * It starts at 2 (1000:017D), so the first press makes it 3 and every press after that flips it
 * between 2 and 3 — which is one bit, since `SCREEN 1` has two palettes and an even number is
 * the first of them.
 */
export function revStepPalette(game: RevGame): void {
  game.palette += 1;
  if (game.palette === 4) game.palette = 2;
}

/** Which of the two `SCREEN 1` palettes the game is set to draw in. */
export function revCgaPalette(game: RevGame): number {
  return game.palette % PALETTE_COUNT;
}

/**
 * 1000:1055: `O` turns the sound off and on again, where 0 is on.
 *
 * The line goes on row 1 (1000:1077), is left there for two seconds and is then rubbed out with
 * nine spaces (1000:10A5 and 10B4), so it is gone before the player's next key. The port's own
 * note that there is no sound to play stood under it and goes with it.
 */
export function revToggleSound(game: RevGame): void {
  game.sound += 1;
  if (game.sound === 2) game.sound = 0;
  game.say(game.sound === 0 ? SOUND_ON : SOUND_OFF, NO_SOUND_HERE);
  game.delay(REV_TWO_SECONDS);
  game.said = [];
}

/**
 * 1000:0F00: `E` asks for the delay the game waits out before every redraw, so that several
 * movement keys can be typed ahead of it (1000:412A busy-waits in it).
 *
 * Nothing here redraws on a timer, so the number is kept and nothing reads it. The tab's number
 * reader takes one digit rather than a typed line, so the delay only ever reaches 9 and the cap
 * the original puts on it at 1000:0F53 never bites; it is kept all the same.
 */
export async function revSetEnterDelay(game: RevGame, desk: RevTownDesk): Promise<void> {
  const typed = await desk.number(ENTER_DELAY_PROMPT);
  if (typed === null) return;
  game.enterDelay = typed > LONGEST_ENTER_DELAY ? LONGEST_ENTER_DELAY : typed;
}
