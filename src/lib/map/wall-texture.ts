import type { GameId } from '../app-state.svelte';
import { bundledPictureImages, sectionPalette, type RenderedImage } from '../bestiary/pictures';
import { monsterPixelIndex, renderImage, vgaToRgb, type PicImage, type Rgb } from '../game/dotu-pic.js';
import mwPalettes from '../game/mw-palettes.json';
import { sectionInfo } from '../game/sections';
import { wallImages as moraffsWorldWallImages } from '../mw-bestiary/pictures';
import { wallPictureFile } from '../game/port/pictures';

/**
 * The texture the 3-D view would draw this floor's walls with.
 *
 * Both games keep their wall pictures in .pic files the site already bundles, and in both the
 * walls change with depth: Dungeons of the Unforgiven loads one of four wall pictures for each
 * section, and Moraff's World keeps one wall picture and recolours it on every floor.
 */
export interface WallTexture {
  /** The picture file the game loads for this floor. */
  file: string;
  /** The image of that file the wall faces are drawn from. */
  image: number;
  /** What the swatch is labelled with. */
  caption: string;
  /** Everything the drawing depends on, so a texture already drawn can be kept. */
  key: string;
  /** The palette the game draws it in. */
  palette: Rgb[];
  /** The palette entry one pixel value takes on one row, or -1 where the pixel is not drawn. */
  pixelIndex: (value: number, row: number) => number;
  /** The images of the file, or null when the site does not bundle it. */
  images: () => PicImage[] | null;
}


/**
 * A wall picture holds a door, a portcullis, the teleporter sign, three wall materials and four
 * floor and ceiling tiles. FUN_3000_342d (exe 3000:342d) picks between the three materials by a
 * count of the square's own coordinates, so any of them can stand for the floor and the first
 * one does.
 */
const UNFORGIVEN_WALL_IMAGE = 3;

/** Walls are drawn from colour set 5, palette entries 80 to 95 (exe 3000:342d writes 0x50). */
const UNFORGIVEN_WALL_COLOUR_SET = 5;

/** The tint FUN_3000_342d (exe 3000:342d) sets before it draws a wall face. */
const UNFORGIVEN_WALL_TINT = 12;

/**
 * WALL.PIC holds a door and a wall, and FUN_3000_31f3 (exe 3000:31f3, mw.c) draws the second on
 * every side that is not a door.
 */
const MORAFFS_WORLD_WALL_IMAGE = 1;

/**
 * A wall pixel is drawn in the floor's own wall colours: draw_wall_picture (exe 3000:04d3, mw.c
 * "draw_wall_picture") adds DGROUP 0x43a4, which is 16 and is never written, to every value
 * below 16, and set_palette fills entries 16 to 31 from one of eleven sets.
 */
const MORAFFS_WORLD_WALL_BASE = 16;

/** How many wall colour sets set_palette (exe 4000:10ee) rotates through. */
const MORAFFS_WORLD_WALL_SETS = mwPalettes.palettes.length;

function unforgivenWallTexture(module: number, floor: number): WallTexture | null {
  const section = sectionInfo(module, floor);
  if (!section) return null;
  const file = wallPictureFile(section.section);
  return {
    file,
    image: UNFORGIVEN_WALL_IMAGE,
    caption: `Section ${section.section} walls, from ${file}`,
    key: `unforgiven:${file}:${module}:${section.part}`,
    palette: sectionPalette(module + 1, section.part),
    pixelIndex: (value, row) => monsterPixelIndex(value, UNFORGIVEN_WALL_TINT, UNFORGIVEN_WALL_COLOUR_SET, row),
    images: () => bundledPictureImages(file),
  };
}

function moraffsWorldWallTexture(floor: number): WallTexture {
  const set = ((floor % MORAFFS_WORLD_WALL_SETS) + MORAFFS_WORLD_WALL_SETS) % MORAFFS_WORLD_WALL_SETS;
  return {
    file: 'wall.pic',
    image: MORAFFS_WORLD_WALL_IMAGE,
    caption: `Floor ${floor} walls, colour set ${set + 1} of ${MORAFFS_WORLD_WALL_SETS}`,
    key: `moraffsWorld:${set}`,
    palette: vgaToRgb(mwPalettes.palettes[set]),
    pixelIndex: (value) => value + MORAFFS_WORLD_WALL_BASE,
    images: moraffsWorldWallImages,
  };
}

/**
 * The wall texture of one floor, or null for a floor with none: the floors below Dungeons of the
 * Unforgiven's town belong to no section, and Moraff's Revenge draws no walls at all.
 */
export function wallTexture(game: GameId, dungeon: number, floor: number): WallTexture | null {
  if (game === 'unforgiven') return unforgivenWallTexture(dungeon, floor);
  if (game === 'moraffsWorld') return moraffsWorldWallTexture(floor);
  return null;
}

const drawn = new Map<string, RenderedImage>();

/** The texture as the game draws it, at its own 256 by 200 pixels, or null when the site does
 *  not bundle the picture file it comes from. */
export function renderWallTexture(texture: WallTexture): RenderedImage | null {
  const cached = drawn.get(texture.key);
  if (cached) return cached;
  const images = texture.images();
  if (!images) return null;
  const image = renderImage(images[texture.image], texture.palette, texture.pixelIndex);
  drawn.set(texture.key, image);
  return image;
}
