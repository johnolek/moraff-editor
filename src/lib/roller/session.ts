import { rollChar } from '../game/port/character';
import type { Rng } from '../game/port/rng';
import type { Game, PlayerCharacter, ScreenLine } from '../game/port/state';
import { newGame } from '../game/port/state';

/**
 * One of the seven places roll_char stops: its six questions, and the key it waits for with a
 * screen up, which takes any answer at all.
 */
export type Question = 'difficulty' | 'race' | 'keepRerollDesign' | 'designStat' | 'name' | 'class' | 'continue';

/** An answer to one of them: the number a menu takes, or the name that was typed. */
export type Answer = number | string;

/** Where the roller has got to, for a screen to draw. */
export interface RollerView {
  /** What the game is showing, in the order the lines were drawn. */
  screen: ScreenLine[];
  /** What the roller is waiting for, or null once the character is finished. */
  question: Question | null;
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
    return { screen: this.game.screen, question: this.question, pc: this.game.pc };
  }

  private run(): Game {
    let next = 0;
    const take = (question: Question): Answer => {
      if (next === this.answers.length) throw new NeedsAnswer(question);
      return this.answers[next++];
    };
    const game = newGame({
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
