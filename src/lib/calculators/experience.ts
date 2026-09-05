import { allMonsters, appearsOn, isPuffball, type Monster } from '../bestiary/monsters';
import { expToReach, expValue, levelGain, monsterLevelDistribution } from '../game/dotu-mech.js';

export interface Character {
  level: number;
  exp: number;
  /** The "I can handle anything!" difficulty, which doubles the experience per level. */
  hard: boolean;
}

/** The stats the level-up and level-drain rolls read. */
export interface Stats {
  cls: number;
  con: number;
  luck: number;
  wis: number;
  iq: number;
}

export interface LevelRow {
  level: number;
  xpToReach: number;
  stillNeeded: number;
}

export interface Progress {
  rows: LevelRow[];
  toNextLevel: number;
  toTarget: number;
}

export interface KillRow {
  monster: Monster;
  xpPerKill: number;
  /** Null when the monster is worth nothing, so no number of kills would do it. */
  killsToNextLevel: number | null;
  killsToTarget: number | null;
}

export interface DrainCost {
  /** The experience a drained character is left with. */
  newExp: number;
  expLost: number;
  /** [min, max] maximum hit points one drained level takes away. */
  hpLost: [number, number];
  spLost: number;
}

/** Experience needed to reach a level, as a whole number like the game's tables print. */
export function xpToReach(level: number, hard: boolean): number {
  return level <= 0 ? 0 : Math.round(expToReach(level, hard));
}

/** The thresholds from the character's own level up to the target, and what is still missing. */
export function levelProgress(character: Character, target: number): Progress {
  const rows: LevelRow[] = [];
  for (let level = character.level; level <= Math.max(character.level, target); level++) {
    const needed = xpToReach(level, character.hard);
    rows.push({ level, xpToReach: needed, stillNeeded: Math.max(0, needed - character.exp) });
  }
  return {
    rows,
    toNextLevel: Math.max(0, xpToReach(character.level + 1, character.hard) - character.exp),
    toTarget: Math.max(0, xpToReach(target, character.hard) - character.exp),
  };
}

/** What a kill is worth on average, over the levels the floor stocks the monster at. */
export function expectedExp(expMult: number, levels: [number, number][]): number {
  return levels.reduce((sum, [ml, p]) => sum + p * expValue(ml, expMult), 0);
}

/** Kills needed to earn `missing` experience; null when the monster is worth nothing. */
export function killsFor(missing: number, xpPerKill: number): number | null {
  if (missing <= 0) return 0;
  if (xpPerKill <= 0) return null;
  return Math.ceil(missing / xpPerKill);
}

/** Every monster the floor can be stocked with, best experience first. */
export function killRows(module: number, floor: number, progress: Progress): KillRow[] {
  const levels = monsterLevelDistribution(floor, module);
  return allMonsters()
    .filter((monster) => appearsOn(monster, module, floor))
    .map((monster) => {
      const xpPerKill = isPuffball(monster) ? 0 : expectedExp(monster.expMult, levels);
      return {
        monster,
        xpPerKill,
        killsToNextLevel: killsFor(progress.toNextLevel, xpPerKill),
        killsToTarget: killsFor(progress.toTarget, xpPerKill),
      };
    })
    .sort((a, b) => b.xpPerKill - a.xpPerKill);
}

/**
 * What one drained level costs. The game drops the character a level and sets its experience
 * to the minimum for the level it lands on, so everything earned above that minimum is gone;
 * the hit points and spell points it takes back are the same roll the level granted.
 */
export function drainCost(character: Character, stats: Stats): DrainCost {
  const newExp = xpToReach(character.level - 1, character.hard);
  const gain = levelGain(stats.cls, stats.con, stats.luck, stats.wis, stats.iq);
  return {
    newExp,
    expLost: Math.max(0, character.exp - newExp),
    hpLost: gain.hp,
    spLost: gain.sp,
  };
}
