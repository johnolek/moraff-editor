import { describe, expect, it } from 'vitest';
import type { Square } from '../game/unfmap.js';
import { compactSides, describeFeature, describeMonster, describeNote, describeSide, describeSquare } from './describe';

function square(overrides: Partial<Square> = {}): Square {
  return { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0, ...overrides };
}

describe('describeSide', () => {
  it('names each side kind and where teleporters lead', () => {
    expect(describeSide(0, 0)).toBe('wall');
    expect(describeSide(1, 0)).toBe('door');
    expect(describeSide(2, 0)).toBe('secret door');
    expect(describeSide(3, 0)).toBe('open');
    expect(describeSide(4, 0)).toBe('teleporter to Module II');
    expect(describeSide(4, 2)).toBe('teleporter to Module II or IV');
    expect(describeSide(4, 4)).toBe('teleporter to Module IV');
  });
});

describe('describeFeature', () => {
  it('spells out destinations and landing squares', () => {
    expect(describeFeature(null)).toBeNull();
    expect(describeFeature({ kind: 'down', destination: { floor: 3, x: 1, y: 2 } })).toBe('Down ladder to floor 3');
    expect(describeFeature({ kind: 'trapdoor', destination: { floor: 10, x: 18, y: 93 } })).toBe('Trap door to floor 10, lands at 18, 93');
    expect(describeFeature({ kind: 'town', building: 2 })).toBe('Temple');
  });
});

describe('describeSquare and compactSides', () => {
  it('describes rock without sides', () => {
    const description = describeSquare(square({ solid: true }), null, 5, 6, 0);
    expect(description).toEqual({ title: 'Square 5, 6', rock: true, sides: [], feature: null });
    expect(compactSides(description)).toBe('');
  });

  it('lists the four sides in one line', () => {
    const description = describeSquare(square({ n: 0, e: 1 }), null, 5, 6, 0);
    expect(compactSides(description)).toBe('N wall · S open · W open · E door');
  });
});

describe('describeNote', () => {
  it('spells out the two note kinds', () => {
    expect(describeNote({ kind: 'oneWayUp', topFloor: 2 })).toBe('One way: no ladder back down from floor 2.');
    expect(describeNote({ kind: 'landsOn', glyph: 'chute', destination: 4 })).toBe('Lands on a chute to floor 4.');
    expect(describeNote({ kind: 'landsOn', glyph: 'up', destination: 1 })).toBe('Lands on an up ladder to floor 1.');
  });
});

describe('describeMonster', () => {
  it('names the monster with the level and hit points it was stocked with', () => {
    const monster = { slot: 3, x: 12, y: 40, monsterId: 'builtin-0', level: 7, hp: 43 };
    expect(describeMonster(monster)).toBe('Giant Garbage Can · level 7 · 43 HP');
  });
});
