export interface TwinFloor {
  /** 0-based, the way the rest of the map explorer counts modules. */
  module: number;
  floor: number;
}

/**
 * The seventeen sets of floors that were dealt the same walls. The generator picks a wall
 * pattern for each 16 x 16 block from a hash of the block, the floor and the module, and on
 * these floors the hash lands on the same one of the 25 patterns for every block, so the two
 * or three floors are identical wall for wall over the whole area the game shows. Everything
 * placed on top of the walls -- ladders, chutes, trap doors, town buildings -- is rolled
 * separately and differs between them.
 *
 * A group is always the same floor number in two or three different modules. twins.test.ts
 * recomputes the table from the bundled dungeon, so it cannot drift from the generator.
 */
export const TWIN_FLOORS: TwinFloor[][] = [
  [{ module: 0, floor: 0 }, { module: 1, floor: 0 }],
  [{ module: 0, floor: 3 }, { module: 1, floor: 3 }, { module: 4, floor: 3 }],
  [{ module: 0, floor: 10 }, { module: 2, floor: 10 }],
  [{ module: 0, floor: 22 }, { module: 2, floor: 22 }],
  [{ module: 1, floor: 8 }, { module: 4, floor: 8 }],
  [{ module: 1, floor: 13 }, { module: 3, floor: 13 }, { module: 4, floor: 13 }],
  [{ module: 1, floor: 15 }, { module: 2, floor: 15 }],
  [{ module: 1, floor: 16 }, { module: 3, floor: 16 }],
  [{ module: 1, floor: 43 }, { module: 2, floor: 43 }],
  [{ module: 2, floor: 2 }, { module: 3, floor: 2 }],
  [{ module: 2, floor: 7 }, { module: 4, floor: 7 }],
  [{ module: 2, floor: 8 }, { module: 3, floor: 8 }],
  [{ module: 2, floor: 33 }, { module: 4, floor: 33 }],
  [{ module: 2, floor: 53 }, { module: 4, floor: 53 }],
  [{ module: 3, floor: 22 }, { module: 4, floor: 22 }],
  [{ module: 3, floor: 47 }, { module: 4, floor: 47 }],
  [{ module: 3, floor: 56 }, { module: 4, floor: 56 }],
];

/** The other floors with this floor's walls, empty when its walls are its own. */
export function twinsOf(module: number, floor: number): TwinFloor[] {
  const group = TWIN_FLOORS.find((twins) => twins.some((twin) => twin.module === module && twin.floor === floor));
  if (!group) return [];
  return group.filter((twin) => twin.module !== module || twin.floor !== floor);
}
