import { fillRect, drawLine, type Frame } from '../../view3d/frame';
import { floodBothHalves, type FloodContext, type WallFace } from '../../view3d/flood';
import { SKIP, scaleImage } from '../../view3d/scale';
import type { ViewRect } from '../../view3d/geometry';
import {
  MW_VIEW_REACH,
  ftol,
  horizonRow,
  mwProjectSquare,
  slotNarrowing,
  type SquarePlace,
  type ViewFrame,
} from './geometry';
import { drawMwWall, BRICKS_TEXTURED, SIDE_OPEN, type MwWallScene } from './wall';

/**
 * FUN_3000_1a08 (WORLD.EXE 3000:1a08, mw.c "FUN_3000_1a08"): one of the four views.
 *
 * It paints the floor and the ceiling, then walks forward a square at a time, drawing the wall
 * ahead and pouring the frustum out to each side, and stops at the first side it cannot see
 * through. It then walks back drawing what stands on the squares straight ahead — far to near, so
 * the nearer ones paint over the further — and finally draws the monster on the next square over
 * at nearly the height of the view.
 *
 * The walk itself is `src/lib/play/view3d/flood.ts`, which is Dungeons of the Unforgiven's port of
 * the same pair of mutually recursive functions: FUN_3000_0b3b and FUN_3000_12ca here, 3000:00a8
 * and 3000:0837 there. They agree down to the 650-call budget and the odd detail that the left
 * half works its texture percentages out in floating point where the right half uses integers.
 */

/** A monster the view may draw, as the floor's own record holds it. */
export interface MwViewMonster {
  x: number;
  y: number;
  /** The picture number in the monster's record, at DS:0237 + type * 35 + 34. */
  picture: number;
  /** Its colour byte, which every pixel of value 17 is drawn in. */
  colour: number;
}

export interface MwViewScene extends Omit<MwWallScene, 'facing'> {
  /** DS:43aa: the character's height in inches over five, plus six. */
  horizonWeight: number;
  monsters: MwViewMonster[];
  /** `ladder_delta` (exe 3000:a449) for a square: above zero a way down, below it a way up. */
  ladderAt(x: number, y: number): number;
}

/** The view came back blocked: a wall stands right in front of the character. */
export const MW_VIEW_BLOCKED = -1;

/**
 * `draw_picture` (WORLD.EXE 3000:0105, mw.c "draw_picture") substitutes colours by a simpler rule
 * than the later game's: value 0 is not drawn, 16 is black, 17 is the monster's own colour byte
 * unless that byte is 32, and everything else is a palette entry already. Nothing is added to it —
 * the offset at DGROUP 0x43a2 is written once, with zero, and never again.
 *
 * This is the rule `src/lib/mw-bestiary/pictures.ts` already draws the bestiary's monsters with.
 */
const MW_UNDRAWN_COLOUR = 32;

export function mwPicturePixel(value: number, _row: number, colours: { tint: number }): number {
  if (value === 0) return SKIP;
  if (value === 17) return colours.tint === MW_UNDRAWN_COLOUR ? SKIP : colours.tint;
  if (value === 16) return 0;
  return value;
}

/** Draw one view. `view` is 0 north, 1 south, 2 west, 3 east, and `rect` where it goes. */
export function renderMwView(frame: Frame, scene: MwViewScene, rect: ViewRect, view: number): number {
  const frameOf: ViewFrame = { ...rect, horizonWeight: scene.horizonWeight, facing: view, at: scene.at };
  const wallScene: MwWallScene = { ...scene, facing: view };
  const width = rect.right - rect.left;
  const height = rect.bottom - rect.top;

  const context: FloodContext = {
    view: frameOf,
    wall: (face: WallFace) => drawMwWall(frame, wallScene, face),
    square: (x1, z1, x2, z2, leftX, rightX) => drawSquare(frame, scene, frameOf, x1, z1, x2, z2, leftX, rightX),
  };

  let reached = 0;
  for (let depth = 0; depth < MW_VIEW_REACH; depth++) {
    const across = slotNarrowing(width, depth);
    const down = slotNarrowing(height, depth);
    if (depth === 0 && sideAhead(scene, view) === SIDE_OPEN) {
      drawFloorAndCeiling(frame, scene, frameOf, rect, view);
    }
    const open = drawMwWall(frame, wallScene, {
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
      if (depth === 0) return MW_VIEW_BLOCKED;
      break;
    }
    reached = depth + 1;
    floodBothHalves(context, depth);
  }

  // Far to near, so a nearer square paints over a further one.
  for (let depth = reached; depth > 0; depth--) {
    const across = slotNarrowing(width, depth);
    drawSquare(
      frame,
      scene,
      frameOf,
      -0.5,
      depth + 0.5,
      0.5,
      depth + 0.5,
      ftol(rect.left + across),
      ftol(rect.right - across),
    );
  }

  drawAdjacentMonster(frame, scene, rect, view, width);
  return 0;
}

/** `wall_side` for the side this view looks through from the character's own square. */
function sideAhead(scene: MwViewScene, view: number): number {
  const { x, y } = scene.at;
  const here = scene.rows[y]?.[x];
  if (!here) return 0;
  if (view === 0) return here.n;
  if (view === 1) return scene.rows[y + 1]?.[x]?.n ?? 0;
  if (view === 2) return here.w;
  return scene.rows[y]?.[x + 1]?.w ?? 0;
}

/**
 * The ceiling and the floor, which the original paints as rows of chevrons converging on the
 * vanishing point rather than as any kind of flat fill.
 *
 * Each row's distance `t` is worked out in floor-tile units, and its parity picks between palette
 * entries 26 and 27 — the sixth step of the two ramps `set_palette` (exe 4000:10ee) fills the
 * floor's wall colours from, so the ground is always drawn in the same two colours as the walls.
 * Within a row the bands step outward from the middle of the view, `local_a` wide and alternating,
 * until they reach its left edge. The parity is nudged by the character's own x or y, which is what
 * makes the pattern move as they walk.
 *
 * Near the horizon, where a band would be narrower than a sixty-fourth of the screen, the row is
 * laid flat instead; on a screen under 370 pixels wide every row is.
 */
function drawFloorAndCeiling(
  frame: Frame,
  scene: MwViewScene,
  view: ViewFrame,
  rect: ViewRect,
  which: number,
): void {
  const maxX = scene.screen.width - 1;
  const maxY = scene.screen.height - 1;
  const left = Math.trunc((maxX * rect.left) / 0x63f);
  const right = Math.trunc((maxX * rect.right) / 0x63f);
  const top = Math.trunc((maxY * rect.top) / 0x4af);
  const bottom = Math.trunc((maxY * rect.bottom) / 0x4af);
  const horizon = (view.horizonWeight * top + (32 - view.horizonWeight) * bottom) >> 5;

  if (scene.videoMode < 2 || scene.bricks !== BRICKS_TEXTURED) {
    fillRect(frame, left, top, right, bottom, 0);
    return;
  }

  const centre = (left + right) >> 1;
  const flatBelow = maxX >> 6;
  const banded = maxX >= 0x172;
  // The parity is stepped by the character's own square, so the ground shifts as they walk.
  const nudge = (which < 2 && scene.at.y % 2 === 0) || (which > 1 && scene.at.x % 2 === 1) ? 1 : 0;

  for (const ceiling of [true, false]) {
    const edgeRow = ceiling ? top : bottom;
    const from = ceiling ? top : horizon;
    const to = ceiling ? horizon - 1 : bottom;
    for (let y = from; y <= to; y++) {
      // How far off this row is, in floor tiles: about one at the edge of the view, growing
      // without bound as the row approaches the horizon.
      const step = short(y - horizon + (ceiling ? -1 : 1));
      if (step === 0) continue;
      const tile = Math.trunc(short(Math.trunc(short(short(edgeRow - horizon) * 4) / step)) / 3) + nudge;
      let colour = tile % 2 === 1 ? 0x1b : 0x1a;

      const span = ceiling ? horizon - y : y - horizon;
      const reach = ceiling ? horizon - top : bottom - horizon;
      const half = reach === 0 ? 0 : Math.trunc((span * ((right - left) >> 1)) / reach);
      if (half < flatBelow || !banded) {
        drawLine(frame, left, y, right, y, colour);
        continue;
      }

      let inner = half >> 1;
      drawLine(frame, centre - inner, y, centre + inner, y, colour);
      const edge = centre - left - 1;
      for (;;) {
        colour = colour === 0x1b ? 0x1a : 0x1b;
        let outer = inner + half;
        if (centre - outer <= left) outer = edge;
        drawLine(frame, centre + inner, y, centre + outer, y, colour);
        drawLine(frame, centre - outer, y, centre - inner, y, colour);
        if (outer === edge) break;
        inner = outer;
      }
    }
  }
}

/** Truncate to a signed 16-bit int, which the original's arithmetic leans on. */
const short = (x: number): number => (x << 16) >> 16;

/**
 * The part of FUN_3000_2796 (exe 3000:2796) that draws: the monster standing on the square, and
 * the ladder mark under or over it.
 *
 * The square right in front of the character is left alone here — FUN_3000_1a08 draws that
 * monster itself, at nearly the height of the view.
 */
function drawSquare(
  frame: Frame,
  scene: MwViewScene,
  view: ViewFrame,
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  leftX: number,
  rightX: number,
): void {
  const face = mwProjectSquare(x1, z1, x2, z2, leftX, rightX, view);
  if (!face) return;

  const adjacent = x1 === -0.5 && z1 === 1.5;
  const from = Math.trunc(face.from * 255);
  const to = Math.trunc(face.to * 255);
  const options = (tint: number) => ({
    screen: scene.screen,
    colours: { base: 0, tint },
    pixel: mwPicturePixel,
  });

  if (!adjacent) {
    const monster = scene.monsters.find((m) => m.x === face.square.x && m.y === face.square.y);
    const picture = monster && scene.pictures.monster(monster.picture);
    if (monster && picture) {
      scaleImage(frame, face.left, face.top, face.right, face.bottom, picture, from, to, options(monster.colour));
    }
  }

  if (face.from === face.to) return;
  const ladder = scene.ladderAt(face.square.x, face.square.y);
  if (ladder === 0) return;
  const picture = scene.pictures.ladder(ladder > 0);
  if (!picture) return;
  // A way down is marked on the floor of the square and a way up on its ceiling.
  const top = ladder > 0 ? Math.trunc((face.top + face.bottom * 2) / 3) : face.top;
  const bottom = ladder > 0 ? face.bottom : Math.trunc((face.top * 2 + face.bottom) / 3);
  scaleImage(frame, face.left, top, face.right, bottom, picture, from, to, options(0));
}

/**
 * The monster on the square the view looks straight at, which FUN_3000_1a08 draws itself rather
 * than leaving to the square painter: inset a ninth of the view's width on each side, from an
 * eighth of the way down to fifteen units short of the bottom, which comes to about six sevenths
 * of the view's height.
 */
function drawAdjacentMonster(
  frame: Frame,
  scene: MwViewScene,
  rect: ViewRect,
  view: number,
  width: number,
): void {
  const ahead = squareAhead(scene.at, view);
  const monster = scene.monsters.find((m) => m.x === ahead.x && m.y === ahead.y);
  if (!monster) return;
  const picture = scene.pictures.monster(monster.picture);
  if (!picture) return;

  const inset = slotNarrowing(width, 1) / 3;
  scaleImage(
    frame,
    ftol(rect.left + inset),
    (rect.bottom + 7 * rect.top) >> 3,
    ftol(rect.right - inset),
    rect.bottom - 15,
    picture,
    0,
    255,
    { screen: scene.screen, colours: { base: 0, tint: monster.colour }, pixel: mwPicturePixel },
  );
}

/** The square one step the way a view looks. */
function squareAhead(at: SquarePlace, view: number): SquarePlace {
  if (view === 0) return { x: at.x, y: at.y - 1 };
  if (view === 1) return { x: at.x, y: at.y + 1 };
  if (view === 2) return { x: at.x - 1, y: at.y };
  return { x: at.x + 1, y: at.y };
}
