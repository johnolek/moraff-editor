import { drawLine, newFrame, type Frame } from '../../view3d/frame';
import { ACROSS, DOWN, SIDE_DOOR, SIDE_WALL, side } from '../../../game/revmap.js';
import { GREEN, RED } from './colours';
import { boxFilled, boxOutline, cint, paint, type ViewBox } from './paint';

/**
 * The four 3-D views: the corridor ahead, behind and to either side, five squares deep.
 *
 * `1000:593C` draws all four every time, walking the direction round the compass from the one
 * the character faces until it comes back to it (`1000:6B6E`). Each direction is scanned into
 * three arrays of six depths (`1000:5AE1` and its three twins) and then drawn from them
 * (`1000:62E2`..`1000:69BC`). Depth 1 is the square the character stands on, so the deepest
 * square a view reaches is five away.
 */

/** The compass, numbered the way the move code numbers it (1000:30C7's `ON GOTO`). */
export const NORTH = 1;
export const EAST = 2;
export const SOUTH = 3;
export const WEST = 4;

/** What a side of a square is, in the only three grades the view cares about. */
export const OPEN = 0;
export const DOOR = 1;
export const WALL = 2;

/** Where the character is and which way, which is all a view needs of the game. */
export interface RevViewPlace {
  column: number;
  row: number;
  level: number;
  /** The character's own number, which is the divisor in the wall rule. */
  generation: number;
  /** DGROUP B47C: 1 north, 2 east, 3 south, 4 west. */
  facing: number;
}

/**
 * One direction scanned: the wall across the corridor and the two beside it, by depth.
 *
 * Index 0 and index 7 are the untouched ends of the BASIC arrays at DGROUP 1F82, 1F62 and 1F42,
 * which the drawing reads past both ends of and which are zero -- an opening -- there. The sides
 * at depth 1 are zero for the same reason: `1000:5B51` leaves the scan before computing them,
 * because the square the character stands on has no sides worth drawing.
 */
export interface ViewDepths {
  /** 1F82: the wall across the corridor at each depth. */
  far: number[];
  /** 1F62: the wall along the left of the square at each depth. */
  left: number[];
  /** 1F42: the wall along its right. */
  right: number[];
  /** The deepest depth the scan got to before a wall or a door stopped it. */
  reached: number;
}

/** How deep the scan and the drawing go: `FOR depth = 1 TO 6` (1000:613C, 1000:69B4). */
const DEEPEST = 6;

/** The `VIEW` boxes the four panels are drawn in, from F2.COM's own list and 1000:6193's corners. */
export const FRONT_BOX: ViewBox = { left: 214, top: 57, right: 266, bottom: 110 };
export const RIGHT_BOX: ViewBox = { left: 267, top: 95, right: 319, bottom: 149 };
export const BACK_BOX: ViewBox = { left: 214, top: 137, right: 266, bottom: 190 };
export const LEFT_BOX: ViewBox = { left: 161, top: 95, right: 213, bottom: 149 };

/** How wide and how tall the drawing inside a box is; the two side boxes have a spare row. */
const PANEL_WIDTH = 53;
const PANEL_HEIGHT = 54;

/** The far corner the drawing mirrors about, which is the last pixel of the panel. */
const RIGHT_EDGE = PANEL_WIDTH - 1;
const BOTTOM_EDGE = PANEL_HEIGHT - 1;

/**
 * How far in the frame at each depth sits, in both directions at once.
 *
 * The first six lines of F2.COM, read at 1000:BD00 into the arrays at DGROUP 1EC6 and 1EB6. The
 * two are the same numbers, so the frame at depth `d` runs from `NEST[d]` to `52 - NEST[d]`
 * across and from `NEST[d]` to `53 - NEST[d]` down.
 */
const NEST = [0, 0, 9, 15, 19, 22, 24];

/**
 * The four corners of a side door's slab, from F2.COM's last five lines (1000:BD72).
 *
 * A door in a side wall is a quadrilateral seen almost edge-on: a near edge at `DOOR_X` and a
 * far edge at `DOOR_FAR_X`, each running from its own top down to its own foot.
 */
const DOOR_X = [0, 0, 3, 11, 16, 20];
const DOOR_FAR_X = [0, 0, 6, 13, 17, 20];
const DOOR_TOP = [0, 0, 16, 20, 22, 24];
const DOOR_FAR_TOP = [0, 0, 18, 21, 23, 25];
const DOOR_FOOT = [0, 0, 3, 11, 16, 20];
const DOOR_FAR_FOOT = [0, 0, 6, 13, 17, 21];

/** The deepest depth a side door is drawn at, and the deepest one that is filled in. */
const DEEPEST_SIDE_DOOR = 5;
const DEEPEST_FILLED_SIDE_DOOR = 3;

/** The wall rule's three grades, from the map's own reading of the same numbers. */
function grade(kind: number, column: number, row: number, place: RevViewPlace): number {
  const value = side(kind, column, row, place.level, place.generation);
  if (value === SIDE_WALL) return WALL;
  return value === SIDE_DOOR ? DOOR : OPEN;
}

/** The square a direction reaches at a depth; depth 1 is the character's own square. */
export function squareAtDepth(place: RevViewPlace, direction: number, depth: number): { column: number; row: number } {
  const step = depth - 1;
  if (direction === NORTH) return { column: place.column, row: place.row - step };
  if (direction === SOUTH) return { column: place.column, row: place.row + step };
  if (direction === EAST) return { column: place.column + step, row: place.row };
  return { column: place.column - step, row: place.row };
}

/**
 * One direction's three walls at every depth the scan reaches.
 *
 * `1000:5AC0` stops the scan when the wall at the depth before is anything but an opening, so a
 * door closes a view even though the character can walk through it.
 */
export function scanDirection(place: RevViewPlace, direction: number): ViewDepths {
  const depths: ViewDepths = {
    far: new Array(DEEPEST + 2).fill(OPEN),
    left: new Array(DEEPEST + 2).fill(OPEN),
    right: new Array(DEEPEST + 2).fill(OPEN),
    reached: 0,
  };
  for (let depth = 1; depth <= DEEPEST; depth++) {
    if (depths.far[depth - 1] !== OPEN) break;
    depths.reached = depth;
    const { column, row } = squareAtDepth(place, direction, depth);
    if (direction === NORTH) {
      depths.far[depth] = grade(ACROSS, column, row, place);
      if (depth === 1) continue;
      depths.left[depth] = grade(DOWN, column, row, place);
      depths.right[depth] = grade(DOWN, column + 1, row, place);
    } else if (direction === EAST) {
      depths.far[depth] = grade(DOWN, column + 1, row, place);
      if (depth === 1) continue;
      depths.left[depth] = grade(ACROSS, column, row, place);
      depths.right[depth] = grade(ACROSS, column, row + 1, place);
    } else if (direction === SOUTH) {
      depths.far[depth] = grade(ACROSS, column, row + 1, place);
      if (depth === 1) continue;
      depths.left[depth] = grade(DOWN, column + 1, row, place);
      depths.right[depth] = grade(DOWN, column, row, place);
    } else {
      depths.far[depth] = grade(DOWN, column, row, place);
      if (depth === 1) continue;
      depths.left[depth] = grade(ACROSS, column, row + 1, place);
      depths.right[depth] = grade(ACROSS, column, row, place);
    }
  }
  return depths;
}

/** The door across the corridor, a red slab a third of the frame in on every side but the floor. */
function drawDoorAhead(panel: Frame, depth: number): void {
  // 1000:68DB nudges the slab one pixel in at the deepest frame, where it would otherwise be
  // inside out.
  const nudge = depth === DEEPEST ? 1 : 0;
  const inX = (RIGHT_EDGE - 2 * NEST[depth]) / 3;
  const inY = (BOTTOM_EDGE - 2 * NEST[depth]) / 3;
  boxFilled(
    panel,
    cint(NEST[depth] + inX + nudge),
    cint(NEST[depth] + inY),
    cint(RIGHT_EDGE - NEST[depth] - inX - nudge),
    BOTTOM_EDGE - NEST[depth],
    RED,
  );
}

/** A door in a side wall: the slab drawn almost edge-on, and filled in when it is close enough. */
function drawSideDoor(panel: Frame, depth: number, mirrored: boolean): void {
  const across = (x: number): number => (mirrored ? RIGHT_EDGE - x : x);
  const near = across(DOOR_X[depth]);
  drawLine(panel, near, BOTTOM_EDGE - DOOR_FOOT[depth], near, DOOR_TOP[depth], RED);
  if (depth === DEEPEST_SIDE_DOOR) return;
  const far = across(DOOR_FAR_X[depth]);
  drawLine(panel, near, DOOR_TOP[depth], far, DOOR_FAR_TOP[depth], RED);
  drawLine(panel, far, DOOR_FAR_TOP[depth], far, BOTTOM_EDGE - DOOR_FAR_FOOT[depth], RED);
  drawLine(panel, far, BOTTOM_EDGE - DOOR_FAR_FOOT[depth], near, BOTTOM_EDGE - DOOR_FOOT[depth], RED);
  if (depth > DEEPEST_FILLED_SIDE_DOOR) return;
  // 1000:6615 and 1000:682B both start the fill one pixel inside the slab's left-hand edge,
  // which on the right of the view is the far edge rather than the near one.
  const inside = mirrored ? RIGHT_EDGE - DOOR_FAR_X[depth] + 1 : DOOR_X[depth] + 1;
  paint(panel, inside, DOOR_TOP[depth] + 3, RED, RED);
}

/**
 * One direction drawn into its own panel: the nested frames, the side walls and where they end.
 *
 * `1000:62E2`..`1000:69BC`. The ceiling line at each depth is skipped in the town, which has no
 * ceiling (1000:63E7), and the floor line is drawn only where the corridor ends.
 */
export function drawPanel(panel: Frame, depths: ViewDepths, level: number): void {
  for (let depth = 1; depth <= DEEPEST; depth++) {
    const near = NEST[depth];
    const far = RIGHT_EDGE - near;
    const top = near;
    const foot = BOTTOM_EDGE - near;
    const blocked = depths.far[depth] !== OPEN;

    // The corner of the corridor shows only where the wall beside it starts, stops or ends.
    if (depths.left[depth] === OPEN || depths.left[depth + 1] === OPEN || blocked) {
      drawLine(panel, near, top, near, foot, GREEN);
    }
    if (depths.right[depth] === OPEN || depths.right[depth + 1] === OPEN || blocked) {
      drawLine(panel, far, top, far, foot, GREEN);
    }
    if (level > 0 || blocked) drawLine(panel, far, top, near, top, GREEN);

    if (depth > 1) {
      const behind = NEST[depth - 1];
      const behindTop = behind;
      const behindFoot = BOTTOM_EDGE - behind;
      if (depths.left[depth] === OPEN) {
        boxOutline(panel, behind, top, near, foot, GREEN);
      } else {
        drawLine(panel, behind, behindTop, near, top, GREEN);
        drawLine(panel, behind, behindFoot, near, foot, GREEN);
        if (depths.left[depth] === DOOR && depth <= DEEPEST_SIDE_DOOR) drawSideDoor(panel, depth, false);
      }
      if (depths.right[depth] === OPEN) {
        boxOutline(panel, RIGHT_EDGE - behind, top, far, foot, GREEN);
      } else {
        drawLine(panel, RIGHT_EDGE - behind, behindTop, far, top, GREEN);
        drawLine(panel, RIGHT_EDGE - behind, behindFoot, far, foot, GREEN);
        if (depths.right[depth] === DOOR && depth <= DEEPEST_SIDE_DOOR) drawSideDoor(panel, depth, true);
      }
    }

    if (!blocked) continue;
    drawLine(panel, near, foot, far, foot, GREEN);
    if (depths.far[depth] === DOOR) drawDoorAhead(panel, depth);
    return;
  }
}

/** Which of the four panels a direction is drawn in, given the way the character faces. */
export function panelFor(facing: number, direction: number): ViewBox {
  if (direction === facing) return FRONT_BOX;
  if (direction - 1 === facing || direction + 3 === facing) return RIGHT_BOX;
  if (Math.abs(facing - direction) === 2) return BACK_BOX;
  return LEFT_BOX;
}

/** A panel's own frame, the size the drawing works in. */
export const newPanel = (): Frame => newFrame(PANEL_WIDTH, PANEL_HEIGHT);
