import { LEVELS } from '../../game/revmap.js';
import type { RevGame } from './state';

/** The line the fall prints (the literal at 1000:3479). */
export const FELL_DOWN_A_CHUTE = 'YOU FELL DOWN A CHUTE!';

/**
 * 1000:3428: the chute.
 *
 * The character is saved first — 1000:348B calls the save before 1000:3491 adds one to the
 * level, so a character who stops playing here comes back on the floor they fell *from* — then
 * dropped one level onto the same square, and the square is remembered at 1000:356F so that
 * standing on it again is a false floor and the fall can go on.
 *
 * What this port leaves out: 1000:34A0 to 1000:355A works some further arithmetic over the
 * column, the row and the level before the landing square is remembered, and what it comes to
 * has not been read out. `rev-tools/docs/DUNGEON.md` section 8 has the fall as one level onto
 * the same square, and that is what happens here.
 */
export function revFallDownAChute(game: RevGame, save: () => void): void {
  const pc = game.pc;
  game.say(FELL_DOWN_A_CHUTE);
  save();
  pc.dungeonLevel = Math.min(pc.dungeonLevel + 1, LEVELS);
  // 1000:3560: the square is left with a code that is no feature of its own, so that the false
  // floor is the only thing the next pass can find on it.
  game.feature = 38;
  game.chuteLanding = { column: pc.column, row: pc.row, level: pc.dungeonLevel };
}
