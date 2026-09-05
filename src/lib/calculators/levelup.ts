import data from '../game/dotu-data.json';
import { levelGain } from '../game/dotu-mech.js';

/** The stats the level-up roll reads. */
export interface LevelUpStats {
  cls: number;
  con: number;
  luck: number;
  wis: number;
  iq: number;
}

export interface LevelUpRoll {
  cls: number;
  name: string;
  /** [min, max] maximum hit points the level adds. */
  hp: [number, number];
  averageHp: number;
  sp: number;
}

/** What one level gives a character of this class with these stats. */
export function levelUpRoll(stats: LevelUpStats): LevelUpRoll {
  const gain = levelGain(stats.cls, stats.con, stats.luck, stats.wis, stats.iq);
  const [least, most] = gain.hp;
  return {
    cls: stats.cls,
    name: data.classes[stats.cls].name,
    hp: gain.hp,
    // The roll is a random number from 0 to one less than the span, so every point is as
    // likely as every other and the average sits in the middle.
    averageHp: (least + most) / 2,
    sp: gain.sp,
  };
}

/** The same level for every class, so the seven can be read side by side. */
export function allClassRolls(stats: LevelUpStats): LevelUpRoll[] {
  return data.classes.map((entry) => levelUpRoll({ ...stats, cls: entry.id }));
}
