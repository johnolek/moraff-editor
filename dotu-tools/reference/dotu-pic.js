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

/** Final palette index for a MONSTER picture pixel (scale_image2 with colour set < 0x100).
 *  Returns -1 for "not drawn".  tint = monster.color, colorSet = monster.colorSet.
 *  Shadow bosses have tint 32 with colour set 2, so their tint pixels land on palette entry
 *  64 — a bank the dungeon palette never writes: black until a shop palette has been
 *  applied this session, then that shop's colours (see PICTURES.md). */
export function monsterPixelIndex(v, tint, colorSet) {
  if (v === 0) return -1;
  if (v === 17) { if (tint === 0) return -1; v = tint; }      // a tint of 0 skips the pixel
  if (v === 16 || v === 18) v = 0;
  return (v + (colorSet << 4)) & 0xff;
}
/** Final palette index for a BUILDING picture pixel: layer 0/2 use +0x20, layers 1/3 use +0x3f. */
export const buildingPixelIndex = (v, layer) => (v === 0 ? -1 : (v + (layer & 1 ? 0x3f : 0x20)) & 0xff);

/** Render one image into an ImageData-like {width,height,data: Uint8ClampedArray}. */
export function renderImage(img, pal8, indexFn) {
  const data = new Uint8ClampedArray(PIC_W * PIC_H * 4);
  for (let i = 0; i < PIC_W * PIC_H; i++) {
    const idx = indexFn(img[i]);
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
export function dungeonPalette(palettes, buildingBankB, module, part) {
  const p = palettes[`m${module}_s${part}_dungeon`].map(c => c.slice());
  if (buildingBankB) for (let i = 0; i < 16; i++) p[64 + i] = buildingBankB[i];
  return vgaToRgb(p);
}
