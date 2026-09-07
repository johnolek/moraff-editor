import { describe, expect, it } from 'vitest';
import { summarizeMapFloor } from '../game/floor-summary';
import { HEIGHT, WIDTH } from '../game/unfmap.js';
import { floorsOf, hasDungeon, MAP_GAMES, MORAFFS_REVENGE_MAP, MORAFFS_WORLD_MAP, UNFORGIVEN_MAP, type MapGame } from './game';

describe('the area a game shows', () => {
  it('is 79 by 104 for Dungeons of the Unforgiven and 79 by 110 for Moraff’s World', () => {
    expect(UNFORGIVEN_MAP.area).toEqual({ columns: 79, rows: 104 });
    expect(MORAFFS_WORLD_MAP.area).toEqual({ columns: 79, rows: 110 });
  });

  it('leaves out the column the two 80-wide generators enclose behind walls', () => {
    for (const game of [UNFORGIVEN_MAP, MORAFFS_WORLD_MAP]) {
      expect(game.area.columns).toBe(WIDTH - 1);
      expect(game.area.rows).toBeLessThanOrEqual(HEIGHT);
    }
  });
});

describe('the floors a dungeon has', () => {
  it('runs to the bottom of the module in Dungeons of the Unforgiven', () => {
    expect(UNFORGIVEN_MAP.bottomFloor(0)).toBe(25);
    expect(UNFORGIVEN_MAP.bottomFloor(4)).toBe(105);
    expect(floorsOf(UNFORGIVEN_MAP, 0)).toHaveLength(26);
    expect(floorsOf(UNFORGIVEN_MAP, 0)[25]).toBe(25);
  });

  it('runs 0 to 202 in every Moraff’s World dungeon', () => {
    expect(MORAFFS_WORLD_MAP.bottomFloor(0)).toBe(202);
    expect(MORAFFS_WORLD_MAP.bottomFloor(-1500)).toBe(202);
    expect(floorsOf(MORAFFS_WORLD_MAP, 0)).toHaveLength(203);
    expect(floorsOf(MORAFFS_WORLD_MAP, 0)[202]).toBe(202);
  });
});

describe('the dungeons a game has', () => {
  it('is the five modules of Dungeons of the Unforgiven', () => {
    expect(hasDungeon(UNFORGIVEN_MAP, 0)).toBe(true);
    expect(hasDungeon(UNFORGIVEN_MAP, 4)).toBe(true);
    expect(hasDungeon(UNFORGIVEN_MAP, 5)).toBe(false);
    expect(hasDungeon(UNFORGIVEN_MAP, -1)).toBe(false);
  });

  it('is every value the Moraff’s World record can hold, negatives included', () => {
    expect(hasDungeon(MORAFFS_WORLD_MAP, 0)).toBe(true);
    expect(hasDungeon(MORAFFS_WORLD_MAP, -3204)).toBe(true);
    expect(hasDungeon(MORAFFS_WORLD_MAP, 32767)).toBe(true);
    expect(hasDungeon(MORAFFS_WORLD_MAP, -32769)).toBe(false);
    expect(hasDungeon(MORAFFS_WORLD_MAP, 1.5)).toBe(false);
  });
});

describe('the buildings on floor 0', () => {
  it('is the four of a Dungeons of the Unforgiven town', () => {
    expect(UNFORGIVEN_MAP.buildings.map((building) => building.label)).toEqual(['Store', 'Temple', 'Bank', 'Inn']);
  });

  it('is those four and the world map gate in Moraff’s World', () => {
    expect(MORAFFS_WORLD_MAP.buildings.map((building) => building.label)).toEqual(['Store', 'Temple', 'Bank', 'Inn', 'World map gate']);
  });

  it('reads the field each game’s own generator fills', () => {
    const square = { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1 };
    expect(UNFORGIVEN_MAP.buildingOn({ ...square, town: 3 })).toBe(3);
    expect(UNFORGIVEN_MAP.buildingOn({ ...square, surface: 3 })).toBe(0);
    expect(MORAFFS_WORLD_MAP.buildingOn({ ...square, surface: 5 })).toBe(5);
    expect(MORAFFS_WORLD_MAP.buildingOn({ ...square, town: 5 })).toBe(0);
  });

  it('has a colour for every building it names', () => {
    for (const game of Object.values(MAP_GAMES)) {
      expect(game.buildings.every((building) => /^#[0-9a-f]{6}$/.test(building.colour))).toBe(true);
    }
  });
});

describe('one square of a floor', () => {
  it.each([
    ['unforgiven', UNFORGIVEN_MAP, 0, [0, 7]],
    ['moraffsWorld', MORAFFS_WORLD_MAP, 0, [0, 7]],
    ['moraffsWorld', MORAFFS_WORLD_MAP, -1500, [0, 11]],
    ['revenge', MORAFFS_REVENGE_MAP, 1, [0, 2]],
    ['revenge', MORAFFS_REVENGE_MAP, 3, [17]],
  ] as [string, MapGame, number, number[]][])('is the same as the whole floor of %s dungeon %i gives', (_id, game, dungeon, levels) => {
    for (const level of levels) {
      const rows = game.floor(level, dungeon);
      rows.forEach((row, y) => row.forEach((expected, x) => expect(game.squareOn(x, y, level, dungeon)).toEqual(expected)));
    }
  });
});

describe('what routing walks to', () => {
  it('is a teleporter in Dungeons of the Unforgiven and a ladder in Moraff’s World', () => {
    const square = { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1 };
    expect(UNFORGIVEN_MAP.routeTo.noun).toBe('teleporter');
    expect(UNFORGIVEN_MAP.routeTo.matches({ ...square, e: 4 })).toBe(true);
    expect(UNFORGIVEN_MAP.routeTo.matches({ ...square, ladder: -1 })).toBe(false);
    expect(MORAFFS_WORLD_MAP.routeTo.noun).toBe('ladder');
    expect(MORAFFS_WORLD_MAP.routeTo.matches({ ...square, ladder: -1 })).toBe(true);
    expect(MORAFFS_WORLD_MAP.routeTo.matches({ ...square, ladder: 2 })).toBe(true);
    expect(MORAFFS_WORLD_MAP.routeTo.matches(square)).toBe(false);
  });
});

describe('the name of an exported floor', () => {
  it('names a Moraff’s World file by dungeon and floor, negatives spelled out', () => {
    expect(MORAFFS_WORLD_MAP.pngName(0, 0)).toBe('mw-dungeon-0-floor-0.png');
    expect(MORAFFS_WORLD_MAP.pngName(17, 202)).toBe('mw-dungeon-17-floor-202.png');
    expect(MORAFFS_WORLD_MAP.pngName(-3204, 12)).toBe('mw-dungeon-minus-3204-floor-12.png');
  });
});

describe('Moraff’s Revenge', () => {
  it('shows the whole 20 by 19 floor, which is all the game walks on', () => {
    expect(MORAFFS_REVENGE_MAP.area).toEqual({ columns: 20, rows: 19 });
  });

  it('runs from the town to level 70', () => {
    expect(MORAFFS_REVENGE_MAP.bottomFloor(1)).toBe(70);
    expect(floorsOf(MORAFFS_REVENGE_MAP, 1)).toHaveLength(71);
  });

  it('numbers a dungeon by the generation, which starts at 1 and never reaches 0', () => {
    expect(MORAFFS_REVENGE_MAP.dungeonNoun).toBe('Generation');
    expect(MORAFFS_REVENGE_MAP.dungeonName(3)).toBe('Generation 3');
    expect(MORAFFS_REVENGE_MAP.defaultDungeon).toBe(1);
    expect(hasDungeon(MORAFFS_REVENGE_MAP, 1)).toBe(true);
    expect(hasDungeon(MORAFFS_REVENGE_MAP, 0)).toBe(false);
    expect(hasDungeon(MORAFFS_REVENGE_MAP, -1)).toBe(false);
  });

  it('has no buildings, no trap doors, no secret doors and no monsters', () => {
    expect(MORAFFS_REVENGE_MAP.buildings).toEqual([]);
    expect(MORAFFS_REVENGE_MAP.trapdoorLanding).toBeNull();
    expect(MORAFFS_REVENGE_MAP.stocking).toBeNull();
    expect(MORAFFS_REVENGE_MAP.features).toEqual({ secretDoors: false, trapdoors: false, falseFloors: true });
  });

  it('walks to a ladder, which is all its floors hold worth walking to', () => {
    const square = { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1 };
    expect(MORAFFS_REVENGE_MAP.routeTo.noun).toBe('ladder');
    expect(MORAFFS_REVENGE_MAP.routeTo.matches({ ...square, ladder: -2 })).toBe(true);
    expect(MORAFFS_REVENGE_MAP.routeTo.matches(square)).toBe(false);
  });

  it('numbers the map’s squares from 0 where the game numbers its own from 1', () => {
    // (15, 5) of the town is the ladder down two levels 5.BIN's character took.
    expect(MORAFFS_REVENGE_MAP.squareOn(14, 4, 0, 1).ladder).toBe(2);
    expect(MORAFFS_REVENGE_MAP.floor(0, 1)[4][14].ladder).toBe(2);
  });

  it('names an exported floor by generation, with the town named', () => {
    expect(MORAFFS_REVENGE_MAP.pngName(1, 0)).toBe('revenge-generation-1-town.png');
    expect(MORAFFS_REVENGE_MAP.pngName(3, 17)).toBe('revenge-generation-3-floor-17.png');
  });
});

describe('the legend of a Moraff’s Revenge floor', () => {
  it('counts the false floors of the floor it is showing', () => {
    // (7, 16) of level 1 is the one chute of that level, and the square under it is a false
    // floor: the map's own (6, 15) of level 2.
    const summary = summarizeMapFloor(MORAFFS_REVENGE_MAP, MORAFFS_REVENGE_MAP.floor(2, 1), 2, 1);
    expect(summary.falseFloors).toBe(1);
    expect(summary.secretDoors).toBe(0);
    expect(summary.trapdoors).toBe(0);
    expect(summary.trapdoorLanding).toBeUndefined();
  });
});
