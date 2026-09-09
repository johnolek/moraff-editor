import data from '../game/rev-data.json';

/**
 * The monsters of Moraff's Revenge, and what the game does with them.
 *
 * The table comes from `src/lib/game/rev-data.json`, which
 * `rev-tools/reference/build_rev_data.py` reads out of the game folder; the rules here are read
 * from the disassembly, and each one names the address it came from.
 * `rev-tools/docs/MONSTERS.md` is the longer write-up.
 */

/** Lowest and highest of something, over every slot a monster holds. */
export interface RevBounds {
  min: number;
  max: number;
}

/** One of a dungeon's twenty-two names, and what the shipped `1.NUM` and `2.NUM` put behind it. */
export interface RevMonster {
  /** 1 to 22: the line of `F6.COM` or `F7.COM` this name is on. */
  index: number;
  name: string;
  /** Which picture of `4.NUM` the close-up view draws, from `3.NUM`. */
  closeUp: number;
  /** Which picture of `6.NUM` the distant view draws, from `5.NUM`. */
  distant: number;
  /** How many of the dungeon's monster slots are this one. */
  count: number;
  /** The dungeon levels that hold at least one of it. */
  levels: number[];
  /** The level the game gives it, which is a little deeper than the level it stands on. */
  monsterLevel: RevBounds | null;
  /** What it fights with, after the cap at 1000:8247. */
  hitPoints: RevBounds | null;
  /** How many of its slots hold a negative number in `2.NUM`. */
  negative: number;
}

/** One drawing of a monster at one size. */
export interface RevDrawing {
  width: number;
  height: number;
  /** One string per row, a character per pixel, each a colour index 0 to 3. */
  rows: string[];
}

/**
 * A monster's picture, at every size the 3-D view draws it.
 *
 * `4.NUM` holds two sizes of each close-up and `6.NUM` three of each distant one, laid end to
 * end; the 3-D view picks the size by how far off the monster is (1000:6A3B, 1000:6A74). The
 * picture's own `width`, `height` and `rows` are the first and biggest of them, which is the one
 * the bestiary shows and the one a monster on the character's own square is drawn with.
 */
export interface RevPicture extends RevDrawing {
  index: number;
  variants: RevDrawing[];
}

/** One of the two sets of monsters, and the band of dungeon levels it is used on. */
export interface RevDungeon {
  number: number;
  firstLevel: number;
  lastLevel: number;
  /** The file the names were read from: `F6.COM` or `F7.COM`. */
  nameFile: string;
  monsters: RevMonster[];
  closeUps: RevPicture[];
  distants: RevPicture[];
}

/** One occupied monster slot, worked out from the slot number and the two shared files. */
export interface RevSlot {
  slot: number;
  /** The dungeon level the slot belongs to. */
  level: number;
  column: number;
  row: number;
  /** Which of the dungeon's twenty-two names it is. */
  name: number;
  monsterLevel: number;
  hitPoints: number;
}

export const DUNGEONS: RevDungeon[] = data.dungeons;
export const PALETTES: string[][] = data.palettes;
/** `1.NUM`, one square per slot packed as `32 * row + column`, or 0 for an empty slot. */
export const REV_POSITIONS: number[] = data.slots.positions;
/** `2.NUM`, the hit points each of those monsters has left. */
export const REV_STRENGTHS: number[] = data.slots.strengths;

/** Forty monster slots belong to each dungeon level (1000:79C3). */
export const SLOTS_PER_LEVEL = data.constants.slotsPerLevel;
export const DEEPEST_LEVEL = data.constants.deepestLevel;
/** The name is the slot number modulo this, plus one (1000:80B0). */
const NAME_MODULUS = data.constants.nameModulus;
/** The slot number's divisors that each add a level to the monster (1000:80F5 onward). */
const LEVEL_BONUS_DIVISORS = data.constants.levelBonusDivisors;
/** Hit points are capped at this many per level of the monster (1000:8247). */
export const HIT_POINTS_PER_LEVEL = data.constants.hitPointsPerLevel;
const HIT_POINTS_FLOOR = data.constants.hitPointsFloor;
/** The first level drawn from the second set of monsters (1000:4C6B). */
export const SECOND_DUNGEON_FROM = data.constants.secondDungeonFrom;

/** The two names the correction at 1000:81A6 takes, how far down it moves one on a shallow
 *  level, and how far up when the hit points in `2.NUM` are over the other number
 *  (1000:81A6 to 1000:8211). */
const FIRST_CORRECTED_NAME = 19;
const LAST_CORRECTED_NAME = 20;
const SHALLOWER_THAN = 7;
const SHALLOW_STEP = 8;
const STRONG_ABOVE = 140;
const STRONG_STEP = 2;

/** The slot numbers a dungeon level owns: `40 * level - 39` to `40 * level` (1000:79C3). */
export function slotsForLevel(level: number): [number, number] {
  return [SLOTS_PER_LEVEL * level - (SLOTS_PER_LEVEL - 1), SLOTS_PER_LEVEL * level];
}

/**
 * The level the game gives the monster in a slot (1000:80DE onward).
 *
 * It is the level the slot belongs to, worked out as `INT((slot + 40) / 40)` — which reads one
 * too high on a level's fortieth slot — plus one for each of 2, 4, 8 and 16 the slot number
 * divides by. So a level's monsters run from its own number up to four or five deeper.
 */
export function monsterLevelOf(slot: number): number {
  const level = Math.floor((slot + SLOTS_PER_LEVEL) / SLOTS_PER_LEVEL);
  return level + LEVEL_BONUS_DIVISORS.filter((divisor) => slot % divisor === 0).length;
}

/**
 * Which of the twenty-two names a slot is (1000:80B0, corrected at 1000:81A6).
 *
 * The name is the slot number modulo 20 plus one, so the plain rule only ever reaches the first
 * twenty. The range test at 1000:81A6 then takes a name of 19 or 20: on a level shallower than 7
 * it becomes 11 or 12, and where the number in `2.NUM` is over 140 it becomes 21 or 22. Those
 * last two are the only way the twenty-first and twenty-second names are ever reached.
 */
export function nameIndexOf(slot: number, dungeonLevel: number, stored: number): number {
  const index = (slot % NAME_MODULUS) + 1;
  if (index < FIRST_CORRECTED_NAME || index > LAST_CORRECTED_NAME) return index;
  if (dungeonLevel < SHALLOWER_THAN) return index - SHALLOW_STEP;
  return Math.abs(stored) > STRONG_ABOVE ? index + STRONG_STEP : index;
}

/**
 * The hit points the monster in a slot fights with (1000:8223 to 1000:828A).
 *
 * Meeting it caps the number `2.NUM` holds at ten times its level and writes the cap back into
 * the file, then fights with the absolute value, and a monster with none is given one.
 */
export function fightingHitPoints(slot: number, stored: number): number {
  const capped = Math.min(Math.abs(stored), HIT_POINTS_PER_LEVEL * monsterLevelOf(slot));
  return Math.max(capped, HIT_POINTS_FLOOR);
}

/** A slot of `1.NUM` packs the square as `32 * row + column`, the same order the occupancy
 *  grid is indexed in (1000:76CE beside 1000:76A5). */
const COLUMN_SCALE = data.constants.columnScale;

/**
 * The monsters standing on a dungeon level, in slot order.
 *
 * Moraff's Revenge does not roll its monsters: `1.NUM` and `2.NUM` say where every monster on
 * all seventy levels is and what it has left, the whole disk shares them, and the game writes
 * them back when you leave (1000:B5C8). So this is the dungeon as the disk the table was read
 * from had it, not a distribution.
 */
export function slotsOnLevel(level: number): RevSlot[] {
  const [first, last] = slotsForLevel(level);
  const out: RevSlot[] = [];
  for (let slot = first; slot <= last; slot++) {
    const packed = REV_POSITIONS[slot] ?? 0;
    if (!packed) continue;
    const stored = REV_STRENGTHS[slot] ?? 0;
    out.push({
      slot,
      level,
      row: Math.floor(packed / COLUMN_SCALE),
      column: packed % COLUMN_SCALE,
      name: nameIndexOf(slot, level, stored),
      monsterLevel: monsterLevelOf(slot),
      hitPoints: fightingHitPoints(slot, stored),
    });
  }
  return out;
}

/** The slots of a dungeon level that hold this monster. */
export function slotsOf(monster: RevMonster, level: number): RevSlot[] {
  return slotsOnLevel(level).filter((entry) => entry.name === monster.index);
}

/** Which set of monsters a dungeon level is drawn from (1000:4C6B and 1000:4C97). */
export function dungeonForLevel(level: number): RevDungeon {
  return level >= SECOND_DUNGEON_FROM ? DUNGEONS[1] : DUNGEONS[0];
}

/** A monster the shipped `1.NUM` and `2.NUM` hold no slot for, so the game never puts it in
 *  front of you. */
export function neverMet(monster: RevMonster): boolean {
  return monster.count === 0;
}

/**
 * One in how many turns of the key loop moves a monster (1000:7EEC).
 *
 * The dungeon's key wait polls `INKEY$` instead of blocking, and each pass rolls this: on a
 * one-in-D draw the monster turn runs. D is `INT((165 - L + your level) * speed / 20)`, never
 * below 8. `L` is DGROUP B6B4, the level of the last monster the character met, which is the same
 * variable the wander roll reads and is not the level of the monster whose turn it is. `speed` is
 * how many times faster the machine is than the one the calibration at 1000:BF60 was written for,
 * so the monsters move at the same rate on any machine.
 */
export function monsterTurnOdds(lastMonsterLevel: number, playerLevel: number, speed: number): number {
  return Math.max(8, Math.trunc(((165 - lastMonsterLevel + playerLevel) * speed) / 20));
}

/**
 * How much of the time an awake monster chases you rather than wandering (1000:73B6).
 *
 * Its turn rolls `INT(RND * (L + 35))` and wanders when that is under 15. `L` is DGROUP B6B4,
 * the level of the last monster the character met, which 1000:73BC loads straight into the roll:
 * it is not the level of the monster taking the turn, so every monster on the level chases just
 * as often, and it is zero until anybody has been met.
 */
export function chaseChance(lastMonsterLevel: number): number {
  return Math.max(0, Math.min(1, 1 - 15 / (lastMonsterLevel + 35)));
}

/**
 * The kind the fight code sorts a monster into (1000:82E5 to 1000:8408).
 *
 * It is decided by the name's number and nothing else: 1 to 5 in bands of the twenty-two names,
 * and the second dungeon overrides two of those bands with 6 and 7. The kind is what the swing
 * and the damage are adjusted by.
 */
export function monsterKind(nameIndex: number, dungeonNumber: number): number {
  const second = dungeonNumber === 2;
  if (nameIndex < 6) return second ? 6 : 1;
  if (nameIndex < 9) return 2;
  if (nameIndex < 14) return 3;
  if (nameIndex < 19) return second ? 7 : 4;
  return 5;
}

/** What the fight code does differently for a kind, in the order the rules are applied. */
export function describeKind(kind: number): string[] {
  const lines: string[] = [];
  // 1000:8408 and 1000:8356 move the number the swing has to beat.
  if (kind === 2) lines.push('Four harder to hit than its level alone would make it');
  if (kind === 3) lines.push('Four easier to hit than its level alone would make it');
  // 1000:8C0D and 1000:8CA7 halve the damage of one weapon each.
  if (kind === 1) lines.push('Takes half damage from the mace');
  if (kind === 2) lines.push('Takes half damage from the sword');
  // 1000:9D1F doubles what it deals.
  if (kind === 6) lines.push('Hits you for twice what it rolls');
  // 1000:84B4 multiplies what a kill is worth.
  if (kind === 5) lines.push('Worth ten times the experience of its level');
  return lines;
}

/**
 * What killing a monster of this level and kind is worth (1000:845D to 1000:84BE).
 *
 * `INT(5 * 1.5 ^ (level ^ 0.96) + 30 * (level - 1) ^ 1.4 + 15)`, times ten for kind 5.
 */
export function killExperience(monsterLevel: number, kind: number): number {
  const base = Math.trunc(
    5 * 1.5 ** monsterLevel ** 0.96 + 30 * (monsterLevel - 1) ** 1.4 + 15,
  );
  return kind === 5 ? base * 10 : base;
}

/**
 * The hit points a killed monster comes back with (1000:A3C8 to 1000:A404).
 *
 * Killing one never empties its slot. The slot is given `INT(RND * 8 * level) + 2 * level + 1`
 * hit points for the level you are standing on and a fresh square, so the level always holds its
 * forty monsters and the ones you clear come back at the depth you cleared them at.
 */
export function respawnHitPoints(dungeonLevel: number): RevBounds {
  return { min: 2 * dungeonLevel + 1, max: 10 * dungeonLevel };
}

export interface RevMonsterGroup {
  label: string;
  monsters: RevMonster[];
  dungeon: RevDungeon;
}

/** The list as the tab shows it: a heading for each of the two dungeons, then the names the
 *  game never reaches. */
export function monsterGroups(): RevMonsterGroup[] {
  const groups: RevMonsterGroup[] = [];
  for (const dungeon of DUNGEONS) {
    groups.push({
      label: `Levels ${dungeon.firstLevel}–${dungeon.lastLevel}`,
      monsters: dungeon.monsters.filter((monster) => !neverMet(monster)),
      dungeon,
    });
  }
  const never = DUNGEONS.flatMap((dungeon) =>
    dungeon.monsters.filter(neverMet).map((monster) => ({ monster, dungeon })),
  );
  if (never.length > 0) {
    groups.push({
      label: 'Never met',
      monsters: never.map((entry) => entry.monster),
      dungeon: DUNGEONS[0],
    });
  }
  return groups;
}

/** The id the list keys a monster by, since both dungeons number their names 1 to 22. */
export function monsterId(dungeon: RevDungeon, monster: RevMonster): string {
  return monsterIdFor(dungeon, monster.index);
}

/** The same id from the numbers alone, for a caller holding the name a slot works out rather
 *  than the monster itself. */
export function monsterIdFor(dungeon: RevDungeon, nameIndex: number): string {
  return `${dungeon.number}:${nameIndex}`;
}

/** The monster an id names, and the dungeon it belongs to. */
export function monsterById(id: string): { dungeon: RevDungeon; monster: RevMonster } {
  const [number, index] = id.split(':').map(Number);
  const dungeon = DUNGEONS.find((entry) => entry.number === number) ?? DUNGEONS[0];
  const monster = dungeon.monsters.find((entry) => entry.index === index) ?? dungeon.monsters[0];
  return { dungeon, monster };
}
