import type { Rng } from '../game/port/rng';
import { LEVELS } from '../game/revmap.js';
import { RevMonsters, type RevStanding } from '../play/rev/monsters';
import {
  dungeonForLevel,
  fightingHitPoints,
  monsterById,
  monsterIdFor,
  monsterLevelOf,
  nameIndexOf,
} from '../rev-bestiary/monsters';
import { closeUpOf, renderPicture } from '../rev-bestiary/pictures';
import type { MapStocking, StockedKind } from './game';
import type { MonsterCount, MonsterCountGroup, StockedMonster } from './stocking';

/**
 * Moraff's Revenge's monsters on the map.
 *
 * The casting itself is `src/lib/play/rev/monsters.ts`, the port of the routine a level runs on
 * arrival; this is what the map needs on top of it — which levels have monsters, what one is
 * called, and how the list beside the map reads.
 *
 * Nothing here reads the floor's squares or its generation. The dungeon is arithmetic, but the
 * monsters are not: where they stand comes out of the shipped `1.NUM`, which every character on
 * the disk shares whichever generation they walk.
 */

/** Real randomness in place of the game's generator, which reseeds from the clock. `Random(n)`
 *  hands back an integer 0 to n - 1. */
const browserRng: Rng = { random: (n) => Math.trunc(Math.random() * n) };

/**
 * The level's monsters where arriving on it would put them.
 *
 * The forty slots the level owns are cast into the occupancy grid in slot order, and a slot
 * whose square another monster already stands on is dropped somewhere else at random — which is
 * the only part of this that a second roll can change. Two thirds of the seventy levels hold at
 * least one such pair, so most of them do move.
 */
export function stockRevFloor(level: number, rng: Rng): StockedMonster[] {
  const monsters = new RevMonsters();
  monsters.stock(level, rng);
  return monsters.standing().map((standing) => revStockedMonster(standing, level, monsters.strengths[standing.slot] ?? 0));
}

/**
 * One monster of a level as the map draws it: the square it stands on, and the name, level and
 * hit points its slot number and its number in `2.NUM` work out.
 *
 * @param stored what `2.NUM` holds for the slot, which both the name and the hit points read.
 */
export function revStockedMonster(standing: RevStanding, level: number, stored: number): StockedMonster {
  return {
    slot: standing.slot,
    // The game numbers its columns and rows from 1 and the map numbers both from 0.
    x: standing.column - 1,
    y: standing.row - 1,
    monsterId: monsterIdFor(dungeonForLevel(level), nameIndexOf(standing.slot, level, stored)),
    level: monsterLevelOf(standing.slot),
    hp: fightingHitPoints(standing.slot, stored),
  };
}

/**
 * The colours a monster is drawn in here.
 *
 * `SCREEN 1` has two four-colour sets and the `@` key flips the game between them (1000:1038).
 * The map is nobody's game, so it draws in the one the game starts in (1000:0174).
 */
const MAP_PALETTE = 0;

/**
 * One kind of monster as the map wants it.
 *
 * Moraff's Revenge draws no monster on its own map — only the ladders — so nothing here is a
 * port. The picture is the close-up the 3-D view puts up when the monster is met, with the
 * background it was `GET` out of left out so the map square shows through around it; a cell too
 * small for a picture keeps the marker, which `../map/draw-monsters.ts` decides.
 */
function kind(id: string): StockedKind {
  const { dungeon, monster } = monsterById(id);
  return {
    name: monster.name,
    boss: false,
    pictureKey: () => id,
    picture: () => {
      const closeUp = closeUpOf(dungeon, monster);
      return closeUp === null ? null : renderPicture(closeUp, MAP_PALETTE, false);
    },
  };
}

/** The lowest and highest of some numbers, as "3" or "3–11". */
function spread(values: number[]): string {
  const lowest = Math.min(...values);
  const highest = Math.max(...values);
  return lowest === highest ? String(lowest) : `${lowest}–${highest}`;
}

/** One row of the list: how many of this monster stand on the level, and the levels and hit
 *  points its slots give them. */
function countOf(id: string, monsters: StockedMonster[]): MonsterCount {
  return {
    monsterId: id,
    name: kind(id).name,
    count: monsters.length,
    detail: `level ${spread(monsters.map((monster) => monster.level))} · ${spread(monsters.map((monster) => monster.hp))} HP`,
  };
}

/** The level's monster types, commonest first. */
function groups(monsters: StockedMonster[]): MonsterCountGroup[] {
  const byType = new Map<string, StockedMonster[]>();
  for (const monster of monsters) {
    const kept = byType.get(monster.monsterId);
    if (kept) kept.push(monster);
    else byType.set(monster.monsterId, [monster]);
  }
  const counts = [...byType].map(([id, of]) => countOf(id, of)).sort((a, b) => b.count - a.count);
  return counts.length ? [{ label: null, counts }] : [];
}

const STOCKING_NOTE =
  'Moraff’s Revenge never rolls a level. 1.NUM holds forty monsters for each of the seventy ' +
  'levels and 2.NUM what each has left, both shared by every character on the disk, and arriving ' +
  'only casts those forty onto the squares they name. Rolling again moves the ones whose square ' +
  'was already taken, which is all the game itself leaves to chance.';

export const MORAFFS_REVENGE_STOCKING: MapStocking = {
  // The town owns forty slots like every other level, and the routine leaves it empty.
  stocks: (_generation, level) => level >= 1 && level <= LEVELS,
  stock: (_rows, _generation, level) => stockRevFloor(level, browserRng),
  kind,
  groups,
  describe: (monster) => `${kind(monster.monsterId).name} · level ${monster.level} · ${monster.hp} HP`,
  beyondMap: (count) =>
    count === 1
      ? '1 stands outside the walls, on the square an empty slot of 1.NUM points at, where the game never draws it.'
      : `${count} stand outside the walls, on the squares empty slots of 1.NUM point at, where the game never draws them.`,
  note: STOCKING_NOTE,
};
