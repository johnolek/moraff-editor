import { killMonster } from '../game/port/kills';
import type { GameSession } from './engine';

/**
 * movecontrol (exe 2000:c308, unf.c "movecontrol") at 2000:db6d: the check the loop makes once
 * the key has been dealt with and before it resolves the step.
 *
 * A monster being fought whose hit points have run out is killed here rather than wherever they
 * ran out, so a swing, a spell and a hand grenade all end the same way. `kill_monster` is what
 * hands over the experience, the drops and a section boss's reward, and it asks its own menus.
 *
 * The original draws the monster's picture over the map one last time first, which this port has
 * no portraits for.
 */
export async function killTheDead(session: GameSession): Promise<void> {
  const game = session.game;
  if (game.engaged === -1 || game.monsters[game.engaged].hp >= 1) return;
  await killMonster(game);
  // The repeat-fight flag comes down with the monster (exe 2000:dbe3), so Ctrl-F swings at one
  // monster rather than at whatever walks up next.
  session.repeatFight = false;
}
