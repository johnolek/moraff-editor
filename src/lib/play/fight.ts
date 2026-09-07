import { printBattleHpInfo, spendAttackTime, strike } from '../game/port/combat';
import { showHint } from '../game/port/drops';
import type { Turn } from './engine';

/**
 * The F key: one swing at the monster the character is engaging, and Ctrl-F, which keeps
 * swinging without another key.
 */

/**
 * UH.BIN 108, which the F key gives when there is nothing to fight: "YOU MUST BE STANDING NEXT
 * TO A MONSTER TO ATTACK IT."
 */
const NOTHING_TO_FIGHT = 108;

/**
 * movecontrol (exe 2000:c308, unf.c "movecontrol"), its 0x66 branch at 2000:d294: the F key.
 *
 * With nothing engaged the snake explains how to reach a monster. Otherwise the character swings
 * once, the hit points line goes up under the battle banner when the swing landed, and the time
 * the swing cost is spent, which is what buys an adjacent monster its own attacks.
 */
export function swingAtMonster(turn: Turn): void {
  const game = turn.game;
  if (game.engaged === -1) {
    showHint(game, NOTHING_TO_FIGHT);
    game.pressAnyKey();
    return;
  }
  const damage = strike(game);
  if (damage > 0) printBattleHpInfo(game);
  // The `while (kbhit()) getch();` strike (exe 2000:7f2b) ends with, which throws away whatever
  // was typed while the swing was on the screen.
  turn.session.flushKeys();
  spendAttackTime(game);
}
