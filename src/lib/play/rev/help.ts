import data from '../../game/rev-data.json';
import type { RevTownDesk } from './town';
import type { RevGame } from './state';

/**
 * 1000:C332: the eight help pages, which H and F1 both open.
 *
 * `H1.OVL` to `H8.OVL` are plain text the routine reads a line at a time and paints on an
 * 80-column text screen; `../../game/rev-data.json` carries them, read by
 * `rev-tools/reference/build_rev_data.py`. The first page is the menu, and typing 1 to 7 on it
 * opens one of the seven behind it; any other key closes the help. Every other page is shown
 * twenty-five lines at a time, waits for a key between them and for one more at the end, and
 * then comes back to the menu.
 *
 * What this port leaves out is all screen: the original switches to `SCREEN 0` at 80 columns
 * (1000:C33B), draws a line beginning with `~` in a second colour, and redraws the characters
 * of the `Esc` and `#` markers at 1000:C47B to recolour them. The lines go in the message box
 * here, and the `~` is stripped exactly where 1000:C465 strips it.
 */

/** `H1.OVL` to `H8.OVL`, one list of lines each, `~` markers and all. */
const PAGES: string[][] = data.help;

/** 1000:C349: the twenty-five lines of the text screen, which is how far a page runs before it
 *  stops for a key. */
const PAGE_LINES = 25;

/** 1000:C5C3, the string set up at 1000:020B: what the bottom of a page waits with. */
export const HIT_ANY_KEY = 'Hit any key';

/** How many pages the menu offers behind it (1000:C568's `1` and 1000:C571's `7`). */
const PAGES_BEHIND_THE_MENU = 7;

/** 1000:C399 and C465: a line beginning with `~` is drawn in the highlight colour, and the marker
 *  is stripped before it is printed. The message box has no second colour, so the marker is all
 *  this port takes off. */
function printable(line: string): string {
  return line.startsWith('~') ? line.slice(1) : line;
}

/** The lines of a page, in the chunks of twenty-five the screen shows them in. */
export function revHelpChunks(page: number): string[][] {
  const lines = (PAGES[page] ?? []).map(printable);
  // 1000:C3DD stops for a key on every page but the menu, which is shown whole however long it is.
  if (page === 0) return [lines];
  const chunks: string[][] = [];
  for (let at = 0; at < lines.length; at += PAGE_LINES) chunks.push(lines.slice(at, at + PAGE_LINES));
  return chunks;
}

/** 1000:C557: which page the menu opens for a key, or null for the key that closes the help. */
export function revHelpChoice(key: number): number | null {
  const typed = key - '0'.charCodeAt(0);
  return typed >= 1 && typed <= PAGES_BEHIND_THE_MENU ? typed : null;
}

/**
 * 1000:0EA4 and 0EB3: H and F1 open the help and come back to the top of the pass, so neither
 * spends a moment nor an action.
 */
export async function revShowHelp(game: RevGame, desk: RevTownDesk): Promise<void> {
  for (;;) {
    // 1000:C352: every page begins with a cleared screen.
    game.said = [];
    game.say(...revHelpChunks(0)[0]);
    const chosen = revHelpChoice(await desk.key());
    if (chosen === null) {
      // 1000:C586 leaves the help through 1000:2FF7, and 1000:0ED1 draws the game back over it.
      game.said = [];
      return;
    }
    const chunks = revHelpChunks(chosen);
    for (let at = 0; at < chunks.length; at++) {
      game.said = [];
      game.say(...chunks[at]);
      // 1000:C402: the wait between the twenty-five-line chunks has no prompt of its own —
      // the page's own twenty-fifth line is what says "MORE (Hit any key)".
      if (at < chunks.length - 1) await desk.key();
    }
    // 1000:C5B0: the end of a page waits with the prompt set up at 1000:020B.
    game.say(HIT_ANY_KEY);
    await desk.key();
  }
}
