/**
 * The arithmetic the 3-D view projects a dungeon square with.
 *
 * Read out of the disassembly rather than `dotu-tools/decomp/unf.c`: Ghidra could not follow the
 * 8087 stack, so every floating-point argument in the decompilation of these functions came out
 * as a bare `ftol()` call. The expressions here are the FPU instruction stream.
 */

/** DS:2316 = 650. `draw_3d_view` stops at `650 / 20 + 3` squares (exe 3000:0f75). */
export const VIEW_REACH = Math.floor(650 / 20) + 3;

/** Where on the screen one of the four views is drawn. */
export interface ViewRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/**
 * The four rectangles `FUN_2000_ac9e` (exe 2000:ac9e, unf.c "FUN_2000_ac9e") gives the views in
 * the game's usual display: the way you face large across the top, then left, right and behind.
 */
export const AHEAD_VIEW: ViewRect = { left: 0x12a, top: 5, right: 0x516, bottom: 0x2f8 };
export const LEFT_VIEW: ViewRect = { left: 1, top: 0x212, right: 299, bottom: 0x2f8 };
export const RIGHT_VIEW: ViewRect = { left: 0x515, top: 0x212, right: 0x63f, bottom: 0x2f8 };
export const BEHIND_VIEW: ViewRect = { left: 0x2b2, top: 0x302, right: 0x393, bottom: 0x409 };

/** The whole screen, which is what the game gives the view when it draws only the one ahead. */
export const WHOLE_SCREEN_VIEW: ViewRect = { left: 0, top: 0, right: 0x63f, bottom: 0x4af };

/**
 * How far in from each edge of the view the slot for the square `depth` steps ahead starts
 * (`draw_3d_view`'s `local_e`, exe 3000:0f75). The slots close on the vanishing point.
 */
export const slotNarrowing = (width: number, depth: number): number =>
  Math.fround((width * depth) / (2 * depth + 1));

/**
 * `FUN_3000_2822` (exe 3000:2822, unf.c "FUN_3000_2822"): snap down to a half-integer, which is
 * where the corners of a square sit in the view's coordinates.
 */
export const snapDown = (x: number): number => Math.fround(Math.floor(x - 0.5) + 0.5);

/** `FUN_3000_27fc` (exe 3000:27fc, unf.c "FUN_3000_27fc"): the same, snapping up. */
export const snapUp = (x: number): number => Math.fround(Math.ceil(x - 0.5) + 0.5);

/** Truncation toward zero, which is what the Borland `ftol` helper (exe 1000:115b) does. */
export const ftol = (x: number): number => Math.trunc(x);

/** Where a square sits, once the view's own coordinates have been turned back into the map's. */
export interface SquarePlace {
  x: number;
  y: number;
}

/**
 * `FUN_3000_3311` (exe 3000:3311, unf.c "FUN_3000_3311"): turn a point in the view's coordinates
 * — sideways across the view, forward away from the character — into a square on the map.
 *
 * The 0.499 is the game's own rounding bias (DS:25df): a positive sideways value is floored after
 * adding it and any other is raised after taking it away, so a half square goes toward zero (the
 * `fcompp` against zero at 3000:3348 falls through to `floor` only when zero is below the value).
 * Facings 2 and 3 truncate the forward
 * coordinate to an integer on the way through, which the other two do not; that asymmetry is the
 * original's and is kept.
 */
export function viewPointToSquare(sideways: number, forward: number, facing: number, at: SquarePlace): SquarePlace {
  let across = Math.fround(sideways > 0 ? Math.floor(sideways + 0.499) : Math.ceil(sideways - 0.499));
  let away = Math.fround(Math.floor(forward + 0.499));

  if (facing === 0) {
    away = -away;
  } else if (facing === 1) {
    across = -across;
  } else if (facing === 2) {
    const kept = ftol(away);
    away = -across;
    across = -kept;
  } else if (facing === 3) {
    const kept = ftol(away);
    away = across;
    across = kept;
  }
  return { x: at.x + across, y: at.y + away };
}

/** The screen rectangle a square's face fills, in the game's 1600 x 1200 units. */
export interface SquareFrame {
  /** Left and right edges, already clipped to the part of the square the view can see. */
  left: number;
  right: number;
  top: number;
  bottom: number;
  /** The fractions of the square's own width the visible part spans, 0..1. */
  from: number;
  to: number;
  /** The square this frame belongs to. */
  square: SquarePlace;
}

/** What `draw_map_square` needs from the view besides the four corner numbers. */
export interface ViewFrame {
  /** The rectangle the view is drawn in, in 1600 x 1200 units. */
  left: number;
  top: number;
  right: number;
  bottom: number;
  /** DS:b8bd, 0..32: how far down the rectangle the horizon sits. */
  horizonWeight: number;
  /** DS:c664: which of the four views is being drawn. */
  facing: number;
  /** Where the character stands. */
  at: SquarePlace;
}

/** The row the walls meet the floor on, blended between the top and bottom of the view. */
export function horizonRow(frame: ViewFrame): number {
  return (frame.top * frame.horizonWeight + frame.bottom * (32 - frame.horizonWeight)) >> 5;
}

/**
 * `draw_map_square` (exe 3000:2848, unf.c "draw_map_square") as far as its geometry goes: the two
 * rays that bound a square become a screen rectangle, or null when nothing of it can be seen.
 *
 * `nearSideways`/`nearForward` and `farSideways`/`farForward` are the frustum's two edges where
 * they cross the square, in the view's coordinates; `left`/`right` are the screen edges of the
 * slot the caller has already narrowed the square down to.
 */
export function projectSquare(
  nearSideways: number,
  nearForward: number,
  farSideways: number,
  farForward: number,
  left: number,
  right: number,
  frame: ViewFrame,
): SquareFrame | null {
  const square = viewPointToSquare(
    Math.fround((nearSideways + farSideways) / 2),
    Math.fround((nearForward + farForward) / 2),
    frame.facing,
    frame.at,
  );

  // A span that has collapsed onto either edge of the frustum covers no pixels.
  if ((farSideways === 0.5 && nearSideways === 0.5) || (farSideways === -0.5 && nearSideways === -0.5)) return null;

  let spanNear: number;
  let spanFar: number;
  let edgeNear: number;
  let edgeFar: number;

  // A square whose two rays fall on opposite sides of straight ahead fills the whole slot, and
  // the game skips the edge arithmetic entirely for it.
  if (nearSideways < 0 && farSideways > 0) return finish(0, 1);

  if (nearSideways === farSideways) {
    if (nearSideways < 0) {
      spanNear = Math.fround((nearSideways * 0.5) / snapDown(nearForward));
      spanFar = Math.fround(((nearSideways + 1) * 0.5) / snapUp(farForward));
      edgeNear = Math.fround((nearSideways * 0.5) / nearForward);
      edgeFar = Math.fround((farSideways * 0.5) / farForward);
    } else {
      spanNear = Math.fround(((farSideways - 1) * 0.5) / snapUp(farForward));
      // The near edge snaps a half-square further along than the far one does, which is the
      // original's asymmetry and not a transcription slip.
      spanFar = Math.fround((nearSideways * 0.5) / snapDown(nearForward + 0.5));
      edgeNear = Math.fround((farSideways * 0.5) / farForward);
      edgeFar = Math.fround((nearSideways * 0.5) / nearForward);
    }
  } else if (nearSideways < 0) {
    const snapped = snapDown(nearSideways);
    spanNear =
      snapped === -farForward
        ? Math.fround((snapDown(nearSideways - 1) * 0.5) / farForward)
        : Math.fround((snapped * 0.5) / (nearForward - 1));
    spanFar = Math.fround((snapUp(farSideways) * 0.5) / nearForward);
    edgeNear = Math.fround((nearSideways * 0.5) / nearForward);
    edgeFar = Math.fround((farSideways * 0.5) / farForward);
  } else {
    spanNear = Math.fround((snapDown(farSideways) * 0.5) / nearForward);
    const snapped = snapUp(nearSideways);
    spanFar =
      snapped === farForward
        ? Math.fround((snapUp(nearSideways + 1) * 0.5) / farForward)
        : Math.fround((snapped * 0.5) / (nearForward - 1));
    edgeNear = Math.fround((farSideways * 0.5) / farForward);
    edgeFar = Math.fround((nearSideways * 0.5) / nearForward);
  }

  // 0.15 pulls both edges in; 0.4 (DS:25c3) pulls one of them in again on the side the frustum
  // has already cut, which is what keeps a square from painting over its neighbour.
  spanNear = Math.fround((spanFar - spanNear) * 0.15 + spanNear);
  spanFar = Math.fround(spanFar - (spanFar - spanNear) * 0.15);
  if (nearSideways > 0) spanFar = Math.fround(spanFar - (spanFar - spanNear) * 0.4);
  if (farSideways < 0) spanNear = Math.fround((spanFar - spanNear) * 0.4 + spanNear);
  if (spanFar === spanNear) return null;

  edgeNear = Math.fround((edgeNear - spanNear) / (spanFar - spanNear));
  edgeFar = Math.fround((edgeFar - spanNear) / (spanFar - spanNear));
  return finish(edgeNear, edgeFar);

  function finish(near: number, far: number): SquareFrame | null {
    let from: number;
    let to: number;
    let x1 = left;
    let x2 = right;

    if (near < 0 || far > 1) {
      if (near > 1 || far < 0) return null;
      if (near >= 0) {
        from = near;
        to = 1;
        x2 = ftol(x2 - (x2 - x1) * ((far - 1) / (far - near)));
      } else {
        from = 0;
        to = far;
        x1 = ftol((x2 - x1) * (-near / (far - near)) + x1);
      }
    } else {
      from = near;
      to = far;
    }

    const horizon = horizonRow(frame);
    const height = frame.bottom - frame.top;
    // 0.7 (DS:25cb) and 64 (DS:25d3) turn the square's distance into the half-height of its face.
    const reach = Math.fround((snapUp(farForward) - 0.7) * 64);
    const top = ftol(horizon - ((32 - frame.horizonWeight) * height) / reach);
    const bottom = ftol(horizon + (frame.horizonWeight * height) / reach);
    return { left: x1, right: x2, top, bottom, from, to, square };
  }
}
