import { rollChar } from '../game/mw-port/character';
import type { MwCharacter, MwGame } from '../game/mw-port/state';
import { newMwGame } from '../game/mw-port/state';
import type { ScreenLine } from '../game/port/state';
import type { Answer } from './session';
import { RecordedRandom } from './session';

/**
 * One of the six places Moraff's World's roll_char stops: its five questions, and the key it
 * waits for with a screen up, which takes any answer at all.
 */
export type MwQuestion = 'race' | 'keepRerollDesign' | 'designStat' | 'name' | 'class' | 'continue';

/** Where the roller has got to, for a screen to draw. */
export interface MwRollerView {
  /** What the game is showing, in the order the lines were drawn. */
  screen: ScreenLine[];
  /** What the roller is waiting for, or null once the character is finished. */
  question: MwQuestion | null;
  pc: MwCharacter;
}

/** Thrown out of a question the session has no answer for yet. */
class NeedsAnswer {
  constructor(readonly question: MwQuestion) {}
}

/**
 * Moraff's World's roll_char driven from a screen, the way {@link RollerSession} drives
 * Dungeons of the Unforgiven's.
 *
 * The port asks its questions by calling into the `MwGame` and carrying straight on with the
 * answer, which a screen cannot do: it has to stop and wait for a click. So the session answers
 * from the answers given so far and throws when it runs out of them. Adding the next answer runs
 * roll_char again from the top, and it arrives back at the same place with the same character,
 * because every random number the earlier run drew was kept and is handed back in the same order.
 */
export class MwRollerSession {
  private answers: Answer[] = [];
  private readonly drawn: number[] = [];
  private game: MwGame;
  private question: MwQuestion | null = null;

  /** `slot` is the character number, 0 to 9, the way select_player picks one before rolling. */
  constructor(readonly slot: number) {
    this.game = this.run();
  }

  /** Answer the question the roller is waiting on and let it carry on. */
  answer(value: Answer): void {
    if (this.question === null) return;
    this.answers.push(value);
    this.game = this.run();
  }

  /** Throw the character away and roll another from the very first screen. */
  restart(): void {
    this.answers = [];
    this.drawn.length = 0;
    this.game = this.run();
  }

  view(): MwRollerView {
    return { screen: this.game.screen, question: this.question, pc: this.game.pc };
  }

  private run(): MwGame {
    let next = 0;
    const take = (question: MwQuestion): Answer => {
      if (next === this.answers.length) throw new NeedsAnswer(question);
      return this.answers[next++];
    };
    const game = newMwGame({
      slot: this.slot,
      rng: new RecordedRandom(this.drawn),
      askRace: () => take('race') as number,
      askKeepRerollDesign: () => take('keepRerollDesign') as number,
      askDesignStat: () => take('designStat') as number,
      askName: () => take('name') as string,
      askClass: () => take('class') as number,
      pressAnyKey: () => {
        take('continue');
      },
    });
    this.question = null;
    try {
      rollChar(game);
    } catch (thrown) {
      if (!(thrown instanceof NeedsAnswer)) throw thrown;
      this.question = thrown.question;
    }
    return game;
  }
}
