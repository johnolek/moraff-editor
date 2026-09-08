import type { RevGame } from './state';

/** 1000:A02B and 1000:A0E0: what a death says. */
export const YOURE_DEAD = "YOU'RE DEAD HA HA HA...";
export const CARRIED_OUT = ['  Someone carries you out and tries to', 'raise you from the dead.'];
export const RAISE_FAILED = "  The raise doesn't work.";

/** 1000:A136: the square the raise puts the character back on, which is the temple at 14, 12. */
const RAISED_AT = { column: 14, row: 12 };

/**
 * 1000:A02B: the character's hit points have run out.
 *
 * Someone carries them out and rolls `INT(RND * 23) + 1` against their health. On a roll their
 * health can beat they are back in the town on the temple's own square, one point of health the
 * poorer; on one it cannot, the raise fails and 1000:A249 deletes the character's two files and
 * the game goes to the hall of fame.
 *
 * @returns whether the character is still alive.
 */
export function revDie(game: RevGame): boolean {
  const pc = game.pc;
  game.say(YOURE_DEAD, ...CARRIED_OUT);
  pc.hp = pc.maxHp;
  if (game.rng.random(23) + 1 > pc.stats[3]) {
    game.say(RAISE_FAILED);
    game.over = true;
    return false;
  }
  pc.dungeonLevel = 0;
  pc.column = RAISED_AT.column;
  pc.row = RAISED_AT.row;
  pc.stats[3] -= 1;
  return true;
}
