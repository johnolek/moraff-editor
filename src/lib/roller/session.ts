import { rollChar } from '../game/port/character';
import type { Rng } from '../game/port/rng';
import type { Game, PlayerCharacter, ScreenLine } from '../game/port/state';
import { newGame } from '../game/port/state';

/**
 * One of the places a roller stops: the questions the three games ask, and the key each of them
 * waits for with a screen up, which takes any answer at all.
 */
export type Question =
  | 'difficulty'
  | 'race'
  | 'keepRerollDesign'
  | 'designStat'
  | 'name'
  | 'class'
  | 'continue'
  | 'revRace'
  | 'revKeep'
  | 'revClass';

/** An answer to one of them: the number a menu takes, or the name that was typed. */
export type Answer = number | string;

/** Where the roller has got to, for a screen to draw. */
export interface RollerView<Line = ScreenLine, Pc = PlayerCharacter> {
  /** What the game is showing, in the order the lines were drawn. */
  screen: Line[];
  /** What the roller is waiting for, or null once the character is finished. */
  question: Question | null;
  pc: Pc;
}

/** What the session knows that the game does not: what it is waiting for. */
export interface RollerState {
  question: Question | null;
}

/** What a port needs to start one roll. */
export interface RollerSetup {
  /** The character number the roll is for, the way the game's own select screen picks one. */
  slot: number;
  rng: Rng;
  /** The next answer to `question`, which throws when there is none yet. */
  take(question: Question): Answer;
}

/**
 * One game's roller: how to start it, how to run it, and what to show of it.
 *
 * `Game` is that game's own state and `View` its own view, so a port hands the session a game
 * only the port itself looks inside.
 */
export interface RollerPort<Game, View> {
  newGame(setup: RollerSetup): Game;
  rollChar(game: Game): void;
  view(game: Game, state: RollerState): View;
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
 * A game's character roller driven from a screen.
 *
 * The ports ask their questions by calling into the game and carrying straight on with the
 * answer, which a screen cannot do: it has to stop and wait for a click. So the session answers
 * from the answers given so far and throws when it runs out of them. Adding the next answer runs
 * the roller again from the top, and it arrives back at the same place with the same character,
 * because every random number the earlier run drew was kept and is handed back in the same order.
 */
export class RollerSession<Game, View> {
  private answers: Answer[] = [];
  private readonly drawn: number[] = [];
  private game: Game;
  private question: Question | null = null;

  /** `slot` is the character number the game picks before rolling: 20 to 29 in Dungeons of the
   *  Unforgiven, 0 to 9 in Moraff's World, and in Moraff's Revenge 1 to 10, which names the two
   *  files the roll writes. */
  constructor(
    private readonly port: RollerPort<Game, View>,
    readonly slot: number,
  ) {
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

  view(): View {
    return this.port.view(this.game, { question: this.question });
  }

  private run(): Game {
    let next = 0;
    const take = (question: Question): Answer => {
      if (next === this.answers.length) throw new NeedsAnswer(question);
      return this.answers[next++];
    };
    const game = this.port.newGame({ slot: this.slot, rng: new RecordedRandom(this.drawn), take });
    this.question = null;
    try {
      this.port.rollChar(game);
    } catch (thrown) {
      if (!(thrown instanceof NeedsAnswer)) throw thrown;
      this.question = thrown.question;
    }
    return game;
  }
}

/** Dungeons of the Unforgiven's roll_char as a session drives it. */
export const ROLLER_PORT: RollerPort<Game, RollerView> = {
  newGame: (setup) =>
    newGame({
      slot: setup.slot,
      rng: setup.rng,
      // The map view the game is showing while a character is rolled, which is what it halves to
      // place the map cursor. These are its dimensions in the three biggest video modes.
      areaColumns: 0x13,
      areaRows: 0x21,
      askDifficulty: () => setup.take('difficulty') as number,
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
  view: (game, state) => ({ screen: game.screen, question: state.question, pc: game.pc }),
};
