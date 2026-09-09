import { rollChar } from '../game/rev-port/character';
import type { RevCharacter, RevGame, RevScreenLine } from '../game/rev-port/state';
import { newRevGame } from '../game/rev-port/state';
import type { RollerPort, RollerView } from './session';

/** Where CHCHAR.EXE has got to, for a screen to draw. */
export type RevRollerView = RollerView<RevScreenLine, RevCharacter>;

/** How many races the menu goes round (CHCHAR 0A29 and 0A5B). */
const RACES = 4;

/**
 * CHCHAR.EXE as a session drives it.
 *
 * It stops in five places: the key each of its two instruction screens waits for, the race menu,
 * the keep prompt, the class menu and the name. Its race menu is the one menu of the three games
 * that is walked with the arrow keys rather than answered by number, so the pointer the session
 * keeps is handed back to the roller on every run: it is what the menu draws in reverse.
 */
export const REV_ROLLER_PORT: RollerPort<RevGame, RevRollerView> = {
  newGame: (setup) =>
    newRevGame({
      rng: setup.rng,
      race: setup.race,
      askRace: () => setup.take('revRace') as number,
      askKeep: () => setup.take('revKeep') as number,
      askClass: () => setup.take('revClass') as number,
      askName: () => setup.take('name') as string,
      pressAnyKey: () => {
        setup.take('continue');
      },
    }),
  rollChar,
  view: (game, state) => ({
    screen: game.screen,
    question: state.question,
    race: state.race,
    width: game.width,
    pc: game.pc,
  }),
  racePointer: { question: 'revRace', races: RACES },
};
