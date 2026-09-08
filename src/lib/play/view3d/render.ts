import { fillRect, type Frame } from './frame';
import { floodBothHalves, type FloodContext, type WallFace } from './flood';
import {
  VIEW_REACH,
  ftol,
  horizonRow,
  projectSquare,
  slotNarrowing,
  type ViewFrame,
  type ViewRect,
} from './geometry';
import { FLOOR_TILES, floorTilePair } from './pictures';
import { scaleImage } from './scale';
import { drawWall, DETAIL_TEXTURED, type WallScene } from './wall';
import { FOUR_VIEWS, viewFacing } from './views';

/**
 * `draw_3d_view` (exe 3000:0f75): one of the four corridor views. It walks forward a square at a
 * time drawing the wall ahead and flooding the view out to each side, stops at the first side it
 * cannot see through, and then walks back drawing what stands on the squares straight ahead — far
 * to near, so the nearer ones paint over the further.
 */

/** A monster the view may draw, as its record holds it. */
export interface ViewMonster {
  x: number;
  y: number;
  picnum: number;
  /** Whether it is one of the 22 built-ins rather than one of the section's own four. */
  builtin: boolean;
  /** The record's `color` byte. */
  colour: number;
  colorSet: number;
}

export interface ViewScene extends Omit<WallScene, 'facing'> {
  /** DS:b8bd: the character's height, which is where the horizon sits. */
  horizonWeight: number;
  /** DS:c02e: the way the character faces, which the floor tiles are picked by whichever of the
   *  four views is being drawn. */
  dir: number;
  monsters: ViewMonster[];
  /** The three water sections draw the built-in monsters short, with the overlay over them. */
  water: boolean;
  /** The coin flip the view mirrors the monster ahead on, fresh for every draw. */
  random?: () => number;
}

/** The view came back blocked: the character is facing a wall from right up against it. */
export const VIEW_BLOCKED = -1;

/**
 * Draw one view. `facing` is which way this view looks (0 north, 1 south, 2 west, 3 east) and
 * `rect` where on the 1600 x 1200 screen it goes.
 */
export function renderView(frame: Frame, scene: ViewScene, rect: ViewRect, facing: number): number {
  const view: ViewFrame = { ...rect, horizonWeight: scene.horizonWeight, facing, at: scene.at };
  const wallScene: WallScene = { ...scene, facing };
  const width = rect.right - rect.left;
  const height = rect.bottom - rect.top;

  const context: FloodContext = {
    view,
    wall: (face: WallFace) => drawWall(frame, wallScene, face),
    square: (x1, z1, x2, z2, leftX, rightX) => drawSquare(frame, scene, view, x1, z1, x2, z2, leftX, rightX),
  };

  let reached = 0;
  for (let depth = 0; depth < VIEW_REACH; depth++) {
    const across = slotNarrowing(width, depth);
    const down = slotNarrowing(height, depth);
    if (depth === 0) {
      // The floor and the ceiling go down once, and only when the way ahead is open: a wall right
      // in front of you fills the view on its own.
      const ahead = sideAhead(scene, facing);
      if (ahead === 3 || scene.detail > 1) drawFloorAndCeiling(frame, scene, view, rect);
    }
    const open = drawWall(frame, wallScene, {
      cellX: 0,
      cellZ: -depth,
      kind: 0,
      leftX: ftol(rect.left + across),
      rightX: ftol(rect.right - across),
      topNear: ftol(rect.top + ((32 - scene.horizonWeight) * down) / 16),
      bottomNear: ftol(rect.bottom - (scene.horizonWeight * down) / 16),
      topFar: 0,
      bottomFar: 0,
      pctLeft: 0,
      pctRight: 99,
    });
    if (!open) {
      if (depth === 0) return VIEW_BLOCKED;
      break;
    }
    reached = depth + 1;
    floodBothHalves(context, depth);
  }

  for (let depth = reached; depth > 0; depth--) {
    const across = slotNarrowing(width, depth);
    drawSquare(
      frame,
      scene,
      view,
      -0.5,
      depth + 0.5,
      0.5,
      depth + 0.5,
      ftol(rect.left + across),
      ftol(rect.right - across),
    );
  }
  return 0;
}

/**
 * The four views of one screen, drawn into one frame: `FUN_2000_ac9e` (exe 2000:ac9e) calls
 * `draw_3d_view` once for the way the character faces and once for each of the other three.
 */
export function renderFourViews(frame: Frame, scene: ViewScene, facing: number): void {
  const party = { ...scene, dir: facing };
  for (const view of FOUR_VIEWS) renderView(frame, party, view.rect, viewFacing(view.name, facing));
}

/** `retdwall` for the side the view looks through from the character's own square. */
function sideAhead(scene: ViewScene, facing: number): number {
  const { x, y } = scene.at;
  const here = scene.rows[y]?.[x];
  if (!here) return 0;
  if (facing === 0) return here.n;
  if (facing === 1) return scene.rows[y + 1]?.[x]?.n ?? 0;
  if (facing === 2) return here.w;
  return scene.rows[y]?.[x + 1]?.w ?? 0;
}

/**
 * The floor and the ceiling, each laid as two bands mirrored about the middle of the view. Which
 * pair of the wall file's four tiles is used turns over with every step, which is what makes the
 * floor change as you walk.
 *
 * Without the wall pictures in the bundle there are no tiles, and the two halves are filled flat.
 * The original's own banded gradient for that case (`draw_3d_view`'s DS:2322 branch) is not
 * ported.
 */
function drawFloorAndCeiling(frame: Frame, scene: ViewScene, view: ViewFrame, rect: ViewRect): void {
  const horizon = horizonRow(view);
  const midX = (rect.left + rect.right) >> 1;
  const wall = scene.pictures.wall;

  if (!wall || scene.detail !== DETAIL_TEXTURED) {
    const screen = scene.screen;
    const toX = (x: number) => Math.trunc(((screen.width - 1) * x) / 1599);
    const toY = (y: number) => Math.trunc(((screen.height - 1) * y) / 1199);
    fillRect(frame, toX(rect.left), toY(rect.top), toX(rect.right), toY(horizon), 0);
    fillRect(frame, toX(rect.left), toY(horizon), toX(rect.right), toY(rect.bottom), 0);
    return;
  }

  const pair = floorTilePair(scene.at.x, scene.at.y, scene.dir);
  const distant = wall[FLOOR_TILES[pair + 1]];
  const underfoot = wall[FLOOR_TILES[pair]];
  // The tiles carry no pixel the tint or the transparent value could stand in for, so the colour
  // the last wall face left in DS:4fbd — which this pass does not set — cannot reach them.
  const options = { screen: scene.screen, colours: { base: 0x50, tint: 0 } };
  const third = (a: number, b: number) => Math.trunc((2 * a + b) / 3);

  // The square underfoot fills the two thirds of the band nearest the edge of the view and
  // everything beyond it is crammed into the third by the horizon. Each is drawn twice, mirrored
  // about the middle of the view.
  for (const edge of [rect.top, rect.bottom]) {
    const bend = third(horizon, edge);
    for (const [x1, x2] of [
      [midX, rect.right],
      [midX, rect.left],
    ]) {
      if (distant) scaleImage(frame, x1, horizon, x2, bend, distant, 0, 246, options);
      if (underfoot) scaleImage(frame, x1, bend, x2, edge, underfoot, 0, 251, options);
    }
  }
}

/**
 * The part of `draw_map_square` (exe 3000:2848) that draws: the monster standing on the square,
 * mirrored when the square's own x is odd, and the ladder mark under it.
 */
function drawSquare(
  frame: Frame,
  scene: ViewScene,
  view: ViewFrame,
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  leftX: number,
  rightX: number,
): void {
  const face = projectSquare(x1, z1, x2, z2, leftX, rightX, view);
  if (!face) return;

  const monster = scene.monsters.find((m) => m.x === face.square.x && m.y === face.square.y);
  if (monster) {
    const picture = scene.pictures.monster(monster.picnum, monster.builtin);
    if (picture) {
      const mirrored = (ftol(face.square.x) & 1) === 1;
      const from = mirrored ? Math.trunc(255 - face.to * 255) : Math.trunc(face.from * 255);
      const to = mirrored ? Math.trunc(255 - face.from * 255) : Math.trunc(face.to * 255);
      scaleImage(
        frame,
        mirrored ? face.right : face.left,
        face.top,
        mirrored ? face.left : face.right,
        face.bottom,
        picture,
        from,
        to,
        {
          screen: scene.screen,
          rows: scene.water && monster.builtin ? 140 : 200,
          colours: { base: monster.colorSet << 4, tint: monster.colour },
        },
      );
    }
  }

  const square = scene.rows[face.square.y]?.[face.square.x];
  if (!square || face.from === face.to) return;
  if (square.ladder !== 0) {
    const picture = scene.pictures.ladder(square.ladder > 0);
    if (!picture) return;
    // A ladder down is marked on the floor of the square, a ladder up on its ceiling.
    const top = square.ladder > 0 ? Math.trunc((face.top + face.bottom * 2) / 3) : face.top;
    const bottom = square.ladder > 0 ? face.bottom : Math.trunc((face.top * 2 + face.bottom) / 3);
    scaleImage(frame, face.left, top, face.right, bottom, picture, Math.trunc(face.from * 255), Math.trunc(face.to * 255), {
      screen: scene.screen,
      colours: { base: 0, tint: 0 },
    });
  }
}
