import { bundledMwDungeon } from '../../game/mw-dungeon';
import type { MwGame } from '../../game/mw-port/state';
import type { MwGameSession } from './engine';

/**
 * The chutes: a square that drops the character to a floor below it the moment they stand on
 * one, with no key to press and nothing to be done about it.
 */

/**
 * chute_target (WORLD.EXE 2000:9e4a, mw.c "chute_target"): the floor the chute on this square
 * drops to, or the floor the character is already on when the square has no chute.
 */
export function chuteUnder(game: MwGame): number {
  return bundledMwDungeon.chute(game.pc.x, game.pc.y, game.pc.floor, game.pc.dungeon);
}

/**
 * chute (WORLD.EXE 2000:9d03, mw.c "chute"): fall. The character lands on the same square of a
 * lower floor, and the game saves them where they land.
 */
export async function fallDownAChute(session: MwGameSession, destination: number): Promise<void> {
  const game = session.game;
  if (destination === game.pc.floor) return;
  session.enterFloor(destination);
  session.save();
  // DS:2e92 2eb0 2ece
  game.say(
    'UH OH... A SINKING FEELING...',
    'YOU HAVE FALLEN DOWN A CHUTE!',
    '  HIT ANY KEY TO CONTINUE...',
  );
  await session.settle();
  await session.key();
  session.clearBox();
  game.recenterMap = true;
  game.redrawView = true;
}
