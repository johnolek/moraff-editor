import { newFrame, type Frame } from '../../view3d/frame';
import { CELL, drawGlyph } from './font';

/**
 * `SCREEN 0` at `WIDTH 80`: the text screen the help pages take the display over with.
 *
 * 1000:C33B switches the mode and 1000:C340 sets the width, and from there the help is eighty
 * columns of twenty-five rows with a colour of its own on every line. The card draws that from
 * the same 8 by 8 ROM character generator the graphics screen prints with (`font.ts`), so the
 * page is 640 by 200 — twice the graphics screen's width on the same number of scan lines, which
 * is why the letters are half as wide. It is a frame of colour indexes like every other screen
 * here, but the indexes are CGA's sixteen rather than the four a palette gives `SCREEN 1`.
 */

export const TEXT_COLUMNS = 80;
export const TEXT_ROWS = 25;
export const TEXT_SCREEN_WIDTH = TEXT_COLUMNS * CELL;
export const TEXT_SCREEN_HEIGHT = TEXT_ROWS * CELL;

/** One `LOCATE` and `PRINT`, at the row and column BASIC counts from 1. */
export interface RevTextRun {
  row: number;
  column: number;
  text: string;
  /** One of CGA's sixteen, which is what `COLOR` names in `SCREEN 0`. */
  colour: number;
}

/**
 * How far a tab moves the cursor.
 *
 * The help files hold real tab characters and BASIC's own screen driver, not DOS, is what puts
 * them on the screen: the cursor goes to the next column that is one past a multiple of eight.
 */
export const TAB_STOP = 8;

/** A line as the screen has it, with every tab turned into the spaces it stands for. */
export function revExpandTabs(text: string): string {
  let out = '';
  for (const character of text) {
    if (character !== '\t') {
      out += character;
      continue;
    }
    out += ' '.repeat(TAB_STOP - (out.length % TAB_STOP));
  }
  return out;
}

/** The whole page: every run printed where it was `LOCATE`d, in the colour it was printed in. */
export function drawRevTextScreen(runs: RevTextRun[]): Frame {
  const screen = newFrame(TEXT_SCREEN_WIDTH, TEXT_SCREEN_HEIGHT);
  for (const run of runs) {
    for (let at = 0; at < run.text.length; at++) {
      const column = run.column + at;
      if (column > TEXT_COLUMNS) break;
      drawGlyph(screen, run.text.charCodeAt(at), (column - 1) * CELL, (run.row - 1) * CELL, run.colour);
    }
  }
  return screen;
}
