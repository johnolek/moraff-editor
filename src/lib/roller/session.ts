import { rollChar } from '../game/port/character';
import type { Rng } from '../game/port/rng';
import type { Game, PlayerCharacter } from '../game/port/state';
import { newGame } from '../game/port/state';

/** One of the six questions roll_char stops on. */
export type Question = 'difficulty' | 'race' | 'keepRerollDesign' | 'designStat' | 'name' | 'class';

/** An answer to one of them: the number a menu takes, or the name that was typed. */
export type Answer = number | string;

/** Where the roller has got to, for a screen to draw. */
export interface RollerView {
  /** The lines the game has printed since the last question was answered. */
  screen: string[];
  /** The question waiting to be answered, or null once the character is finished. */
  question: Question | null;
  /** How many of the twenty-four design points are still to be placed. */
  pointsLeft: number;
  pc: PlayerCharacter;
}

/**
 * Math.random behind the port's `Rng`, keeping every draw so a run can be played again.
 *
 * The game's `Random(n)` cuts an integer in 0..n-1 out of a uniform fraction, and so does this;
 * the fraction is Math.random's rather than the sawtooth a 1993 PC's reseeded generator produced.
 * The fractions are remembered because {@link RollerSession} runs roll_char again from the top
 * after every answer, and the character has to come out the same each time.
 */
export class RecordedRandom implements Rng {
  private position = 0;

  constructor(private readonly drawn: number[]) {}

  random(n: number): number {
    if (this.position === this.drawn.length) this.drawn.push(Math.random());
    return Math.trunc(this.drawn[this.position++] * n);
  }
}

/** Thrown out of a question the session has no answer for yet. */
class NeedsAnswer {
  constructor(readonly question: Question) {}
}

/**
 * roll_char driven from a screen.
 *
 * The port asks its questions by calling into the `Game` and carrying straight on with the
 * answer, which a screen cannot do: it has to stop and wait for a click. So the session answers
 * from the answers given so far and throws when it runs out of them. Adding the next answer runs
 * roll_char again from the top, and it arrives back at the same place with the same character,
 * because every random number the earlier run drew was kept and is handed back in the same order.
 */
export class RollerSession {
  private answers: Answer[] = [];
  private readonly drawn: number[] = [];
  /** How many lines had been printed when each question was reached. */
  private marks: number[] = [];
  private asked: Question[] = [];
  private game: Game;
  private question: Question | null = null;

  /** `slot` is the character number, 20 to 29, the way select_player picks one before rolling. */
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

  view(): RollerView {
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

  private run(): Game {
    const messages: string[] = [];
    const marks: number[] = [];
    const asked: Question[] = [];
    let next = 0;
    const take = (question: Question): Answer => {
      marks.push(messages.length);
      asked.push(question);
      if (next === this.answers.length) throw new NeedsAnswer(question);
      return this.answers[next++];
    };
    const game = newGame({
      messages,
      slot: this.slot,
      rng: new RecordedRandom(this.drawn),
      // The map view the game is showing while a character is rolled, which is what it halves to
      // place the map cursor. These are its dimensions in the three biggest video modes.
      areaColumns: 0x13,
      areaRows: 0x21,
      askDifficulty: () => take('difficulty') as number,
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
