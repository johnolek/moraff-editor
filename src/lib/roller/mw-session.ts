import { rollChar } from '../game/mw-port/character';
import type { MwCharacter, MwGame } from '../game/mw-port/state';
import { newMwGame } from '../game/mw-port/state';
import type { ScreenLine } from '../game/port/state';
import type { RollerPort, RollerView } from './session';

/** Where Moraff's World's roller has got to, for a screen to draw. */
export type MwRollerView = RollerView<ScreenLine, MwCharacter>;

/** Moraff's World's roll_char as a session drives it. It asks five of the six questions
 *  Dungeons of the Unforgiven's does, having no difficulty to choose. */
export const MW_ROLLER_PORT: RollerPort<MwGame, MwRollerView> = {
  newGame: (setup) =>
    newMwGame({
      slot: setup.slot,
      rng: setup.rng,
      askRace: () => setup.take('race') as number,
      askKeepRerollDesign: () => setup.take('keepRerollDesign') as number,
      askDesignStat: () => setup.take('designStat') as number,
      askName: () => setup.take('name') as string,
      askClass: () => setup.take('class') as number,
      pressAnyKey: () => {
        setup.take('continue');
      },
    }),
  rollChar,
  view: (game, state) => ({ screen: game.screen, question: state.question, race: state.race, width: null, pc: game.pc }),
};
