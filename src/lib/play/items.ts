import { loseItem } from '../game/port/drops';
import type { Turn } from './engine';

/** The L key, which throws away something the character carries. The I key is in cast.ts. */

/**
 * movecontrol (exe 2000:c308, unf.c "movecontrol"), case 3 of the same switch: the L key throws
 * a suit of armor, a weapon or the money away. `lose_item` asks both of its own menus.
 */
export async function dropSomething(turn: Turn): Promise<void> {
  await loseItem(turn.game);
}
