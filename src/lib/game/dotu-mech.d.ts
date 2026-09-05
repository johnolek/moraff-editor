/** Types for the exports the app uses; dotu-mech.js exports more. */

/** The threshold for level l: a character is level l once its experience passes this. */
export function expNeeded(l: number, hard: boolean): number;
/** Experience a character needs to reach `level`; the numbers the game's own tables print. */
export function expToReach(level: number, hard: boolean): number;
/** The level a character with this much experience is given the next time it rests at an inn. */
export function levelForExp(exp: number, hard: boolean, current?: number): number;
/** Experience awarded for killing a monster of level ml with multiplier expMult. */
export function expValue(ml: number, expMult?: number): number;

export interface LevelGain {
  /** [min, max] maximum hit points one level adds; the same roll is taken back by a drain. */
  hp: [number, number];
  sp: number;
}
/** What one level costs or gains a character of this class with these stats. */
export function levelGain(cls: number, con: number, luck: number, wis: number, iq: number): LevelGain;
/** Monster level for a floor before the random nudge: depth + 15 * module (module 0..4). */
export function monsterLevelBase(depth: number, module: number): number;
/** [level, probability] pairs for the stored monster level after the nudge, sorted by level. */
export function monsterLevelDistribution(depth: number, module: number, maxSteps?: number): [number, number][];
/** [min, max] hit points a stocked monster of level ml can have. */
export function monsterHpRange(hpPerLevel: number, ml: number, isBoss?: boolean, section?: number): [number, number];
/** Chance each monster type is picked when a floor is stocked. */
export const MONSTER_TYPE_ODDS: {
  puffball: number;
  blocker: number;
  levelDrainer: number;
  poisonDisease: number;
  sectionMonster: number;
};
/** Seconds between a monster's strikes, from its type's speed. */
export function monsterAttackInterval(speed: number): number;
/** Breath damage: ml + rand(ml), halved by the matching resist. */
export function breathDamage(ml: number, resisted: boolean, rnd?: () => number): number;

export interface DropOdds {
  /** Chance per kill of each of the seven weapons Stick to Great Sword, by name. */
  weapons: Record<string, number>;
  /** Chance per kill of each of the six armors Leather to Titanium, by name. */
  armors: Record<string, number>;
  /** Chance per kill of each of the twelve "YOU FIND" items, by name. */
  items: Record<string, number>;
  /** Chance a kill finds any of the twelve items at all. */
  anyItem: number;
  /** Chance a level drainer's corpse leaves a stat potion rather than a trap door key. */
  drainerPotion: number;
  /** The other side of that roll; a key only drops on floors 4 to 178 and only once. */
  drainerKey: number;
  /** Chance a kill offers a spell book; the spell is only learned if it is not known yet. */
  spellbookRoll: number;
  /** Chance of a scroll, wand or spell paper, each only rolled when no book was learned. */
  scroll: number;
  wand: number;
  paper: number;
  /** The highest spell level each source can produce on this floor. */
  maxBookLevel: number;
  maxScrollLevel: number;
  maxWandLevel: number;
  maxPaperLevel: number;
  /** Chance a kill heals the character (cup of health) or gives a spell point (ball of thought). */
  healChance: number;
  spChance: number;
}
/** Per-kill drop probabilities. Only the weapons and armors depend on the monster's level. */
export function dropOdds(depth: number, ml: number, cls: number): DropOdds;

/** Rubles one unit of culture stock costs at this character level. */
export function stockPrice(lev: number): number;
/** Rubles one magic crystal costs; "I can handle anything!" charges half again as much. */
export function crystalPrice(lev: number, hard: boolean): number;
/** Rubles the store hands back: one percent per child helped, never more than half. */
export function storeRefund(spent: number, children: number): number;
/** The inn's room price. Children knock it down, but never below half the full price. */
export function innCost(lev: number, children: number): number;
/** Units of culture stock one stay at the inn uses up. */
export function innStockNeeded(lev: number): number;

export interface Upkeep {
  room: number;
  /** The stay's culture stock, with the children refund already taken off. */
  stock: number;
  /** One crystal per missing spell point, with the children refund already taken off. */
  crystals: number;
}
/** What one stay at the inn costs in rubles, split into its three purchases. */
export function upkeepPerRest(lev: number, children: number, spMissing: number, hard: boolean): Upkeep;
/** The temple's services, as [name, price in rubles]. */
export const TEMPLE: [string, number][];
/** Expected Greater American Dollars from one kill on this floor. */
export function expectedMoney(depth: number, cls: number, hard: boolean): number;
/** One money roll for one kill, exactly as the game rolls it. */
export function rollMoney(depth: number, cls: number, hard: boolean, rnd?: () => number): number;
