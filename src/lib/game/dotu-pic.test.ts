import { describe, expect, it } from 'vitest';
import {
  BRIGHT_COLOURS,
  PIC_H,
  PIC_W,
  buildingPixelIndex,
  dimPalette,
  monsterPixelIndex,
  renderImage,
  vgaToRgb,
  type PicImage,
  type Rgb,
} from './dotu-pic.js';
import palettes from './palettes.json';

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from }, (_, i) => from + i);

/** A six-bit palette whose entry n is (n % 64, (n * 5) % 64, (n * 11) % 64), so no two of the
 *  entries the switch reaches share a colour and a moved entry is easy to spot. */
const sixBitRamp = (): number[][] =>
  Array.from({ length: 256 }, (_, i) => [i % 64, (i * 5) % 64, (i * 11) % 64]);

/** Which entries of that ramp one setting rewrote. No entry of it blends to itself. */
const movedBy = (setting: number, water: boolean): number[] => {
  const dimmed = dimPalette(sixBitRamp(), setting, water);
  return dimmed.flatMap((entry, i) => (entry.join() === sixBitRamp()[i].join() ? [] : [i]));
};

/** What the render leaves transparent, and what the rule returns for a pixel it does not draw. */
const NOT_DRAWN = -1;

/** A palette whose entry n is the colour (n, n, n), so a rendered pixel names its own entry. */
const NAMING_PALETTE: Rgb[] = Array.from({ length: 256 }, (_, i) => [i, i, i]);

/** A picture whose column v holds pixel value v in every row, so one render puts all 32 values
 *  through the rule at every row at once. */
function valueRamp(): PicImage {
  const image = new Int16Array(PIC_W * PIC_H);
  for (let row = 0; row < PIC_H; row++) for (let value = 0; value < 32; value++) image[row * PIC_W + value] = value;
  return image;
}

const RAMP = valueRamp();

/** The 32 palette entries one row of the rendered ramp came out as. */
function drawnRow(data: Uint8ClampedArray, row: number): number[] {
  return Array.from({ length: 32 }, (_, value) => {
    const at = (row * PIC_W + value) * 4;
    return data[at + 3] === 0 ? NOT_DRAWN : data[at];
  });
}

/** Every value at v + base, with value 0 undrawn, and then the special values named outright. */
function table(base: number, specials: Record<number, number>): number[] {
  const entries = Array.from({ length: 32 }, (_, value) => (value + base) & 0xff);
  entries[0] = NOT_DRAWN;
  for (const [value, index] of Object.entries(specials)) entries[Number(value)] = index;
  return entries;
}

/** Row `row` of the ramp drawn as a monster, which is also where the gradient values read from. */
const monsterRow = (tint: number, colorSet: number, row: number): number[] =>
  drawnRow(renderImage(RAMP, NAMING_PALETTE, (value, at) => monsterPixelIndex(value, tint, colorSet, at)).data, row);

describe('the drawer colour rule, over a picture holding every pixel value', () => {
  it('substitutes 17, 16 and 18 in colour set 0, where the base adds nothing', () => {
    const tint = 9;
    expect(monsterRow(tint, 0, 0)).toEqual(table(0, { 16: 0, 17: tint, 18: 0 }));
  });

  it('leaves the tint pixel undrawn in colour set 0 when the tint is 0', () => {
    expect(monsterRow(0, 0, 0)).toEqual(table(0, { 16: 0, 17: NOT_DRAWN, 18: 0 }));
  });

  it("adds colour set 1's base to the tint as well", () => {
    const giantBallTint = 5;
    expect(monsterRow(giantBallTint, 1, 0)).toEqual(table(0x10, { 16: 0x10, 17: 0x10 + giantBallTint, 18: 0x10 }));
  });

  it('sends a tint of 16 on through the next substitution and out at the base entry', () => {
    const blackPuffballTint = 16;
    expect(monsterRow(blackPuffballTint, 0, 0)).toEqual(table(0, { 16: 0, 17: 0, 18: 0 }));
  });

  it('keeps the tint raw and reads 29 to 31 off the row in the 0x20 bank', () => {
    const ogerothTint = 52;
    const row = 7;
    expect(monsterRow(ogerothTint, 2, row)).toEqual(
      table(0x20, { 28: ogerothTint, 29: 0xff - row, 30: 0x60 + row, 31: 0xff - row }),
    );
  });

  it('draws the 0x40 bank by the same rule as the 0x20 bank', () => {
    const tint = 52;
    const row = 7;
    expect(monsterRow(tint, 4, row)).toEqual(table(0x40, { 28: tint, 29: 0xff - row, 30: 0x60 + row, 31: 0xff - row }));
  });

  it('wraps the gradient every 160 rows', () => {
    const tint = 52;
    expect(monsterRow(tint, 2, 165)).toEqual(table(0x20, { 28: tint, 29: 0xfa, 30: 0x65, 31: 0xfa }));
  });

  it("cuts a Shadow boss's tint pixels out, its tint being the bank's own base", () => {
    const shadowTint = 0x20;
    const row = 0;
    expect(monsterRow(shadowTint, 2, row)).toEqual(
      table(0x20, { 28: NOT_DRAWN, 29: 0xff, 30: 0x60, 31: 0xff }),
    );
  });

  it('substitutes in the 0x50 bank the 3-D walls are drawn in', () => {
    const plainWallTint = 12;
    expect(monsterRow(plainWallTint, 5, 0)).toEqual(table(0x50, { 16: 0x50, 17: 0x50 + plainWallTint, 18: 0x50 }));
  });

  it('adds 0x20 to a building background and 0x3f to its overlay, with no substitutions', () => {
    const background = drawnRow(renderImage(RAMP, NAMING_PALETTE, (value) => buildingPixelIndex(value, 0)).data, 0);
    const overlay = drawnRow(renderImage(RAMP, NAMING_PALETTE, (value) => buildingPixelIndex(value, 1)).data, 0);
    expect(background).toEqual(table(0x20, {}));
    expect(overlay).toEqual(table(0x3f, {}));
  });
});

describe('the palette', () => {
  it('turns a six-bit entry into the byte a VGA card shows', () => {
    expect(vgaToRgb([[0, 0, 0], [63, 63, 63], [32, 16, 8]])).toEqual([
      [0, 0, 0],
      [255, 255, 255],
      [129, 64, 32],
    ]);
  });

  it('leaves the palette alone on the setting a new character is given', () => {
    const pal = sixBitRamp();
    expect(dimPalette(pal, BRIGHT_COLOURS, false)).toEqual(pal);
  });

  it('blends the wall colours toward grey on every other setting', () => {
    // Module I section 1's wall material, entry 17, and the vivid lime of entry 30. What each
    // setting turns them into was read out of set_palette by the emulation in EmuPalette.py.
    const pal = sixBitRamp();
    pal[17] = [35, 43, 35];
    pal[30] = [0, 47, 0];
    expect(dimPalette(pal, 1, false)[17]).toEqual([36, 40, 36]);
    expect(dimPalette(pal, 2, false)[17]).toEqual([37, 39, 36]);
    expect(dimPalette(pal, 3, false)[17]).toEqual([37, 38, 36]);
    expect(dimPalette(pal, 1, false)[30]).toEqual([9, 30, 7]);
    expect(dimPalette(pal, 2, false)[30]).toEqual([11, 26, 9]);
    expect(dimPalette(pal, 3, false)[30]).toEqual([15, 20, 11]);
  });

  it('reads Module I section 1 out of the shipped palette at full strength', () => {
    const pal = palettes.m1_s1_dungeon;
    expect(pal[17]).toEqual([35, 43, 35]);
    expect(pal[30]).toEqual([0, 47, 0]);
  });

  it('reaches the section colours and the walls bank and nothing else', () => {
    expect(movedBy(3, false)).toEqual([...range(16, 32), ...range(80, 96)]);
  });

  it('stops before the walls bank in a water section', () => {
    expect(movedBy(3, true)).toEqual(range(16, 32));
  });

  it('does not modify the palette it is given', () => {
    const pal = sixBitRamp();
    dimPalette(pal, 3, false);
    expect(pal[17]).toEqual(sixBitRamp()[17]);
  });
});
