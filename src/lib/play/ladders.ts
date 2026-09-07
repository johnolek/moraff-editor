import { bundledDungeon } from '../game/dungeon';
import { showHint } from '../game/port/drops';
import type { Game } from '../game/port/state';
import { BOTTOM_LEVEL } from '../game/unfmap.js';
import { hintOnFloor } from './arrival';
import type { Turn } from './engine';
import { changeModule } from './modules';
import { notBuiltYet } from './screens';

/**
 * The ladders: U to climb one, D to go down one, and the module teleporter waiting at the bottom
 * of the last floor a module has.
 */

/** The snake's answer to U or D on a square with no ladder on it. */
const NO_LADDER = 0x67;

/** What the town's four buildings are called, in the order the generator numbers them from 1. */
const BUILDINGS = ['STORE', 'TEMPLE', 'BANK', 'INN'];

/**
 * check_for_ladder (exe 3000:827f, unf.c "check_for_ladder"): how many floors the ladder on this
 * square goes, down being positive and up negative, and 0 for a square with no ladder.
 */
export function ladderUnder(game: Game): number {
  return bundledDungeon.ladder(game.pc.x, game.pc.y, game.pc.level, game.pc.module);
}

/**
 * draw_ladder_prompt (exe 2000:aa95, unf.c "draw_ladder_prompt"): the box the game puts up on a
 * square with a way out of the floor. A ladder down says which key goes down it; a ladder up and
 * a building both say the other one, since a building in the town is reached by climbing to it.
 */
export function ladderPrompt(ladder: number, building: number): string[] | null {
  const reads = ladder !== 0 ? ladder : -building;
  if (reads === 0) return null;
  // DS:1913 191c, or DS:1902 190a
  return reads > 0 ? ['HIT D TO', 'GO DOWN'] : ["HIT 'U'", 'TO GO UP'];
}

/**
 * movecontrol's 0x75 branch: U climbs the ladder up, or goes into the building the square holds.
 * The game reads the two the same way round, because a building in the town is up a ladder.
 */
export async function goUp(turn: Turn): Promise<void> {
  const { game, session } = turn;
  if (turn.ladder < 0) {
    session.enterFloor(game.pc.level + turn.ladder);
    hintOnFloor(game);
    return;
  }
  if (turn.building !== 0) {
    notBuiltYet(game, `GO INTO THE ${BUILDINGS[turn.building - 1]}`);
    return;
  }
  showHint(game, NO_LADDER);
  game.pressAnyKey();
}

/**
 * movecontrol's 0x64 branch: D goes down the ladder. A ladder that would lead past the bottom
 * floor of the module is the module teleporter instead, which is how a module is left from its
 * deepest floor.
 */
export async function goDown(turn: Turn): Promise<void> {
  const { game, session } = turn;
  if (turn.ladder < 1) {
    showHint(game, NO_LADDER);
    game.pressAnyKey();
    return;
  }
  if (BOTTOM_LEVEL[game.pc.module] < game.pc.level + turn.ladder) {
    await changeModule(turn);
    return;
  }
  session.enterFloor(game.pc.level + turn.ladder);
  hintOnFloor(game);
}
