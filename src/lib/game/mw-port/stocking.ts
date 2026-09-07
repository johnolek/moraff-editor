import data from '../mw-data.json';
import type { Rng } from '../port/rng';

/**
 * Filling a floor of Moraff's World with monsters.
 *
 * The map is a hash and comes out the same every time; the monsters do not. generate_section
 * rolls all 145 of them from the clock the first time the character walks onto a floor, and the
 * game keeps only the three floors most recently visited, in `<slot>MON.MAP` — so going down a
 * ladder and straight back finds the same monsters with the same wounds, and a floor left two
 * floors behind is rolled afresh. `save_mon_map` (WORLD.EXE 2000:4fb4, mw.c "save_mon_map") and
 * `load_mon_map` (WORLD.EXE 2000:507a, mw.c "load_mon_map") are that cache; nothing of it is
 * ported here, so every call is a floor being walked onto for the first time.
 *
 * `mw-tools/docs/DUNGEON.md` is the longer write-up.
 */

/** How many monsters generate_section puts on a floor. */
export const MONSTER_SLOTS = data.constants.monsterSlotsPerFloor;

/** The grid the monsters are placed on, which is the whole section rather than the part of it
 *  the game draws. */
const WIDTH = data.constants.width;
const HEIGHT = data.constants.height;

/** The nine group numbers, which are also the first nine monsters of the table. */
const GROUPS = data.constants.groups;
/** The monsters pick_monster draws from: 0 to 103, the eight quest bosses left out. */
const ROLLABLE = data.constants.rollableMonsters;

/** The quest bosses are monsters 104 to 111, which generate_section places itself. */
const FIRST_BOSS = ROLLABLE;
const LAST_BOSS = ROLLABLE + data.bosses.length - 1;

const HP_MAX = data.constants.hpMax;
const BOSS_HP_PER_FLOOR = data.constants.bossHpPerFloor;
const DEPTH_MAX = data.constants.depthMax;
const DEPTH_DRIFT = data.constants.depthDrift;

/** A floor number above this one is stocked at the deepest depth instead of its own. */
const DEPTH_FLOOR_LIMIT = 251;

/** The middle of the floor a boss is first put down in: `random(50) + 25` on each axis. */
const BOSS_AREA_ORIGIN = 25;
const BOSS_AREA_SIZE = 50;

const MONSTERS = data.monsters;
const BOSSES = data.bosses;

/**
 * One of the 145 records generate_section fills, which `save_mon_map` writes as six bytes:
 * x, y, hit points as a word, the monster type, and the depth.
 */
export interface MwStockedMonster {
  x: number;
  y: number;
  hp: number;
  /** Which of the 112 monsters of the table it is. */
  type: number;
  /** Its own difficulty, which both combat formulas use in place of the floor number. */
  depth: number;
}

/**
 * What stocking needs of a floor square: whether it is rock. `is_solid` (WORLD.EXE 3000:a854,
 * mw.c "is_solid") works that out from the map hash, and every square of a floor built by
 * `../mw-dungeon.js` already carries the answer.
 */
export interface MwFloorSquare {
  solid: boolean;
}

/**
 * pick_monster (WORLD.EXE 2000:45bd, mw.c "pick_monster"): roll a monster type the floor allows.
 *
 * It starts from the floor's group, replaces it with `random(9)` on a coin flip and with
 * `random(104)` one time in three, and draws again from the top until the monster's own floor
 * range brackets the floor and WORLD.PIC holds its picture.
 */
export function pickMonster(rng: Rng, group: number, floor: number): number {
  for (;;) {
    let type = group;
    if (rng.random(2) === 1) type = rng.random(GROUPS);
    if (rng.random(3) === 0) type = rng.random(ROLLABLE);
    if (stockableOn(type, floor)) return type;
  }
}

/** The test the do-while of pick_monster applies to a drawn type. */
function stockableOn(type: number, floor: number): boolean {
  const monster = MONSTERS[type];
  // A negative dungeon number gives a negative group, and the original then reads the monster
  // table backwards from its start; whatever bytes it finds there have never bracketed a floor
  // the game can reach, so the draw counts as rejected.
  if (!monster) return false;
  return monster.minFloor <= floor && floor <= monster.maxFloor && monster.pictureDrawn;
}

/**
 * generate_section (WORLD.EXE 2000:46a4, mw.c "generate_section"): stock a floor with 145
 * monsters. It never touches the map, which is the hash in `../mw-dungeon.js`.
 *
 * Every monster gets a random square of the section that is neither rock nor already taken, a
 * type from {@link pickMonster}, hit points rolled from its own per-floor multiplier, and a
 * depth that starts at the floor and wanders. The first slot is a quest boss on each of the
 * eight floors one stands on, unless the character has already killed it.
 *
 * @param dungeon which of the numbered dungeons the floor belongs to, which sets the group.
 * @param level the floor being stocked; floor 0 is the surface and is left empty.
 * @param killedBosses the eight kill flags (DS:c937), one bit per quest boss in the order
 *   `mw-data.json` lists them; a set bit means that boss is dead and is not placed.
 */
export function stockFloor(
  rng: Rng,
  dungeon: number,
  level: number,
  floorRows: readonly (readonly MwFloorSquare[])[],
  killedBosses: number,
): MwStockedMonster[] {
  // srand(time(NULL)) stands here, and srand(clock_ticks() + slot + a counter) before every
  // square below. The port reseeds nowhere, so its Rng runs on as one sequence and a roll is
  // repeatable from the seed it was built with; the reseeding is also why the game's own
  // monsters come out in diagonal stripes rather than scattered.
  if (level === 0) return [];
  let group = (dungeon + 6) % GROUPS;
  while (rng.random(2) === 0) {
    group = group + rng.random(3) - 1;
    if (group < 0) group = GROUPS - 1;
    if (group > GROUPS - 1) group = 0;
  }
  // set_occupant(character x, character y, 0xfe) stands here, which is what keeps a monster off
  // the square the character is standing on. Nobody is standing on a floor being looked at.
  const taken = new Set<number>();
  const monsters: MwStockedMonster[] = [];
  for (let slot = 0; slot < MONSTER_SLOTS; slot++) {
    let x = 0;
    let y = 0;
    do {
      do {
        x = rng.random(WIDTH);
        y = rng.random(HEIGHT);
      } while (floorRows[y][x].solid);
    } while (taken.has(y * WIDTH + x));
    taken.add(y * WIDTH + x);
    let type = pickMonster(rng, group, level);
    if (slot === 0) {
      const boss = bossOn(level, killedBosses);
      if (boss !== null) type = boss;
      if (isBossType(type)) {
        // set_occupant(x, y, 0xff) gives the square just rolled back before the boss is put
        // down in the middle of the floor instead.
        taken.delete(y * WIDTH + x);
        do {
          do {
            // Every later visit puts the boss back within seven squares of where it was, out of
            // the tables at DS:c8d2 and DS:c8da. A roll here is always a first placement,
            // because nothing carries those squares from one roll to the next.
            y = rng.random(BOSS_AREA_SIZE) + BOSS_AREA_ORIGIN;
            x = rng.random(BOSS_AREA_SIZE) + BOSS_AREA_ORIGIN;
          } while (floorRows[y][x].solid);
        } while (taken.has(y * WIDTH + x));
        taken.add(y * WIDTH + x);
      }
    }
    monsters.push({ x, y, hp: rollHp(rng, type, level), type, depth: rollDepth(rng, level) });
  }
  return monsters;
}

function isBossType(type: number): boolean {
  return type >= FIRST_BOSS && type <= LAST_BOSS;
}

/** The quest boss the floor's first slot holds, or null when the floor has none or the
 *  character has killed the one it has. */
function bossOn(level: number, killedBosses: number): number | null {
  const boss = BOSSES.find((entry) => entry.floor === level);
  if (!boss) return null;
  return (killedBosses & (1 << boss.killFlagBit)) === 0 ? boss.monster : null;
}

/** Two rolls over the monster's own hit points per floor, averaged, with twenty per floor on
 *  top for a quest boss. */
function rollHp(rng: Rng, type: number, level: number): number {
  const span = MONSTERS[type].hpPerFloor * level + 1;
  let hp = (rng.random(span) + rng.random(span) + 2) >> 1;
  if (isBossType(type)) hp += level * BOSS_HP_PER_FLOOR;
  if (hp === 0) hp = 1;
  if (hp > HP_MAX) hp = HP_MAX;
  return hp;
}

/**
 * The depth starts at the floor and then, while a one-in-three roll keeps succeeding, moves by
 * -1, 0 or +1. It is held in a single byte, so a walk that steps below zero wraps to 255.
 */
function rollDepth(rng: Rng, level: number): number {
  let depth = level < DEPTH_FLOOR_LIMIT ? level & 0xff : DEPTH_MAX;
  while (rng.random(3) === 0) depth = (depth + rng.random(3) - 1) & 0xff;
  if (depth === 0) depth = 1;
  if (depth > DEPTH_MAX) depth = DEPTH_MAX;
  if (Math.abs(depth - level) > DEPTH_DRIFT) depth = level & 0xff;
  return depth;
}
