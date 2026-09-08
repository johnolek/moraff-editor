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

/**
 * Which of the four wall files each of the twenty sections is drawn from: the name table at
 * DS:02ef that `load_section_pictures` (exe 2000:372c) indexes with the section number. The
 * entry for section 1 doubles as the file the game falls back on when a section's own is
 * missing. `src/lib/map/wall-texture.ts` has the same table for the map's wall swatch.
 */
export const WALL_FILES = [1, 2, 3, 4, 2, 3, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 3, 2, 1, 4];

/** The wall file a section is drawn with, by section 1..20. */
export const wallPictureFile = (section: number): string => `ufwall${WALL_FILES[section - 1] ?? 1}.pic`;

/** A picture set with nothing in it, which draws the view in flat colours. */
export const NO_PICTURES: ViewPictures = {
  wall: null,
  overlay: null,
  monster: () => null,
  ladder: () => null,
};
