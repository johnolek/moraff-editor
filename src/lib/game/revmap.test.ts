import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  ACROSS,
  COLUMNS,
  DOWN,
  LEVELS,
  ROWS,
  falseFloor,
  feature,
  featureCode,
  floor,
  fold,
  mbfAdd,
  mbfDivide,
  mbfFix,
  mbfFromInt,
  mbfInteger,
  mbfMultiply,
  mbfSin,
  mbfSingle,
  mbfSubtract,
  mbfValue,
  side,
  squareOn,
  wallSide,
  type Mbf,
} from './revmap.js';

/** A number of the fixture, which writes every value as the three fields the format holds. */
type Triple = [number, number, number];

interface MbfFixture {
  sin: [number, Triple][];
  arithmetic: ({ a: Triple; b: Triple; divide?: Triple } & Record<string, Triple>)[];
}

const fixture: MbfFixture = JSON.parse(readFileSync('rev-tools/fixtures/mbf.json', 'utf8'));

function mbf([sign, fraction, exponent]: Triple): Mbf {
  return { sign, fraction: BigInt(fraction), exponent };
}

function triple(x: Mbf): Triple {
  return [x.sign, Number(x.fraction), x.exponent];
}

// rev-tools/reference/mbf.py is the reference for the arithmetic the dungeon is made of, and
// this file is a transcription of it. The fixture is what mbf.py answers, so a transcription
// that has drifted by one bit anywhere fails here rather than in a wall somewhere on floor 40.
describe('the run-time arithmetic', () => {
  it('does every operation the way mbf.py does', () => {
    const wrong: string[] = [];
    for (const row of fixture.arithmetic) {
      const a = mbf(row.a);
      const b = mbf(row.b);
      const got: Record<string, Mbf> = {
        multiply: mbfMultiply(a, b),
        add: mbfAdd(a, b),
        subtract: mbfSubtract(a, b),
        fix: mbfFix(a),
        integer: mbfInteger(a),
        sin: mbfSin(a),
        ...(row.divide ? { divide: mbfDivide(a, b) } : {}),
      };
      for (const [name, answer] of Object.entries(got)) {
        const expected = row[name];
        if (triple(answer).join() !== expected.join()) {
          wrong.push(`${name}(${row.a}, ${row.b}) = ${triple(answer)}, not ${expected}`);
        }
      }
    }
    expect(wrong).toEqual([]);
  });

  it('reads a stored single back as the number it holds', () => {
    // 1 / (2 * pi) and 0.5, the two constants BRUN30's SIN reduces an angle with. The first is
    // a single, so it is a little short of the real 1 / (2 * pi), and reducing a large angle
    // with it is where the run-time's sine parts company with a library one.
    expect(mbfSingle(Uint8Array.from([0x83, 0xf9, 0x22, 0x7e]))).toBe(0.15915493667125702);
    expect(mbfSingle(Uint8Array.from([0, 0, 0, 0x80]))).toBe(0.5);
    expect(mbfSingle(Uint8Array.from([0, 0, 0, 0]))).toBe(0);
  });

  it('holds a whole number of the dungeon exactly', () => {
    for (const n of [1, 10, 300, 54730, 0xffffff]) expect(mbfValue(mbfFromInt(n))).toBe(n);
  });
});

describe('SIN', () => {
  it('answers every angle the way BRUN30 does', () => {
    const wrong: string[] = [];
    for (const [angle, expected] of fixture.sin) {
      const answer = triple(mbfSin(mbfFromInt(angle)));
      if (answer.join() !== expected.join()) wrong.push(`sin(${angle}) = ${answer}, not ${expected}`);
    }
    expect(wrong).toEqual([]);
  });

  // The four angles rev-tools/docs/DUNGEON.md prints beside the real sine, to show how far the
  // run-time's own drifts from it once an angle runs into the tens of thousands.
  it.each([
    [100, -0.506367564, -0.506365641],
    [1000, 0.826860666, 0.826879541],
    [27370, 0.43032652, 0.430279088],
    [54730, -0.308712423, -0.309228641],
  ])('answers angle %i with %f, where the real sine gives %f', (angle, runtime, real) => {
    expect(mbfValue(mbfSin(mbfFromInt(angle)))).toBeCloseTo(runtime, 8);
    expect(Math.sin(angle)).toBeCloseTo(real, 8);
  });

  it('is far enough from the real sine to move a wall', () => {
    // A wall is INT(ABS(SIN(angle)) * 10), so a difference of this size is a different wall
    // about one angle in two thousand. Counting them is what says a library sine will not do.
    let moved = 0;
    for (let angle = 10; angle <= 54730; angle++) {
      const runtime = Math.trunc(Math.abs(mbfValue(mbfSin(mbfFromInt(angle)))) * 10);
      if (runtime !== Math.trunc(Math.abs(Math.sin(angle)) * 10)) moved++;
    }
    expect(moved).toBeGreaterThan(20);
  });
});

// Every wall value below was read off rev-tools/reference/revmap.py, which is the reference the
// whole rule was written from, and the counts are the ones rev-tools/docs/DUNGEON.md quotes.
describe('wallSide', () => {
  it.each([
    [ACROSS, 1, 1, 0, 5],
    [DOWN, 1, 1, 0, 9],
    [ACROSS, 15, 5, 0, 2],
    [DOWN, 10, 6, 2, 0],
  ])('gives kind %i at (%i, %i) of level %i the value %i', (kind, column, row, level, expected) => {
    expect(wallSide(kind, column, row, level)).toBe(expected);
  });

  it('walls off 42.2% of the whole dungeon and puts a door on 18.2%', () => {
    let sides = 0;
    let walls = 0;
    let doors = 0;
    for (let level = 0; level <= LEVELS; level++) {
      for (let row = 2; row <= ROWS; row++) {
        for (let column = 1; column <= COLUMNS; column++) {
          sides++;
          const value = wallSide(ACROSS, column, row, level);
          if (value >= 8) walls++;
          else if (value >= 6) doors++;
        }
      }
      for (let row = 1; row <= ROWS; row++) {
        for (let column = 2; column <= COLUMNS; column++) {
          sides++;
          const value = wallSide(DOWN, column, row, level);
          if (value >= 8) walls++;
          else if (value >= 6) doors++;
        }
      }
    }
    expect(sides).toBe(51191);
    expect(walls).toBe(21626);
    expect(doors).toBe(9311);
  });
});

describe('side', () => {
  it('turns the value into the code the map draws', () => {
    // 9 is a wall, 7 a door and 4 an opening, and (6, 4) of the town has one of each around it.
    expect([wallSide(ACROSS, 6, 4, 0), wallSide(DOWN, 6, 4, 0), wallSide(DOWN, 7, 4, 0)]).toEqual([9, 7, 4]);
    expect([side(ACROSS, 6, 4, 0), side(DOWN, 6, 4, 0), side(DOWN, 7, 4, 0)]).toEqual([0, 1, 3]);
  });

  it('walls off the four outer edges whatever the rule says', () => {
    for (let column = 1; column <= COLUMNS; column++) {
      expect(side(ACROSS, column, 1, 3)).toBe(0);
      expect(side(ACROSS, column, ROWS + 1, 3)).toBe(0);
    }
    for (let row = 1; row <= ROWS; row++) {
      expect(side(DOWN, 1, row, 3)).toBe(0);
      expect(side(DOWN, COLUMNS + 1, row, 3)).toBe(0);
    }
    // Not because the rule happens to agree: it calls this outer side an opening.
    expect(wallSide(DOWN, 1, 4, 3)).toBe(2);
  });
});

describe('fold', () => {
  it('takes 3 off twice while the code is over 3, which is 1000:5649', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9].map(fold)).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3]);
  });
});

describe('feature', () => {
  // The four ladders 5.BIN's character used, from rev-tools/docs/DUNGEON.md section 7: each is
  // a ladder down on one level and the same ladder back up on the level it reaches.
  it.each([
    [15, 5, 0, 2],
    [13, 8, 1, 1],
    [10, 6, 2, 1],
  ])('pairs the ladder down at (%i, %i) of level %i with the ladder up %i levels below', (column, row, level, span) => {
    expect(feature(column, row, level)).toEqual({ kind: 'down', span });
    expect(feature(column, row, level + span)).toEqual({ kind: 'up', span });
  });

  it('always pairs a ladder down with a ladder up of the same span', () => {
    for (const level of [0, 5, 40]) {
      for (let row = 1; row <= ROWS; row++) {
        for (let column = 1; column <= COLUMNS; column++) {
          const here = feature(column, row, level);
          if (here?.kind !== 'down') continue;
          expect(feature(column, row, level + here.span)).toEqual({ kind: 'up', span: here.span });
        }
      }
    }
  });

  it('leaves the town without a ladder up or a chute', () => {
    for (let row = 1; row <= ROWS; row++) {
      for (let column = 1; column <= COLUMNS; column++) {
        expect(feature(column, row, 0)?.kind ?? 'down').toBe('down');
      }
    }
  });

  it('reads a code of 0 as a chute', () => {
    expect(featureCode(7, 16, 1)).toBe(0);
    expect(feature(7, 16, 1)).toEqual({ kind: 'chute', span: 1 });
  });

  it('leaves the bottom level with nothing to fall through', () => {
    for (let row = 1; row <= ROWS; row++) {
      for (let column = 1; column <= COLUMNS; column++) {
        expect(feature(column, row, LEVELS)?.kind ?? 'up').not.toBe('chute');
      }
    }
  });
});

describe('falseFloor', () => {
  it('is the square a chute drops you on, when that square holds nothing itself', () => {
    expect(feature(7, 16, 1)).toEqual({ kind: 'chute', span: 1 });
    expect(feature(7, 16, 2)).toBeNull();
    expect(falseFloor(7, 16, 2)).toBe(true);
  });

  it('is nowhere a chute does not land', () => {
    expect(falseFloor(7, 16, 1)).toBe(false);
    expect(falseFloor(1, 1, 2)).toBe(false);
  });

  it('never sits on a square that holds a ladder or a chute of its own', () => {
    for (const level of [2, 17, 40]) {
      for (let row = 1; row <= ROWS; row++) {
        for (let column = 1; column <= COLUMNS; column++) {
          if (falseFloor(column, row, level)) expect(feature(column, row, level)).toBeNull();
        }
      }
    }
  });
});

describe('floor', () => {
  it('is 19 rows of 20 squares', () => {
    const rows = floor(2);
    expect(rows.length).toBe(ROWS);
    expect(rows.every((row) => row.length === COLUMNS)).toBe(true);
  });

  it('gives every square the same fields', () => {
    expect(Object.keys(floor(2)[4][14])).toEqual([
      'n',
      's',
      'w',
      'e',
      'solid',
      'ladder',
      'chute',
      'falseFloor',
      'trapdoor',
      'surface',
    ]);
  });

  it('has no rock, no trap doors and no buildings anywhere', () => {
    const squares = floor(2).flat();
    expect(squares.every((square) => !square.solid && square.trapdoor === -1 && square.surface === 0)).toBe(true);
  });

  it('carries the ladder as the floors it spans, up being negative', () => {
    // (15, 5) of the town is the ladder down two levels 5.BIN's character took.
    expect(floor(0)[4][14].ladder).toBe(2);
    expect(floor(2)[4][14].ladder).toBe(-2);
  });

  it('drops a chute one level, which is what 1000:3491 does to the level', () => {
    expect(floor(1)[15][6].chute).toBe(2);
    expect(floor(2)[15][6].falseFloor).toBe(true);
  });

  it('agrees with the square the generator answers for on its own', () => {
    const rows = floor(3, 5);
    for (let row = 1; row <= ROWS; row++) {
      for (let column = 1; column <= COLUMNS; column++) {
        expect(rows[row - 1][column - 1]).toEqual(squareOn(column, row, 3, 5));
      }
    }
  });

  it('makes a different dungeon for a different generation', () => {
    const first = JSON.stringify(floor(2, 1));
    expect(JSON.stringify(floor(2, 3))).not.toBe(first);
    expect(JSON.stringify(floor(2, 1))).toBe(first);
  });
});
