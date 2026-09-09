import { sectionOf } from '../game/dotu-files.js';
import { showHint } from '../game/port/drops';
import type { Game } from '../game/port/state';
import { bossOfficeTaunt, readBossOfficeMessage } from '../game/port/town';
import type { GameSession, Turn } from './engine';

/**
 * random_events_tick (exe 3000:6e85, unf.c "random_events_tick"), which movecontrol runs once a
 * key has asked for a step.
 *
 * Most of what it does is roll for one of the notes the game drops under a monster — the tour a
 * new character is given and the eight warnings after it — which this port does not show. What
 * is left of it here is the count it keeps: every two hundred and fiftieth step the little snake
 * brings the message the section's boss has sent, and the rest of the function is skipped that
 * time round.
 */

/** How many steps apart the boss's messages are: the 0xfa the step count is taken modulo. */
const STEPS_BETWEEN_MESSAGES = 0xfa;

/** get_choice on hint 123's two entries: 1 reads the message, 2 tells the snake to get lost. */
const READ_IT = 0x31;
const MESSAGE_MENU = [READ_IT, 0x32];

/**
 * The two counts movecontrol and random_events_tick keep in the data segment: DS:2414, the steps
 * taken, and DS:0273, the step after an arrival that does not count. The character record has no
 * room for either, so they are kept beside the game they belong to.
 */
const counts = new WeakMap<Game, { steps: number; skipOneStep: boolean }>();

function countsOf(game: Game): { steps: number; skipOneStep: boolean } {
  const count = counts.get(game) ?? { steps: 0, skipOneStep: false };
  counts.set(game, count);
  return count;
}

/**
 * FUN_2000_31bc (exe 2000:31bc): arriving on a floor raises the flag that keeps movecontrol from
 * running the tick for the first step taken there.
 */
export function skipTheNextTick(game: Game): void {
  countsOf(game).skipOneStep = true;
}

/** random_events_tick, and movecontrol's own test of the flag an arrival raised. */
export async function randomEventsTick(turn: Turn): Promise<void> {
  const count = countsOf(turn.game);
  if (count.skipOneStep) {
    count.skipOneStep = false;
    return;
  }
  count.steps += 1;
  if (count.steps % STEPS_BETWEEN_MESSAGES !== 0) return;
  count.steps = 0;
  await bossOfficeMessage(turn.session);
}

/**
 * boss_office_message (exe 3000:6c9d, unf.c "boss_office_message"): the taunt a section's Shadow
 * boss sends while it is still alive, which the snake offers and only shows if it is asked to.
 *
 * The boss's own picture stands beside the taunt in a panel of the section's wall material
 * (`boss-office.ts`), on top of the play screen: the routine wipes nothing before it draws, and
 * the key it waits for at the end is what takes the panel down again.
 *
 * What the port still does differently is the taunt's own four lines, which the original reads
 * off the stone tablet brought down for them and this port prints in the message box.
 */
async function bossOfficeMessage(session: GameSession): Promise<void> {
  const game = session.game;
  const tablet = bossOfficeTaunt(game);
  if (tablet === null) return;
  showHint(game, 123);
  const chosen = await session.choice(MESSAGE_MENU);
  if (chosen !== READ_IT) return;
  readBossOfficeMessage(game, tablet);
  session.bossOffice = { section: sectionOf(game.pc.module, game.pc.level) };
  await game.key();
  session.bossOffice = null;
  session.box = [];
}
