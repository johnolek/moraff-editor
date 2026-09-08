#!/usr/bin/env node
// Render every image of UFWALL1..UFWALL4 to a PNG in the colours the game draws it in, and one
// contact sheet per file, into dotu-tools/pics/walls.
//
//   node dotu-tools/reference/scripts/render_walls.mjs [out-dir]
//
// A wall file is shared by several sections; each is drawn here in the palette of the first
// section that loads it, which for UFWALLn is section n, so the four sheets between them show
// all four of the game's wall colour sets.
//
// Images 0 to 5 (the two doors, the teleporter sign and the three wall materials) go through the
// wall drawer's own colour rule, FUN_4000_4f8f (exe 4000:53d1), which lifts a value below 16 into
// entries 16 to 31 — the section's own wall colours. Images 6 to 9, the floor and ceiling tiles,
// go through scale_image2 instead, with the base 0x50 draw_3d_view writes for them (exe
// 3000:0f75), which is entries 80 to 95. Both rules come from the code the Play tab draws with.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { encodePng } from './png.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const out = process.argv[2] ?? join(ROOT, 'dotu-tools', 'pics', 'walls');

const { createServer } = await import('vite');
const server = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const load = (p) => server.ssrLoadModule(`/src/lib/${p}`);

const { PIC_W, PIC_H, parsePic, dungeonPalette } = await load('game/dotu-pic.js');
const { wallPixelIndex } = await load('play/view3d/texture.ts');
const { picturePixelIndex, SKIP } = await load('play/view3d/scale.ts');
const { WALL_BASE, WALL_GRADIENT, WALL_TELEPORTER_SIGN, FLOOR_TILES } = await load('play/view3d/pictures.ts');
const { pixelFont, glyphRows } = await load('ui/pixel-font.ts');
const palettes = JSON.parse(readFileSync(join(ROOT, 'src', 'lib', 'game', 'palettes.json'), 'utf8'));

/** The tints FUN_3000_342d (exe 3000:342d) sets: 15 for the teleporter sign, 12 for everything else. */
const SIGN_TINT = 15;
const WALL_TINT = 12;

/** The floor and ceiling tiles are drawn by scale_image2 with the base draw_3d_view gives them. */
const TILE_BASE = 0x50;
const TILE_TINT = 0;

const face = pixelFont('tall');
const LABEL_HEIGHT = 18;
const BACKGROUND = [20, 20, 30];
const LABEL_COLOUR = [255, 220, 80];

/** One image as RGBA, with the pixels the drawer skips left transparent. */
function renderImage(image, index, palette) {
  const data = new Uint8ClampedArray(PIC_W * PIC_H * 4);
  for (let at = 0; at < PIC_W * PIC_H; at++) {
    const x = at % PIC_W;
    const row = (at / PIC_W) | 0;
    const entry = FLOOR_TILES.includes(index)
      ? picturePixelIndex(image[at], row, { base: TILE_BASE, tint: TILE_TINT })
      : wallPixelIndex(image[at], x, PIC_W, {
          base: WALL_BASE,
          tint: index === WALL_TELEPORTER_SIGN ? SIGN_TINT : WALL_TINT,
          gradient: WALL_GRADIENT,
        });
    if (entry === SKIP) continue;
    const [r, g, b] = palette[entry];
    data[at * 4] = r;
    data[at * 4 + 1] = g;
    data[at * 4 + 2] = b;
    data[at * 4 + 3] = 255;
  }
  return data;
}

/** A canvas the images and their labels are pasted onto. */
function sheet(width, height) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let at = 0; at < width * height; at++) {
    data[at * 4] = BACKGROUND[0];
    data[at * 4 + 1] = BACKGROUND[1];
    data[at * 4 + 2] = BACKGROUND[2];
    data[at * 4 + 3] = 255;
  }
  return {
    data,
    paste(image, left, top) {
      for (let row = 0; row < PIC_H; row++) {
        for (let x = 0; x < PIC_W; x++) {
          const from = (row * PIC_W + x) * 4;
          if (image[from + 3] === 0) continue;
          const to = ((top + row) * width + left + x) * 4;
          data.set(image.subarray(from, from + 4), to);
        }
      }
    },
    text(line, left, top) {
      for (let i = 0; i < line.length; i++) {
        glyphRows(face, line[i]).forEach((bits, row) => {
          for (let bit = 0; bits >> bit; bit++) {
            if (!(bits & (1 << bit))) continue;
            const at = ((top + row) * width + left + i * face.advance + bit) * 4;
            data.set(LABEL_COLOUR, at);
          }
        });
      }
    },
  };
}

mkdirSync(out, { recursive: true });
for (let file = 1; file <= 4; file++) {
  const name = `ufwall${file}.pic`;
  const { images } = parsePic(new Uint8Array(readFileSync(join(ROOT, 'src', 'lib', 'game', 'pics', name))));
  const palette = dungeonPalette(palettes, null, 1, file);
  const columns = 5;
  const rows = Math.ceil(images.length / columns);
  const page = sheet(PIC_W * columns, (PIC_H + LABEL_HEIGHT) * rows);
  images.forEach((image, index) => {
    const rgba = renderImage(image, index, palette);
    writeFileSync(join(out, `ufwall${file}_${String(index).padStart(2, '0')}.png`), encodePng(PIC_W, PIC_H, rgba));
    const left = (index % columns) * PIC_W;
    const top = ((index / columns) | 0) * (PIC_H + LABEL_HEIGHT);
    page.text(`ufwall${file} image ${index} (palette: section ${file})`, left + 4, top + 3);
    page.paste(rgba, left, top + LABEL_HEIGHT);
  });
  writeFileSync(
    join(out, `_sheet_ufwall${file}.png`),
    encodePng(PIC_W * columns, (PIC_H + LABEL_HEIGHT) * rows, page.data),
  );
  console.log(`${name}: ${images.length} images in section ${file}'s colours`);
}
await server.close();
