import { printBattleHpInfo, spendAttackTime, strike } from '../game/port/combat';
import { showHint } from '../game/port/drops';
import type { GameSession, Turn } from './engine';
import { KEY } from './keys';

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
 * once, the hit points line goes up in the battle banner when the swing landed, and the time the
 * swing cost is spent, which is what buys an adjacent monster its own attacks.
 *
 * Both of those draw straight onto the message block and neither waits for a key, so the swing
 * stands beside the banner rather than going into a box of its own.
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
  game.events.push({ kind: 'swung' });
}

/**
 * movecontrol (exe 2000:c308, unf.c "movecontrol"), its 6 branch at 2000:d285: Ctrl-F puts the
 * repeat-fight flag up, and the character keeps swinging until something reads the keyboard.
 */
export function keepSwinging(turn: Turn): void {
  turn.session.repeatFight = true;
}

/**
 * movecontrol (exe 2000:c308, unf.c "movecontrol") where it takes its key, at 2000:c82d: with
 * the repeat-fight flag up it does not read one at all, it takes F.
 *
 * In DOS the player stops the repeat by touching a key, because the flush at the end of every
 * swing reads it and reading the keyboard is what puts the flag down. A browser only delivers a
 * key event once the page stops working, so the loop hands it a turn here before swinging again,
 * which is also what lets the map be drawn between one swing and the next.
 */
export async function readKey(session: GameSession): Promise<number> {
  if (!session.repeatFight) return session.key();
  session.changed();
  await new Promise((resolve) => setTimeout(resolve));
  return KEY.fight;
}
