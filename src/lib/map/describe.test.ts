import { describe, expect, it } from 'vitest';
import { describeExplored, describeFeature, describeNote, describeSquare, describeTeleporter, featureLine } from './describe';
import { UNFORGIVEN_MAP, type MapSquare } from './game';

function square(overrides: Partial<MapSquare> = {}): MapSquare {
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
    expect(describeFeature(null, UNFORGIVEN_MAP)).toBeNull();
    expect(describeFeature({ kind: 'down', destination: { floor: 3, x: 1, y: 2 } }, UNFORGIVEN_MAP)).toBe('Down ladder to floor 3');
    expect(describeFeature({ kind: 'trapdoor', destination: { floor: 10, x: 18, y: 93 } }, UNFORGIVEN_MAP)).toBe('Trap door to floor 10, lands at 18, 93');
    expect(describeFeature({ kind: 'town', building: 2 }, UNFORGIVEN_MAP)).toBe('Temple');
  });
});

describe('describeSquare', () => {
  it('describes rock and a plain open square', () => {
    expect(describeSquare(square({ solid: true }), null, 5, 6, UNFORGIVEN_MAP, 0)).toEqual({ title: 'Square 5, 6', rock: true, feature: null, beyondMap: false });
    expect(describeSquare(square({ n: 0, e: 1 }), null, 5, 6, UNFORGIVEN_MAP, 0)).toEqual({ title: 'Square 5, 6', rock: false, feature: null, beyondMap: false });
  });

  it('says only that nothing can reach a square beyond the area the game shows', () => {
    const beyond = describeSquare(square({ ladder: -1 }), { kind: 'up', destination: { floor: 4, x: 5, y: 105 } }, 5, 105, UNFORGIVEN_MAP, 0);
    expect(beyond).toEqual({
      title: 'Square 5, 105',
      rock: false,
      feature: "Beyond the game's map: nothing can reach this square.",
      beyondMap: true,
    });
  });

  it('names a teleporter only when the square holds nothing else', () => {
    expect(describeSquare(square({ e: 4 }), null, 5, 6, UNFORGIVEN_MAP, 2).feature).toBe('Teleporter to Module II or IV');
    expect(describeSquare(square({ e: 4 }), { kind: 'down', destination: { floor: 3, x: 5, y: 6 } }, 5, 6, UNFORGIVEN_MAP, 2).feature).toBe('Down ladder to floor 3');
  });
});

describe('featureLine', () => {
  it('names rock, and the reason a square beyond the map holds nothing worth naming', () => {
    expect(featureLine(describeSquare(square({ solid: true }), null, 5, 6, UNFORGIVEN_MAP, 0))).toBe('Rock');
    expect(featureLine(describeSquare(square(), { kind: 'town', building: 2 }, 5, 6, UNFORGIVEN_MAP, 0))).toBe('Temple');
    expect(featureLine(describeSquare(square({ solid: true }), null, 5, 105, UNFORGIVEN_MAP, 0))).toBe("Beyond the game's map: nothing can reach this square.");
  });
});

describe('describeExplored', () => {
  it('says the file has seen an open square', () => {
    expect(describeExplored(false, 0)).toBe('Explored in the .DUN file you loaded.');
  });

  it('says which dungeon makes a seen square rock', () => {
    expect(describeExplored(true, 7)).toBe('Explored in the .DUN file you loaded, but rock in dungeon 7.');
  });
});

describe('describeNote', () => {
  it('spells out the two note kinds', () => {
    expect(describeNote({ kind: 'oneWayUp', topFloor: 2 })).toBe('One way: no ladder back down from floor 2.');
    expect(describeNote({ kind: 'landsOnChute', chuteFloor: 4 })).toBe('Lands on a chute to floor 4.');
  });
});
