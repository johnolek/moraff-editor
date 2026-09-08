import type { ScreenLine } from '../game/port/state';

/**
 * The whole screen `movecontrol` (exe 2000:c308) keeps up while the game is played: the four 3-D
 * views, the boxes around them and the blocks of text on them.
 *
 * Everything is placed in the 1600 x 1200 grid the game draws in whatever the video mode, which
 * is the grid `src/lib/ui/GameScreen.svelte` positions text in and the one the view rectangles in
 * `view3d/geometry.ts` are given in. `dotu-tools/docs/SCREEN.md` is the same screen described
 * from a photograph of the real thing.
 */

/** The whole of it, for a `GameScreen` that lies over the drawing. */
export const SCREEN_WINDOW = { x: 0, y: 0, width: 1600, height: 1200 };

/** The pixels the game's 640 x 480 mode has, which is what the drawing is done at. */
export const SCREEN_PIXELS = { width: 640, height: 480 };

/** A box on the screen, in those same units. Both edges are inside it. */
export interface ScreenBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
  colour: number;
}

/** Where a screen line goes, once its text is known. */
export type LinePlace = Omit<ScreenLine, 'text'>;
