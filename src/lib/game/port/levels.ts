import { expNeeded } from './combat';
import { innTablet, tabletMessage } from './hints';
import type { Game } from './state';

/**
 * go_up_level (exe 3000:bd9a, unf.c "go_up_level"): one experience level, with the hit points
 * and spell points that come with it. `go_down_level` in `combat.ts` is the same table with the
 * signs turned round.
 *
 * Every class rolls its hit points out of its own mix of constitution and luck; only a fighter
 * gets no spell points at all, and a sage gets more of both than anyone. The level goes up
 * first, the new hit points are added to the current ones as well as to the maximum, and the
 * spell points are filled right up.
 */
export function goUpLevel(game: Game): void {
  const pc = game.pc;
  const wasMaxHp = pc.maxHp;
  pc.lev += 1;
  switch (pc.cls) {
    case 0:
      pc.maxHp += game.rng.random(pc.con * 2 + Math.trunc(pc.luck / 2) + 10) + 35;
      break;
    case 1:
      pc.maxHp += game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 2) + 10) + 15;
      pc.maxSp += Math.trunc((pc.wis * 2 + pc.iq) / 3);
      break;
    case 2:
      pc.maxHp += game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 3) + 5) + 14;
      pc.maxSp += Math.trunc((pc.wis + pc.iq) / 13);
      break;
    case 3:
      pc.maxHp += game.rng.random(Math.trunc(pc.con / 3) + Math.trunc(pc.luck / 5) + 4) + 13;
      pc.maxSp += Math.trunc((pc.wis + pc.iq * 2) / 5);
      break;
    case 4:
      pc.maxHp += game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 3) + 4) + 14;
      pc.maxSp += Math.trunc((pc.wis * 2 + pc.iq) / 5);
      break;
    case 5:
      pc.maxHp += game.rng.random(pc.con * 3 + pc.luck + 17) + 55;
      pc.maxSp += Math.trunc((pc.wis + pc.iq) / 14);
      break;
    case 6:
      pc.maxHp += game.rng.random(Math.trunc(pc.con / 2) + Math.trunc(pc.luck / 3) + 7) + 14;
      pc.maxSp += Math.trunc((pc.wis + pc.iq * 2) / 8);
      break;
  }
  pc.sp = pc.maxSp;
  pc.hp += pc.maxHp - wasMaxHp;
}

/**
 * check_gain_level (exe 2000:7c71, unf.c "check_gain_level"): whether the character has earned
 * the next level. Only a night at the inn actually hands it over; this is what the message after
 * a kill and the battle screen ask.
 */
export function checkGainLevel(game: Game): boolean {
  return expNeeded(game, game.pc.lev) < game.pc.exp;
}

/**
 * gain_level (exe 2000:7d23, unf.c "gain_level"): the level the character's experience is worth,
 * calling {@link goUpLevel} once for each level between the one they have and it. The caller
 * writes the answer back over the character's level; this function does not.
 *
 * It counts up from level 0 rather than from the character's own level, so a character who has
 * somehow gained levels without the experience for them keeps the hit points and drops back to
 * the level the experience buys. The loop gives up at 1000 and answers 0, which would take the
 * character back to a fresh one's level.
 */
export function gainLevel(game: Game): number {
  for (let level = 0; ; level += 1) {
    if (level > 999) return 0;
    if (game.pc.lev < level) goUpLevel(game);
    if (game.pc.exp < expNeeded(game, level)) return level;
  }
}

/**
 * level_up_screen (exe 3000:955f, unf.c "level_up_screen"): the stone tablet the inn shows once
 * the night has been paid for and the level gained, one of fourteen picked by the new level.
 * From level 80 up the original runs off the end of its comparisons and shows nothing.
 */
export function levelUpScreen(game: Game): void {
  const tablet = innTablet(game.pc.lev);
  if (tablet === null) return;
  game.tablet(...tabletMessage(tablet));
}
