import type { MwTurn } from './engine';

/**
 * FUN_2000_7b86 (WORLD.EXE 2000:7b86, mw.c "FUN_2000_7b86"): Q writes everything out and leaves.
 *
 * The original saves the explored map of the block it is in and the three floors' monsters to
 * their own files first, prints the line hidden in the executable a letter at a time, waits for
 * a key, saves the character and exits to DOS. Here the character is written back into the
 * roster and the maps into the blob beside it, and the session ends. The three floors' monsters
 * are not kept, which `README.md` says why.
 */
export async function quitAndSave(turn: MwTurn): Promise<void> {
  const { game, session } = turn;
  session.memory.save();
  // FUN_2000_3fcf (exe 2000:3fcf) un-Caesars this out of DS:2586, DS:2591 and DS:259d.
  game.say('PLEASE DO NOT DISTRIBUTE THIS GAME', 'HIT ANY KEY'); // and DS:28ff
  await session.settle();
  await session.key();
  session.save();
  session.over = true;
  session.changed();
}
