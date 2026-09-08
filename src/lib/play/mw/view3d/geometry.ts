import {
  ftol,
  horizonRow,
  slotNarrowing,
  snapDown,
  snapUp,
  type SquareFrame,
  type SquarePlace,
  type ViewFrame,
} from '../../view3d/geometry';

/**
 * The arithmetic Moraff's World's 3-D view projects a dungeon square with.
 *
 * Almost all of it is shared with Dungeons of the Unforgiven and is imported from that port rather
 * than written again: the 35-square reach out of `650 / 20 + 3`, the `width * depth / (2 * depth +
 * 1)` slot narrowing, the snap to a half-integer, the 0.499 rounding bias and the 0.4, 0.7 and 64
 * of the square projection are the same constants at the same addresses in both executables.
 *
 * Two things are this game's own, so they are written out here:
 *
 * 1. `FUN_3000_30d7` (WORLD.EXE 3000:30d7) rounds the sideways coordinate on `> 0`, where the
 *    Dungeons of the Unforgiven port has the two branches the other way about. It matters: at
 *    exactly +0.5, which is the value a wedge midpoint most often takes, the two disagree about
 *    which square is meant.
 * 2. `FUN_3000_2796` (WORLD.EXE 3000:2796) has no 0.15 step. The later game pulls both edges of a
 *    span in by 0.15 before the 0.4 that cuts one of them again; this one only does the 0.4. There
 *    is no 0.15 anywhere in WORLD.EXE's data segment.
 */

export { ftol, horizonRow, slotNarrowing, snapDown, snapUp };
export type { SquareFrame, SquarePlace, ViewFrame };

/** DS:43a8 holds 650 and is never written, so the view reaches `650 / 20 + 3` squares. */
export const MW_VIEW_REACH = Math.floor(650 / 20) + 3;

/**
 * `FUN_3000_30d7` (WORLD.EXE 3000:30d7, mw.c "FUN_3000_30d7"): turn a point in the view's
 * coordinates — sideways across the view, forward away from the character — into a square on the
 * map.
 *
 * The 0.499 bias is the double at DS:4619. Views 2 and 3 truncate the forward coordinate to an
 * integer on the way through, which the other two do not; that asymmetry is the original's.
 */
export function mwViewPointToSquare(
  sideways: number,
  forward: number,
  view: number,
  at: SquarePlace,
): SquarePlace {
  // fld [si] / fldz / fcompp / jae: the fall-through is the strictly positive case.
  let across = Math.fround(sideways > 0 ? Math.floor(sideways + 0.499) : Math.ceil(sideways - 0.499));
  let away = Math.fround(Math.floor(forward + 0.499));

  if (view === 0) {
    away = -away;
  } else if (view === 1) {
    across = -across;
  } else if (view === 2) {
    const kept = ftol(away);
    away = -across;
    across = -kept;
  } else if (view === 3) {
    const kept = ftol(away);
    away = across;
    across = kept;
  }
  return { x: at.x + across, y: at.y + away };
}

/**
 * `FUN_3000_2796` (WORLD.EXE 3000:2796, mw.c "FUN_3000_2796"): the two rays that bound a square
 * become a screen rectangle, or null when nothing of it can be seen.
 *
 * `nearSideways`/`nearForward` and `farSideways`/`farForward` are the frustum's two edges where
 * they cross the square; `left`/`right` are the screen edges of the slot the walker has already
 * narrowed the square down to.
 */
export function mwProjectSquare(
  nearSideways: number,
  nearForward: number,
  farSideways: number,
  farForward: number,
  left: number,
  right: number,
  frame: ViewFrame,
): SquareFrame | null {
  const square = mwViewPointToSquare(
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

  // 0.4 (DS:45fd) pulls one edge in on the side the frustum has already cut, which is what keeps a
  // square from painting over its neighbour.
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
    // 0.7 (DS:4605) and 64 (DS:460d) turn the square's distance into the half-height of its face.
    const reach = Math.fround((snapUp(farForward) - 0.7) * 64);
    const top = ftol(horizon - ((32 - frame.horizonWeight) * height) / reach);
    const bottom = ftol(horizon + (frame.horizonWeight * height) / reach);
    return { left: x1, right: x2, top, bottom, from, to, square };
  }
}

/**
 * DS:43aa, the weight that puts the horizon between the top and the bottom of a view: the
 * character's own height in inches over five, plus six (exe 3000:1a24). A sprite of 24 inches
 * gets 10 and an ogre of 100 gets 26, out of the 32 the blend divides by, so a tall character
 * sees more floor and less ceiling.
 */
export const mwHorizonWeight = (heightInInches: number): number => Math.trunc(heightInInches / 5) + 6;
