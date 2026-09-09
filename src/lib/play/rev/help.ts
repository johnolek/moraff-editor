import data from '../../game/rev-data.json';
import { revExpandTabs, TEXT_ROWS, type RevTextRun } from './screen/text-screen';
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
 * The page takes the whole display over as an eighty-column text screen (`screen/text-screen.ts`),
 * which is the one place in the game that is not `SCREEN 1`. Each line goes on in a colour of
 * its own: a line beginning with `~` steps the colour cycle at 1000:B9D6 before it is printed and
 * loses the marker at 1000:C465, and a line without one keeps the colour standing. The menu and
 * the fighting page have their keys picked out on top of that (1000:C47B).
 */

/** `H1.OVL` to `H8.OVL`, one list of lines each, `~` markers and all. */
const PAGES: string[][] = data.help;

/** 1000:C349: the twenty-five lines of the text screen, which is how far a page runs before it
 *  stops for a key. */
const PAGE_LINES = 25;

/** 1000:C5C3, the string set up at 1000:020B: what the bottom of a page waits with. */
export const HIT_ANY_KEY = 'Hit any key';

/** 1000:C5B0: `LOCATE 25, B796 + 10`, and B796 is the 25 that 1000:C349 puts there while the
 *  eighty-column screen is up, so the prompt sits at the middle of the bottom row. */
const PROMPT_ROW = 25;
const PROMPT_COLUMN = 35;

/** How many pages the menu offers behind it (1000:C568's `1` and 1000:C571's `7`). */
const PAGES_BEHIND_THE_MENU = 7;

/** 1000:C399 and C465: a line beginning with `~` steps the colour before it is printed, and the
 *  marker is taken off. */
function printable(line: string): string {
  return line.startsWith('~') ? line.slice(1) : line;
}

/** The lines of a page as they stand in the file, in the chunks of twenty-five the screen shows
 *  them in. */
function rawChunks(page: number): string[][] {
  const lines = PAGES[page] ?? [];
  // 1000:C3DD stops for a key on every page but the menu, which is shown whole however long it is.
  if (page === 0) return [lines];
  const chunks: string[][] = [];
  for (let at = 0; at < lines.length; at += PAGE_LINES) chunks.push(lines.slice(at, at + PAGE_LINES));
  return chunks;
}

/** The same, with the `~` markers off, which is what the tab's message box is given. */
export function revHelpChunks(page: number): string[][] {
  return rawChunks(page).map((chunk) => chunk.map(printable));
}

/**
 * 1000:0196: the seven colours the help cycles through.
 *
 * Start-up fills the array with `I + 9` for I of 0 to 6 — CGA's bright half, light blue through
 * white — for an installation whose `NAME` file says the monitor is a colour one. A monochrome
 * installation gets seven whites instead (1000:0134), and this port is a colour monitor.
 */
const HELP_COLOURS = [9, 10, 11, 12, 13, 14, 15];

/** What `SCREEN 0` leaves the foreground at, which is what the first line of a page that does
 *  not begin with a `~` comes out in. */
const DEFAULT_COLOUR = 7;

/** 1000:C48F: the colour the keys are picked out in on a colour monitor; a monochrome one gets
 *  the 7 at 1000:C486 instead. */
const KEY_COLOUR = 15;

/** DGROUP B780 and the colour it left standing: the cycle runs on across pages, so which colour
 *  a line comes out in depends on how much help has been read before it. */
export interface RevHelpColours {
  counter: number;
  colour: number;
}

export function revNewHelpColours(): RevHelpColours {
  return { counter: 0, colour: DEFAULT_COLOUR };
}

/** 1000:B9D6: one step round the seven. The counter is raised first and put back to 0 once it is
 *  over six, so the colours come round as 10, 11, 12, 13, 14, 15, 9 and then 10 again. */
function stepTheColour(colours: RevHelpColours): void {
  colours.counter += 1;
  if (colours.counter > 6) colours.counter = 0;
  colours.colour = HELP_COLOURS[colours.counter];
}

/**
 * 1000:C47B: the keys of the menu and of the fighting page, picked out.
 *
 * Both pages are a list of what a key does, and this puts the key itself in a colour of its own:
 * the `#` of the `@,#` line and the word `Esc` are printed again where they stand, and then the
 * first character of every row down to the sixteenth on the menu (1000:C4A3) or the thirteenth
 * on the fighting page (1000:C4D3) is read off the screen and printed back — which is the first
 * letter of every option, the letter the player types.
 */
function pickOutTheKeys(runs: RevTextRun[], printed: string[], menu: boolean): void {
  if (menu) {
    runs.push({ row: 13, column: 3, text: '#', colour: KEY_COLOUR });
    runs.push({ row: 17, column: 1, text: 'Esc', colour: KEY_COLOUR });
  } else {
    runs.push({ row: 13, column: 1, text: 'Esc', colour: KEY_COLOUR });
  }
  const rows = menu ? 16 : 13;
  for (let row = 1; row <= rows; row++) {
    runs.push({ row, column: 1, text: (printed[row - 1] ?? '').slice(0, 1) || ' ', colour: KEY_COLOUR });
  }
}

/** Which of the two pages that pick their keys out this is, or null for the other six. */
export type RevHelpKeys = 'menu' | 'fighting' | null;

/**
 * One screenful of a page, as the eighty-column screen has it.
 *
 * The colour cycle is carried in and out because it belongs to the whole help session rather
 * than to one page: DGROUP B780 is never put back, so the colour a page opens in is where the
 * page before it left off.
 */
export function revHelpScreen(lines: string[], colours: RevHelpColours, keys: RevHelpKeys = null): RevTextRun[] {
  const runs: RevTextRun[] = [];
  const printed: string[] = [];
  lines.slice(0, TEXT_ROWS).forEach((line, at) => {
    if (line.startsWith('~')) stepTheColour(colours);
    const text = revExpandTabs(printable(line));
    printed.push(text);
    runs.push({ row: at + 1, column: 1, text, colour: colours.colour });
  });
  if (keys !== null) pickOutTheKeys(runs, printed, keys === 'menu');
  return runs;
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
/**
 * A whole page as the screen has it, one set of runs per screenful.
 *
 * The colour cycle is carried in and left where the page leaves it, since the game never puts
 * DGROUP B780 back: which colour the next page opens in depends on how much has been read.
 */
export function revHelpTextScreens(page: number, colours: RevHelpColours): RevTextRun[][] {
  const chunks = rawChunks(page);
  return chunks.map((lines, at) => {
    const last = at === chunks.length - 1;
    // 1000:C427: the menu and the fighting page are the two that pick their keys out.
    const keys: RevHelpKeys = page === 0 ? 'menu' : last && page === PAGES_BEHIND_THE_MENU ? 'fighting' : null;
    const runs = revHelpScreen(lines, colours, keys);
    // 1000:C457: the menu asks for its key straight away; every other page ends with the prompt,
    // in a colour 1000:C45C steps to before printing it.
    if (last && page !== 0) {
      stepTheColour(colours);
      runs.push({ row: PROMPT_ROW, column: PROMPT_COLUMN, text: HIT_ANY_KEY, colour: colours.colour });
    }
    return runs;
  });
}

/**
 * 1000:0EA4 and 0EB3: H and F1 open the help and come back to the top of the pass, so neither
 * spends a moment nor an action.
 */
export async function revShowHelp(game: RevGame, desk: RevTownDesk): Promise<void> {
  const colours = revNewHelpColours();
  for (;;) {
    // 1000:C352: every page begins with a cleared screen.
    game.said = [];
    game.say(...revHelpChunks(0)[0]);
    game.textScreen = revHelpTextScreens(0, colours)[0];
    const chosen = revHelpChoice(await desk.key());
    if (chosen === null) {
      // 1000:C586 leaves the help through 1000:2FF7, and 1000:0ED1 draws the game back over it.
      game.said = [];
      game.textScreen = null;
      return;
    }
    const chunks = revHelpChunks(chosen);
    const screens = revHelpTextScreens(chosen, colours);
    for (let at = 0; at < chunks.length; at++) {
      game.said = [];
      game.say(...chunks[at]);
      game.textScreen = screens[at];
      // 1000:C402: the wait between the twenty-five-line chunks has no prompt of its own —
      // the page's own twenty-fifth line is what says "MORE (Hit any key)".
      if (at < chunks.length - 1) await desk.key();
    }
    // 1000:C5B0: the end of a page waits with the prompt set up at 1000:020B.
    game.say(HIT_ANY_KEY);
    await desk.key();
  }
}
