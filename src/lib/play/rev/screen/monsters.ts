import { plot, type Frame } from '../../view3d/frame';
import { closeUpOf, distantOf } from '../../../rev-bestiary/pictures';
import { dungeonForLevel, nameIndexOf, type RevDrawing } from '../../../rev-bestiary/monsters';
import { BLACK } from './colours';
import { boxFilled, type ViewBox } from './paint';
import { squareAtDepth, type RevViewPlace } from './views';

/**
 * The monsters the 3-D views draw, and the one standing on the character's own square.
 *
 * A view draws the nearest monster along its own direction and whatever stands one square behind
 * it (`MAP-MEMORY.md` §3 and §4.5); the one on the character's square goes in the box between the
 * four views instead (`1000:6BAF`). Nothing else on this screen shows where a monster is.
 */

/** The occupancy grid, asked one square at a time: the slot standing there, or 0. */
export interface RevOccupancy {
  slotOn(column: number, row: number): number;
  /** `2.NUM`'s hit points for a slot, which the name rule below reads. */
  strengthOf(slot: number): number;
}

/** How far the box between the four views reaches (1000:591C). */
export const MIDDLE_BOX: ViewBox = { left: 214, top: 111, right: 266, bottom: 136 };

/** Where the close-up of a monster on the character's own square is put (1000:6C80). */
const MIDDLE_PICTURE = { x: 225, y: 112 };

/**
 * Where each monster in a view is put, and which picture it is drawn with.
 *
 * `1000:69FA` walks `j` from 1 and the monster it draws stands `j` squares ahead. The five
 * `PUT`s at 1000:6A98, 6ABC, 6AE0, 6B03 and 6B26 are literal coordinates inside the direction's
 * own `VIEW`, and the test at 1000:6A25 is the whole of the choice of picture: two squares off
 * or nearer is a close-up, and further away is a distant one.
 */
const AHEAD = [
  { x: 11, y: 25, distant: false, variant: 0 },
  { x: 13, y: 26, distant: false, variant: 1 },
  { x: 15, y: 25, distant: true, variant: 0 },
  { x: 17, y: 24, distant: true, variant: 1 },
  { x: 18, y: 24, distant: true, variant: 2 },
];

/** How many names a dungeon has (1000:6D40). */
const NAMES = 22;

/**
 * Which of the dungeon's names a slot is, as the view works it out.
 *
 * The view keeps its own copy of the rule at `1000:6D40` to `6DA3`, in integer arithmetic rather
 * than the encounter's single-precision, and the two come out the same: a name of 19 or 20 drops
 * eight on a dungeon level below 7 and rises two where `2.NUM` holds more than 140 for the slot.
 * So this is `nameIndexOf`, and a view names the monster a fight would name.
 */
export function viewNameIndex(slot: number, level: number, strength: number): number {
  return nameIndexOf(slot, level, strength);
}

/** The picture for a name, at the size the view wants it, or null where the file has none. */
function drawingFor(name: number, level: number, distant: boolean, variant: number): RevDrawing | null {
  if (name < 1 || name > NAMES) return null;
  const dungeon = dungeonForLevel(level);
  const monster = dungeon.monsters[name - 1];
  if (!monster) return null;
  const picture = distant ? distantOf(dungeon, monster) : closeUpOf(dungeon, monster);
  return picture?.variants[variant] ?? picture ?? null;
}

/**
 * A picture put down with `OR`, which is the action every monster in a view is drawn with.
 *
 * The compiler leaves the action clause off those five `PUT`s and its default is a bitwise OR of
 * the picture onto the screen, so a colour-0 pixel of the picture shows what is behind it and an
 * overlap comes out as the two colours' bits together.
 */
function putOr(screen: Frame, drawing: RevDrawing, x: number, y: number): void {
  drawing.rows.forEach((row, at) => {
    for (let column = 0; column < row.length; column++) {
      const px = x + column;
      const py = y + at;
      if (px < 0 || py < 0 || px >= screen.width || py >= screen.height) continue;
      plot(screen, px, py, screen.pixels[py * screen.width + px] | Number(row[column]));
    }
  });
}

/** A picture put down with `PSET`, which paints its colour-0 pixels as well. */
function putPset(screen: Frame, drawing: RevDrawing, x: number, y: number): void {
  drawing.rows.forEach((row, at) => {
    for (let column = 0; column < row.length; column++) plot(screen, x + column, y + at, Number(row[column]));
  });
}

/**
 * The monsters one direction can see, by depth: the name index, or 0 for an empty square.
 *
 * `1000:6CC5` fills this per depth as the scan walks outwards, and `1000:6DDC` remembers the
 * depth of the first one it met. The drawing then runs from depth 2 to one past that, which is
 * how a second monster standing directly behind the first gets drawn too.
 *
 * The original keeps one array of names for all four directions and never clears it, so a view
 * there can draw a monster the direction before it saw (`MAP-MEMORY.md` §4.5). This starts each
 * direction from nothing, which is the one place it declines to copy the original.
 */
export function seenAlong(
  place: RevViewPlace,
  direction: number,
  reached: number,
  occupancy: RevOccupancy,
): { seen: number[]; nearest: number } {
  const seen = new Array(AHEAD.length + 3).fill(0);
  let nearest = 0;
  for (let depth = 2; depth <= reached; depth++) {
    const { column, row } = squareAtDepth(place, direction, depth);
    const slot = occupancy.slotOn(column, row);
    if (slot === 0) continue;
    seen[depth] = viewNameIndex(slot, place.level, occupancy.strengthOf(slot));
    if (nearest === 0) nearest = depth;
  }
  return { seen, nearest };
}

/** The monsters of one direction, drawn into that direction's panel. */
export function drawMonstersInPanel(
  panel: Frame,
  place: RevViewPlace,
  direction: number,
  reached: number,
  occupancy: RevOccupancy,
): void {
  const { seen, nearest } = seenAlong(place, direction, reached, occupancy);
  // With nothing seen the loop still runs over the squares the scan reached, drawing the
  // nothing they hold (1000:6144).
  const bound = nearest === 0 ? Math.min(reached - 1, AHEAD.length) : nearest;
  for (let ahead = 1; ahead <= bound && ahead <= AHEAD.length; ahead++) {
    const name = seen[ahead + 1];
    if (name === 0) continue;
    const at = AHEAD[ahead - 1];
    const drawing = drawingFor(name, place.level, at.distant, at.variant);
    if (drawing) putOr(panel, drawing, at.x, at.y);
  }
}

/**
 * The box between the four views: blank, or the monster standing where the character stands.
 *
 * `1000:58F7` clears the box when the square is empty and `1000:6BAF` puts the biggest close-up
 * in it when it is not. The picture covers the `H=HELP` printed under it.
 */
export function drawMiddleBox(screen: Frame, place: RevViewPlace, occupancy: RevOccupancy): void {
  const slot = occupancy.slotOn(place.column, place.row);
  if (slot === 0) {
    boxFilled(screen, MIDDLE_BOX.left, MIDDLE_BOX.top, MIDDLE_BOX.right, MIDDLE_BOX.bottom, BLACK);
    return;
  }
  const name = viewNameIndex(slot, place.level, occupancy.strengthOf(slot));
  const drawing = drawingFor(name, place.level, false, 0);
  if (drawing) putPset(screen, drawing, MIDDLE_PICTURE.x, MIDDLE_PICTURE.y);
}
