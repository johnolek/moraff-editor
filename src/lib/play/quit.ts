import type { Turn } from './engine';

/**
 * quit_game (exe 2000:9c13, unf.c "quit_game"): Q writes everything out and leaves.
 *
 * The original saves the explored maps and the floor's monsters to their own files first, prints
 * the line hidden in the executable a letter at a time, waits for a key, saves the character and
 * exits to DOS. Here the character is written back into the roster, which is the file that
 * matters, and the session ends.
 */
export async function quitGame(turn: Turn): Promise<void> {
  const { game, session } = turn;
  // decode_quit_message (exe 2000:5f78) un-Caesars this out of DS:123c, DS:1247 and DS:1253.
  game.say('PLEASE DO NOT DISTRIBUTE THIS GAME');
  game.say('HIT ANY KEY'); // DS:152a
  await session.key();
  session.save();
  session.over = true;
  session.changed();
}
