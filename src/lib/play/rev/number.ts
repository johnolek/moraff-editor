import { REV_KEY } from './keys';
import type { RevGame } from './state';
import type { RevTownDesk } from './town';

/**
 * 1000:21F3: a whole number typed at a prompt, which is what the bank's amounts and the enter
 * delay are asked for.
 *
 * The routine is its own line editor. It remembers the row and the column the cursor stood at
 * before the first key (CSRLIN and POS at 1000:2205 and 220F), and after every key it prints
 * what has been typed so far back there with a space after it — which is what rubs out the digit
 * a Backspace has just dropped. Three things end it: return, the digit limit the caller sets in
 * DGROUP B540, and nothing else. Every other key is read and thrown away.
 */

const ZERO = '0'.charCodeAt(0);
const NINE = '9'.charCodeAt(0);

/** 1000:2440 and 0F38: how many digits each caller lets the player type. */
export const REV_BANK_DIGITS = 15;
export const REV_ENTER_DELAY_DIGITS = 4;

/**
 * The number typed at the cursor, which is 0 where nothing was typed.
 *
 * `digits` is DGROUP B540: reaching it ends the reader as return does, and the digit that
 * reached it counts.
 */
export async function revTypeANumber(game: RevGame, desk: RevTownDesk, digits: number): Promise<number> {
  const { row, column } = game.kept.cursor();
  let typed = '';
  for (;;) {
    const key = await desk.key();
    if (key >= ZERO && key <= NINE) typed += String.fromCharCode(key);
    // 1000:225D: the number the caller reads is worked out here, before the Backspace below can
    // shorten the string, so it is always the string as it stood when this key arrived.
    const value = typed === '' ? 0 : Number(typed);
    if (typed !== '' && key === REV_KEY.backspace) typed = typed.slice(0, -1);
    if (key === REV_KEY.enter) return value;
    game.kept.locate(row, column);
    game.kept.printKeepingTheCursor(`${typed} `);
    if (typed.length === digits) return value;
  }
}

/**
 * `VAL(k$)`: the digit a key typed, and 0 for a key that typed none.
 *
 * It is how the store reads its line numbers (1000:290B), how the temple reads its spells
 * (1000:2631) and how the guild reads a spell level (1000:2D74) — one key each, rather than a
 * line, so `L` and every other letter come out as 0.
 */
export function revTypedDigit(key: number): number {
  return key >= ZERO && key <= NINE ? key - ZERO : 0;
}
