import { describe, expect, it } from 'vitest';
import { bundledDungeon } from '../game/dungeon';
import type { Square } from '../game/unfmap.js';
import { MAP_COLUMNS, MAP_ROWS } from './area';
import { dungeonLookup, notableSquares, squareNotes, type FloorLookup } from './notes';

function square(overrides: Partial<Square> = {}): Square {
  return { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0, ...overrides };
}

/** A lookup over a few hand-made squares keyed by "x,y,floor"; everything else is plain. */
function lookup(squares: Record<string, Square>): FloorLookup {
  return { squareOn: (x, y, level) => squares[`${x},${y},${level}`] ?? square() };
}

describe('squareNotes', () => {
  it('says nothing about an up ladder with a ladder back down', () => {
    const floors = lookup({ '1,1,4': square({ ladder: 1 }) });
    expect(squareNotes(floors, 5, square({ ladder: -1 }), 1, 1)).toEqual([]);
  });

  it('flags an up ladder with no ladder back down', () => {
    const floors = lookup({ '1,1,2': square() });
    expect(squareNotes(floors, 5, square({ ladder: -3 }), 1, 1)).toEqual([{ kind: 'oneWayUp', topFloor: 2 }]);
  });

  it('flags an up ladder that arrives on a chute', () => {
    const floors = lookup({ '1,1,2': square({ chute: 4 }) });
    expect(squareNotes(floors, 5, square({ ladder: -3 }), 1, 1)).toEqual([
      { kind: 'oneWayUp', topFloor: 2 },
      { kind: 'landsOnChute', chuteFloor: 4 },
    ]);
  });

  it('says nothing about anything but an up ladder', () => {
    const floors = lookup({ '1,1,7': square({ chute: 9 }), '1,1,4': square({ ladder: -2 }) });
    expect(squareNotes(floors, 6, square({ chute: 7 }), 1, 1)).toEqual([]);
    expect(squareNotes(floors, 6, square({ trapdoor: 10 }), 1, 1)).toEqual([]);
    expect(squareNotes(floors, 3, square({ ladder: 1 }), 1, 1)).toEqual([]);
    expect(squareNotes(floors, 6, square(), 1, 1)).toEqual([]);
    expect(squareNotes(floors, 0, square({ town: 2 }), 1, 1)).toEqual([]);
  });
});

describe('dungeonLookup', () => {
  it('reproduces every square of a floor exactly as Dungeon.floor() does', () => {
    const floors = dungeonLookup(bundledDungeon, 1);
    for (const level of [0, 3]) {
      const rows = bundledDungeon.floor(level, 1);
      rows.forEach((row, y) => row.forEach((expected, x) => expect(floors.squareOn(x, y, level)).toEqual(expected)));
    }
  });
});

describe('notableSquares on a real floor', () => {
  it('lists up ladders and nothing else', () => {
    const floors = dungeonLookup(bundledDungeon, 0);
    const rows = bundledDungeon.floor(5, 0);
    const notable = notableSquares(floors, 5, rows);
    expect(notable.oneWayUp.length).toBeGreaterThan(0);
    for (const entry of [...notable.oneWayUp, ...notable.intoChute]) expect(rows[entry.y][entry.x].ladder).toBeLessThan(0);
  });

  it('groups a hand-made floor by what is odd about each up ladder', () => {
    const floors = lookup({ '0,0,2': square({ chute: 7 }), '1,0,2': square({ ladder: 1 }), '2,0,2': square() });
    const rows = [[square({ ladder: -3 }), square({ ladder: -3 }), square({ ladder: -3 }), square({ ladder: 1 })]];
    expect(notableSquares(floors, 5, rows)).toEqual({
      oneWayUp: [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
      ],
      intoChute: [{ x: 0, y: 0, chuteFloor: 7 }],
    });
  });

  it('leaves out the rows and the column the game never shows', () => {
    const floors = lookup({});
    const rows: Square[][] = Array.from({ length: MAP_ROWS + 2 }, () =>
      Array.from({ length: MAP_COLUMNS + 1 }, () => square({ solid: true })),
    );
    rows[MAP_ROWS][0] = square({ ladder: -1 });
    rows[0][MAP_COLUMNS] = square({ ladder: -1 });
    expect(notableSquares(floors, 5, rows)).toEqual({ oneWayUp: [], intoChute: [] });
  });
});
