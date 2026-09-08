import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  ACROSS,
  COLUMNS,
  DOWN,
  LEVELS,
  ROWS,
  TEN,
  TOWN_BUILDINGS,
  WALL,
  blocked,
  chuteLanding,
  falseFloor,
  feature,
  featureCode,
  featureMarked,
  floor,
  fold,
  mbfAbsolute,
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
  townBuilding,
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

describe('featureMarked', () => {
  // Row 5 of the town is 36 in 7.NUM, which is bits 5 and 2 of twenty. The columns run from the
  // top bit down (1000:5449), so those are columns 15 and 18 -- two of the town's ten ladders.
  it('picks the columns of a row out from the top bit down', () => {
    const set = [];
    for (let column = 1; column <= COLUMNS; column++) if (featureMarked(column, 5, 0)) set.push(column);
    expect(set).toEqual([15, 18]);
  });

  it('marks 1,642 of the squares the game can reach', () => {
    let marked = 0;
    for (let level = 0; level <= LEVELS; level++) {
      for (let row = 1; row <= ROWS; row++) {
        for (let column = 1; column <= COLUMNS; column++) if (featureMarked(column, row, level)) marked++;
      }
    }
    expect(marked).toBe(1642);
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
    for (const level of [5, 40]) {
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

  // The town takes a ladder that reaches further than the step it asked about, so the square it
  // lands on can hold a ladder up that climbs back past level 0. Seven of the town's ten do.
  it('does not pair the town ladders with the ladders up they land beside', () => {
    expect(feature(11, 6, 0)).toEqual({ kind: 'down', span: 1 });
    expect(feature(11, 6, 1)).toEqual({ kind: 'up', span: 2 });
  });

  // 1000:55DD takes the ladder when the level below folds to at least the distance rather than
  // exactly it, and these ten squares are exactly the ten `7.NUM` marks on level 0. Asking for
  // an exact match, as every other level does, leaves only (5, 10), (15, 5) and (16, 19).
  it('takes ten ladders down out of the town, one for every square 7.NUM marks there', () => {
    const found: [number, number, number][] = [];
    for (let row = 1; row <= ROWS; row++) {
      for (let column = 1; column <= COLUMNS; column++) {
        const here = feature(column, row, 0);
        if (here) found.push([column, row, here.span]);
      }
    }
    expect(found).toEqual([
      [1, 2, 2],
      [15, 5, 2],
      [18, 5, 2],
      [11, 6, 1],
      [4, 10, 2],
      [5, 10, 1],
      [13, 13, 1],
      [7, 14, 1],
      [20, 15, 1],
      [16, 19, 1],
    ]);
  });

  // 7.NUM is an index of the feature formula rather than a second copy of it, and the two
  // disagree about 61 of the squares the game can reach. On 26 of them the formula alone puts a
  // feature the file does not mark: two levels below (11, 18) of level 4 the code is 5, which
  // folds to the two levels asked about, so without the file this square holds a ladder down.
  it('leaves a square the formula puts a ladder on, where 7.NUM has no bit', () => {
    expect(fold(featureCode(11, 18, 4, 2))).toBe(2);
    expect(featureMarked(11, 18, 4)).toBe(false);
    expect(feature(11, 18, 4)).toBeNull();
  });

  // The other 35 go the other way, and cost nothing: the file marks the square, the formula
  // finds nothing on it, and 1000:563F leaves the code at 50 once the loop has run out.
  it('leaves a square 7.NUM marks where the formula finds nothing', () => {
    expect(featureMarked(19, 14, 9)).toBe(true);
    expect(feature(19, 14, 9)).toBeNull();
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

describe('chuteLanding', () => {
  it('drops one level where the column plus the row is odd', () => {
    expect(chuteLanding(7, 16, 1)).toBe(2);
  });

  it('drops a second level where the column plus the row is even', () => {
    expect(chuteLanding(8, 16, 4)).toBe(6);
  });

  it('drops a third where the level reached plus the column is even and that level is over 25', () => {
    expect(chuteLanding(9, 17, 25)).toBe(28);
    // The same square higher up gains the second level and stops: 25 is not over 25.
    expect(chuteLanding(9, 17, 23)).toBe(25);
  });

  it('stops at the deepest level, which the module itself falls past', () => {
    expect(chuteLanding(8, 16, 69)).toBe(LEVELS);
  });
});

describe('falseFloor', () => {
  it('is the square a chute drops you on, when that square holds nothing itself', () => {
    expect(feature(7, 16, 1)).toEqual({ kind: 'chute', span: 1 });
    expect(feature(7, 16, 2)).toBeNull();
    expect(falseFloor(7, 16, 2)).toBe(true);
  });

  it('follows the fall the whole way down, not one level', () => {
    expect(falseFloor(8, 16, 6)).toBe(true);
    expect(falseFloor(9, 17, 28)).toBe(true);
  });

  it('is not a level the fall goes straight past', () => {
    // The chute on (5, 3) of level 6 lands on level 8, so level 7 of that square is never
    // landed on, although nothing at all is on it.
    expect(chuteLanding(5, 3, 6)).toBe(8);
    expect(feature(5, 3, 7)).toBeNull();
    expect(falseFloor(5, 3, 7)).toBe(false);
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

// The ten squares and their numbers are 1000:10FD's ten column-and-row tests, and the numbers
// are the ones 1000:132A's `ON building GOTO` hands to the seven building routines.
describe('townBuilding', () => {
  it.each([
    [7, 3, 1],
    [3, 2, 2],
    [18, 17, 3],
    [13, 3, 4],
    [7, 15, 5],
    [14, 12, 5],
    [18, 3, 6],
    [13, 18, 6],
    [2, 8, 6],
    [6, 14, 7],
  ])('stands building %3$i on (%1$i, %2$i)', (column, row, building) => {
    expect(townBuilding(column, row)).toBe(building);
  });

  it('leaves every other square of the town empty', () => {
    let standing = 0;
    for (let row = 1; row <= ROWS; row++) {
      for (let column = 1; column <= COLUMNS; column++) {
        const building = townBuilding(column, row);
        expect(building).toBeLessThanOrEqual(TOWN_BUILDINGS);
        if (building) standing += 1;
      }
    }
    expect(standing).toBe(10);
  });

  // The buildings sit on their own squares: nothing the game does would stop a ladder and a
  // building sharing one, and none of the ten does.
  it('stands no building on a square that holds a ladder', () => {
    for (let row = 1; row <= ROWS; row++) {
      for (let column = 1; column <= COLUMNS; column++) {
        if (townBuilding(column, row)) expect(feature(column, row, 0)).toBeNull();
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
      'town',
    ]);
  });

  it('has no rock and no trap doors anywhere', () => {
    const squares = floor(2).flat();
    expect(squares.every((square) => !square.solid && square.trapdoor === -1)).toBe(true);
  });

  it('puts a building on a town square and nothing on the same square below', () => {
    expect(floor(0)[2][6].town).toBe(1);
    expect(floor(1)[2][6].town).toBe(0);
    expect(floor(0).flat().filter((square) => square.town !== 0).length).toBe(10);
  });

  it('carries the ladder as the floors it spans, up being negative', () => {
    // (15, 5) of the town is the ladder down two levels 5.BIN's character took.
    expect(floor(0)[4][14].ladder).toBe(2);
    expect(floor(2)[4][14].ladder).toBe(-2);
  });

  it('drops a chute as far as the fall carries it, and marks where it lands', () => {
    expect(floor(1)[15][6].chute).toBe(2);
    expect(floor(2)[15][6].falseFloor).toBe(true);
    expect(floor(4)[15][7].chute).toBe(6);
    expect(floor(6)[15][7].falseFloor).toBe(true);
    // Level 7 of (5, 3) is a level the fall from level 6 goes past.
    expect(floor(7)[2][4].falseFloor).toBe(false);
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

/**
 * The squares the five shipped characters walked, taken from their `<n>.BIN` explored maps
 * (rev-tools/reference/make_explored_fixture.mjs). Coordinates are the game's own: columns 1
 * to 20 and rows 1 to 19.
 */
const walked: { generation: number; characters: { name: string; floors: { level: number; squares: [number, number][] }[] }[] } =
  JSON.parse(readFileSync('rev-tools/fixtures/explored.json', 'utf8'));

/** Whether a side is a wall, so that a rule can be moved and replayed against the same maps. */
type WallRule = (kind: number, column: number, row: number, level: number) => boolean;

/** How the walked squares of one level hang together under a rule: how many adjacent pairs it
 *  walls off, and how many pieces the walls cut the squares into. */
function replay(squares: [number, number][], level: number, isWall: WallRule): { pairs: number; separated: number; pieces: number } {
  const key = ([column, row]: [number, number]) => `${column},${row}`;
  const parent = new Map(squares.map((square) => [key(square), key(square)]));
  const root = (at: string): string => {
    let current = at;
    while (parent.get(current) !== current) {
      parent.set(current, parent.get(parent.get(current)!)!);
      current = parent.get(current)!;
    }
    return current;
  };
  let pairs = 0;
  let separated = 0;
  for (const [column, row] of squares) {
    // Every square is asked about the square above it and the square to its left, so each
    // adjacent pair is counted once: the wall between them belongs to this square.
    for (const [kind, neighbour] of [
      [ACROSS, [column, row - 1]],
      [DOWN, [column - 1, row]],
    ] as [number, [number, number]][]) {
      if (!parent.has(key(neighbour))) continue;
      pairs++;
      if (isWall(kind, column, row, level)) {
        separated++;
        continue;
      }
      const one = root(key([column, row]));
      const other = root(key(neighbour));
      if (one !== other) parent.set(one, other);
    }
  }
  return { pairs, separated, pieces: new Set(squares.map((square) => root(key(square)))).size };
}

function replayAll(isWall: WallRule) {
  let pairs = 0;
  let separated = 0;
  let levels = 0;
  let cut = 0;
  for (const character of walked.characters) {
    for (const floor of character.floors) {
      const answer = replay(floor.squares, floor.level, isWall);
      pairs += answer.pairs;
      separated += answer.separated;
      levels++;
      if (answer.pieces > 1) cut++;
    }
  }
  return { pairs, separated, levels, cut };
}

const asRead: WallRule = (kind, column, row, level) => blocked(kind, column, row, level, walked.generation);

// A character got to every square of its map by walking onto it from a square beside it, so the
// squares it has seen on one level cannot be cut into pieces by walls. That is the check
// `revmap.py --check` makes, and it is what says the rule above is the game's own rule.
describe('the squares the shipped characters really walked', () => {
  it('is nine levels across five characters', () => {
    expect(walked.characters.map((character) => character.floors.length)).toEqual([2, 1, 1, 1, 4]);
    const squares = walked.characters.flatMap((character) => character.floors.map((floor) => floor.squares.length));
    expect(squares).toEqual([32, 1, 33, 32, 32, 52, 100, 170, 36]);
  });

  it('hangs together on every level', () => {
    const { levels, cut } = replayAll(asRead);
    expect(levels).toBe(9);
    expect(cut).toBe(0);
  });

  it('walls off a quarter of the adjacent pairs, where the whole dungeon walls off two fifths', () => {
    const { pairs, separated } = replayAll(asRead);
    expect([pairs, separated]).toEqual([706, 171]);
    expect(separated / pairs).toBeLessThan(0.3);
  });

  // Each of these is one small change to the rule, replayed against the same nine levels. They
  // are the four rev-tools/docs/DUNGEON.md tried, and each of them strands a character.
  it.each([
    ['a level term of level + 3', ((kind, column, row, level) => blocked(kind, column, row, level + 1, walked.generation)) as WallRule],
    ['the two kinds swapped', ((kind, column, row, level) => blocked(kind === ACROSS ? DOWN : ACROSS, column, row, level, walked.generation)) as WallRule],
    ['a generation of 3', ((kind, column, row, level) => blocked(kind, column, row, level, 3)) as WallRule],
    ['no ten added before SIN', withoutTheTen],
  ])('cuts eight of the nine levels into pieces with %s', (_name, rule) => {
    const { levels, cut } = replayAll(rule);
    expect([levels, cut]).toEqual([9, 8]);
  });
});

/** The rule with the `+ 10` at 1000:54AF left out, which is the smallest change of the four. */
function withoutTheTen(kind: number, column: number, row: number, level: number): boolean {
  let value = mbfFromInt(level + 2);
  for (const term of [kind, column, row]) value = mbfMultiply(value, mbfFromInt(term));
  return mbfValue(mbfInteger(mbfAbsolute(mbfMultiply(mbfSin(value), TEN)))) >= WALL;
}
