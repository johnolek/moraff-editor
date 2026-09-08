import { fillRect, drawLine, plot, type Frame } from '../../view3d/frame';
import { floodBothHalves, type FloodContext, type WallFace } from '../../view3d/flood';
import { SKIP, scaleImage } from '../../view3d/scale';
import type { PicRowImage } from '../../view3d/texture';
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
import { MW_SCREEN_MODE } from './screen';
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
  /** `surface_feature` (exe 2000:7c2d): 1 store, 2 temple, 3 bank, 4 inn, 5 the gate, 0 none.
   *  Only floor 0 reads it. */
  surfaceFeatureAt(x: number, y: number): number;
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
 *
 * Video mode 9 — the 1024 by 768 in 256 colours the port runs in — paints the same chevrons in
 * different colours: {@link stepGround} walks a palette ramp a band at a time instead of
 * flipping between two entries, and every band is a two-pixel dither of that colour against the
 * row's own. That is the flat dark olive `mw-tools/docs/SCREEN.md` describes.
 *
 * The line-art brick modes, which paint plain rows rather than chevrons, are still not here: the
 * port's screen is never in a state that asks for them.
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
  const svga = scene.videoMode === MW_SCREEN_MODE.mode;
  // The pattern is stepped by the character's own square, so the ground shifts as they walk. The
  // chequer wants only the parity of that; mode 9 wants the whole number, because it picks the
  // row's colour out of sixteen rather than two.
  const nudge = (which < 2 && scene.at.y % 2 === 0) || (which > 1 && scene.at.x % 2 === 1) ? 1 : 0;
  const walked = 3 * (which < 2 ? scene.at.y : scene.at.x);

  for (const ceiling of [true, false]) {
    const edgeRow = ceiling ? top : bottom;
    const from = ceiling ? top : horizon;
    const to = ceiling ? horizon - 1 : bottom;
    for (let y = from; y <= to; y++) {
      // How far off this row is, in floor tiles: about one at the edge of the view, growing
      // without bound as the row approaches the horizon.
      const step = short(y - horizon + (ceiling ? -1 : 1));
      if (step === 0) continue;
      const distance = Math.trunc(short(Math.trunc(short(short(edgeRow - horizon) * 4) / step)) / 3);
      let colour = (distance + nudge) % 2 === 1 ? 0x1b : 0x1a;
      // Mode 9's word of two entries: the row's colour lands on the odd pixels of every band and
      // the band's own colour on the even ones.
      const tile = (which === 0 || which === 2 ? -distance : distance) + walked;
      let word = ((GROUND_FIRST + (tile % 16)) << 8) | GROUND_FIRST;

      const span = ceiling ? horizon - y : y - horizon;
      const reach = ceiling ? horizon - top : bottom - horizon;
      const half = reach === 0 ? 0 : Math.trunc((span * ((right - left) >> 1)) / reach);
      if (half < flatBelow || !banded) {
        // Too near the horizon for a band to be worth drawing, so the row is laid flat. Mode 9
        // lays it in the low byte alone, which every row starts at the ramp's first entry.
        if (svga) drawGroundRun(frame, left, y, right - left + 1, GROUND_FIRST);
        else drawLine(frame, left, y, right, y, colour);
        continue;
      }

      let inner = half >> 1;
      if (svga) drawGroundRun(frame, centre - inner, y, 2 * inner, word);
      else drawLine(frame, centre - inner, y, centre + inner, y, colour);
      const edge = centre - left - 1;
      for (;;) {
        colour = colour === 0x1b ? 0x1a : 0x1b;
        word = stepGround(word, scene.floor, ceiling);
        let outer = inner + half;
        if (centre - outer <= left) outer = edge;
        if (svga) {
          drawGroundRun(frame, centre + inner, y, outer - inner, word);
          drawGroundRun(frame, centre - outer, y, outer - inner, word);
        } else {
          drawLine(frame, centre + inner, y, centre + outer, y, colour);
          drawLine(frame, centre - outer, y, centre - inner, y, colour);
        }
        if (outer === edge) break;
        inner = outer;
      }
    }
  }
}

/** The first of the sixteen palette entries `set_palette` fills the mode-9 ground from. */
const GROUND_FIRST = 0x30;

/**
 * How the band colour walks between two bands (exe 3000:1f4d for the ceiling, 3000:2201 for the
 * floor). The low byte counts round a range of the palette: entries 48 to 63 everywhere except
 * on the surface, which uses the wider 32 to 63, and on the first floor down, whose ground alone
 * walks the sixteen wall entries 16 to 31 instead.
 */
function stepGround(word: number, floor: number, ceiling: boolean): number {
  const base = floor === 0 ? 0x20 : (floor === 1) === ceiling ? 0x30 : 0x10;
  const mask = floor === 0 ? 0x3f1f : floor === 1 ? 0x3f0f : 0x3f2f;
  return ((((word - base + 1) & mask) + base) & 0xffff) >>> 0;
}

/**
 * FUN_2000_0ad7 (WORLD.EXE 2000:0ad7, mw.c "FUN_2000_0ad7"): a run of pixels written two at a
 * time as a sixteen-bit word, the low byte on the left of each pair.
 *
 * A run of odd length puts the low byte down once before the pairs start, so everything after it
 * sits a pixel out of step. The routine writes straight into a 1024-byte scan line, which is why
 * it clamps the run to that width whatever the screen is.
 */
function drawGroundRun(frame: Frame, x: number, y: number, length: number, word: number): void {
  const low = word & 0xff;
  const high = (word >> 8) & 0xff;
  let at = Math.max(0, x);
  let left = Math.min(length, 0x400 - at);
  if (left % 2 === 1) {
    plot(frame, at, y, low);
    at += 1;
    left -= 1;
  }
  for (let i = 0; i < left; i += 2) {
    plot(frame, at + i, y, low);
    plot(frame, at + i + 1, y, high);
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
  const mark = (picture: PicRowImage | null, top: number, bottom: number) => {
    if (picture) scaleImage(frame, face.left, top, face.right, bottom, picture, from, to, options(0));
  };

  // A way down is marked on the floor of the square (exe 3000:2fdd).
  const ladder = scene.ladderAt(face.square.x, face.square.y);
  if (ladder > 0) {
    mark(scene.pictures.ladder(true), Math.trunc((face.top + face.bottom * 2) / 3), face.bottom);
  }

  // The ceiling mark is a way up everywhere but the surface, where exe 3000:302b throws the
  // ladder away and reads surface_feature instead, negated. So on floor 0 the mark stands over a
  // store, a temple, a bank, an inn or the gate, and a way up there is not marked at all.
  const ceiling =
    scene.floor === 0 ? -scene.surfaceFeatureAt(face.square.x, face.square.y) : ladder;
  if (ceiling < 0) {
    mark(scene.pictures.ladder(false), face.top, Math.trunc((face.top * 2 + face.bottom) / 3));
  }
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
