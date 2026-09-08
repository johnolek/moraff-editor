import { die } from '../../game/mw-port/levels';
import type { MwGameSession } from './engine';
import { mwDeleteTheMaps, mwFilesWereDeleted } from './memory';

/**
 * Death (WORLD.EXE 2000:726f, mw.c "FUN_2000_726f"), which movecontrol runs whenever the hit
 * points have gone below zero.
 *
 * With a raise-dead contract the character wakes on floor 0 of the dungeon the contract names
 * and play carries on; without one the original deletes the character's files and movecontrol
 * hands back to the character select screen. MORF-66 says the roster marks the entry dead and
 * keeps the bytes, so the record is neither written nor deleted — but the explored maps are the
 * game's other file, and those really are deleted, here as there.
 */
export async function mwDie(session: MwGameSession): Promise<void> {
  const game = session.game;
  const eventsBefore = game.events.length;
  const outcome = die(game);
  if (mwFilesWereDeleted(game.events, eventsBefore)) mwDeleteTheMaps(session.memory);
  await session.settle();
  if (outcome === 'raised') {
    session.enterFloor(0);
    game.recenterMap = true;
    return;
  }
  session.die();
  session.over = true;
  session.changed();
}
