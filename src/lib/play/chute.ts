import { bundledDungeon } from '../game/dungeon';
import type { Game } from '../game/port/state';
import type { Turn } from './engine';

/**
 * The chutes: a square that drops the character to a floor below it the moment they stand on
 * one, with no key to press and nothing to be done about it.
 */

/**
 * detect_chute (exe 2000:b5ea, unf.c "detect_chute"): the floor the chute on this square drops
 * to, or the floor the character is already on when the square has no chute.
 */
export function chuteUnder(game: Game): number {
  const chute = bundledDungeon.chute(game.pc.x, game.pc.y, game.pc.level, game.pc.module);
  return chute;
}

/**
 * chute (exe 2000:b532, unf.c "chute"): fall. The character lands on the same square of a lower
 * floor, and the game saves them where they land.
 */
export async function fallDownChute(turn: Turn, destination: number): Promise<void> {
  const { game, session } = turn;
  if (destination === game.pc.level) return;
  session.enterFloor(destination);
  session.save();
  // DS:1a9e, DS:1abc, DS:1ada
  game.say('UH OH... A SINKING FEELING...');
  game.say('YOU HAVE FALLEN DOWN A CHUTE!');
  game.say('  HIT ANY KEY TO CONTINUE...');
  await session.key();
  session.box = [];
  game.redrawView = true;
}
