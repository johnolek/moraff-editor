import type { PicRowImage } from '../../view3d/texture';

/**
 * The pictures Moraff's World's 3-D view draws with.
 *
 * The renderer is handed one of these rather than reaching for the files itself, so the same code
 * runs in the browser, where Vite inlines the pictures, and under Node, where a script reads them
 * off disk. Dungeons of the Unforgiven's view is handed the same shape.
 */

/**
 * WALL.PIC holds two images. `load_world_pic` (WORLD.EXE 2000:27b8, mw.c "load_world_pic") stores
 * a far pointer to each in the array at DGROUP 0xca32, and FUN_3000_31f3 (exe 3000:31f3) draws
 * the first on a door and the second on every other side.
 */
export const WALL_DOOR = 0;
export const WALL_STONE = 1;

/**
 * How far across the wall picture a face reaches. FUN_3000_31f3 hands `draw_wall_picture` the
 * face's own 0..99 span doubled for a door and quadrupled for a wall, so a wall's material
 * repeats twice across a face that fills the view and a door's does not repeat at all.
 */
export const DOOR_REPEAT = 2;
export const STONE_REPEAT = 4;

/**
 * The palette entries a wall pixel and a monster pixel are drawn in.
 *
 * `draw_wall_picture` (exe 3000:04d3) adds DGROUP 0x43a4 to every value below 16, and that byte
 * holds 16 and is never written, so a wall's sixteen pixel values land on palette entries 16 to
 * 31 — which is exactly the block `set_palette` (exe 4000:10ee) refills for every floor.
 */
export const WALL_BASE = 16;

/**
 * What value 17 comes out as. FUN_3000_31f3 writes 12 into DGROUP 0x43a0 before each of its two
 * `draw_wall_picture` calls.
 */
export const WALL_TINT = 12;

/**
 * The first entry of the gradient bank values 18 and 19 read (`draw_wall_picture` adds 0x40).
 * WALL.PIC has no pixel above 15, so nothing in this game is ever drawn from it.
 */
export const WALL_GRADIENT = 0x40;

/** Everything the view draws that comes out of a `.PIC` file. */
export interface MwViewPictures {
  /** WALL.PIC's two images, or null when the bundle has no wall picture. */
  wall: PicRowImage[] | null;
  /** A monster's picture, by the picture number in its record. */
  monster(picture: number): PicRowImage | null;
  /** The two ladder marks, WORLD.PIC images 0 and 1. */
  ladder(down: boolean): PicRowImage | null;
}

/** A picture set with nothing in it, which draws the view in flat colours. */
export const NO_MW_PICTURES: MwViewPictures = {
  wall: null,
  monster: () => null,
  ladder: () => null,
};
