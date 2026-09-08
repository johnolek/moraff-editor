import { horizonRow, type ViewFrame } from './geometry';

/**
 * The 90-degree flood the view pours through open sides, in the fixed point the game keeps it in:
 * one map square is 256 units. `x` runs sideways, positive to the character's right; `z` runs
 * forward. A wedge is two points, one on each frustum edge.
 *
 * `FUN_3000_00a8` (exe 3000:00a8) takes the right half and `FUN_3000_0837` (exe 3000:0837) the
 * left. They are near-mirrors of each other, and the places where they are not are the reason
 * they are written out separately here rather than folded into one function with a sign.
 */

/** One square is 256 units across (DS:2593). */
export const UNIT = 256;

/** DS:2316: how many wedges one half of the flood may visit before it gives up. */
export const FLOOD_BUDGET = 650;

/** `3000:003b`: up to the next half-square line. */
export const snapUpUnit = (x: number): number => ((x & 0xff) === 0x80 ? x : 256 * Math.ceil((x - 128) / 256) + 128);
/** `3000:0067`: down to the previous half-square line. */
export const snapDownUnit = (x: number): number => 256 * Math.floor((x - 128) / 256) + 128;
/** `3000:0081`, used only by the right half. */
export const ceil256 = (x: number): number => 256 * Math.ceil(x / 256);
/** `3000:080f`, used only by the left half. */
export const floor256 = (x: number): number => 256 * Math.floor(x / 256);

/** Borland's signed 32-bit divide (exe 1000:1558) truncates toward zero. */
const div = (a: number, b: number): number => Math.trunc(a / b);

/** One wall face, as `FUN_3000_342d` (exe 3000:342d) is handed it. */
export interface WallFace {
  /** Sideways and forward offsets in squares from where the view starts. Forward is negative. */
  cellX: number;
  cellZ: number;
  /** 0 for the face across the view, +1 and -1 for a side face with its far end left or right. */
  kind: number;
  leftX: number;
  rightX: number;
  /** Top and bottom at the near end of the face. */
  topNear: number;
  bottomNear: number;
  /** DS:c672 and DS:c674: the same at the far end. */
  topFar: number;
  bottomFar: number;
  /** How far across the wall picture each end of the face falls, 0..100. */
  pctLeft: number;
  pctRight: number;
}

/** What the flood draws with, so it can be tested without a wall drawer or a screen. */
export interface FloodContext {
  view: ViewFrame;
  /** `FUN_3000_342d`: draw the face, and say whether the view carries on through it. */
  wall(face: WallFace): boolean;
  /** `draw_map_square`: draw whatever stands on the square this wedge covers. */
  square(x1: number, z1: number, x2: number, z2: number, leftX: number, rightX: number): void;
}

/** The running state one half of the flood keeps. */
interface Flood extends FloodContext {
  /** DS:c678. The original never counts it back down, so this is a budget, not a depth. */
  used: number;
  centreX: number;
  horizon: number;
  width: number;
  height: number;
}

const start = (context: FloodContext): Flood => ({
  ...context,
  used: 0,
  centreX: (context.view.right + context.view.left) >> 1,
  horizon: horizonRow(context.view),
  width: context.view.right - context.view.left,
  height: context.view.bottom - context.view.top,
});

/** Where a point on a frustum edge lands across the screen. */
const screenX = (flood: Flood, x: number, z: number): number => flood.centreX + div(x * flood.width, z * 2);

/** The row a wall at this distance is centred on: the horizon, moved by how tall the character is. */
const centreRow = (flood: Flood, z: number): number =>
  flood.horizon - (div(flood.height * ((16 - flood.view.horizonWeight) << 6), z) >> 4);

/** Half the height of a wall at this distance. */
const halfHeight = (flood: Flood, z: number): number => div(flood.height << 6, z);

/**
 * Pour the flood out from the character's own square, both halves, for the square `depth` steps
 * ahead. `draw_3d_view` seeds each half with the +-0.5 side of that square and gives each its own
 * budget (exe 3000:0f75).
 */
export function floodBothHalves(context: FloodContext, depth: number): void {
  const near = UNIT * depth + 128;
  const far = UNIT * depth + 384;
  floodLeft(start(context), -128, near, -128, far);
  floodRight(start(context), 128, near, 128, far);
}

/** `FUN_3000_00a8` (exe 3000:00a8): the right half of the wedge. */
function floodRight(flood: Flood, x1: number, z1: number, x2: number, z2: number): void {
  if (flood.used > FLOOD_BUDGET) return;
  flood.used++;

  const rightX = screenX(flood, x1, z1);
  const leftX = screenX(flood, x2, z2);
  if (leftX >= rightX) return;

  const face = wallFace(flood, z1, z2, leftX, rightX);
  let open: boolean;

  if (x1 === x2) {
    const line = snapDownUnit(z1);
    open = flood.wall({
      ...face,
      cellX: div(x1 + 0x17f, 256),
      cellZ: div(-(z2 + 0x7f), 256),
      kind: 1,
      pctLeft: (100 * (256 - (z2 - line))) >> 8,
      pctRight: (100 * (256 - (z1 - line))) >> 8,
    });
    if (open) {
      const step = snapUpUnit(z2);
      floodRight(flood, div(x1 * step, z1), step, div(x2 * step, z2), step);
    }
  } else {
    const line = snapDownUnit(x2);
    open = flood.wall({
      ...face,
      cellX: div(ceil256(x2 - 127), 256),
      cellZ: div(-z2, 256),
      kind: 0,
      pctLeft: (100 * (x2 - line)) >> 8,
      pctRight: (100 * (x1 - line)) >> 8,
    });
    if (open) stepPastFront(flood, x1, z1, x2, z2, snapUpUnit(x1), floodRight);
  }

  flood.square(x1 / 256, z1 / 256, x2 / 256, z2 / 256, leftX, rightX);
}

/** `FUN_3000_0837` (exe 3000:0837): the left half. */
function floodLeft(flood: Flood, x1: number, z1: number, x2: number, z2: number): void {
  if (flood.used > FLOOD_BUDGET) return;
  flood.used++;

  const leftX = screenX(flood, x1, z1);
  const rightX = screenX(flood, x2, z2);
  if (leftX >= rightX) return;

  const face = wallFace(flood, z1, z2, leftX, rightX);
  let open: boolean;

  if (x1 === x2) {
    const line = snapDownUnit(z1);
    open = flood.wall({
      ...face,
      // The left half floors this where the right half truncates; the right half never sees a
      // negative sideways value, so the two agree in practice.
      cellX: div(floor256(x1 + 0x17f), 256),
      cellZ: div(-(z2 + 0x7f), 256),
      kind: -1,
      pctLeft: Math.trunc((z1 - line) / 2.56),
      pctRight: Math.trunc((z2 - line) / 2.56),
    });
    if (open) {
      const step = snapUpUnit(z2);
      floodLeft(flood, div(x1 * step, z1), step, div(x2 * step, z2), step);
    }
  } else {
    const line = snapDownUnit(x1);
    open = flood.wall({
      ...face,
      // The bias should be 128 to mirror the right half's; at 129 a frustum edge landing exactly
      // on a square line picks the column next door. The original's, kept.
      cellX: div(floor256(x1 + 129), 256),
      cellZ: div(-z2, 256),
      kind: 0,
      pctLeft: Math.trunc((x1 - line) / 2.56),
      pctRight: Math.trunc((x2 - line) / 2.56),
    });
    if (open) stepPastFront(flood, x1, z1, x2, z2, snapDownUnit(x1), floodLeft);
  }

  flood.square(x1 / 256, z1 / 256, x2 / 256, z2 / 256, leftX, rightX);
}

/** The parts of a face that do not depend on which half is drawing it. */
function wallFace(flood: Flood, z1: number, z2: number, leftX: number, rightX: number): WallFace {
  const nearCentre = centreRow(flood, z1);
  const farCentre = centreRow(flood, z2);
  const nearHalf = halfHeight(flood, z1);
  const farHalf = halfHeight(flood, z2);
  return {
    cellX: 0,
    cellZ: 0,
    kind: 0,
    leftX,
    rightX,
    topNear: nearCentre - nearHalf,
    bottomNear: nearCentre + nearHalf,
    topFar: farCentre - farHalf,
    bottomFar: farCentre + farHalf,
    pctLeft: 0,
    pctRight: 0,
  };
}

type Half = (flood: Flood, x1: number, z1: number, x2: number, z2: number) => void;

/**
 * Where the wedge goes once it has passed through an open face across the view: on to the next
 * square, off to the side, or — when the corner of a square falls inside the wedge — both, as two
 * wedges. `step` is the next square line sideways, which is the one asymmetry between the halves.
 */
function stepPastFront(
  flood: Flood,
  x1: number,
  z1: number,
  x2: number,
  z2: number,
  step: number,
  half: Half,
): void {
  const corner = Math.abs(div((z1 + 256) << 8, snapUpUnit(Math.abs(x1))));
  const outer = Math.abs(div(z1 << 8, x1));
  if (corner <= outer) {
    half(flood, div(x1 * (z1 + 256), z1), z1 + 256, div(x2 * (z2 + 256), z2), z2 + 256);
    return;
  }
  const inner = Math.abs(div(z2 << 8, x2));
  if (corner >= inner) {
    half(flood, step, div(z1 * step, x1), step, div(z2 * step, x2));
    return;
  }
  // The corner is inside the wedge, so it splits. The first piece has its outer edge clipped to
  // the square line rather than carried along its own ray, which is the clip and not a slip.
  half(flood, step, z1 + 256, div(x2 * (z2 + 256), z2), z2 + 256);
  half(flood, step, div(z1 * step, x1), step, z2 + 256);
}
