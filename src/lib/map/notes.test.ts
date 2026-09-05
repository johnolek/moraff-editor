import { describe, expect, it } from 'vitest';
import { bundledDungeon } from '../game/dungeon';
import type { Square } from '../game/unfmap.js';
import { dungeonLookup, notableSquares, squareNotes, type FloorLookup } from './notes';

function square(overrides: Partial<Square> = {}): Square {
  return { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0, ...overrides };
}

/** A lookup over a few hand-made squares keyed by "x,y,floor"; everything else is plain. */
function lookup(squares: Record<string, Square>, landing: [number, number] = [5, 5]): FloorLookup {
  return {
    squareOn: (x, y, level) => squares[`${x},${y},${level}`] ?? square(),
    trapdoorLanding: () => landing,
  };
}

describe('squareNotes', () => {
  it('says nothing about ordinary ladders that pair up', () => {
    const floors = lookup({ '1,1,4': square({ ladder: -1 }), '1,1,3': square({ ladder: 1 }) });
    expect(squareNotes(floors, 3, square({ ladder: 1 }), 1, 1)).toEqual([]);
    expect(squareNotes(floors, 4, square({ ladder: -1 }), 1, 1)).toEqual([]);
  });

  it('flags an up ladder with no ladder back down', () => {
    const floors = lookup({ '1,1,2': square() });
    expect(squareNotes(floors, 5, square({ ladder: -3 }), 1, 1)).toEqual([{ kind: 'oneWayUp', topFloor: 2 }]);
  });

  it('flags an up ladder that arrives on a chute, and one that arrives on another up ladder', () => {
    const ontoChute = lookup({ '1,1,2': square({ chute: 4 }) });
    expect(squareNotes(ontoChute, 5, square({ ladder: -3 }), 1, 1)).toEqual([
      { kind: 'oneWayUp', topFloor: 2 },
      { kind: 'landsOn', glyph: 'chute', destination: 4 },
    ]);
    const ontoUp = lookup({ '1,1,4': square({ ladder: -2 }) });
    expect(squareNotes(ontoUp, 5, square({ ladder: -1 }), 1, 1)).toEqual([
      { kind: 'oneWayUp', topFloor: 4 },
      { kind: 'landsOn', glyph: 'up', destination: 2 },
    ]);
  });

  it('flags chutes and trap doors that land on other features', () => {
    const floors = lookup({ '1,1,7': square({ chute: 9 }), '5,5,10': square({ ladder: 1 }) });
    expect(squareNotes(floors, 6, square({ chute: 7 }), 1, 1)).toEqual([{ kind: 'landsOn', glyph: 'chute', destination: 9 }]);
    expect(squareNotes(floors, 6, square({ trapdoor: 10 }), 1, 1)).toEqual([{ kind: 'landsOn', glyph: 'down', destination: 11 }]);
  });

  it('ignores squares without a feature', () => {
    expect(squareNotes(lookup({}), 6, square(), 1, 1)).toEqual([]);
    expect(squareNotes(lookup({}), 0, square({ town: 2 }), 1, 1)).toEqual([]);
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
  it('finds one-way up ladders and only lists squares with notes', () => {
    const floors = dungeonLookup(bundledDungeon, 0);
    const rows = bundledDungeon.floor(5, 0);
    const notable = notableSquares(floors, 5, rows);
    expect(notable.length).toBeGreaterThan(0);
    for (const entry of notable) expect(entry.notes.length).toBeGreaterThan(0);
    const oneWay = notable.filter((entry) => entry.notes.some((note) => note.kind === 'oneWayUp'));
    expect(oneWay.length).toBeGreaterThan(0);
    for (const entry of oneWay) expect(rows[entry.y][entry.x].ladder).toBeLessThan(0);
  });
});
