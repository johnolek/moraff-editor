import { describe, expect, it } from 'vitest';
import { newFrame, pixelAt, type Frame } from '../../view3d/frame';
import { BLACK, RED, TEXT } from './colours';
import { drawMap, drawMapMonsters, squareLeft, squareTop, TOWN_BUILDINGS, type RevMapView } from './map';
import { debugDrawn, type PlayMode } from '../../mode';
import { wallSide, ACROSS, DOWN } from '../../../game/revmap.js';

function view(named: Partial<RevMapView> = {}): RevMapView {
  return {
    level: named.level ?? 3,
    generation: named.generation ?? 1,
    column: named.column ?? 10,
    row: named.row ?? 10,
    facing: named.facing ?? 1,
    known: named.known ?? (() => true),
  };
}

/** A square whose named side is a door, which is the only side the map breaks a line in. */
function findSide(kind: number, level: number, want: (value: number) => boolean): { column: number; row: number } {
  for (let column = 2; column <= 19; column++) {
    for (let row = 2; row <= 18; row++) {
      if (want(wallSide(kind, column, row, level, 1))) return { column, row };
    }
  }
  throw new Error('no such side on this floor');
}

describe('where a square lands on the screen', () => {
  it('puts column 1 row 1 in the corner and steps eight pixels a square', () => {
    expect(squareLeft(1)).toBe(0);
    expect(squareTop(1)).toBe(45);
    expect(squareLeft(20)).toBe(152);
    expect(squareTop(19)).toBe(189);
  });
});

describe('drawing the map', () => {
  it('draws nothing at all for a square the character has not stood on', () => {
    const screen = newFrame(320, 200);
    drawMap(screen, view({ known: (column, row) => column === 10 && row === 10 }));
    expect(pixelAt(screen, squareLeft(5), squareTop(5))).toBe(BLACK);
  });

  it('breaks a door in the middle and leaves a wall solid', () => {
    const screen = newFrame(320, 200);
    const door = findSide(DOWN, 3, (value) => value >= 6 && value <= 7);
    const wall = findSide(DOWN, 3, (value) => value >= 8);
    drawMap(screen, view());
    const x = squareLeft(door.column);
    const y = squareTop(door.row);
    expect(pixelAt(screen, x, y + 1)).toBe(RED);
    expect(pixelAt(screen, x, y + 4)).toBe(BLACK);
    expect(pixelAt(screen, squareLeft(wall.column), squareTop(wall.row) + 4)).toBe(RED);
  });

  it('breaks a side door over five pixels and a top door over three', () => {
    const screen = newFrame(320, 200);
    const across = findSide(ACROSS, 3, (value) => value >= 6 && value <= 7);
    // Only the square below an unwalked one draws its own top side, so ask for that square alone.
    drawMap(screen, view({ known: (column, row) => column === across.column && row === across.row }));
    const x = squareLeft(across.column);
    const y = squareTop(across.row);
    expect(pixelAt(screen, x + 2, y)).toBe(RED);
    expect(pixelAt(screen, x + 3, y)).toBe(BLACK);
    expect(pixelAt(screen, x + 5, y)).toBe(BLACK);
    expect(pixelAt(screen, x + 6, y)).toBe(RED);
  });

  it('marks the ten buildings of the town with a letter and nothing in the dungeon', () => {
    const town = newFrame(320, 200);
    drawMap(town, view({ level: 0, column: 1, row: 1 }));
    const inn = TOWN_BUILDINGS[0];
    const letters = countIn(town, squareLeft(inn.column) + 1, squareTop(inn.row) + 1, TEXT);
    expect(letters).toBeGreaterThan(0);

    const dungeon = newFrame(320, 200);
    drawMap(dungeon, view({ level: 3, column: 1, row: 1 }));
    expect(countIn(dungeon, squareLeft(inn.column) + 1, squareTop(inn.row) + 1, TEXT)).toBe(0);
  });

  it('draws the character as an arrow that faces the way they do', () => {
    const north = newFrame(320, 200);
    drawMap(north, view({ known: () => false, column: 5, row: 5, facing: 1 }));
    const east = newFrame(320, 200);
    drawMap(east, view({ known: () => false, column: 5, row: 5, facing: 2 }));
    expect(countIn(north, squareLeft(5) + 1, squareTop(5) + 1, TEXT)).toBeGreaterThan(0);
    expect(north.pixels).not.toEqual(east.pixels);
  });
});

/** How many pixels of a colour a seven by seven sprite laid at a point holds. */
function countIn(screen: { pixels: Uint8Array; width: number }, x: number, y: number, colour: number): number {
  let found = 0;
  for (let row = 0; row < 7; row++) {
    for (let column = 0; column < 7; column++) {
      if (screen.pixels[(y + row) * screen.width + x + column] === colour) found += 1;
    }
  }
  return found;
}

describe('the monsters debug mode marks on the map', () => {
  const at = { column: 10, row: 10 };
  /** Two monsters standing where the character cannot see them: this game's views show only the
   *  square the character stands on, so neither would be drawn anywhere else. */
  const outOfSight = [
    { column: 4, row: 6 },
    { column: 15, row: 14 },
  ];

  /** Whether anything was drawn on a square, which for a mark is the letter's own colour. */
  function lettered(screen: Frame, square: { column: number; row: number }): boolean {
    const left = squareLeft(square.column) + 1;
    const top = squareTop(square.row) + 1;
    for (let x = left; x < left + 7; x++) {
      for (let y = top; y < top + 7; y++) if (pixelAt(screen, x, y) === TEXT) return true;
    }
    return false;
  }

  /** The map as `from-game.ts` asks for it in that mode: every monster on the level, or none. */
  function marked(mode: PlayMode): boolean[] {
    const screen = newFrame(320, 200);
    drawMapMonsters(screen, at, debugDrawn(mode) ? outOfSight : []);
    return outOfSight.map((monster) => lettered(screen, monster));
  }

  it('marks both of them in debug', () => {
    expect(marked('debug')).toEqual([true, true]);
  });

  it('marks neither in faithful or in speedrun', () => {
    expect(marked('faithful')).toEqual([false, false]);
    expect(marked('speedrun')).toEqual([false, false]);
  });

  it("leaves the character's own square to its arrow", () => {
    const screen = newFrame(320, 200);
    drawMap(screen, view({ column: at.column, row: at.row }));
    const before = screen.pixels.slice();
    drawMapMonsters(screen, at, [at]);
    expect(screen.pixels).toEqual(before);
  });
});
