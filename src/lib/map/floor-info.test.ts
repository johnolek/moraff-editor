import { describe, expect, it } from 'vitest';
import { jumpTarget, squareFeature, teleporterTargets } from './floor-info';
import { UNFORGIVEN_MAP, type MapSquare } from './game';

function square(overrides: Partial<MapSquare> = {}): MapSquare {
  return { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0, ...overrides };
}

describe('squareFeature', () => {
  it('reports nothing for a plain open square', () => {
    expect(squareFeature(UNFORGIVEN_MAP, 0, 3, square(), 10, 10)).toBeNull();
  });

  it('sends ladders and chutes to the same square on the destination floor', () => {
    expect(squareFeature(UNFORGIVEN_MAP, 0, 3, square({ ladder: 2 }), 10, 11)).toEqual({
      kind: 'down',
      destination: { floor: 5, x: 10, y: 11 },
    });
    expect(squareFeature(UNFORGIVEN_MAP, 0, 3, square({ ladder: -1 }), 10, 11)).toEqual({
      kind: 'up',
      destination: { floor: 2, x: 10, y: 11 },
    });
    expect(squareFeature(UNFORGIVEN_MAP, 0, 3, square({ chute: 6 }), 10, 11)).toEqual({
      kind: 'chute',
      destination: { floor: 6, x: 10, y: 11 },
    });
  });

  it('sends trap doors to the fixed landing square of the destination floor', () => {
    const [landingX, landingY] = UNFORGIVEN_MAP.trapdoorLanding(10, 0);
    expect(squareFeature(UNFORGIVEN_MAP, 0, 3, square({ trapdoor: 10 }), 10, 11)).toEqual({
      kind: 'trapdoor',
      destination: { floor: 10, x: landingX, y: landingY },
    });
  });

  it('names town buildings', () => {
    expect(squareFeature(UNFORGIVEN_MAP, 0, 0, square({ town: 3 }), 10, 11)).toEqual({ kind: 'town', building: 3 });
  });
});

describe('jumpTarget', () => {
  it('only follows ladders, chutes and trap doors', () => {
    expect(jumpTarget(UNFORGIVEN_MAP, 0, 3, square(), 1, 1)).toBeNull();
    expect(jumpTarget(UNFORGIVEN_MAP, 0, 0, square({ town: 1 }), 1, 1)).toBeNull();
    expect(jumpTarget(UNFORGIVEN_MAP, 0, 3, square({ ladder: 1 }), 1, 1)).toEqual({ floor: 4, x: 1, y: 1 });
  });
});

describe('teleporterTargets', () => {
  it('goes up from Module I, down from Module V, either way in between', () => {
    expect(teleporterTargets(0)).toEqual([1]);
    expect(teleporterTargets(2)).toEqual([1, 3]);
    expect(teleporterTargets(4)).toEqual([3]);
  });
});
