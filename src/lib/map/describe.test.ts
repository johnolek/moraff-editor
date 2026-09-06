import { describe, expect, it } from 'vitest';
import type { Square } from '../game/unfmap.js';
import { describeFeature, describeMonster, describeNote, describeSquare, describeTeleporter } from './describe';

function square(overrides: Partial<Square> = {}): Square {
  return { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0, ...overrides };
}

describe('describeTeleporter', () => {
  it('names the modules a teleporter leads to', () => {
    expect(describeTeleporter(0)).toBe('Teleporter to Module II');
    expect(describeTeleporter(2)).toBe('Teleporter to Module II or IV');
    expect(describeTeleporter(4)).toBe('Teleporter to Module IV');
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

describe('describeSquare', () => {
  it('describes rock and a plain open square', () => {
    expect(describeSquare(square({ solid: true }), null, 5, 6, 0)).toEqual({ title: 'Square 5, 6', rock: true, feature: null });
    expect(describeSquare(square({ n: 0, e: 1 }), null, 5, 6, 0)).toEqual({ title: 'Square 5, 6', rock: false, feature: null });
  });

  it('names a teleporter only when the square holds nothing else', () => {
    expect(describeSquare(square({ e: 4 }), null, 5, 6, 2).feature).toBe('Teleporter to Module II or IV');
    expect(describeSquare(square({ e: 4 }), { kind: 'down', destination: { floor: 3, x: 5, y: 6 } }, 5, 6, 2).feature).toBe('Down ladder to floor 3');
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
