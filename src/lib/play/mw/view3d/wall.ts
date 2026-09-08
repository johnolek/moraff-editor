import type { MapSquare } from '../../../map/game';
import type { WallFace } from '../../view3d/flood';
import { drawLine, type Frame } from '../../view3d/frame';
import { drawWallFace, type PicRowImage } from '../../view3d/texture';
import {
  DOOR_REPEAT,
  STONE_REPEAT,
  WALL_BASE,
  WALL_DOOR,
  WALL_GRADIENT,
  WALL_STONE,
  WALL_TINT,
  type MwViewPictures,
} from './pictures';

/**
 * FUN_3000_31f3 (WORLD.EXE 3000:31f3, mw.c "FUN_3000_31f3"): draw one face of one square, and say
 * whether the view carries on through it. The flood has already worked out the four corners; this
 * only turns them from the game's 1600 by 1200 units into screen pixels and paints them.
 *
 * Dungeons of the Unforgiven's FUN_3000_342d is the same routine three years later, and
 * `src/lib/play/view3d/wall.ts` is its port. The arithmetic below is shared with it constant for
 * constant — the per-square hash, the fill hash and the odd-square test are identical — so what is
 * written out here is only what Moraff's World does differently: two wall pictures instead of ten,
 * palette entries 16 to 31 instead of 80 to 95, and a right-hand edge line the later game drops.
 */

/** What `wall_side` (exe 3000:a524) calls a side. */
export const SIDE_WALL = 0;
export const SIDE_DOOR = 1;
export const SIDE_SECRET = 2;
export const SIDE_OPEN = 3;

/**
 * One wall square in 128 is turned into this before the face is drawn. Nothing then reads it:
 * only sides 3 and 1 are ever tested, so an odd square is drawn as the ordinary wall it already
 * was. Dungeons of the Unforgiven gave the same test a picture of its own and made it the
 * teleporter; here the hook is present and does nothing, and it is kept that way.
 */
export const SIDE_ODD = 4;

/** DS:4390, which the B key steps through: the texture, a flat fill, then two-colour stripes. */
export const BRICKS_TEXTURED = 0;
export const BRICKS_FILLED = 1;
export const BRICKS_STRIPED = 2;

/** The colours FUN_3000_1a08 (exe 3000:1a08) sets before it draws a view. */
export interface MwWallColours {
  /** DS:439a: the edges of a face, and three of its five decorations. */
  outline: number;
  /** DS:439c: the lattice the fifth decoration is drawn with. */
  chequer: number;
  /** The X the second decoration draws, which is written into the call rather than read from a
   *  colour global. */
  cross: number;
}

export const MW_WALL_COLOURS: MwWallColours = { outline: 15, chequer: 15, cross: 12 };

export interface MwWallScene {
  rows: MapSquare[][];
  /** DS:cd42 and DS:cd44: the square the view starts from. */
  at: { x: number; y: number };
  /** DS:cd46 and DS:cd48. */
  floor: number;
  dungeon: number;
  /** DS:cd4a: which of the four views is being drawn, 0 north, 1 south, 2 west, 3 east. */
  facing: number;
  pictures: MwViewPictures;
  /** DS:4390. */
  bricks: number;
  /** DS:cd94: the video mode MW.EXE was told to use. Two and up are the 256-colour ones. */
  videoMode: number;
  /** The real screen the 1600 by 1200 units are scaled onto. */
  screen: { width: number; height: number };
}

/** Truncate to a signed 16-bit int, which the original's arithmetic leans on. */
const short = (x: number): number => (x << 16) >> 16;
const div = (a: number, b: number): number => Math.trunc(a / b);

/**
 * `wall_side` (exe 3000:a524) read off the generated floor: side 0 is the square's west edge and
 * side 1 its north edge, which is how `MwDungeon.side` is indexed too.
 */
function sideOf(scene: MwWallScene, x: number, y: number, side: number): number {
  const square = scene.rows[y]?.[x];
  if (!square) return SIDE_WALL;
  return side === 0 ? square.w : square.n;
}

/** Which square and which of its edges a face belongs to, once the facing has been turned back. */
function faceSquare(scene: MwWallScene, face: WallFace): { x: number; y: number; side: number } {
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

/** The one square in 128 the game marks out and then does nothing with. */
function isOddSquare(scene: MwWallScene, x: number, y: number): boolean {
  return short(short(x * y) + short(scene.floor * scene.dungeon)) % 128 === 1;
}

/**
 * The per-square hash the face's style and fill colour are picked with, chosen four ways by the
 * floor's last digit.
 */
function faceStyle(scene: MwWallScene, x: number, y: number): { style: number; fill: number } {
  const floor = scene.floor;
  const tenth = floor % 10;
  let hash: number;
  if (tenth < 5) hash = div(x + y, 3) + floor * 61 + 5;
  else if (tenth < 6) hash = div(x + 67, 5) + div(y + 47, 5) + floor * 61;
  else if (tenth < 8) hash = div(x + 21, 4) + div(y + 37, 4) + floor * 61;
  else hash = x + y + floor + 58;

  let fill = 0;
  if (scene.videoMode > 1) {
    fill = short(hash * 0x11) % 13 < 4 ? (Math.abs(short(hash * 0x115)) % 11) + 16 : 13;
  }
  return { style: div(hash, 3) % 5, fill };
}

/** Fill a four-cornered face by scanlines, the way the two line-art brick speeds do. */
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
  if (botL - topL > botR - topR) {
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
export function drawMwWall(frame: Frame, scene: MwWallScene, face: WallFace): boolean {
  const { x, y, side } = faceSquare(scene, face);
  let code = sideOf(scene, x, y, side);
  if (code === SIDE_WALL && isOddSquare(scene, x, y)) code = SIDE_ODD;
  if (code === SIDE_OPEN) return true;

  const { style, fill } = faceStyle(scene, x, y);
  const low = face.pctLeft;
  const high = face.pctRight === 0 ? 99 : face.pctRight;

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

  const wall = scene.pictures.wall;
  if (wall && scene.bricks === BRICKS_TEXTURED) {
    // The texture is the whole of this mode: the original draws no outline over it, and the light
    // band along the top and bottom of every trapezoid is the picture's own — each of its 200 rows
    // opens and closes with a short run of colour 12, and a row of the picture becomes a column of
    // the face.
    //
    // draw_wall_picture also keeps the last picture drawn in each of the four views and returns
    // without drawing when it is asked for the same one again (exe 3000:04e0). That saves a repaint
    // only because the screen still holds the last frame; this port paints a fresh buffer every
    // time, so the cache is deliberately left out.
    const door = code === SIDE_DOOR;
    const picture: PicRowImage | null = wall[door ? WALL_DOOR : WALL_STONE] ?? null;
    const repeat = door ? DOOR_REPEAT : STONE_REPEAT;
    if (picture) {
      drawWallFace(frame, xL, xR, topL, topR, botL, botR, picture, low * repeat, high * repeat, {
        base: WALL_BASE,
        tint: WALL_TINT,
        gradient: WALL_GRADIENT,
      });
    }
    return false;
  }

  drawLineArt();
  return false;

  /**
   * What the game draws at the other two brick speeds, and what it falls back on when the wall
   * picture was never loaded: the face filled, outlined, and given one of five decorations.
   *
   * The door this mode draws by hand — a panel between texture columns 20 and 80 with three
   * cross-rails and a frame, exe 3000:3dc3 onwards — is not ported. Nothing reaches this path
   * with the pictures bundled, and the textured door is the one the screen shows.
   */
  function drawLineArt(): void {
    const striped = scene.bricks === BRICKS_STRIPED;
    // The stripes are the outline on its own: no fill and no decoration, only the edges.
    if (!striped) {
      const shade = scene.videoMode === 0 ? (row: number) => row % 2 : () => fill;
      fillFace(frame, xL, xR, topL, topR, botL, botR, shade);
    }

    const line = MW_WALL_COLOURS.outline;
    drawLine(frame, xL, topL, xR, topR, line);
    drawLine(frame, xL, botL, xR, botR, line);
    if (style !== 3 || striped) {
      if (low === 0) drawLine(frame, xL, topL, xL, botL, line);
      // Unlike the later game, this one really does draw the right-hand edge: the span is never
      // clamped before the test, so a face reaching the full 99 gets it.
      if (high > 98) drawLine(frame, xR, topR, xR, botR, line);
    }
    if (striped) return;

    if (style === 2) {
      for (let i = 0; i < 5; i++) {
        drawLine(frame, xL, topL + div((botL - topL) * i, 5), xR, topR + div((botR - topR) * i, 5), line);
      }
    }
    if (style < 4) {
      const third = div(xR - xL, 3);
      drawLine(frame, xL + third, div(2 * topL + topR, 3), xL + third, div(2 * botL + botR, 3), line);
      drawLine(frame, xR - third, div(topL + 2 * topR, 3), xR - third, div(botL + 2 * botR, 3), line);
    }
    if (style === 1) {
      const cross = MW_WALL_COLOURS.cross;
      drawLine(frame, xL, topL, xR, botR, cross);
      drawLine(frame, xL, botL, xR, topR, cross);
    }
  }
}
