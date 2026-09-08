import { expLabel, levelLabel } from '../character/record';
import type { DiscoveredMap } from '../map/draw-floor';
import type { MapSquare } from '../map/game';
import { ARMOR_NAMES, WEAPON_NAMES } from '../game/port/drops';
import type { PlayerCharacter, ScreenLine, ScreenRect } from '../game/port/state';
import { drawLine, fillRect, plot, type Frame } from './view3d/frame';
import { drawZoomMonsters, type ZoomMapWindow } from './zoom-monsters';

/**
 * The whole screen `movecontrol` (exe 2000:c308) keeps up while the game is played: the four 3-D
 * views, the boxes around them and the blocks of text on them.
 *
 * Everything is placed in the grid the game draws in whatever the video mode, 1600 across and
 * 1200 down, which is the grid `view3d/text.ts` draws a line of text in and the one the view
 * rectangles in `view3d/geometry.ts` are given in. `dotu-tools/docs/SCREEN.md` is the same
 * screen described from a photograph of the real thing.
 */

/** The whole of it, for anything that wants the screen as a rectangle. */
export const SCREEN_WINDOW = { x: 0, y: 0, width: 1600, height: 1200 };

/** One of the twelve screens the game can run in. */
export interface VideoMode {
  /** The number DS:c6a8 holds, which the game takes from its fourth command-line argument. */
  mode: number;
  width: number;
  height: number;
  colours: number;
}

/**
 * The twelve video modes, from the jump table at `FUN_2000_1598` (exe 2000:1598, dispatched at
 * 2000:15ac). Each arm sets the screen's last column at DS:c6aa and its last row at DS:c6ae —
 * one less than the sizes below — and the number of colours at DS:c6e9.
 *
 * The G key does not choose between them: it only cycles the view size and the wall detail.
 */
export const VIDEO_MODES: VideoMode[] = [
  { mode: 0, width: 720, height: 348, colours: 2 },
  { mode: 1, width: 320, height: 200, colours: 4 },
  { mode: 2, width: 320, height: 200, colours: 16 },
  { mode: 3, width: 320, height: 200, colours: 256 },
  { mode: 4, width: 360, height: 480, colours: 256 },
  { mode: 5, width: 640, height: 350, colours: 16 },
  { mode: 6, width: 640, height: 480, colours: 16 },
  { mode: 7, width: 800, height: 600, colours: 16 },
  { mode: 8, width: 1024, height: 768, colours: 16 },
  { mode: 9, width: 1024, height: 768, colours: 256 },
  { mode: 10, width: 1024, height: 768, colours: 256 },
  { mode: 11, width: 640, height: 480, colours: 256 },
];

/** The mode the game is played in here: 1024 by 768 in 256 colours. */
export const SCREEN_MODE = VIDEO_MODES[9];
export const SCREEN_PIXELS = { width: SCREEN_MODE.width, height: SCREEN_MODE.height };

/** A box on the screen, in those same units. Both edges are inside it. */
export interface ScreenBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
  colour: number;
}

/**
 * The rectangles the game fills before it draws anything in them, in the order it fills them.
 *
 * Each is a `FUN_2000_20db` (exe 2000:20db) call, which scales its corners by 1599 and 1199 —
 * one unit off `pfont`'s 1600 and 1200. Every colour here is the one a 256-colour mode gets; the
 * lower ones fill some of these boxes flat black instead, which this port does not offer.
 */
export const KEY_MENU_BOX: ScreenBox = { left: 4, top: 5, right: 0x126, bottom: 0x20f, colour: 10 };
export const ZOOM_MAP_BOX: ScreenBox = { left: 0x519, top: 0, right: 0x63f, bottom: 0x20c, colour: 10 };
export const BATTLE_SPELLS_BOX: ScreenBox = { left: 5, top: 0x2fe, right: 0x2ac, bottom: 0x40c, colour: 10 };
/** The strip above the message box, which is the background of the one line drawn over the menu. */
export const MESSAGE_BAR_BOX: ScreenBox = { left: 0x398, top: 0x2ff, right: 0x640, bottom: 0x329, colour: 11 };
export const MESSAGE_BOX: ScreenBox = { left: 0x398, top: 0x324, right: 0x640, bottom: 0x4af, colour: 13 };
export const STATUS_BOX: ScreenBox = { left: 4, top: 0x40e, right: 0x393, bottom: 0x4ac, colour: 11 };

export const SCREEN_BOXES: ScreenBox[] = [
  KEY_MENU_BOX,
  ZOOM_MAP_BOX,
  BATTLE_SPELLS_BOX,
  MESSAGE_BAR_BOX,
  MESSAGE_BOX,
  STATUS_BOX,
];

/**
 * `FUN_4000_667b` (exe 4000:667b, unf.c "FUN_4000_667b"): the thirteen lines of the key menu.
 *
 * Every line is drawn twice, once in green and once in yellow, and the yellow pass puts the key
 * letter into a hole the green pass left. `psfont` (exe 4000:0db8) steps by the width it is
 * given divided by the string's own length, so a pass lands its letters where it does by how
 * long it is and how far it is spread; two of the lines are given a shorter string and a wider
 * spread above 1000 pixels across, which is what `keysSpreadTo` below is. The strings are the
 * bytes of the data segment, spaces and all.
 *
 * The two passes are not drawn in the same face. `FUN_4000_667b` clears DS:4dec around the green
 * pass, which stops `psfont` handing those lines to the vector font, so the menu's own words come
 * out as .FNT glyphs while the key letters over them are strokes — see `view3d/menu-font.ts`.
 */
export const KEY_MENU_X = 9;
export const KEY_MENU_SPREAD_TO = 0x126;
/** The colour of the key letter in every line. */
export const KEY_MENU_KEY_COLOUR = 4;

export const KEY_MENU_LINES: {
  y: number;
  body: string;
  keys: string;
  colour: number;
  /** The x the key letters are spread out to, where it is not the body's own. */
  keysSpreadTo?: number;
}[] = [
  { y: 0x00a, body: ' ) PREP SPELLS', keys: '1             ', colour: 8 },
  { y: 0x02f, body: 'VIEW  ONEY    ', keys: '   M     ', colour: 8, keysSpreadTo: 0x134 },
  { y: 0x054, body: ' IEW STATS    ', keys: 'V             ', colour: 8 },
  { y: 0x079, body: ' AST SPELL    ', keys: 'C             ', colour: 8 },
  { y: 0x09e, body: 'E PAND MAP    ', keys: ' X            ', colour: 8 },
  { y: 0x0c3, body: ' XP NEEDED    ', keys: 'E             ', colour: 8 },
  // The one line of the menu the game draws in pale blue rather than green.
  { y: 0x0e8, body: ' PTIONS MENU  ', keys: 'O             ', colour: 3 },
  { y: 0x10c, body: 'DIG  UNNEL    ', keys: '    T         ', colour: 8 },
  { y: 0x131, body: ' IGHT  OSE ITEM', keys: 'F     L        ', colour: 8 },
  { y: 0x156, body: ' RMOR  EAPONS ', keys: 'A   W    ', colour: 8, keysSpreadTo: 0x119 },
  { y: 0x17b, body: ' OOM   OCKETS ', keys: 'Z     P       ', colour: 8 },
  { y: 0x19f, body: ' ELP   RAPHICS', keys: 'H     G       ', colour: 8 },
  { y: 0x1c4, body: ' UIT  USE  TEM', keys: 'Q         I   ', colour: 8 },
];

/** The white line under the menu, in the same box (DS:6779). */
export const SECTION_INFO = { text: 'S) SECTION INFO', y: 0x1ea, colour: 15 };

/**
 * How far down its own line the game drops the body pass, which is twice the font index it
 * passes for it: 4 at 1024 by 768, where that index is 2.
 */
export const KEY_MENU_BODY_DROP = 4;

/** The thirteen lines and the line under them, as the screen renderer takes them. */
export function keyMenuLines(): ScreenLine[] {
  const place = { x: KEY_MENU_X, spreadTo: KEY_MENU_SPREAD_TO, font: 0 };
  const lines = KEY_MENU_LINES.flatMap((line): ScreenLine[] => [
    { ...place, text: line.body, y: line.y + KEY_MENU_BODY_DROP, colour: line.colour, bitmapFace: true },
    {
      ...place,
      spreadTo: line.keysSpreadTo ?? KEY_MENU_SPREAD_TO,
      text: line.keys,
      y: line.y,
      colour: KEY_MENU_KEY_COLOUR,
    },
  ]);
  return [...lines, { ...place, text: SECTION_INFO.text, y: SECTION_INFO.y, colour: SECTION_INFO.colour }];
}

/**
 * `FUN_3000_caac` (exe 3000:caac, unf.c "FUN_3000_caac"): the green block along the bottom.
 *
 * The experience is printed with `%-20.0f`, whose trailing spaces draw nothing, so the port
 * prints the number alone. A character of level 9 or more gets the short labels and a different
 * set of x's, which is how the experience of a deep character still fits on the line.
 */
export function statusLines(pc: PlayerCharacter): ScreenLine[] {
  const short = pc.lev >= 9;
  const at = (text: string, x: number, y: number, colour: number): ScreenLine => ({ text, x, y, font: 0, colour });
  return [
    at(`ARMOR:${ARMOR_NAMES[pc.armor] ?? '?'}`, 0x0a, 0x410, 3),
    at(`WEAPON:${WEAPON_NAMES[pc.weapon] ?? '?'}`, 0x190, 0x410, 3),
    at(`${levelLabel(pc.lev)}${pc.lev}`, 0x0a, 0x437, 4),
    at(expLabel(pc.lev), short ? 0x8c : 0x122, 0x437, 4),
    at(String(Math.round(pc.exp)), short ? 0xbe : 0x190, 0x437, 4),
    at(`SPELL POINTS:${Math.trunc(pc.sp)} OF ${Math.trunc(pc.maxSp)}`, 0x0a, 0x45d, 8),
    at(`HEALTH POINTS:${pc.hp} OF ${pc.maxHp}`, 0x0a, 0x483, 8),
    at(`STR:${pc.str}`, 0x24e, 0x437, 6),
    at(`INT:${pc.iq}`, 0x2f8, 0x437, 6),
    at(`WIZ:${pc.wis}`, 0x24e, 0x45d, 6),
    at(`CON:${pc.con}`, 0x2f8, 0x45d, 6),
    at(`DEX:${pc.dex}`, 0x24e, 0x483, 6),
    // The one label with no colon, which is why the block reads LUCK17 (DS:2831).
    at(`LUCK${pc.luck}`, 0x2f8, 0x483, 6),
  ];
}

/**
 * `FUN_3000_8e75` (exe 3000:8e75, unf.c "FUN_3000_8e75"): the small map in the top right corner,
 * drawn in the screen's own pixels rather than the 1600 x 1200 grid.
 *
 * `FUN_2000_59c0` (exe 2000:59c0) sets the three numbers below out of a table the video mode
 * indexes: 8 pixels in 15 columns by 26 rows on a 640 x 480 screen, and 10 in 19 by 33 on a
 * 1024 x 768 one. The window is centred on the character, who stands at column `columns >> 1`
 * and row `rows >> 1`.
 */
export const ZOOM_CELL = 10;
export const ZOOM_COLUMNS = 19;
export const ZOOM_ROWS = 33;

/** The left edge of the map, as DS:0411 works it out from the screen's width. */
export const zoomMapLeft = (screenWidth: number): number =>
  Math.trunc(((screenWidth - 1) * ZOOM_MAP_BOX.left) / 0x63f);

/** Which square of the floor a cell of the map shows. */
export function zoomMapSquare(at: { x: number; y: number }, column: number, row: number): { x: number; y: number } {
  return { x: at.x + column - (ZOOM_COLUMNS >> 1), y: at.y + row - (ZOOM_ROWS >> 1) };
}

/**
 * `FUN_2000_9d17` (exe 2000:9d17): the arrow on the character's square, as the 7 x 7 bitmap at
 * DS:046d that a cell of eight pixels uses. Its point is at the top before the facing turns it.
 */
export const FACING_ARROW = [
  '   X   ',
  '  XXX  ',
  ' XXXXX ',
  'XXXXXXX',
  '  XXX  ',
  '  XXX  ',
  '  XXX  ',
];

/**
 * Where one pixel of that bitmap lands, given the corner of the character's cell. The four cases
 * are the original's own rotations, which mirror rather than turn for south and east.
 */
export function arrowPixel(
  facing: number,
  x: number,
  y: number,
  column: number,
  row: number,
): { x: number; y: number } {
  if (facing === 1) return { x: x + column - 1, y: y - row + 5 };
  if (facing === 2) return { x: x + row - 1, y: y + column - 1 };
  if (facing === 3) return { x: x - row + 5, y: y + column - 1 };
  return { x: x + column - 1, y: y + row - 1 };
}

/** What the drawing half of the screen needs to know about the floor the character stands on. */
export interface ZoomMapFloor {
  rows: MapSquare[][];
  at: { x: number; y: number; dir: number };
  /** The map the character has discovered: a square it does not know is not drawn at all, and a
   *  chute is marked only on a square that was already known when they arrived. */
  map: DiscoveredMap;
  /** The monsters to mark on the map, which the game never marks and debug mode always does. */
  monsters?: { x: number; y: number }[];
}

/** Where the map is drawn on a frame of this width, and how much of the floor it shows. */
export const zoomMapWindow = (frameWidth: number): ZoomMapWindow => ({
  left: zoomMapLeft(frameWidth),
  top: 0,
  cell: ZOOM_CELL,
  columns: ZOOM_COLUMNS,
  rows: ZOOM_ROWS,
});

/**
 * Where a corner of a filled rectangle lands on the frame. `FUN_2000_20db` (exe 2000:20db) scales
 * its corners by the screen's last column over 1599 and its last row over 1199, one unit off
 * `pfont`'s own 1600 and 1200.
 */
const fillX = (frame: Frame, x: number): number => Math.trunc(((frame.width - 1) * x) / 0x63f);
const fillY = (frame: Frame, y: number): number => Math.trunc(((frame.height - 1) * y) / 0x4af);

/**
 * The colour 0 a screen that takes the display over is drawn on: `cast_a_spell` fills the top of
 * the screen for its spell table and the message column for the miniature one, and a screen whose
 * own fill is lost in the decompilation blacks the whole display out instead.
 */
export function clearScreenRect(frame: Frame, rect: ScreenRect): void {
  const [left, top] = [fillX(frame, rect.x), fillY(frame, rect.y)];
  fillRect(frame, left, top, fillX(frame, rect.right), fillY(frame, rect.bottom), 0);
}

/**
 * The boxes and the zoom map, painted into the frame the four views are drawn on. The words over
 * them go on afterwards, through `view3d/text.ts`.
 */
export function drawScreenFurniture(frame: Frame, floor: ZoomMapFloor): void {
  for (const box of SCREEN_BOXES) {
    const [left, top] = [fillX(frame, box.left), fillY(frame, box.top)];
    fillRect(frame, left, top, fillX(frame, box.right), fillY(frame, box.bottom), box.colour);
  }
  drawZoomMap(frame, floor);
  drawZoomMonsters(frame, zoomMapWindow(frame.width), floor.at, floor.monsters ?? []);
}

/**
 * The colours `drawsquare` (exe 3000:87de) draws a square's own marks in.
 *
 * The white is `draw_side`'s (exe 3000:8432) for every side and every door tick; the red is the
 * four corner dots, which the game plots in every video mode from the 640 by 350 one up and in
 * none of the five below it; the yellow is the ladder and trap door diagonals, and the pale blue
 * the chute's, which the chute branch swaps in for the yellow.
 *
 * The two marks are white instead when DS:00c7 is set, which is the switch the game takes from a
 * negative video mode number on its command line (exe 2000:6337). The mode the game is played in
 * here is a positive 9, so that switch is off.
 */
export const ZOOM_SIDE_COLOUR = 15;
export const ZOOM_CORNER_COLOUR = 6;
export const ZOOM_MARK_COLOUR = 4;
export const ZOOM_CHUTE_COLOUR = 3;

/**
 * The colour a square with one of the town's four buildings on it is filled with: the building's
 * own number plus two, except that the inn's 6 is moved on to 8 (exe 3000:8864). Six is the red
 * the corner dots are plotted in, and eight a dark grey.
 */
export function zoomBuildingColour(building: number): number {
  const colour = building + 2;
  return colour === 6 ? 8 : colour;
}

/** A square with neither a trap door nor a chute on it, which is what the game leaves the
 *  destination floor at and what stops both diagonals being drawn. */
const NOTHING_CROSSED = -1;

/**
 * The diagonals are drawn twice, a pixel apart, on a screen wider than 1000 of its own pixels
 * (exe 3000:8c02). The play screen is 1024 across, so its map always draws them thick.
 */
const THICK_MARK_ABOVE_WIDTH = 1000;

/** The cell size from which a door's tick is drawn as a pair of long lines as well. */
const DOOR_TICK_PAIR_FROM_CELL = 8;

/** `drawsquare` (exe 3000:87de) and `draw_side` (exe 3000:8432) for every square of the window. */
function drawZoomMap(frame: Frame, floor: ZoomMapFloor): void {
  const left = zoomMapLeft(frame.width);
  for (let column = 0; column < ZOOM_COLUMNS; column++) {
    for (let row = 0; row < ZOOM_ROWS; row++) {
      const square = zoomMapSquare(floor.at, column, row);
      if (!floor.map.known(square.x, square.y)) continue;
      const here = floor.rows[square.y]?.[square.x];
      // Rock is never drawn. solidcheck calls a square rock when it has a wall on all four
      // sides, and nothing ever stands on one: a step cannot reach it and no 3-D view sees
      // into it, so the character's own map never marks one. The test only bites on a floor
      // the site has revealed whole, where it keeps the rock blank instead of drawing it as a
      // square somebody could be standing in.
      if (!here || here.solid) continue;
      drawZoomSquare(frame, here, left + column * ZOOM_CELL, row * ZOOM_CELL, {
        chuteKnown: floor.map.knownOnArrival(square.x, square.y),
      });
    }
  }

  // The original flashes the arrow white six times a second; the port draws it steadily.
  const originX = left + (ZOOM_COLUMNS >> 1) * ZOOM_CELL + 2;
  const originY = (ZOOM_ROWS >> 1) * ZOOM_CELL + 2;
  FACING_ARROW.forEach((line, row) => {
    for (let column = 0; column < line.length; column++) {
      if (line[column] !== 'X') continue;
      const at = arrowPixel(floor.at.dir, originX, originY, column, row);
      plot(frame, at.x, at.y, 15);
    }
  });
}

/**
 * One square of the map, in the order `drawsquare` (exe 3000:87de) draws it: the fill, the four
 * sides, the four corner dots, and the marks for what the square holds.
 *
 * A square is filled black unless one of the town's four buildings stands on it, which is all the
 * map ever says about a building — no mark goes over the colour. The marks belong to the other
 * three things a square can hold, and the routine asks about them in order, each only on a square
 * the last one left alone: a ladder down is one diagonal and a ladder up the other, a trap door is
 * both, and a chute is both with a plus sign through them, in pale blue rather than yellow. The
 * chute is asked about only on a square that was already known when the character arrived on the
 * floor, which is why a chute shows on the map after they have left and come back and not before.
 */
function drawZoomSquare(
  frame: Frame,
  square: MapSquare,
  x: number,
  y: number,
  asTheGame: { chuteKnown: boolean },
): void {
  const ladder = square.ladder;
  const building = ladder === 0 ? (square.town ?? 0) : 0;
  fillRect(frame, x + 1, y + 1, x + ZOOM_CELL, y + ZOOM_CELL, building === 0 ? 0 : zoomBuildingColour(building));

  drawZoomSide(frame, square.w, x, y, false);
  drawZoomSide(frame, square.n, x, y, true);
  drawZoomSide(frame, square.e, x + ZOOM_CELL, y, false);
  drawZoomSide(frame, square.s, x, y + ZOOM_CELL, true);
  for (const corner of [x, x + ZOOM_CELL]) {
    plot(frame, corner, y, ZOOM_CORNER_COLOUR);
    plot(frame, corner, y + ZOOM_CELL, ZOOM_CORNER_COLOUR);
  }

  // The trap door's own destination floor, which the square is crossed for whatever it is, and
  // which the chute branch borrows when it claims the square instead.
  let crossed = building === 0 && ladder === 0 ? square.trapdoor : NOTHING_CROSSED;
  let colour = ZOOM_MARK_COLOUR;
  if (ladder === 0 && crossed === NOTHING_CROSSED && asTheGame.chuteKnown && square.chute !== 0) {
    crossed = square.chute;
    colour = ZOOM_CHUTE_COLOUR;
    const middle = Math.trunc(ZOOM_CELL / 2);
    drawLine(frame, x + middle, y, x + middle, y + ZOOM_CELL, colour);
    drawLine(frame, x, y + middle, x + ZOOM_CELL, y + middle, colour);
  }

  const thick = frame.width - 1 > THICK_MARK_ABOVE_WIDTH;
  if (ladder > 0 || crossed !== NOTHING_CROSSED) {
    drawLine(frame, x, y, x + ZOOM_CELL, y + ZOOM_CELL, colour);
    if (thick) drawLine(frame, x, y + 1, x + ZOOM_CELL, y + ZOOM_CELL + 1, colour);
  }
  if (ladder < 0 || crossed !== NOTHING_CROSSED) {
    drawLine(frame, x, y + ZOOM_CELL, x + ZOOM_CELL, y, colour);
    if (thick) drawLine(frame, x, y + ZOOM_CELL + 1, x + ZOOM_CELL, y + 1, colour);
  }
}

/**
 * `draw_side` (exe 3000:8432): one side of one cell. `horizontal` sides run along the cell's top
 * edge and the others down its left edge; `x` and `y` are the cell's own corner, so the east and
 * south sides are drawn as the west and north sides of the next cell along.
 *
 * Every side but an open one gets a plain line, so a secret door and a module teleporter are
 * walls to look at. A door gets ticks across it as well, which is the gap in the wall the map
 * draws a doorway as: a short one three pixels long, and on a cell of eight pixels or more two
 * longer ones a pixel either side of it. The two halves of the routine differ over that short
 * tick — the side running along the top draws it only on a cell too small for the long pair,
 * and the side running down the left draws it always, under the pair.
 */
function drawZoomSide(frame: Frame, side: number, x: number, y: number, horizontal: boolean): void {
  if (side !== 3) {
    if (horizontal) drawLine(frame, x + 1, y, x + ZOOM_CELL - 1, y, ZOOM_SIDE_COLOUR);
    else drawLine(frame, x, y + 1, x, y + ZOOM_CELL - 1, ZOOM_SIDE_COLOUR);
  }
  if (side !== 1) return;
  const middle = ZOOM_CELL >> 1;
  const reach = Math.trunc(ZOOM_CELL / 3);
  const long = ZOOM_CELL >= DOOR_TICK_PAIR_FROM_CELL;
  if (horizontal) {
    if (long) {
      drawLine(frame, x + middle - 1, y - reach, x + middle - 1, y + reach, ZOOM_SIDE_COLOUR);
      drawLine(frame, x + middle + 1, y - reach, x + middle + 1, y + reach, ZOOM_SIDE_COLOUR);
      return;
    }
    drawLine(frame, x + middle, y - 1, x + middle, y + 1, ZOOM_SIDE_COLOUR);
    return;
  }
  // A door on a side too near the right of the screen draws no tick at all: the game works out
  // where the right-hand end would reach and gives up when that is past the last column.
  if (x + reach >= frame.width - 1) return;
  if (long) {
    drawLine(frame, x - reach, y + middle + 1, x + reach, y + middle + 1, ZOOM_SIDE_COLOUR);
    drawLine(frame, x - reach, y + middle - 1, x + reach, y + middle - 1, ZOOM_SIDE_COLOUR);
  }
  drawLine(frame, x - 1, y + middle, x + 1, y + middle, ZOOM_SIDE_COLOUR);
}
