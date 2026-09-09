import {
  HIT_POINTS_PER_LEVEL,
  fightingHitPoints,
  killExperience,
  monsterKind,
  monsterLevelOf,
  nameIndexOf,
  dungeonForLevel,
} from '../../rev-bestiary/monsters';
import { REV_KEY } from './keys';
import { REV_VALUE, revValue, type RevPc } from './record';
import type { RevFight, RevGame } from './state';

/**
 * 1000:8223: meeting a monster, and the swing.
 *
 * The loop finds a monster on the character's own square (1000:08F6 and 1000:0946) and calls the
 * per-key routine 1000:3FFC, which ends in the redraw at 1000:4275; 1000:4969 asks the same
 * question again there and jumps here. Everything about the monster comes out of its slot
 * number — `../../rev-bestiary/monsters.ts` is that rule, already ported for the Monsters tab —
 * and what this adds is what the fight itself keeps: the hit points, the kind's two adjustments
 * and the experience.
 */

/** What the kind adds to the number a swing has to beat (1000:8408 and 1000:8356). */
function kindAdjust(kind: number): number {
  if (kind === 2) return 4;
  if (kind === 3) return -4;
  return 0;
}

/** What the kind adds to the monster's own chance of swinging back (1000:8425). */
function attackBonus(name: number, dungeonNumber: number): number {
  return dungeonNumber === 2 && name === 16 ? 20 : 0;
}

/**
 * 1000:8223: the fight is opened against the monster in a slot.
 *
 * The hit points the monster fights with are capped at ten times its level and **the cap is
 * written back into `2.NUM`**, so meeting a monster can permanently weaken it. A monster with
 * none left is given one.
 */
export function revMeetMonster(game: RevGame, slot: number): RevFight {
  const level = game.pc.dungeonLevel;
  const stored = game.monsters.strengths[slot] ?? 0;
  const monsterLevel = monsterLevelOf(slot);
  if (stored >= HIT_POINTS_PER_LEVEL * monsterLevel) {
    game.monsters.strengths[slot] = Math.round(HIT_POINTS_PER_LEVEL * monsterLevel);
  }
  const name = nameIndexOf(slot, level, game.monsters.strengths[slot] ?? 0);
  const dungeon = dungeonForLevel(level);
  const kind = monsterKind(name, dungeon.number);
  const fight: RevFight = {
    slot,
    name,
    monsterLevel,
    hitPoints: fightingHitPoints(slot, game.monsters.strengths[slot] ?? 0),
    kind,
    kindAdjust: kindAdjust(kind),
    attackBonus: attackBonus(name, dungeon.number),
    experience: killExperience(monsterLevel, kind),
  };
  game.fight = fight;
  game.lastMonsterLevel = monsterLevel;
  // 1000:8068 and 1000:803D: the slot the fight is against, and the awake flag the monsters'
  // turn shares between them put back to nothing.
  game.lastFought = slot;
  game.monsters.awake = 0;
  return fight;
}

/** The four things a swing can be thrown with, by the key that throws it (1000:87CA onwards). */
export type RevWeapon = 'sword' | 'mace' | 'knife' | 'fists';

/** Which record value says the character owns the weapon, and null for fists, which need none. */
const OWNED: Record<RevWeapon, number | null> = {
  sword: REV_VALUE.sword,
  mace: REV_VALUE.mace,
  knife: REV_VALUE.knife,
  fists: null,
};

/** The weapon a fight key throws, or null for a key that throws none. */
export function revWeaponFor(key: number): RevWeapon | null {
  if (key === REV_KEY.sword) return 'sword';
  if (key === REV_KEY.mace) return 'mace';
  if (key === REV_KEY.knife) return 'knife';
  if (key === REV_KEY.fists) return 'fists';
  return null;
}

/** 1000:89B4: the two lines a swing with a weapon the character does not own prints. */
export const NO_SUCH_WEAPON = ['YOU DO NOT HAVE THAT', '   WEAPON!!   '];

/**
 * The fifteen lines a fight draws on, read at start-up into the array at DGROUP 5FE0 and held in
 * `F2.COM` — the last fifteen lines of that file, after the magic items it describes.
 *
 * A miss picks one of the first five (`INT(RND * 5) + 1`, 1000:8D60), a hit one of the next five
 * (`INT(RND * 5) + 6`, 1000:8D94), and the last five belong to the drains the monster's attack
 * hands out (1000:9E72).
 */
export const REV_FIGHT_LINES = [
  'HA HA, YOU MISSED!',
  'YOU MISSED',
  'GET A REAL WEAPON',
  'LEARN HOW TO FIGHT!',
  'YOU MISSED, YOU FOOL!',
  'NICE SWING!',
  'I WANT YOU FOR U.S. ARMY!',
  'RIGHT IN THE -----!',
  'BULLSEYE!',
  'SMACK!',
  'YOU FEEL COLD',
  'D R A I N ...',
  'YOU FEEL WEAK',
  'UH OH...',
  'OH SHIT!',
];

/** 1000:8D38 and 1000:8D86: what the swing says, which is one of five either way.
 *
 * The `S.` is on the damage being over one rather than on its not being one (1000:8DE6), so a
 * swing that did nothing says POINT rather than POINTS. */
export function revSwingWords(game: RevGame, swing: RevSwing): string[] {
  const said = REV_FIGHT_LINES[game.rng.random(5) + (swing.damage === 0 ? 0 : 5)];
  const points = `YOU DID ${swing.damage} POINT${swing.damage > 1 ? 'S.' : '.'}`;
  return [said, points];
}

/** The two rows a swing writes on, twenty-five columns wide, straight over the map: `LOCATE 11,
 *  1` at 1000:8D00 and `LOCATE 10, 1` at 1000:8D1F. */
const SWING_SAID_ROW = 11;
const SWING_POINTS_ROW = 10;
const SWING_WIDTH = 25;

/**
 * 1000:8D00: where the two lines of a swing go.
 *
 * Row 11 is blanked and then row 10, and it is that second blank which leaves the cursor at the
 * start of row 11 -- the hit and the miss lines are printed with no `LOCATE` of their own
 * (1000:8D5D and 1000:8D91). The damage then goes back on row 10 above them.
 *
 * The miss line is held back for the breath of fire and for nothing else: the test at 1000:8D45
 * wants the key not to have been `B`, since a breath cannot miss.
 */
export function revPrintTheSwing(game: RevGame, swing: RevSwing, words: string[], key: number): void {
  game.kept.blank(SWING_SAID_ROW, 1, SWING_WIDTH);
  game.kept.blank(SWING_POINTS_ROW, 1, SWING_WIDTH);
  if (swing.damage === 0 && key !== REV_KEY.breathe) game.kept.print(words[0]);
  if (swing.damage > 0) game.kept.print(words[0]);
  game.kept.printAt(SWING_POINTS_ROW, 1, words[1]);
}

/** Whether the character owns the weapon (1000:87DB, 8805, 8830). */
export function revOwnsWeapon(pc: RevPc, weapon: RevWeapon): boolean {
  const value = OWNED[weapon];
  return value === null || revValue(pc, value) === 1;
}

/** What a swing came to. */
export interface RevSwing {
  /** The roll the swing made, DGROUP B712. */
  roll: number;
  /** The number it had to beat, DGROUP B5E4 at 1000:8AD9. */
  target: number;
  /** The damage it did, DGROUP B574, which is 0 for a miss. */
  damage: number;
}

/**
 * 1000:8AD9: the number a swing has to beat, which the game keeps at DGROUP B5E4 and prints
 * nowhere.
 *
 * It is the same whichever weapon is swung — a weapon's plus is added to the roll rather than
 * taken off this — so it is the one number that says how hard the monster in front of you is to
 * hit. There is none while nothing is being fought.
 */
export function revSwingTarget(game: RevGame): number | null {
  const fight = game.fight;
  if (!fight) return null;
  const pc = game.pc;
  let target = Math.round((fight.monsterLevel - pc.level) * 0.7);
  if (target > 5) target = 5;
  target = Math.round(target + 5 + Math.trunc(pc.dungeonLevel * 0.25) + fight.kindAdjust + fight.monsterLevel);
  // 1000:8ADC: a fighter has five fewer to beat, and every level over six one fewer again.
  if (pc.cls === 1) target -= 5;
  return Math.round(target - Math.trunc(pc.level / 6));
}

/**
 * 1000:89FD: the lowest an exploding d20 can come out at, which is what says whether a swing can
 * miss at all.
 *
 * Every throw of the die adds seven tenths of strength and the character's level to the running
 * total, and the die itself is at least 1, so no swing can roll under this. A weapon's plus goes
 * on top (1000:8A5C and 1000:8A76) and can only help. The hit test at 1000:8B1B wants the roll
 * over the number to beat, so a number under this one cannot be missed with anything.
 */
export function revLowestSwing(pc: RevPc): number {
  return Math.trunc(0.7 * pc.stats[0]) + 1 + pc.level;
}

/**
 * 1000:89FD: the swing.
 *
 * The roll is an exploding d20 — a 20 rolls again and both are counted — with seven tenths of
 * strength and the character's level added each time round. What it has to beat is built from
 * the two levels, the depth and the kind, and the three damage bands are each fifteen further
 * points over it.
 */
export function revSwing(game: RevGame, weapon: RevWeapon): RevSwing {
  const pc = game.pc;
  const fight = game.fight;
  if (!fight) return { roll: 0, target: 0, damage: 0 };
  const rng = game.rng;
  let roll = 0;
  let x = 0;
  do {
    x = rng.random(20) + 1;
    roll += Math.trunc(0.7 * pc.stats[0]) + x + pc.level;
  } while (x === 20);
  if (weapon === 'sword') roll += revValue(pc, REV_VALUE.swordPlus);
  if (weapon === 'mace') roll += revValue(pc, REV_VALUE.macePlus);

  const target = revSwingTarget(game) ?? 0;

  let damage = 0;
  const strength = pc.fromStrength;
  if (roll > target) damage += rng.random(10) + strength + 1;
  if (roll - 15 > target) damage += rng.random(10) + strength + 1;
  if (roll - 30 > target) damage += rng.random(12) + 2 * strength + 1;
  damage = Math.trunc(damage);
  // 1000:8C0D and 1000:8CA7: the wrong weapon against the wrong kind does half.
  if (fight.kind === 1 && weapon === 'mace') damage = Math.trunc(0.5 * damage + 1);
  if (weapon === 'knife') damage = Math.trunc(0.5 * damage) + 1;
  if (weapon === 'fists') damage = Math.trunc(damage / 3) + 1;
  if (fight.kind === 2 && weapon === 'sword') damage = Math.trunc(0.5 * damage + 1);
  // 1000:8CC5: a wand can put 240 points on one swing, and the next swing is the one that gets
  // them, whatever it is thrown with.
  damage += game.swingBonus;
  game.swingBonus = 0;
  if (damage < 0) damage = 0;
  fight.hitPoints -= damage;
  return { roll, target, damage };
}

/**
 * 1000:8E44: whether the monster swings back. The roll is against the character's agility, and
 * the two monsters of the second dungeon that carry the bonus at 1000:8448 nearly always do.
 * A roll equal to the agility is enough: the branch at 1000:8E6E is `jae`, where the second
 * swing's test at 1000:9FD1 is the strict one.
 */
export function revMonsterAnswers(game: RevGame): boolean {
  const fight = game.fight;
  if (!fight) return false;
  return game.rng.random(50) + fight.attackBonus + 1 >= game.pc.stats[4];
}

/**
 * 1000:8FB2: the character is no longer standing on the monster, so the fight is over.
 *
 * What is left of the monster is written back into `2.NUM` when it is over zero, which is why a
 * monster you ran away from is still wounded when you find it again.
 */
export function revLeaveTheFight(game: RevGame): void {
  const fight = game.fight;
  if (!fight) return;
  if (fight.hitPoints > 0) game.monsters.strengths[fight.slot] = Math.round(fight.hitPoints);
  game.fight = null;
}
