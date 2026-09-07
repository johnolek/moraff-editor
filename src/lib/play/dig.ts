import { attackTiming } from '../game/port/combat';
import { showHint } from '../game/port/drops';
import { endBattleSpells, passMoment, relocate } from '../game/port/moment';
import { BOTTOM_LEVEL } from '../game/unfmap.js';
import type { Turn } from './engine';

/**
 * dig_hole (exe 2000:ba3f, unf.c "dig_hole"): T digs through the floor to whatever is under it.
 *
 * It is refused three quarters of the way down a module, where a Fighter — who has no Relocate
 * or Ascend to fall back on — is moved somewhere else on the floor by way of an apology and
 * everybody else is told the rock is too hard. Digging takes six moments, which the monsters
 * spend walking towards the character without being allowed to swing, and one that reaches them
 * stops the dig.
 */

/** The snake's three answers: the question, the rock that is too hard, and the Fighter's move. */
const DIG_QUESTION = 0x59;
const TOO_DEEP = 0x1d;
const FIGHTER_MOVED = 0x73;

/** The two keys the question takes. */
const DIG = 0x31;

/** How long a monster's attack timer is held at while the digging goes on. */
const HELD_TIMER = -1200;

/** How many moments the digging takes. */
const DIGGING_MOMENTS = 6;

/** How far down a hole can reach, and where the floors run out. */
const DEEPEST_REACH = 6;

export async function digHole(turn: Turn): Promise<void> {
  const { game, session } = turn;
  const pc = game.pc;
  const bottom = BOTTOM_LEVEL[pc.module];
  if (Math.trunc((bottom * 3) / 4) < pc.level) {
    if (pc.cls === 0) {
      showHint(game, FIGHTER_MOVED);
      game.pressAnyKey();
      relocate(game);
      return;
    }
    showHint(game, TOO_DEEP);
    game.pressAnyKey();
    return;
  }
  showHint(game, DIG_QUESTION);
  if ((await session.choice([DIG, 0x32])) !== DIG) return;
  session.box = [];
  game.monsterTimers.fill(HELD_TIMER);
  for (let moment = 0; moment < DIGGING_MOMENTS; moment++) passMoment(game);
  game.monsterTimers.fill(0);
  if (attackTiming(game) !== -1) {
    game.redrawView = true;
    game.say('A MONSTER WANTS TO HELP'); // DS:1b44
    return;
  }
  // The original flashes this four times over, and four more times above floor 16, with a wait
  // between each. There is no clock here to wait on, so it is printed once.
  game.say('DIGGING... DIGGING...'); // DS:1b5c
  // DS:1b72 1b89 1ba1
  game.say('BOY THIS IS HARD WORK!', 'THIS IS ONE WAY TO WORK', '  UP A SWEAT!');
  game.pressAnyKey();
  game.engaged = -1;
  game.recenterMap = true;
  let landing = pc.level;
  do {
    landing += 1;
    if (landing >= pc.level + DEEPEST_REACH || landing >= Math.trunc((bottom * 5) / 6)) break;
  } while (game.solid(pc.x, pc.y, landing, pc.module));
  // Relocate looks for an open square on the floor being left, so this keeps drawing squares
  // until one of them happens to be open on the floor below as well.
  while (game.solid(pc.x, pc.y, landing, pc.module)) relocate(game);
  endBattleSpells(game);
  session.enterFloor(landing);
}
