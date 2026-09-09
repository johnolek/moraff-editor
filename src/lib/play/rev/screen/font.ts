import { plot, type Frame } from '../../view3d/frame';

/**
 * The 8 by 8 character generator the screen's text is drawn with.
 *
 * Moraff's Revenge prints its words in `SCREEN 1`, where a character is not text at all: the
 * run-time paints the glyph the PC's ROM character generator holds for that code, eight pixels
 * by eight, in the current foreground colour with colour 0 behind it. The game's own letter and
 * arrow sprites are the same shapes -- 1000:040D prints "SBTIW" and `GET`s the five characters
 * back off the screen, and 1000:04A9 does the same with the four arrow codes 18 to 1B. So the
 * ROM's first 128 shapes are needed to draw any of this, and they are the table below.
 */

/** Codes 0 to 127 of the ROM character generator, eight bytes each, high bit leftmost. */
const ROM_FONT_8X8 =
   '00000000000000007e81a581bd99817e7effdbffc3e7ff7e6cfefefe7c38100010387cfe7c381000387c38fefe7c387c1010387cfe7c387c0000183c3c180000' +
   'ffffe7c3c3e7ffff003c664242663c00ffc399bdbd99c3ff0f070f7dcccccc783c6666663c187e183f333f303070f0e07f637f636367e6c0995a3ce7e73c5a99' +
   '80e0f8fef8e08000020e3efe3e0e0200183c7e18187e3c1866666666660066007fdbdb7b1b1b1b003e63386c6c38cc78000000007e7e7e00183c7e187e3c18ff' +
   '183c7e1818181800181818187e3c180000180cfe0c180000003060fe603000000000c0c0c0fe0000002466ff6624000000183c7effff000000ffff7e3c180000' +
   '000000000000000030787830300030006c6c6c00000000006c6cfe6cfe6c6c00307cc0780cf8300000c6cc183066c600386c3876dccc76006060c00000000000' +
   '1830606060301800603018181830600000663cff3c660000003030fc303000000000000000303060000000fc000000000000000000303000060c183060c08000' +
   '7cc6cedef6e67c00307030303030fc0078cc0c3860ccfc0078cc0c380ccc78001c3c6cccfe0c1e00fcc0f80c0ccc78003860c0f8cccc7800fccc0c1830303000' +
   '78cccc78cccc780078cccc7c0c18700000303000003030000030300000303060183060c0603018000000fc0000fc00006030180c1830600078cc0c1830003000' +
   '7cc6dededec078003078ccccfccccc00fc66667c6666fc003c66c0c0c0663c00f86c6666666cf800fe6268786862fe00fe6268786860f0003c66c0c0ce663e00' +
   'ccccccfccccccc0078303030303078001e0c0c0ccccc7800e6666c786c66e600f06060606266fe00c6eefefed6c6c600c6e6f6decec6c600386cc6c6c66c3800' +
   'fc66667c6060f00078ccccccdc781c00fc66667c6c66e60078cce0701ccc7800fcb4303030307800ccccccccccccfc00cccccccccc783000c6c6c6d6feeec600' +
   'c6c66c38386cc600cccccc7830307800fec68c183266fe007860606060607800c06030180c060200781818181818780010386cc60000000000000000000000ff' +
   '30301800000000000000780c7ccc7600e060607c6666dc00000078ccc0cc78001c0c0c7ccccc7600000078ccfcc07800386c60f06060f000000076cccc7c0cf8' +
   'e0606c766666e60030007030303078000c000c0c0ccccc78e060666c786ce60070303030303078000000ccfefed6c6000000f8cccccccc00000078cccccc7800' +
   '0000dc66667c60f0000076cccc7c0c1e0000dc766660f00000007cc0780cf80010307c30303418000000cccccccc76000000cccccc7830000000c6d6fefe6c00' +
   '0000c66c386cc6000000cccccc7c0cf80000fc983064fc001c3030e030301c001818180018181800e030301c3030e00076dc0000000000000010386cc6c6fe00';

const glyphs = Uint8Array.from(
  (ROM_FONT_8X8.match(/../g) ?? []).map((pair) => parseInt(pair, 16)),
);

/** How wide and how tall one character cell is, which is also the text grid's step. */
export const CELL = 8;

/** The four arrow codes the map draws the character with (1000:04A9's literal `18 19 1A 1B`). */
export const ARROW_UP = 0x18;
export const ARROW_DOWN = 0x19;
export const ARROW_RIGHT = 0x1a;
export const ARROW_LEFT = 0x1b;

/** The eight row bitmaps of one character code, high bit leftmost. */
export function glyphRows(code: number): Uint8Array {
  const at = (code & 0x7f) * CELL;
  return glyphs.subarray(at, at + CELL);
}

/**
 * One character at a pixel position, the cell painted opaque.
 *
 * `SCREEN 1` has no text plane, so a character's own pixels go down in `colour` and the rest of
 * the cell in colour 0 -- which is how the game rubs a line out by printing spaces over it. The
 * text screens the help and the character roller run on do have one, and there the second half
 * of a `COLOR` is what goes behind the glyph.
 */
export function drawGlyph(
  frame: Frame,
  code: number,
  x: number,
  y: number,
  colour: number,
  background = 0,
): void {
  const rows = glyphRows(code);
  for (let row = 0; row < CELL; row++) {
    for (let bit = 0; bit < CELL; bit++) {
      plot(frame, x + bit, y + row, rows[row] & (0x80 >> bit) ? colour : background);
    }
  }
}

/**
 * A string at a `LOCATE row, column`, both counted from 1 the way the statement counts them.
 *
 * The screen is forty columns by twenty-five rows and a cell is eight pixels square, so
 * `LOCATE r, c` starts at pixel ((c - 1) * 8, (r - 1) * 8).
 */
export function drawText(frame: Frame, text: string, row: number, column: number, colour: number): void {
  for (let i = 0; i < text.length; i++) {
    drawGlyph(frame, text.charCodeAt(i), (column - 1 + i) * CELL, (row - 1) * CELL, colour);
  }
}
