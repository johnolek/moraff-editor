import type { MapSquare } from '../map/game';
import { mwViewPictures } from '../play/mw/view3d/browser';
import { mwHorizonWeight } from '../play/mw/view3d/geometry';
import { renderMwView, type MwViewScene } from '../play/mw/view3d/render';
import { MW_WHOLE_SCREEN_VIEW, MW_SCREEN_MODE } from '../play/mw/view3d/screen';
import { BRICKS_TEXTURED, SIDE_OPEN, SIDE_WALL } from '../play/mw/view3d/wall';
import { newFrame, toRgba } from '../play/view3d/frame';
import type { MwMonster } from './monsters';
import { floorPalette, type RenderedImage } from './pictures';

/**
 * A Moraff's World monster drawn the way you meet it: standing one square ahead of you in a
 * corridor, through the game's own 3-D view. The Dungeons of the Unforgiven card does the same
 * thing in `src/lib/bestiary/corridor.ts`, off the same flood-fill renderer.
 *
 * The corridor is made up rather than found: a floor of solid rock with one straight passage cut
 * through it, so the picture does not depend on where the monster happens to be stocked.
 */

/** The picture's size, which is also how wide the card shows it, so its pixels stay square. */
export const CORRIDOR_WIDTH = 512;
export const CORRIDOR_HEIGHT = 384;

/** The game has no facing: all four views are compass directions. This is the one looking north. */
const NORTH = 0;

/** Where the character stands on the made-up floor. The square's own x and y are read for the
 *  wall decorations, so this being fixed is what keeps one floor's corridor the same from monster
 *  to monster. */
const STANDING = { x: 5, y: 5 };

/** How many squares of corridor are cut. The monster fills the view from the first of them, so
 *  the rest only show as the walls either side of it. */
const CORRIDOR_DEPTH = 4;

/** The height the horizon is weighed by: a human, whose race rolls around 70 inches. */
const EYE_HEIGHT_INCHES = 70;

/** Nothing on the made-up floor is a way up or down, or a building on the surface. */
const NOTHING_THERE = () => 0;

/** A square with a wall on all four sides, which is what solid rock is. */
const rock = (): MapSquare => ({
  n: SIDE_WALL,
  s: SIDE_WALL,
  w: SIDE_WALL,
  e: SIDE_WALL,
  solid: false,
  ladder: 0,
  chute: 0,
  trapdoor: -1,
});

/**
 * Solid rock with a corridor running north from where the character stands. Opening a square's
 * north side is what makes the way through to the square beyond it; leaving every west side shut
 * is what gives the corridor its walls.
 */
export function mwCorridorFloor(): MapSquare[][] {
  const size = STANDING.y + CORRIDOR_DEPTH + 2;
  const rows = Array.from({ length: size }, () => Array.from({ length: size }, rock));
  for (let step = 0; step < CORRIDOR_DEPTH; step++) rows[STANDING.y - step][STANDING.x].n = SIDE_OPEN;
  return rows;
}

/** What the view is drawn from: the made-up corridor, the floor's colours, and the monster
 *  standing one square ahead. */
export function mwCorridorScene(entry: MwMonster, floor: number): MwViewScene {
  return {
    rows: mwCorridorFloor(),
    at: STANDING,
    floor,
    // Only the hook Dungeons of the Unforgiven turned into its teleporters reads the dungeon
    // number, and in this game that hook draws nothing, so the card need not carry one.
    dungeon: 0,
    pictures: mwViewPictures(),
    bricks: BRICKS_TEXTURED,
    videoMode: MW_SCREEN_MODE.mode,
    screen: { width: CORRIDOR_WIDTH, height: CORRIDOR_HEIGHT },
    horizonWeight: mwHorizonWeight(EYE_HEIGHT_INCHES),
    monsters: [{ x: STANDING.x, y: STANDING.y - 1, picture: entry.picture, colour: entry.colour }],
    ladderAt: NOTHING_THERE,
    surfaceFeatureAt: NOTHING_THERE,
  };
}

/** The monster standing in a corridor of the floor the card is showing it on, or null when
 *  WORLD.PIC has no picture of it. */
export function renderMonsterInCorridor(entry: MwMonster, floor: number): RenderedImage | null {
  if (!mwViewPictures().monster(entry.picture)) return null;
  const frame = newFrame(CORRIDOR_WIDTH, CORRIDOR_HEIGHT);
  renderMwView(frame, mwCorridorScene(entry, floor), MW_WHOLE_SCREEN_VIEW, NORTH);
  return { width: CORRIDOR_WIDTH, height: CORRIDOR_HEIGHT, data: toRgba(frame, floorPalette(floor)) };
}
