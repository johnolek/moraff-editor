// Moraff .PIC decoder + palette rules for Dungeons of the Unforgiven (ES module, no deps).
// Format (exe 3000:974d load_picture / 4000:4818 scale_image2): a file is a sequence of
// image records; record = big-endian uint16 N, then 201 little-endian uint16 row offsets
// (relative to record+402, first is always 2), then the row data.  200 rows x 256 columns,
// 5-bit colour indices; row = start x, then runs: b < 0x20 -> colour b, length next byte
// (0 = 255); b >= 0x20 -> colour b & 31, length b >> 5.  See PICTURES.md.

export const PIC_W = 256, PIC_H = 200;

/** Parse a .PIC file into images; each image is an Int16Array(256*200) of colour indices
 *  (0 = not drawn).  Returns {images, consumed}. */
export function parsePic(bytes) {
  const images = [];
  let pos = 0;
  while (pos + 402 <= bytes.length) {
    const n = (bytes[pos] << 8) | bytes[pos + 1];
    const tab = new Array(201);
    for (let i = 0; i < 201; i++) tab[i] = bytes[pos + 2 + 2 * i] | (bytes[pos + 3 + 2 * i] << 8);
    const base = pos + 402;
    if (tab[0] !== 2 || base + n > bytes.length + 2) break;
    let bad = false;
    for (let i = 0; i < 200; i++) if (tab[i] > tab[i + 1]) { bad = true; break; }
    if (bad) break;
    const img = new Int16Array(PIC_W * PIC_H);
    for (let r = 0; r < 200; r++) {
      let p = base + tab[r]; const end = base + tab[r + 1];
      if (end <= p) continue;
      let x = bytes[p++];
      while (p < end) {
        const b = bytes[p++];
        let colour, len;
        if (b < 0x20) { colour = b; len = bytes[p++]; if (len === 0) len = 255; }
        else { colour = b & 31; len = b >> 5; }
        if (colour) for (let i = 0; i < len; i++) if (x + i < PIC_W) img[r * PIC_W + x + i] = colour;
        x += len;
      }
    }
    images.push(img);
    pos = base + n;
  }
  return { images, consumed: pos };
}

/** Map a 6-bit VGA palette ([r,g,b] 0..63 each, 256 entries) to 8-bit RGB. */
export const vgaToRgb = pal => pal.map(([r, g, b]) => [r * 255 / 63 | 0, g * 255 / 63 | 0, b * 255 / 63 | 0]);

/** The four settings of the options menu's "SUBDUED-BRIGHT COLOR SWITCH" (DS:4df2). */
export const COLOUR_SETTINGS = 4;

/** What a new character is given, by roll_char (exe 3000:4c77): the colours at full strength. */
export const BRIGHT_COLOURS = 0;

/** The three sections `load_section_pictures` (exe 2000:372c) sets the water flag for, 1-based. */
export const WATER_SECTIONS = [4, 8, 20];

/** The wall banks the switch reaches: the section's own colours, then the 3-D walls' bank. */
const SECTION_COLOURS = [16, 32];
const WALL_BANK = [80, 96];

/**
 * The end of `set_palette` (exe 4000:12c3, unf.c "set_palette"), where the options menu's colour
 * setting blends the wall colours toward grey.  Settings 1, 2 and 3 mix in more of the other two
 * channels each time; setting 0 leaves the palette alone.
 *
 * Each channel is worked out from the channels already rewritten, not from the entry the loop
 * started with, so red feeds the new green and both feed the new blue.  A water section's loop
 * stops before the 3-D walls' bank, which keeps its random components whatever the setting is.
 *
 * This is the dungeon palette only.  Inside a building `set_palette` copies its own table over
 * entries 32..95 after the loop has run, so the setting never shows on the walls of a shop.
 *
 * `pal` is 6-bit entries and is not modified; the returned palette is a fresh copy.
 */
export function dimPalette(pal, setting, water) {
  const out = pal.map(c => c.slice());
  if (setting === BRIGHT_COLOURS) return out;
  const banks = water ? [SECTION_COLOURS] : [SECTION_COLOURS, WALL_BANK];
  for (const [from, to] of banks) {
    for (let i = from; i < to; i++) {
      const [r, g, b] = out[i];
      if (setting === 1) {
        const nr = ((r + r + r + g + b) / 5) | 0;
        const ng = ((nr + g + g + g + b) / 5) | 0;
        out[i] = [nr, ng, ((nr + ng + b + b + b) / 5) | 0];
      } else if (setting === 2) {
        const nr = (r + r + g + b) >> 2;
        const ng = (nr + g + g + b) >> 2;
        out[i] = [nr, ng, (nr + ng + b + b) >> 2];
      } else {
        const nr = ((r + g + b) / 3) | 0;
        const ng = ((nr + g + b) / 3) | 0;
        out[i] = [nr, ng, ((nr + ng + b) / 3) | 0];
      }
    }
  }
  return out;
}

/** The drawer's second tint, DS:4fbf, which it substitutes for pixel value 18 (exe 4000:4eb0).
 *  Nothing in the executable ever writes that word, so it keeps the initial value 0 and pixel
 *  value 18 always ends up on the colour set's base entry, exactly like pixel value 16. */
const SECOND_TINT = 0;

/** Final palette index for one picture pixel, or -1 for "not drawn".  This is the whole colour
 *  rule of the game's picture drawer, scale_image2 (exe 4000:4818); everything that draws a
 *  .PIC file goes through it.  `base` is the colour-set base the drawer keeps in DS:4fc1 (a
 *  monster's is colorSet << 4) and `tint` is DS:4fbd.  `row` is the row the pixel lands on,
 *  which only the gradient values look at; the drawer counts it as the rectangle's top edge
 *  after it has been scaled to the screen, plus the row within the rectangle (exe 4000:4c7c).
 *
 *  Bases 0x20 and 0x40 are one rule written out twice (exe 4000:4bcc and 4000:4ce8).  Values
 *  1..27 land at v + base (4000:4c5c).  Value 28 is the tint: skipped when the tint equals the
 *  base (4000:4be5), and otherwise a palette entry in its own right, with no base added
 *  (4000:4c68).  Values 29 to 31 take no colour from the picture at all -- they read the
 *  96..255 gradient bank that gradient_palette (exe 4000:1150) builds, at the row wrapped to
 *  160: 30 counts up the bank (4000:4c76) and 29 and 31 count down it (4000:4c90).
 *
 *  Every other base below 0x100, negative ones included, substitutes in turn (exe 4000:4e04):
 *  17 becomes the tint, and is skipped when the tint is 0 (4000:4e18, 4000:4e93); then 16
 *  becomes 0 (4000:4e9f); then 18 becomes the second tint (4000:4eaa).  The steps run in that
 *  order, so a tint of 16 falls through the next one and lands on the base entry.  What is left
 *  lands at (v + base) & 0xff -- the base is added, as a byte, to a substituted tint as much as
 *  to anything else (4000:4ebe).
 *
 *  Base 0x100 adds 0x20 and base 0x101 adds 0x3f (exe 4000:4ee5 and 4000:4f1e); those two are
 *  the town buildings.  Any other base draws nothing. */
export function picturePixelIndex(v, row, base, tint) {
  if (v === 0) return -1;
  if (base === 0x20 || base === 0x40) {
    if (v < 28) return v + base;
    if (v === 28) return tint === base ? -1 : tint & 0xff;
    const gradientRow = row % 160;
    return v === 30 ? gradientRow + 0x60 : 0xff - gradientRow;
  }
  if (base >= 0x100) {
    if (base === 0x100) return (v + 0x20) & 0xff;
    if (base === 0x101) return (v + 0x3f) & 0xff;
    return -1;
  }
  if (v === 17 && tint === 0) return -1;
  if (v === 17) v = tint;
  if (v === 16) v = 0;
  if (v === 18) v = SECOND_TINT;
  return (v + base) & 0xff;
}

/** Final palette index for a MONSTER picture pixel: tint = monster.color, colorSet =
 *  monster.colorSet.  Both are read straight out of the 29-byte monster record before the
 *  picture is drawn, by draw_map_square (exe 3000:2848) and by monster_manual (exe 3000:c39d). */
export const monsterPixelIndex = (v, tint, colorSet, row) => picturePixelIndex(v, row, colorSet << 4, tint);

/** Final palette index for a BUILDING picture pixel: load_building_picture (exe 3000:974d) draws
 *  the four images in order with the bases 0x100, 0x101, 0x100, 0x101. */
export const buildingPixelIndex = (v, layer) => picturePixelIndex(v, 0, layer & 1 ? 0x101 : 0x100, 0);

/** Render one image into an ImageData-like {width,height,data: Uint8ClampedArray}.
 *  indexFn is given the pixel's value and its row, which some pixel values take their colour
 *  from; the picture is drawn at the top of the screen, so the row is the picture's own. */
export function renderImage(img, pal8, indexFn) {
  const data = new Uint8ClampedArray(PIC_W * PIC_H * 4);
  for (let i = 0; i < PIC_W * PIC_H; i++) {
    const idx = indexFn(img[i], (i / PIC_W) | 0);
    if (idx < 0) continue;
    const [r, g, b] = pal8[idx];
    data[i * 4] = r; data[i * 4 + 1] = g; data[i * 4 + 2] = b; data[i * 4 + 3] = 255;
  }
  return { width: PIC_W, height: PIC_H, data };
}

/** Picture index rules: built-in monster picnum p -> UFMON.PIC image p+2 (images 0,1 are the
 *  ladders); section monster picnum 7..10 -> UFMON<section>.PIC image picnum-7.
 *  Town building files: images [0,1] main picture (overlay, background), [2,3] right strip. */
export const builtinPictureIndex = picnum => picnum + 2;
export const sectionPictureIndex = picnum => picnum - 7;

/** Dungeon palette for a section.  Entries 64..79 are only ever written by the building
 *  palette: pass buildingBankB to get the "after visiting a shop" look (the usual one), or
 *  null for the fresh-session look where those entries are still black. */
export function dungeonPalette(palettes, buildingBankB, module, part, setting = BRIGHT_COLOURS) {
  const water = WATER_SECTIONS.includes((module - 1) * 4 + part);
  const p = dimPalette(palettes[`m${module}_s${part}_dungeon`], setting, water);
  if (buildingBankB) for (let i = 0; i < 16; i++) p[64 + i] = buildingBankB[i];
  return vgaToRgb(p);
}
