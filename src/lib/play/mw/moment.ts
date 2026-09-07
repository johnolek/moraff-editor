import { monstersMove, spendTime } from '../../game/mw-port/combat';
import type { MwGame } from '../../game/mw-port/state';
import { MW_SQUARE_EMPTY, MW_SQUARE_PLAYER, mwSetOccupant } from '../../game/mw-port/state';

/**
 * The two halves of a moment, which movecontrol (WORLD.EXE 2000:aad5) puts either side of every
 * step and runs back to back for the key that only waits.
 */

/**
 * FUN_2000_9cb8 (WORLD.EXE 2000:9cb8): what a step costs in moves — a hundred plus whatever the
 * character is carrying, less ten times their agility, floored at zero, then divided by a
 * hundred and one added.
 *
 * So an unburdened nimble character spends one move a step and a loaded slow one spends more.
 */
export function stepCost(game: MwGame): number {
  const pc = game.pc;
  const load = pc.loadedWeight + 100 - pc.dex * 10;
  return Math.trunc((load < 0 ? 0 : load) / 100) + 1;
}

/**
 * FUN_2000_a57e (WORLD.EXE 2000:a57e, mw.c "FUN_2000_a57e"): leaving a square takes the character
 * off the occupancy grid.
 *
 * The original also wipes the message box off the top of the screen first, and wipes a taller
 * rectangle when the battle banner is showing. The port clears the box on the next key instead.
 */
export function leaveSquare(game: MwGame): void {
  mwSetOccupant(game, game.pc.x, game.pc.y, MW_SQUARE_EMPTY);
}

/**
 * FUN_2000_a64b (WORLD.EXE 2000:a64b, mw.c "FUN_2000_a64b"): arriving on a square.
 *
 * The character goes back on the grid, every ring of regeneration hands over a hit point, half
 * the time the step's own cost in moves is spent — which is what buys an adjacent monster its
 * turns — and then every monster on the floor takes its step.
 *
 * Nothing here caps the hit points at the maximum; movecontrol does that at the end of a step.
 */
export function arriveSquare(game: MwGame): void {
  mwSetOccupant(game, game.pc.x, game.pc.y, MW_SQUARE_PLAYER);
  game.pc.hp += game.pc.regenRings;
  if (game.rng.random(2) !== 0) spendTime(game, stepCost(game));
  monstersMove(game);
}
