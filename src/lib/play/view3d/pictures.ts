import type { PicRowImage } from './texture';

/**
 * The ten images of a `ufwall<part>.pic`, in the order `load_section_pictures` (exe 2000:372c)
 * loads them. `dotu-tools/pics/walls/_sheet_ufwall1.png` is the whole file drawn out.
 */
export const WALL_DOOR = 0;
export const WALL_SECRET = 1;
export const WALL_TELEPORTER_SIGN = 2;
/** The three materials a plain wall is drawn with. */
export const WALL_MATERIALS = [3, 4, 5] as const;
/**
 * The four perspective tiles the floor and ceiling are laid with. `draw_3d_view` uses them in
 * pairs, picking the pair by the parity of the character's x + y so the floor changes as you walk.
 */
export const FLOOR_TILES = [6, 7, 8, 9] as const;

/**
 * Everything the 3-D view draws that comes out of a `.PIC` file. The renderer is handed one of
 * these rather than reaching for the files itself, so the same code runs in the browser (where
 * Vite inlines the pictures) and under Node (where a script reads them off disk).
 */
export interface ViewPictures {
  /**
   * The ten images of the section's wall file, or null when the bundle has no wall pictures. The
   * view falls back to flat fills of the section's own wall colours when this is null.
   */
  wall: PicRowImage[] | null;
  /** `overlay.pic`, drawn over the bottom of a monster in the three water sections. */
  overlay: PicRowImage[] | null;
  /** A monster's picture, by the picture number and colour set in its record. */
  monster(picnum: number, builtin: boolean): PicRowImage | null;
  /** The two ladder marks, `ufmon.pic` images 0 (down) and 1 (up). */
  ladder(down: boolean): PicRowImage | null;
}

/** The wall file a section is drawn with: one per section-within-module. */
export const wallPictureFile = (part: number): string => `ufwall${part}.pic`;

/** A picture set with nothing in it, which draws the view in flat colours. */
export const NO_PICTURES: ViewPictures = {
  wall: null,
  overlay: null,
  monster: () => null,
  ladder: () => null,
};
