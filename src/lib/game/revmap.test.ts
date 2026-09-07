import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
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
