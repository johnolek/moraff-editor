import { bundledMwDungeon } from '../../game/mw-dungeon';
import type { MwGame } from '../../game/mw-port/state';
import type { ScreenLine } from '../../game/port/state';
import type { MwGameSession } from './engine';
import { MW_MESSAGE_BOX } from './screens';

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
 * How long "UH OH... A SINKING FEELING..." stands on its own before the two lines that say what
 * happened join it (exe 2000:9dbc). There is no high speed option in this game to skip it.
 */
const SINKING_MS = 1500;

/**
 * The three lines the fall is announced on: print_text calls at x 0 down the strip at the top
 * left, 0x28 apart from y 0 (exe 2000:9db0, 2000:9dd2 and 2000:9de6), in the message box's own
 * colour.
 */
const CHUTE_STEP = 0x28;

const chuteLine = (text: string, index: number): ScreenLine => ({
  text,
  x: 0,
  y: index * CHUTE_STEP,
  font: 0,
  colour: MW_MESSAGE_BOX.colour,
});

/**
 * chute (WORLD.EXE 2000:9d03, mw.c "chute"): fall. The character lands on the same square of a
 * lower floor, and the game saves them where they land.
 *
 * The first line stands alone for a second and a half before the other two, which is the whole of
 * the fall as the player feels it.
 */
export async function fallDownAChute(session: MwGameSession, destination: number): Promise<void> {
  const game = session.game;
  if (destination === game.pc.floor) return;
  session.enterFloor(destination);
  session.save();
  game.draw(chuteLine('UH OH... A SINKING FEELING...', 0)); // DS:2e92
  game.delay(SINKING_MS);
  game.draw(chuteLine('YOU HAVE FALLEN DOWN A CHUTE!', 1)); // DS:2eb0
  game.draw(chuteLine('  HIT ANY KEY TO CONTINUE...', 2)); // DS:2ece
  await session.key();
  session.clearBox();
  game.recenterMap = true;
  game.redrawView = true;
}
