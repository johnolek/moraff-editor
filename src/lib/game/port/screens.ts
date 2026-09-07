import type { Game, ScreenLine } from './state';

// The message text is the exact bytes of the game's own strings, read out of the data segment of
// the unpacked executable. The comment on each drawn line gives the address of every string it
// prints, in order; dotu-tools/reference/scripts/exe_strings.py reads them back.

/** The left edge of the eight menu lines (exe: pfont's x in mset_gmenu). */
export const MENU_X = 0x3a2;

/** The top of the first menu line. The eight lines step {@link MENU_LINE_STEP} apart. */
export const MENU_TOP = 0x329;

/** How far apart the eight menu lines are drawn. */
export const MENU_LINE_STEP = 0x32;

/** The one line above the menu that a prompt is drawn on. */
export const MESSAGE_LINE_Y = 0x301;

/** The colour mset_gmenu draws every menu line in. */
export const MENU_COLOUR = 6;

/**
 * How long a menu line has to be before the game spreads it out instead of printing it plainly.
 *
 * mset_gmenu measures the line and sends anything of 27 characters or more through FUN_4000_593f
 * (exe 4000:593f), which spreads the string from x to the right edge of the screen at 0x640 —
 * squeezing it up when it is too long to fit at the font's own spacing.
 */
export const MENU_SPREAD_LENGTH = 0x1b;

/** The right edge a long menu line is spread out to reach. */
export const MENU_SPREAD_TO = 0x640;

/**
 * fill_rect (exe 4000:2a36) in the background colour: take off the screen every line drawn
 * inside a rectangle.
 *
 * The screen keeps a string's top left corner rather than the box its letters fill, so a line
 * counts as inside the rectangle when the point it was drawn at is. `x1` and `y1` are past the
 * last column and row, the way the game's own rectangles are given.
 */
export function clearRect(game: Game, x0: number, y0: number, x1: number, y1: number): void {
  for (let at = game.screen.length - 1; at >= 0; at -= 1) {
    const line = game.screen[at];
    if (line.x >= x0 && line.x < x1 && line.y >= y0 && line.y < y1) game.screen.splice(at, 1);
  }
}

/**
 * FUN_2000_2820 (exe 2000:2820): wipe the eight menu lines.
 *
 * The rectangle runs from x 0x398 to the right edge and from y 0x324 to the bottom of the
 * screen, which covers the whole menu column. Every caller fills the lines in again straight
 * afterwards. The colour it fills with is the background in every video mode but the widest few,
 * where it is 13 — a dark grey the game paints its menu column with — and the port has nothing
 * to draw either one with, so both take the lines off the screen.
 */
export function clearMenuBlock(game: Game): void {
  clearRect(game, 0x398, 0x324, 0x640, 0x4b0);
}

/**
 * FUN_2000_28be (exe 2000:28be): wipe the one line above the menu.
 *
 * The rectangle is the strip from y 0x2ff to 0x329 in the same column, which is where every
 * screen that puts a question over its menu draws it.
 */
export function clearMessageLine(game: Game): void {
  clearRect(game, 0x398, 0x2ff, 0x640, 0x329);
}

// erase_message_block (exe 4000:430e, unf.c "erase_message_block") erases nothing: it reads the
// keyboard buffer empty and clears the two mouse buttons, so a key pressed while the last screen
// was up cannot answer the next one. The port has no buffer to drain and no port of it.

/**
 * One of the eight menu lines as mset_gmenu (exe 2000:2b08) draws it: at x 0x3a2, 0x32 apart, in
 * the body font in colour 6. A line of 27 characters or more is spread out to the right edge
 * instead of printed at the font's own spacing.
 */
export function menuLine(text: string, index: number): ScreenLine {
  const line: ScreenLine = {
    text,
    x: MENU_X,
    y: index * MENU_LINE_STEP + MENU_TOP,
    font: 0,
    colour: MENU_COLOUR,
  };
  if (text.length >= MENU_SPREAD_LENGTH) line.spreadTo = MENU_SPREAD_TO;
  return line;
}

/**
 * mset_gmenu (exe 2000:2b08, unf.c "mset_gmenu"), the half of it that draws: wipe the menu column
 * and fill it with up to eight lines.
 *
 * The original reads the keyboard once the lines are up, which is {@link gmenuChoice} here. It
 * also watches the keyboard *while* it draws and stops as soon as a key it would accept is
 * waiting, so a player who types ahead sees only part of the menu; nothing the port draws into
 * can be typed ahead of, so the lines all go up.
 */
export function drawMenu(game: Game, lines: string[]): void {
  clearMenuBlock(game);
  lines.forEach((text, index) => {
    if (index < 8) game.draw(menuLine(text, index));
  });
}

/** What a menu reader makes of a key: a menu number, an escape, or a key it goes on waiting past. */
export type MenuChoice = number | 'escape' | null;

/**
 * mset_gmenu (exe 2000:2b08, unf.c "mset_gmenu"), the half of it that reads: what one key does to
 * a menu whose lines are numbered `first` to `last`.
 *
 * The digits it takes are the line numbers themselves, so a menu given 1 and 8 takes '1' to '8'
 * and hands back 1 to 8. Escape cancels. Every other key is ignored and the original goes on
 * waiting, which is the `null` here. A menu called with a `first` of -1 takes any key at all and
 * hands back its character code; that is {@link anyKeyChoice}.
 */
export function gmenuChoice(first: number, last: number, key: string): MenuChoice {
  if (key === '\x1b') return 'escape';
  const digit = key.charCodeAt(0) - 0x30;
  if (digit < first || digit > last) return null;
  return digit;
}

/**
 * get_choice (exe 2000:2d93, unf.c "get_choice"): what one key does to a menu of `last - first`
 * plus one lines.
 *
 * This is the other of the game's two menu readers, and it numbers differently: whatever `first`
 * is, the keys it takes start at '1'. `first` and `last` only say how many lines there are — they
 * are the first and last of the eight mouse boxes the menu column is divided into, and the count
 * is what the key range is worked out from. Escape cancels; an extended key arrives as a zero
 * byte, and the original throws away the scan code behind it and goes on waiting, which is what
 * the `null` for an unknown key stands for here.
 */
export function getChoice(first: number, last: number, key: string): MenuChoice {
  if (key === '\x1b') return 'escape';
  const digit = key.charCodeAt(0) - 0x30;
  if (digit < 1 || digit - 1 > last - first) return null;
  return digit;
}

/**
 * mset_gmenu (exe 2000:2b08) called with a `first` of -1: the wait that keeps a screen up until
 * the player has read it, which hands back whatever key was pressed. Escape still cancels.
 */
export function anyKeyChoice(key: string): string | 'escape' {
  return key === '\x1b' ? 'escape' : key;
}

/** Where the eight-line message box's wait draws {@link drawHitAnyKey}. */
export const HIT_ANY_KEY_X = 0x294;
export const HIT_ANY_KEY_Y = 0x41e;

/**
 * FUN_2000_3e73 (exe 2000:3e73): the little plaque that says a key is wanted.
 *
 * It is what the wait behind every eight-line message box (FUN_2000_4054, exe 2000:4054) puts on
 * the screen: a box 0xf0 across and 0x82 down at the corner it is given, with a picture of a hand
 * scaled into it where the video mode has the colours for one, and two lines of text over that.
 * With a mouse it asks for the button instead, over three lines.
 */
export function drawHitAnyKey(game: Game, x: number, y: number): void {
  // DS:0a69 0a71
  game.draw({ text: 'HIT ANY', x: x + 0x19, y: y + 0x14, spreadTo: x + 0xe1, font: 0, colour: 15 });
  game.draw({ text: 'KEY NOW', x: x + 0x19, y: y + 0x41, spreadTo: x + 0xe1, font: 0, colour: 15 });
}
