import { describe, expect, it } from 'vitest';
import { bundledDungeon } from '../game/dungeon';
import type { Square } from '../game/unfmap.js';
import { MAP_COLUMNS, MAP_ROWS } from './area';
import { teleporterColour, teleporterHue, teleporterLineWidth, teleporterSegments } from './teleporters';

function square(overrides: Partial<Square> = {}): Square {
  return { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0, ...overrides };
}

describe('teleporterSegments', () => {
  it('lists a shared side once and places east and south sides on the neighbouring edge', () => {
    const rows: Square[][] = [
      [square({ e: 4 }), square({ w: 4, s: 4 })],
      [square(), square({ n: 4 })],
    ];
    expect(teleporterSegments(rows)).toEqual([
      { x: 1, y: 0, vertical: true },
      { x: 1, y: 1, vertical: false },
    ]);
  });

  it('ignores rock and floors without teleporters', () => {
    expect(teleporterSegments([[square({ solid: true, w: 4 })]])).toEqual([]);
    expect(teleporterSegments(bundledDungeon.floor(20, 1))).toEqual([]);
  });

  it('leaves out the rows and the column the game never shows', () => {
    const whole: Square[][] = Array.from({ length: MAP_ROWS + 2 }, () =>
      Array.from({ length: MAP_COLUMNS + 1 }, () => square({ solid: true })),
    );
    whole[MAP_ROWS][0] = square({ n: 4 });
    whole[0][MAP_COLUMNS] = square({ n: 4 });
    expect(teleporterSegments(whole)).toEqual([]);
  });

  it('matches the fixture count of teleporter squares in spirit: the Module I town has some', () => {
    expect(teleporterSegments(bundledDungeon.floor(0, 0)).length).toBeGreaterThan(0);
  });
});

describe('teleporter styling', () => {
  it('cycles the hue slowly and wraps', () => {
    expect(teleporterHue(0)).toBe(0);
    expect(teleporterHue(9000)).toBeCloseTo(180);
    expect(teleporterHue(18000)).toBeCloseTo(0);
  });

  it('is translucent and thick enough to see zoomed out', () => {
    expect(teleporterColour(120.4)).toBe('hsla(120, 100%, 60%, 0.7)');
    expect(teleporterLineWidth(4)).toBe(3);
    expect(teleporterLineWidth(40)).toBe(10);
  });
});
