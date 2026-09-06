import { allMonsters, isPuffball, type Monster } from '../bestiary/monsters';
import { nudgeLevel, rollHp } from '../bestiary/roll';
import { sectionOf } from '../game/dotu-files.js';
import { monsterLevelBase } from '../game/dotu-mech.js';
import { sectionInfo, type SectionInfo } from '../game/sections';
import { HEIGHT, WIDTH, type Square } from '../game/unfmap.js';
import { isOnMap } from './area';

/** Monsters the game keeps for one floor, boss included (RE notes 4.1). */
export const MONSTER_SLOTS = 145;

/** Monster type indexes the game loads from MD.BIN for the current section. */
const BOSS_SLOT = 22;
const FIRST_REGULAR_SLOT = 23;
const LEVEL_DRAINER_SLOT = 26;

/** Built-in monsters by their index in the game's table: 0..1 blockers, 2..13 puffballs,
 *  14..21 poison and disease. */
const FIRST_PUFFBALL = 2;
const PUFFBALL_COUNT = 12;
const BLOCKER_COUNT = 2;
const FIRST_POISON = 14;
const POISON_COUNT = 8;

/** The Shadow boss appears in the middle 50 squares of each axis. */
const BOSS_AREA_ORIGIN = 25;
const BOSS_AREA_SIZE = 50;

export interface StockedMonster {
  /** Position in the floor's monster table; the Shadow boss is always slot 0. */
  slot: number;
  x: number;
  y: number;
  monsterId: string;
  level: number;
  hp: number;
}

const catalogue = new Map(allMonsters().map((entry) => [entry.id, entry]));

/** The catalogue entry a stocked monster refers to. */
export function monsterById(id: string): Monster {
  const entry = catalogue.get(id);
  if (!entry) throw new Error(`no monster ${id}`);
  return entry;
}

/**
 * The section whose monsters a floor is stocked from, or null when the game itself could not
 * stock it. The game needs two things the floor override can take away: a floor belonging to
 * one of its own module's four sections, so there is a monster table to load, and a monster
 * level of at least 1.
 */
export function stockingSection(moduleIndex: number, floor: number): SectionInfo | null {
  const firstOfModule = moduleIndex * 4 + 1;
  const section = sectionOf(moduleIndex, floor);
  if (section < firstOfModule || section > firstOfModule + 3) return null;
  if (monsterLevelBase(floor, moduleIndex) <= 0) return null;
  return sectionInfo(moduleIndex, floor);
}

/** The game's random(n): an integer 0..n-1. */
const random = (rnd: () => number, n: number) => Math.trunc(rnd() * n);

/**
 * Fills a floor's 145 monster slots the way stock_level() does: every slot gets a random
 * open square nothing else stands on, a level nudged away from the floor's base level, and
 * hit points rolled for whichever monster the type roll picked. On a section's boss floor
 * slot 0 is the Shadow boss, placed in the middle of the map.
 *
 * The game seeds its generator afresh for every square it draws, which makes the monsters
 * land in diagonal stripes; `rnd` is used plainly here, so they spread out evenly instead.
 *
 * A floor the game could not stock gets nothing.
 */
export function stockFloor(rows: Square[][], moduleIndex: number, floor: number, rnd: () => number): StockedMonster[] {
  const section = stockingSection(moduleIndex, floor);
  if (!section) return [];
  const baseLevel = monsterLevelBase(floor, moduleIndex);
  const taken = new Set<number>();
  const monsters: StockedMonster[] = [];
  for (let slot = 0; slot < MONSTER_SLOTS; slot++) {
    const boss = slot === 0 && floor === section.bossFloor;
    const { x, y } = boss ? bossSquare(rows, taken, rnd) : freeSquare(rows, taken, rnd);
    taken.add(y * WIDTH + x);
    const entry = boss ? sectionMonster(section.section, BOSS_SLOT) : rollKind(section.section, rnd);
    const level = nudgeLevel(baseLevel, rnd);
    monsters.push({ slot, x, y, monsterId: entry.id, level, hp: rollHp(entry, level, rnd) });
  }
  return monsters;
}

export function monsterAt(monsters: StockedMonster[], x: number, y: number): StockedMonster | null {
  return monsters.find((monster) => monster.x === x && monster.y === y) ?? null;
}

export interface MonsterCount {
  monsterId: string;
  name: string;
  count: number;
}

/** How many of each monster type a stocked floor holds, commonest first, with the Shadow
 *  boss ahead of them all. */
export function monsterCounts(monsters: StockedMonster[]): MonsterCount[] {
  const counts = new Map<string, number>();
  for (const monster of monsters) counts.set(monster.monsterId, (counts.get(monster.monsterId) ?? 0) + 1);
  return [...counts]
    .map(([monsterId, count]) => ({ monsterId, name: monsterById(monsterId).name, count }))
    .sort((a, b) => Number(monsterById(b.monsterId).isBoss) - Number(monsterById(a.monsterId).isBoss) || b.count - a.count);
}

/** How many of the floor's monsters stand outside the area the game shows. */
export function beyondMapCount(monsters: StockedMonster[]): number {
  return monsters.filter((monster) => !isOnMap(monster)).length;
}

export interface MonsterCountGroup {
  label: string;
  counts: MonsterCount[];
}

/** The headings the monster list groups its types under, in the order it shows them. */
const GROUP_LABELS = ['Shadow boss', 'This section', 'Everywhere', 'Puffballs', 'Poison and disease'] as const;

type GroupLabel = (typeof GROUP_LABELS)[number];

function groupOf(entry: Monster): GroupLabel {
  if (entry.isBoss) return 'Shadow boss';
  if (entry.origin.kind === 'section') return 'This section';
  if (isPuffball(entry)) return 'Puffballs';
  if (entry.special === 0) return 'Everywhere';
  return 'Poison and disease';
}

/** The floor's monster types split into those groups, commonest first within each group.
 *  A group nothing was stocked from is left out. */
export function groupedMonsterCounts(monsters: StockedMonster[]): MonsterCountGroup[] {
  const counts = monsterCounts(monsters);
  return GROUP_LABELS.map((label) => ({
    label,
    counts: counts.filter((entry) => groupOf(monsterById(entry.monsterId)) === label),
  })).filter((group) => group.counts.length > 0);
}

/**
 * The type roll: 1 in 20 a puffball, else 1 in 7 a garbage can or ball, else 1 in 15 the
 * section's level drainer, else 1 in 12 a poison or disease monster, else one of the
 * section's three regulars.
 */
function rollKind(section: number, rnd: () => number): Monster {
  if (random(rnd, 20) === 0) return builtinMonster(random(rnd, PUFFBALL_COUNT) + FIRST_PUFFBALL);
  if (random(rnd, 7) === 0) return builtinMonster(random(rnd, BLOCKER_COUNT));
  if (random(rnd, 15) === 0) return sectionMonster(section, LEVEL_DRAINER_SLOT);
  if (random(rnd, 12) === 0) return builtinMonster(random(rnd, POISON_COUNT) + FIRST_POISON);
  return sectionMonster(section, random(rnd, 3) + FIRST_REGULAR_SLOT);
}

function builtinMonster(index: number): Monster {
  return monsterById(`builtin-${index}`);
}

function sectionMonster(section: number, slot: number): Monster {
  return monsterById(`section-${section}-${slot}`);
}

/** A random square, redrawn until it is open and holds no monster yet. */
function freeSquare(rows: Square[][], taken: Set<number>, rnd: () => number): { x: number; y: number } {
  for (;;) {
    const x = random(rnd, WIDTH);
    const y = random(rnd, HEIGHT);
    if (!rows[y][x].solid && !taken.has(y * WIDTH + x)) return { x, y };
  }
}

function bossSquare(rows: Square[][], taken: Set<number>, rnd: () => number): { x: number; y: number } {
  for (;;) {
    const x = random(rnd, BOSS_AREA_SIZE) + BOSS_AREA_ORIGIN;
    const y = random(rnd, BOSS_AREA_SIZE) + BOSS_AREA_ORIGIN;
    if (!rows[y][x].solid && !taken.has(y * WIDTH + x)) return { x, y };
  }
}
