import { REV_MAGIC } from './magic';
import { revValue, setRevValue } from './record';
import { revClearScreen, revHitAnyKey, revSayGoodbye } from './screens';
import { revArriveInTheTown } from './spells';
import type { RevGame } from './state';
import type { RevTownDesk } from './town';

/** 1000:A02B, A0E0, A121 and A160: what a death says. */
export const YOURE_DEAD = "YOU'RE DEAD HA HA HA...";
export const CARRIED_OUT = ['  Someone carries you out and tries to', 'raise you from the dead.'];
export const RAISE_FAILED = "  The raise doesn't work.";
export const REINCARNATED = "You've been reincarnated.";

/** 1000:A01C: the row the first line is printed on, on a screen the death has just cleared.
 *  Everything after it is printed at the cursor and so runs down from row 16. */
const DEAD_ROW = 15;

/** 1000:A136 and A215: the square a raise and a reincarnation both put the character back on,
 *  which is the temple's. */
const RAISED_AT = { column: 14, row: 12 };

/** 1000:A1A2 and A1FE: a reincarnated character's six new characteristics, and what the one the
 *  second roll picks gets on top. */
const NEW_STAT_SPREAD = 13;
const NEW_STAT_LEAST = 3;
const FAVOURED_STAT_BONUS = 10;
const STAT_COUNT = 6;

/**
 * 1000:A15D: the character comes back as somebody else.
 *
 * Six new characteristics of `INT(RND * 13) + 3`, one of them ten better, no level and no
 * experience, and back in the town on the temple's square. What they keep is their name, their
 * class, their maximum hit points and everything they own.
 *
 * The roll that picks the favoured characteristic is `INT(RND * 6)`, with no 1 added to it, and
 * the six are `A(1)` to `A(6)`. So one reincarnation in six puts the ten points on `A(0)`, which
 * is a real element of the array and nothing the game ever reads, and that character comes back
 * with nothing extra at all.
 */
async function reincarnate(game: RevGame, desk: RevTownDesk): Promise<void> {
  const pc = game.pc;
  game.say(REINCARNATED);
  pc.hp = pc.maxHp;
  pc.level = 0;
  pc.experience = 0;
  for (let stat = 0; stat < STAT_COUNT; stat++) pc.stats[stat] = game.rng.random(NEW_STAT_SPREAD) + NEW_STAT_LEAST;
  const favoured = game.rng.random(STAT_COUNT);
  game.scratch = favoured;
  if (favoured > 0) pc.stats[favoured - 1] += FAVOURED_STAT_BONUS;
  await revHitAnyKey(game, desk);
  pc.column = RAISED_AT.column;
  pc.row = RAISED_AT.row;
  revArriveInTheTown(game);
}

/**
 * 1000:A05A to 1000:A0A1: a death takes the two spells a fight casts on the character off.
 *
 * The fight's own poll drops them when the step counter comes back round to where they were cast
 * (1000:0A4F, `revCountDownBattleSpells`); a death drops them whatever the counter says, and
 * hands back exactly what each cast gave — eleven points of agility for Speed (1000:9275 adds
 * them, 1000:A075 takes them) and seven off what strength puts on a swing for Strength
 * (1000:92F5 and 1000:A096). The strength here is the character's own, not the characteristic,
 * so a death costs the swing rather than the record's strength; the town's routine at 1000:1C93
 * is the other two spells, the ones cast in the dungeon, and takes those off elsewhere.
 */
function takeOffTheBattleSpells(game: RevGame): void {
  const pc = game.pc;
  if (revValue(pc, REV_MAGIC.battleSpeed) > 0) {
    setRevValue(pc, REV_MAGIC.battleSpeed, 0);
    pc.stats[4] -= 11;
  }
  if (revValue(pc, REV_MAGIC.battleStrength) > 0) {
    setRevValue(pc, REV_MAGIC.battleStrength, 0);
    pc.fromStrength -= 7;
  }
}

/**
 * 1000:A013: the character's hit points have run out.
 *
 * The screen is cleared and told so, and then two rolls decide what becomes of them. The first,
 * `INT(RND * 4) + 1`, ends half of all deaths on the spot — the files are deleted and the game
 * chains to the hall of fame without another word. The second, `INT(RND * 2) + 1`, sends half of
 * what is left to a reincarnation and the rest to the raise: someone carries the body out and
 * rolls `INT(RND * 23) + 1` against its health, and on a roll the health can beat the character
 * is back in the town on the temple's square, one point of health the poorer.
 *
 * @returns whether the character is still alive.
 */
export async function revDie(game: RevGame, desk: RevTownDesk): Promise<boolean> {
  const pc = game.pc;
  // 1000:A016: the death takes the whole screen, which is what finally rubs the dungeon out.
  revClearScreen(game);
  game.kept.locate(DEAD_ROW, 1);
  game.say(YOURE_DEAD);
  // 1000:A034 and 1000:A047: a level or an experience total a drain pushed below zero is put
  // back to zero on the way out.
  if (pc.level < 0) pc.level = 0;
  if (pc.experience < 0) pc.experience = 0;
  takeOffTheBattleSpells(game);
  // 1000:A0A4: nothing more is said and nothing is rolled again.
  if (game.rng.random(4) + 1 > 2) return theEnd(game);
  // 1000:A0C2.
  if (game.rng.random(2) + 1 === 1) {
    await reincarnate(game, desk);
    return true;
  }
  game.say(...CARRIED_OUT);
  pc.hp = pc.maxHp;
  if (game.rng.random(23) + 1 > pc.stats[3]) {
    game.say(RAISE_FAILED);
    return theEnd(game);
  }
  pc.dungeonLevel = 0;
  pc.column = RAISED_AT.column;
  pc.row = RAISED_AT.row;
  pc.stats[3] -= 1;
  // 1000:A156: the raise waits for a key before the town is drawn over the death.
  await revHitAnyKey(game, desk);
  revArriveInTheTown(game);
  return true;
}

/**
 * 1000:A22B: the character's two files are deleted and the game signs off.
 *
 * The key it waits for at 1000:A23D is not kept: it is there so that the hall of fame can be
 * chained to, and the port's run ends here instead.
 */
function theEnd(game: RevGame): boolean {
  revSayGoodbye(game, true);
  game.over = true;
  return false;
}
