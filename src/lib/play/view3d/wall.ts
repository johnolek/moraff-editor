import type { MapSquare } from '../../map/game';
import { drawLine, type Frame } from './frame';
import type { WallFace } from './flood';
import { WALL_DOOR, WALL_GRADIENT, WALL_MATERIALS, WALL_TELEPORTER_SIGN, type ViewPictures } from './pictures';
import { drawWallFace, type PicRowImage } from './texture';

/**
 * `FUN_3000_342d` (exe 3000:342d): draw one face of one square, and say whether the view carries
 * on through it. It does no projection of its own — the flood has already worked out the four
 * corners, and this only turns them from the game's 1600 x 1200 units into screen pixels.
 */

/** What the game calls a side: 0 wall, 1 door, 2 secret door, 3 open, 4 teleporter. */
export const SIDE_WALL = 0, SIDE_DOOR = 1, SIDE_SECRET = 2, SIDE_OPEN = 3, SIDE_TELEPORTER = 4;

/** How much of the view the game draws: the options menu cycles these three. */
export const DETAIL_TEXTURED = 0, DETAIL_FILLED = 1, DETAIL_OUTLINE = 2;

/** The colours the wall drawer works in (DS:2308 and its neighbours). */
export interface WallPalette {
  /** DS:2308: the highlight under a door plank. */
  plank: number;
  /** DS:230a: what a line-art wall is filled with. Recomputed per face in 256-colour modes. */
  fill: number;
  /** DS:230e: the shading under a door lintel. */
  lintel: number;
  /** DS:2310: the outline of a face. */
  outline: number;
  /** DS:2312: the portcullis lattice. */
  lattice: number;
  /** DS:2314: the door panel. */
  door: number;
}

export const WALL_PALETTE: WallPalette = { plank: 14, fill: 14, lintel: 13, outline: 15, lattice: 0, door: 7 };

export interface WallScene {
  rows: MapSquare[][];
  /** DS:c65c and DS:c65e: the square the view starts from. */
  at: { x: number; y: number };
  /** DS:c660 / DS:c034 and DS:c662 / DS:c036. */
  floor: number;
  module: number;
  /** DS:c664. */
  facing: number;
  /** DS:022d: the module number carried with the save; 0 in a game that has not moved module. */
  moduleCarried: number;
  pictures: ViewPictures;
  /** DS:2306. */
  detail: number;
  /** The real screen, whose width and height the 1600 x 1200 units are scaled onto. */
  screen: { width: number; height: number };
  /** DS:c6a8: 0 two-colour, 1 sixteen-colour, 2 and up 256-colour. */
  videoClass: number;
}

/** Truncate to a signed 16-bit int, which the original's arithmetic leans on. */
const short = (x: number): number => (x << 16) >> 16;
const div = (a: number, b: number): number => Math.trunc(a / b);

/**
 * `retdwall` (exe 3000:8360) read off the generated floor: side 0 is the square's west edge and
 * side 1 its north edge.
 */
function sideOf(scene: WallScene, x: number, y: number, side: number): number {
  const square = scene.rows[y]?.[x];
  if (!square) return SIDE_WALL;
  return side === 0 ? square.w : square.n;
}

/** Which square and which of its edges a face belongs to, once the facing has been turned back. */
function faceSquare(scene: WallScene, face: WallFace): { x: number; y: number; side: number } {
  let dx = face.cellX;
  let dy = face.cellZ;
  let side = face.kind === 0 ? 1 : 0;

  if (scene.facing === 1) {
    if (face.kind === 0) {
      dy = 1 - dy;
      dx = -dx;
    } else {
      dy = -dy;
      dx = 1 - dx;
    }
  } else if (scene.facing === 2) {
    side = (side + 1) % 2;
    const kept = dx;
    dx = dy;
    dy = face.kind === 0 ? -kept : 1 - kept;
  } else if (scene.facing === 3) {
    side = (side + 1) % 2;
    const kept = dx;
    dx = face.kind === 0 ? 1 - dy : -dy;
    dy = kept;
  }
  return { x: scene.at.x + dx, y: scene.at.y + dy, side };
}

/**
 * A teleporter is not stored on the map: the game works one out from where the square is. The
 * two products are each cut to 16 bits before they are added, and that wraparound is what puts
 * the teleporters where they are.
 */
function isTeleporter(scene: WallScene, x: number, y: number): boolean {
  if (scene.floor >= 15 && scene.moduleCarried !== 0) return false;
  return short(short(x * y) + short(scene.floor * scene.module)) % 128 === 1;
}

/** The per-face hash the decoration and the fill colour are picked with. */
function faceStyle(scene: WallScene, x: number, y: number): { hash: number; style: number; fill: number } {
  const floor = scene.floor;
  const tenth = floor % 10;
  let hash: number;
  if (tenth < 5) hash = div(x + y, 3) + floor * 61 + 5;
  else if (tenth < 6) hash = div(x + 67, 5) + div(y + 47, 5) + floor * 61;
  else if (tenth < 8) hash = div(x + 21, 4) + div(y + 37, 4) + floor * 61;
  else hash = x + y + floor + 58;

  let fill = WALL_PALETTE.fill;
  if (scene.videoClass > 1) {
    fill = short(hash * 0x11) % 13 < 4 ? (Math.abs(short(hash * 0x115)) % 11) + 16 : 13;
  }
  return { hash, style: div(hash, 3) % 5, fill };
}

/** Fill a four-cornered face by scanlines, the way the wireframe modes do. */
function fillFace(
  frame: Frame,
  xL: number,
  xR: number,
  topL: number,
  topR: number,
  botL: number,
  botR: number,
  colour: (y: number) => number,
): void {
  if ((botL - topL) > (botR - topR)) {
    if (topR !== topL) {
      for (let y = topL; y <= topR; y++) {
        drawLine(frame, xL, y, xL + div((xR - xL) * (y - topL), topR - topL), y, colour(y));
      }
    }
    if (botL !== botR) {
      for (let y = botR; y <= botL; y++) {
        drawLine(frame, xL, y, xL + div((xR - xL) * (botL - y), botL - botR), y, colour(y));
      }
    }
    for (let y = topR; y <= botR; y++) drawLine(frame, xL, y, xR, y, colour(y));
  } else {
    for (let y = topL; y <= botL; y++) drawLine(frame, xL, y, xR, y, colour(y));
    if (topL !== topR) {
      for (let y = topR; y <= topL; y++) {
        drawLine(frame, xR - div((xR - xL) * (y - topR), topL - topR), y, xR, y, colour(y));
      }
    }
    if (botL !== botR) {
      for (let y = botL; y <= botR; y++) {
        drawLine(frame, xR - div((xR - xL) * (botR - y), botR - botL), y, xR, y, colour(y));
      }
    }
  }
}

/**
 * Draw the face, and say whether the flood may carry on past it. An open side is the only thing
 * that returns true, and it returns before anything is drawn.
 */
export function drawWall(frame: Frame, scene: WallScene, face: WallFace): boolean {
  const { x, y, side } = faceSquare(scene, face);
  let code = sideOf(scene, x, y, side);
  if (code === SIDE_WALL && isTeleporter(scene, x, y)) code = SIDE_TELEPORTER;
  if (code === SIDE_OPEN) return true;

  const { style, fill } = faceStyle(scene, x, y);
  let low = face.pctLeft;
  let high = face.pctRight === 0 ? 99 : face.pctRight;

  // The whole view is worked out in 1600 x 1200 units and only becomes pixels here.
  const maxX = scene.screen.width - 1;
  const maxY = scene.screen.height - 1;
  const xL = div(maxX * face.leftX, 1600);
  const xR = div(maxX * face.rightX, 1600);
  const nearTop = div(maxY * face.topNear, 1200);
  const nearBottom = div(maxY * face.bottomNear, 1200);
  const farTop = div(maxY * face.topFar, 1200);
  const farBottom = div(maxY * face.bottomFar, 1200);
  if (xR <= xL || low === high) return false;

  let topL: number, topR: number, botL: number, botR: number;
  if (face.kind === 1) {
    topL = farTop;
    topR = nearTop;
    botL = farBottom;
    botR = nearBottom;
  } else if (face.kind === -1) {
    topL = nearTop;
    topR = farTop;
    botL = nearBottom;
    botR = farBottom;
  } else {
    topL = topR = nearTop;
    botL = botR = nearBottom;
  }

  if (low < 0) low = 0;
  if (high > 98) high = 98;

  const wall = scene.pictures.wall;
  if (wall && scene.detail === DETAIL_TEXTURED) {
    const pichash = div(x + y + scene.floor * 31 + 5, 8);
    const picture = (index: number): PicRowImage | null => wall[index] ?? null;
    if (code === SIDE_TELEPORTER) {
      const tint = scene.videoClass > 1 ? 15 : scene.videoClass === 1 ? 1 : 0;
      paint(picture(WALL_TELEPORTER_SIGN), low * 2, high * 2, tint);
      return false;
    }
    if (code === SIDE_DOOR) {
      paint(picture(WALL_DOOR + (((pichash % 2) + 2) % 2)), low * 2, high * 2, 12);
      return false;
    }
    // A secret door is drawn as an ordinary wall, which is the whole point of it.
    paint(picture(WALL_MATERIALS[((pichash % 3) + 3) % 3]), low * 4, high * 4, 12);
    return false;
  }

  drawLineArt();
  return false;

  function paint(picture: PicRowImage | null, from: number, to: number, tint: number): void {
    if (!picture) return;
    drawWallFace(frame, xL, xR, topL, topR, botL, botR, picture, from, to, {
      base: 0x50,
      tint,
      gradient: WALL_GRADIENT,
    });
  }

  /**
   * What the game draws when the wall pictures were never loaded (DS:031f) or the detail level
   * has been turned down: the face outlined and filled, with a decoration picked by its hash.
   */
  function drawLineArt(): void {
    const dither = scene.videoClass === 0;
    const shade = (row: number): number => (dither ? row % 2 : fill);
    if (scene.detail < DETAIL_OUTLINE) fillFace(frame, xL, xR, topL, topR, botL, botR, shade);

    const line = WALL_PALETTE.outline;
    drawLine(frame, xL, topL, xR, topR, line);
    drawLine(frame, xL, botL, xR, botR, line);
    // The right edge is clamped to 98 just above and then tested for more than 98, so the
    // original never draws it. Kept.
    if (style !== 3 || scene.detail === DETAIL_OUTLINE) {
      if (low === 0) drawLine(frame, xL, topL, xL, botL, line);
    }
    if (scene.detail === DETAIL_OUTLINE) return;

    if (style === 2) {
      for (let i = 0; i < 5; i++) {
        drawLine(frame, xL, topL + div((botL - topL) * i, 5), xR, topR + div((botR - topR) * i, 5), line);
      }
    }
    if (style < 4) {
      const third = div(xR - xL, 3);
      drawLine(frame, xL + third, div(2 * topL + topR, 3), xL + third, div(2 * botL + botR, 3), line);
      drawLine(frame, xR - third, div(topL + 2 * topR, 3), xR - third, div(botL + 2 * botR, 3), line);
    } else if (style === 4) {
      drawPortcullis();
    }
    if (style === 1) {
      drawLine(frame, xL, topL, xR, botR, 12);
      drawLine(frame, xL, botL, xR, topR, 12);
    }
    if (code === SIDE_DOOR && high > 18 && low < 80) drawDoor();
  }

  function drawPortcullis(): void {
    const divisions = 5;
    for (let i = 0; i < divisions; i++) {
      const colour = WALL_PALETTE.lattice;
      drawLine(frame, xL, topL + div((botL - topL) * i, divisions), xR, topR + div((botR - topR) * i, divisions), colour);
    }
    for (let i = 0; i < divisions; i++) {
      for (let j = i % 2; j < divisions; j += 2) {
        const across = Math.trunc((100 * j) / (divisions - 1));
        if (across < low || across > high) continue;
        const px = div((xR - xL) * (across - low), high - low);
        const upper = topL + div((botL - topL) * i, divisions);
        const lower = topL + div((botL - topL) * (i + 1), divisions);
        let a = px * (topR + div((botR - topR) * (i + 1), divisions) - lower);
        let b = px * (topR + div((botR - topR) * i, divisions) - upper);
        if (xL < xR) {
          a = div(a, xR - xL);
          b = div(b, xR - xL);
        }
        drawLine(frame, xL + px, b + upper, xL + px, a + lower, WALL_PALETTE.lattice);
      }
    }
  }

  /** The panel inside a door, inset to a fifth from each side of the face. */
  function drawDoor(): void {
    const span = high - low;
    let doorR = xL + div((80 - low) * (xR - xL), span);
    if (doorR > xR) doorR = xR;
    let doorL = xL + div((20 - low) * (xR - xL), span);
    if (doorL < xL) doorL = xL;
    const across = xR - xL || 1;
    const rightTop = topL + div((doorR - xL) * (topR - topL), across);
    const rightBottom = botL + div((doorR - xL) * (botR - botL), across);
    const leftTop = topL + div((doorL - xL) * (topR - topL), across);
    const leftBottom = botL + div((doorL - xL) * (botR - botL), across);
    // The panel starts a quarter of the way down the face.
    const tR = Math.trunc((3 * rightTop + rightBottom) * 0.25);
    const tL = Math.trunc((3 * leftTop + leftBottom) * 0.25);

    fillFace(frame, doorL, doorR, tL, tR, leftBottom, rightBottom, () => WALL_PALETTE.door);

    for (let i = 1; i < 6; i += 2) {
      drawLine(
        frame,
        doorL,
        tL + div((leftBottom - tL) * i, 6),
        doorR,
        tR + div((rightBottom - tR) * i, 6),
        15,
      );
      if (nearBottom - nearTop > 30) {
        drawLine(
          frame,
          doorL,
          tL + div((leftBottom - tL) * i, 6) + 1,
          doorR,
          tR + div((rightBottom - tR) * i, 6) + 1,
          WALL_PALETTE.plank,
        );
      }
    }

    const thickness = div(nearBottom - nearTop, 35);
    // The lintel shading runs one step further than the frame below it does.
    if (face.kind !== 0) {
      for (let i = 0; i <= thickness; i++) {
        drawLine(frame, doorL, leftBottom - i, doorR, rightBottom - i, WALL_PALETTE.lintel);
      }
    }
    for (let i = 0; i < thickness; i++) {
      if (i === 0) {
        drawLine(frame, doorL, tL, doorL, leftBottom, 14);
        drawLine(frame, doorR, tR, doorR, rightBottom, 14);
        drawLine(frame, doorL, tL, doorR, tR, 14);
      } else if (face.kind !== 0) {
        if (doorL !== xL && face.kind !== -1) drawLine(frame, doorL + i, tL, doorL + i, leftBottom, fill);
        if (doorR !== xR && face.kind !== 1) drawLine(frame, doorR - i, tR, doorR - i, rightBottom, fill);
        drawLine(frame, doorL + 1, tL + i, doorR - 1, tR + i, fill);
      }
    }
  }
}
