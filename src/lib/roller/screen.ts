import mwPalettes from '../game/mw-palettes.json';
import palettes from '../game/palettes.json';
import type { ScreenLine } from '../game/port/state';

/** One entry of the game's palette, whose three components are the 6 bits the VGA DAC takes. */
function cssColour(entry: number[]): string {
  const byte = (component: number) =>
    Math.round((component * 255) / 63)
      .toString(16)
      .padStart(2, '0');
  return `#${entry.map(byte).join('')}`;
}

/** Entries 0 to 15 of one of a game's palettes, as CSS. */
const fixedColours = (palette: number[][]): string[] => palette.slice(0, 16).map(cssColour);

/**
 * Dungeons of the Unforgiven's fixed UI colours, entries 0 to 15, as CSS.
 *
 * `dotu-tools/docs/PICTURES.md` calls entries 1 to 15 of the 256-colour palette the fixed UI
 * colours, and all forty palettes in `palettes.json` hold the same sixteen, so which one they are
 * read out of makes no difference. Entry 0 is the background the game rubs text out with, and no
 * line drawn in it reaches a screen. Moraff's World has its own sixteen, which differ in two
 * entries, so a Moraff's World screen wants {@link MW_SCREEN_COLOURS} instead.
 */
export const SCREEN_COLOURS: string[] = fixedColours(palettes.m1_s1_dungeon);

/**
 * The same for Moraff's World, out of its own `set_palette` (WORLD.EXE 4000:10ee). All eleven of
 * its floor palettes hold the same sixteen. Entry 5, the orange its message box is printed in, is
 * (53, 20, 10) where Dungeons of the Unforgiven has (53, 20, 0), and entry 12 is (16, 0, 0) where
 * the other game has (20, 0, 0).
 */
export const MW_SCREEN_COLOURS: string[] = fixedColours(mwPalettes.palettes[0]);

/**
 * How far apart pfont (exe 4000:0bb3) sets the characters of each of its three fonts, in the 1600
 * units it divides x by.
 *
 * The numbers are not in the decompilation, which reads them out of a table at DS:c6c5, so they
 * are the widest each font can be without roll_char's own screens running off the edge or into
 * each other. The widest line in font 0 is the 63 characters of the race table's column headers,
 * which fill the 1600 at 25 and run off at 26. In font 1 it is a 43-character paragraph of the
 * difficulty menu indented to 0xa0, which fits at 33 and runs off at 34 — and the class menu's
 * question, 46 characters that psfont is told to spread over 1500, comes to 32.6 a character,
 * which is that same font at its natural spacing. Font 2 draws "RACE: " at x = 0 with the race's
 * name at 0x14a six characters later, so 55 at most; at 55 the eight letters of HUMANOID would
 * reach 0x302 and run into the SEX: FEMALE the same screen draws at 0x2ee, and at 50 they stop
 * just short of it.
 */
export const FONT_ADVANCE = [25, 33, 50];

/**
 * How wide a character of VT323 is as a fraction of its font size, measured in a browser. None of
 * the game's three .FNT faces is a web font, so a screen is set in VT323 at the size that puts
 * its characters the same distance apart as the font the game would have used.
 */
const VT323_ADVANCE = 0.4;

/**
 * Where the top of a capital letter sits in VT323's line box, as a fraction of the font size,
 * measured in a browser. The game's y is the top row of the glyph it draws, so a span is lifted
 * by this much to put its letters where the game puts them.
 */
const VT323_CAP_TOP = 0.24;

/** One string on a screen, in the game's units, ready to be positioned. */
export interface ScreenSpan {
  text: string;
  /** The left edge, out of the 1600 the game's screen is wide. */
  x: number;
  /** The top of the line box, lifted so the letters start on the y the game draws at. */
  y: number;
  /** The font size, in those same units. */
  size: number;
  /** What to add to every character's width, which is how psfont spreads a string out. */
  spacing: number;
  colour: string;
}

/**
 * A drawn line as one or two spans: psfont (exe 4000:0db8) keeps each character the size its font
 * makes it and steps by the span it was given divided by the length of the string, so a line with
 * a right-hand edge comes out spread apart or squeezed together. A line drawn with a value beside
 * it — a race's name, a characteristic's number — is two calls in the game and two spans here.
 */
function spansOf(line: ScreenLine, colours: string[]): ScreenSpan[] {
  const advance = FONT_ADVANCE[line.font];
  const step = line.spreadTo === undefined ? advance : (line.spreadTo - line.x) / Math.max(1, line.text.length);
  const size = advance / VT323_ADVANCE;
  const shared = { y: line.y - size * VT323_CAP_TOP, size, colour: colours[line.colour] };
  const spans = [{ ...shared, text: line.text, x: line.x, spacing: step - advance }];
  if (line.value !== undefined && line.valueX !== undefined) {
    spans.push({ ...shared, text: line.value, x: line.valueX, spacing: 0 });
  }
  return spans;
}

/** Everything showing on a screen, ready to be positioned, in the palette of the game that drew it. */
export function screenSpans(screen: ScreenLine[], colours: string[] = SCREEN_COLOURS): ScreenSpan[] {
  return screen.flatMap((line) => spansOf(line, colours));
}
