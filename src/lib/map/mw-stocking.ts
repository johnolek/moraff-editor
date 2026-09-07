import { stockFloor } from '../game/mw-port/stocking';
import type { Rng } from '../game/port/rng';
import { appearsOn, isBoss, MONSTERS } from '../mw-bestiary/monsters';
import { FLOOR_PALETTES, renderMonster } from '../mw-bestiary/pictures';
import type { MapStocking, StockedKind } from './game';
import type { MonsterCount, MonsterCountGroup, StockedMonster } from './stocking';

/**
 * Moraff's World's monsters on the map.
 *
 * The roll itself is `src/lib/game/mw-port/stocking.ts`, the port of generate_section; this is
 * what the map needs on top of it — which floors can be rolled, what a monster is called, how
 * it is drawn, and how the list beside the map reads.
 */

/**
 * Real randomness in place of the game's generator, which reseeds from the BIOS tick count
 * before every draw. `Random(n)` hands back an integer 0 to n - 1.
 */
const browserRng: Rng = { random: (n) => Math.trunc(Math.random() * n) };

/** Nobody is playing, so no quest boss has been killed and every boss floor gets its boss. */
const NOTHING_KILLED = 0;

/**
 * Whether pick_monster has anything to draw on this floor. It draws again until it has a
 * monster the floor allows, so a floor no monster's range covers — the surface, and anything
 * past floor 254 — would keep it drawing for ever.
 */
function anyMonsterOn(floor: number): boolean {
  return MONSTERS.some((monster) => !isBoss(monster) && appearsOn(monster, floor));
}

function kind(monsterId: string): StockedKind {
  const entry = MONSTERS[Number(monsterId)];
  return {
    name: entry.name,
    boss: isBoss(entry),
    // The colours a floor is drawn in come round again every eleven floors, so two floors that
    // share a palette share their pictures.
    pictureKey: (_dungeon, floor) => String(floor % FLOOR_PALETTES),
    picture: (_dungeon, floor) => renderMonster(entry, floor),
  };
}

/** The lowest and highest of some numbers, as "3" or "3–11". */
function spread(values: number[]): string {
  const lowest = Math.min(...values);
  const highest = Math.max(...values);
  return lowest === highest ? String(lowest) : `${lowest}–${highest}`;
}

/** One row of the list: how many of this monster stand on the floor, and what depths and hit
 *  points they were rolled with. */
function countOf(monsterId: string, monsters: StockedMonster[]): MonsterCount {
  return {
    monsterId,
    name: MONSTERS[Number(monsterId)].name,
    count: monsters.length,
    detail: `depth ${spread(monsters.map((monster) => monster.level))} · ${spread(monsters.map((monster) => monster.hp))} HP`,
  };
}

/** The floor's monster types, the quest boss first and the rest commonest first. */
function groups(monsters: StockedMonster[]): MonsterCountGroup[] {
  const byType = new Map<string, StockedMonster[]>();
  for (const monster of monsters) {
    const kept = byType.get(monster.monsterId);
    if (kept) kept.push(monster);
    else byType.set(monster.monsterId, [monster]);
  }
  const counts = [...byType]
    .map(([monsterId, of]) => countOf(monsterId, of))
    .sort((a, b) => Number(kind(b.monsterId).boss) - Number(kind(a.monsterId).boss) || b.count - a.count);
  return counts.length ? [{ label: null, counts }] : [];
}

/**
 * The map keeps every floor it rolls for as long as the tab is open, where the game keeps only
 * the three floors most recently visited.
 */
const STOCKING_NOTE =
  'The game rolls a floor’s 145 monsters from the clock the first time you arrive and keeps the ' +
  'three floors you were on last, so going up a ladder and back finds them where they were. This ' +
  'roll is one of the countless floors you might have walked into; the map holds on to every ' +
  'floor you roll, not just three.';

export const MORAFFS_WORLD_STOCKING: MapStocking = {
  stocks: (_dungeon, floor) => anyMonsterOn(floor),
  stock: (rows, dungeon, floor) =>
    stockFloor(browserRng, dungeon, floor, rows, NOTHING_KILLED).map((monster, slot) => ({
      slot,
      x: monster.x,
      y: monster.y,
      monsterId: String(monster.type),
      level: monster.depth,
      hp: monster.hp,
    })),
  kind,
  groups,
  describe: (monster) => `${MONSTERS[Number(monster.monsterId)].name} · depth ${monster.level} · ${monster.hp} HP`,
  beyondMap: (count) =>
    count === 1
      ? '1 stands in column 79, which the game walls off, where nothing can reach it.'
      : `${count} stand in column 79, which the game walls off, where nothing can reach them.`,
  note: STOCKING_NOTE,
};
