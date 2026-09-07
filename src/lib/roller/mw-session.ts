import { rollChar } from '../game/mw-port/character';
import type { MwCharacter, MwGame } from '../game/mw-port/state';
import { newMwGame } from '../game/mw-port/state';
import type { Answer } from './session';
import { RecordedRandom } from './session';

/** One of the five questions Moraff's World's roll_char stops on. */
export type MwQuestion = 'race' | 'keepRerollDesign' | 'designStat' | 'name' | 'class';

/** Where the roller has got to, for a screen to draw. */
export interface MwRollerView {
  /** The lines the game has printed since the last question was answered. */
  screen: string[];
  /** The question waiting to be answered, or null once the character is finished. */
  question: MwQuestion | null;
  /** How many of the twenty-four design points are still to be placed. */
  pointsLeft: number;
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
  /** How many lines had been printed when each question was reached. */
  private marks: number[] = [];
  private asked: MwQuestion[] = [];
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
    // The mark of the last question that was answered is where the screen in front of the player
    // begins: everything printed since then. A pending question has a mark of its own on the end.
    const answered = this.question === null ? this.marks.length : this.marks.length - 1;
    const start = answered >= 1 ? this.marks[answered - 1] : 0;
    let placed = 0;
    while (placed < this.asked.length && this.asked[this.asked.length - 1 - placed] === 'designStat') {
      placed += 1;
    }
    return {
      screen: this.game.messages.slice(start),
      question: this.question,
      pointsLeft: 25 - placed,
      pc: this.game.pc,
    };
  }

  private run(): MwGame {
    const messages: string[] = [];
    const marks: number[] = [];
    const asked: MwQuestion[] = [];
    let next = 0;
    const take = (question: MwQuestion): Answer => {
      marks.push(messages.length);
      asked.push(question);
      if (next === this.answers.length) throw new NeedsAnswer(question);
      return this.answers[next++];
    };
    const game = newMwGame({
      messages,
      slot: this.slot,
      rng: new RecordedRandom(this.drawn),
      askRace: () => take('race') as number,
      askKeepRerollDesign: () => take('keepRerollDesign') as number,
      askDesignStat: () => take('designStat') as number,
      askName: () => take('name') as string,
      askClass: () => take('class') as number,
    });
    this.question = null;
    try {
      rollChar(game);
    } catch (thrown) {
      if (!(thrown instanceof NeedsAnswer)) throw thrown;
      this.question = thrown.question;
    }
    this.marks = marks;
    this.asked = asked;
    return game;
  }
}
