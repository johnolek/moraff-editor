import { DRAINED_STATS } from '../bestiary/monsters';
import data from '../game/mw-data.json';

/**
 * The 112 monsters of Moraff's World and what the game does with them.
 *
 * The numbers come from `src/lib/game/mw-data.json`, which
 * `mw-tools/reference/build_mw_data.py` cuts out of WORLD.EXE; the rules here are read from the
 * decompilation, and each one names the function it came from. `mw-tools/docs/DUNGEON.md` is the
 * longer write-up of all of it.
 */

/** One row of the monster table at DGROUP 0x237. */
export interface MwMonster {
  index: number;
  name: string;
  /** The shallowest floor it can be stocked on, and the deepest. */
  minFloor: number;
  maxFloor: number;
  /** Taken off the character's swing. */
  defence: number;
  /** `random(this)` per hit it lands. */
  damageDie: number;
  /** Levels it takes off the character on a hit. */
  levelDrain: number;
  /** Which characteristic it moves and which way: 1 Strength through 6 Luck, negative down. */
  statDrain: number;
  /** What it breathes instead of striking, 1 to 5, or 0 for a monster that only strikes. */
  breath: number;
  /** 1 poisons, 2 diseases, 6 is a puffball, 99 is ordinary, 100 is spell-proof. */
  kind: number;
  /** Hit points per floor of depth. */
  hpPerFloor: number;
  /** Added to its own attack. */
  attack: number;
  /** Also taken off the character's swing. */
  extraDefence: number;
  /** Taken off the character's swing and added to its own attack. */
  defenceAndAttack: number;
  /** What a kill is worth is multiplied by this. */
  expMult: number;
  picture: number;
  /** WORLD.PIC holds this picture. A monster whose picture is missing is never stocked. */
  pictureDrawn: boolean;
  /** The palette entry the picture drawer paints this monster's pixel value 17 in. */
  colour: number;
  /** The whole 35-byte record as hex, fields nobody has read included. */
  raw: string;
}

export interface MwWeapon {
  index: number;
  name: string;
  damageDie: number;
  toHit: number;
  /** How long the swing takes, which is why the great sword is not simply the best weapon. */
  swingTime: number;
  worth: number;
}

export interface MwArmour {
  index: number;
  name: string;
  /** Taken off every monster's attack. */
  armourClass: number;
  worth: number;
}

/** One of the eight quest bosses, and the floor it stands on. */
export interface MwBoss {
  floor: number;
  monster: number;
  name: string;
  killFlagBit: number;
}

export const MONSTERS: MwMonster[] = data.monsters;
export const WEAPONS: MwWeapon[] = data.weapons;
export const ARMOUR: MwArmour[] = data.armour;
export const BOSSES: MwBoss[] = data.bosses;

/** How many monsters generate_section (exe 2000:46a4) puts on a floor. */
export const MONSTERS_PER_FLOOR = data.constants.monsterSlotsPerFloor;
/** The nine values a floor's group can take; every one of them is also a monster index. */
export const GROUPS = data.constants.groups;
/** The 104 monsters the game rolls; 104 to 111 are the quest bosses, which it places itself. */
const ROLLABLE = data.constants.rollableMonsters;
const HP_MAX = data.constants.hpMax;
const BOSS_HP_PER_FLOOR = data.constants.bossHpPerFloor;
const DEPTH_MAX = data.constants.depthMax;
const DEPTH_DRIFT = data.constants.depthDrift;
const EXP_BASE = data.constants.expBase;
const EXP_SCALE = data.constants.expScale;
const EXP_DEPTH_CAP = data.constants.expDepthCap;

/** The puffball, which pops instead of fighting. */
const PUFFBALL = 6;
/** The monster that refuses Go Away, Hold Monster, Drain Monster and Autokill (exe 2000:cc66,
 *  mw.c "spell_proof") and catches a thrown grenade without using it up (exe 3000:e221). */
const SPELL_PROOF = 100;
const POISONS = 1;
const DISEASES = 2;

const bossByMonster = new Map(BOSSES.map((boss) => [boss.monster, boss]));

export function isBoss(monster: MwMonster): boolean {
  return bossByMonster.has(monster.index);
}

/** The floor a quest boss stands on, or null for a monster the game rolls. */
export function bossFloor(monster: MwMonster): number | null {
  return bossByMonster.get(monster.index)?.floor ?? null;
}

export function isPuffball(monster: MwMonster): boolean {
  return monster.kind === PUFFBALL;
}

export function isSpellProof(monster: MwMonster): boolean {
  return monster.kind === SPELL_PROOF;
}

/**
 * Whether pick_monster (exe 2000:45bd, mw.c "pick_monster") will accept this monster on this
 * floor. It rerolls until the monster's own floors bracket the one being stocked and WORLD.PIC
 * has its picture, so a monster with no picture is never seen at all. Floor 0 is the surface,
 * which generate_section leaves empty.
 */
export function appearsOn(monster: MwMonster, floor: number): boolean {
  if (isBoss(monster)) return floor === bossFloor(monster);
  return floor > 0 && monster.pictureDrawn && monster.minFloor <= floor && floor <= monster.maxFloor;
}

/** A monster the game can never stock: its picture is missing, or its floors do not overlap. */
export function neverStocked(monster: MwMonster): boolean {
  if (isBoss(monster)) return false;
  return !monster.pictureDrawn || monster.minFloor > monster.maxFloor;
}

/**
 * The group a floor of this dungeon starts from (exe 2000:46a4, mw.c "generate_section").
 *
 * The group is a monster index 0 to 8, and pick_monster leans on it, so it biases a whole floor
 * towards one monster. generate_section then drifts it — while a coin flip keeps coming up
 * heads the group moves by -1, 0 or +1 and wraps — once, before any monster is placed, so a
 * floor's real group is usually this one and occasionally a neighbour.
 */
export function floorGroup(dungeon: number): number {
  return (((dungeon + 6) % GROUPS) + GROUPS) % GROUPS;
}

/** The nine monsters a group can name, which are the first nine of the table. */
export function groupMonsters(): MwMonster[] {
  return MONSTERS.slice(0, GROUPS);
}

/**
 * How often one draw of pick_monster names this monster, before the floor and the picture are
 * checked: one time in three it is any of the 104, and the rest of the time it is the group
 * itself or one of the first nine, half and half.
 */
function drawChance(index: number, group: number): number {
  const anyMonster = 1 / 3 / ROLLABLE;
  const firstNine = index < GROUPS ? (2 / 3) * (1 / 2) * (1 / GROUPS) : 0;
  const theGroup = index === group ? (2 / 3) * (1 / 2) : 0;
  return anyMonster + firstNine + theGroup;
}

/**
 * The share of a floor's monsters that will be each of the 112, given the floor's group.
 *
 * pick_monster draws and redraws until it has one the floor allows, so the chances are the draw
 * chances of the monsters the floor allows, divided by their total. The eight quest bosses are
 * never drawn: generate_section puts one in the floor's first slot itself.
 */
export function stockingOdds(floor: number, group: number): number[] {
  const weights = MONSTERS.map((monster, index) =>
    !isBoss(monster) && appearsOn(monster, floor) ? drawChance(index, group) : 0,
  );
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return total === 0 ? weights : weights.map((weight) => weight / total);
}

/** How many values each of the two hit point rolls can take on this floor. */
export function hpSpan(monster: MwMonster, floor: number): number {
  return Math.max(1, monster.hpPerFloor * floor + 1);
}

/**
 * The hit points a monster stocked on this floor can have, lowest and highest.
 *
 * generate_section rolls `(random(span) + random(span) + 2) / 2`, which runs from 1 to the span
 * itself, gives a quest boss twenty more per floor on top, and caps the lot at 32,000.
 */
export function hpRange(monster: MwMonster, floor: number): [number, number] {
  const bonus = isBoss(monster) ? BOSS_HP_PER_FLOOR * floor : 0;
  const cap = (hp: number) => Math.max(1, Math.min(HP_MAX, hp));
  return [cap(1 + bonus), cap(hpSpan(monster, floor) + bonus)];
}

/**
 * The monster's own difficulty, which stands in for the floor number in both combat formulas
 * and in what a kill is worth.
 *
 * generate_section starts it at the floor and then, while a 1-in-3 roll keeps succeeding, moves
 * it by -1, 0 or +1. It is kept between 1 and 242, and thrown away for the floor's own number if
 * it has wandered more than ten from it.
 */
export function depthRange(floor: number): [number, number] {
  const depth = depthAtFloor(floor);
  return [Math.max(1, depth - DEPTH_DRIFT), Math.min(DEPTH_MAX, depth + DEPTH_DRIFT)];
}

/** The depth a monster is stocked with before it drifts: the floor, or 242 past that. */
export function depthAtFloor(floor: number): number {
  return Math.min(floor, DEPTH_MAX);
}

/** How often a monster stocked on this floor ends up at each depth. */
export function depthDistribution(floor: number, steps = 20): { depth: number; p: number }[] {
  const start = depthAtFloor(floor);
  let walking = new Map<number, number>([[start, 1]]);
  const stopped = new Map<number, number>();
  for (let step = 0; step <= steps; step++) {
    // Two draws in three end the walk; the last step keeps whatever is left where it stands.
    const ending = step === steps ? 1 : 2 / 3;
    for (const [depth, p] of walking) stopped.set(depth, (stopped.get(depth) ?? 0) + p * ending);
    if (step === steps) break;
    const next = new Map<number, number>();
    for (const [depth, p] of walking) {
      for (const move of [-1, 0, 1]) {
        const to = depth + move;
        next.set(to, (next.get(to) ?? 0) + (p * (1 / 3)) / 3);
      }
    }
    walking = next;
  }
  const out = new Map<number, number>();
  for (const [depth, p] of stopped) {
    const settled = settleDepth(depth, start);
    out.set(settled, (out.get(settled) ?? 0) + p);
  }
  return [...out].sort((a, b) => a[0] - b[0]).map(([depth, p]) => ({ depth, p }));
}

/** The clamps generate_section puts on the drifted depth, which it holds in one byte. */
function settleDepth(walked: number, floor: number): number {
  let depth = ((walked % 256) + 256) % 256;
  if (depth === 0) depth = 1;
  if (depth > DEPTH_MAX) depth = DEPTH_MAX;
  return Math.abs(depth - floor) > DEPTH_DRIFT ? floor : depth;
}

/**
 * What killing the monster is worth (exe 3000:b8d4, mw.c "experience_for_kill").
 *
 * The curve is the one Dungeons of the Unforgiven pays, constant for constant, and the depth it
 * is raised to stops counting at 130.
 */
export function killExperience(monster: MwMonster, depth: number): number {
  const capped = Math.min(Math.max(depth, 0), EXP_DEPTH_CAP);
  return monster.expMult * (EXP_SCALE * EXP_BASE ** capped + capped + 1);
}

/** What the monster breathes, in the words the game prints, numbered 1 to 5. */
const BREATH = ['fire', 'ice', 'acid', 'green phlegm', 'black slime'];

/** What each breath does beyond its damage. */
const BREATH_EXTRA = [
  ', halved by Anti-Fire',
  ', halved by Anti-Cold',
  ', which destroys the armor you are wearing',
  ', which gives you a disease',
  ', which poisons you',
];

/** What the monster does to a character beyond the damage of an ordinary hit. */
export function describeEffects(monster: MwMonster): string[] {
  const lines: string[] = [];
  if (monster.levelDrain > 0) {
    lines.push(`Drains ${monster.levelDrain} level${monster.levelDrain === 1 ? '' : 's'} when it hits you`);
  }
  if (monster.statDrain !== 0) {
    const stat = DRAINED_STATS[Math.abs(monster.statDrain) - 1];
    const move = monster.statDrain > 0 ? 'Adds a point to' : 'Takes a point off';
    lines.push(isPuffball(monster) ? `Pops when it reaches you: ${move.toLowerCase()} your ${stat}, and it is gone` : `${move} your ${stat} when it hits you`);
  }
  if (monster.breath > 0) {
    lines.push(`Breathes ${BREATH[monster.breath - 1]} instead of striking half the time${BREATH_EXTRA[monster.breath - 1]}`);
  }
  if (monster.kind === POISONS) lines.push('Poisons you when it hits you');
  if (monster.kind === DISEASES) lines.push('Gives you a disease when it hits you');
  if (isSpellProof(monster)) lines.push('Refuses Go Away, Hold Monster, Drain Monster and Autokill, and catches a thrown grenade without using it up');
  return lines;
}

export interface MwMonsterGroup {
  label: string;
  monsters: MwMonster[];
}

/** The depths the list is cut into, by the shallowest floor a monster is stocked on. */
const DEPTH_BANDS = [
  { label: 'First seen on floors 1–9', from: 0, to: 9 },
  { label: 'First seen on floors 10–24', from: 10, to: 24 },
  { label: 'First seen on floors 25–49', from: 25, to: 49 },
  { label: 'First seen on floors 50–99', from: 50, to: 99 },
  { label: 'First seen on floor 100 or deeper', from: 100, to: Infinity },
];

/**
 * The monsters as the list shows them: the quest bosses, then everything the game rolls in the
 * order the table holds it, cut by how deep it starts appearing, and last the monsters that can
 * never turn up at all. Floor 0 is the surface and holds no monsters, so a monster whose table
 * entry starts at 0 starts at floor 1.
 */
export function monsterGroups(): MwMonsterGroup[] {
  const bosses = MONSTERS.filter(isBoss);
  const never = MONSTERS.filter(neverStocked);
  const rolled = MONSTERS.filter((monster) => !isBoss(monster) && !neverStocked(monster));
  const bands = DEPTH_BANDS.map((band) => ({
    label: band.label,
    monsters: rolled.filter((monster) => monster.minFloor >= band.from && monster.minFloor <= band.to),
  }));
  return [
    { label: 'Quest bosses', monsters: bosses },
    ...bands,
    { label: 'Never stocked', monsters: never },
  ].filter((group) => group.monsters.length > 0);
}

export function allMonsters(): MwMonster[] {
  return MONSTERS;
}

/** The eight weapons a character can hold; the four after them are what a Power Weapon spell
 *  puts in their hands, and no character owns one. */
export const HELD_WEAPONS: MwWeapon[] = WEAPONS.slice(0, 8);

/** The weapon a character's record names, or the fist when the byte is not one of the twelve. */
export function weaponById(index: number): MwWeapon {
  return WEAPONS[index] ?? WEAPONS[0];
}
