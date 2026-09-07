import { rollChar } from '../game/rev-port/character';
import type { RevCharacter, RevGame, RevScreenLine } from '../game/rev-port/state';
import { newRevGame } from '../game/rev-port/state';
import type { Answer } from './session';
import { RecordedRandom } from './session';

/**
 * One of the five places CHCHAR.EXE stops: the key each of its two instruction screens waits for,
 * the race menu, the keep prompt, the class menu and the name.
 */
export type RevQuestion = 'continue' | 'revRace' | 'revKeep' | 'revClass' | 'name';

/** Where the roller has got to, for a screen to draw. */
export interface RevRollerView {
  /** What the game has printed, in the order it printed it. */
  screen: RevScreenLine[];
  /** How many columns wide the screen is: 80 for the instructions, 40 after them. */
  width: number;
  /** What the roller is waiting for, or null once the character is finished. */
  question: RevQuestion | null;
  /** The race the menu is sitting on, which is the one it draws in reverse. */
  race: number;
  pc: RevCharacter;
}

/** Thrown out of a question the session has no answer for yet. */
class NeedsAnswer {
  constructor(readonly question: RevQuestion) {}
}

/** How many races the menu goes round (CHCHAR 0A29 and 0A5B). */
const RACES = 4;

/**
 * CHCHAR.EXE driven from a screen, the way {@link RollerSession} drives Dungeons of the
 * Unforgiven's roll_char.
 *
 * The port asks its questions by calling into the `RevGame` and carrying straight on with the
 * answer, which a screen cannot do: it has to stop and wait for a click. So the session answers
 * from the answers given so far and throws when it runs out of them. Adding the next answer runs
 * the roller again from the top, and it arrives back at the same place with the same character,
 * because every random number the earlier run drew was kept and is handed back in the same order.
 */
export class RevRollerSession {
  private answers: Answer[] = [];
  private readonly drawn: number[] = [];
  private game: RevGame;
  private question: RevQuestion | null = null;
  /** Where the race menu's pointer is, which the arrow keys move and Return takes. */
  private highlight = 1;

  /** `slot` is the character number, 1 to 10, which names the two files the roll writes. */
  constructor(readonly slot: number) {
    this.game = this.run();
  }

  /** Answer the question the roller is waiting on and let it carry on. */
  answer(value: Answer): void {
    if (this.question === null) return;
    if (this.question === 'revRace') this.highlight = Number(value);
    this.answers.push(value);
    this.game = this.run();
  }

  /**
   * Move the race menu's pointer, the way the right and left arrows move it: one race on, round
   * to the first past the last and to the last before the first.
   */
  moveRace(step: number): void {
    if (this.question !== 'revRace') return;
    const moved = this.highlight + step;
    this.highlight = moved > RACES ? 1 : moved < 1 ? RACES : moved;
    this.game = this.run();
  }

  /** Take the race the pointer is on, which is what Return does. */
  takeRace(): void {
    if (this.question === 'revRace') this.answer(this.highlight);
  }

  /** Throw the character away and roll another from the very first screen. */
  restart(): void {
    this.answers = [];
    this.drawn.length = 0;
    this.highlight = 1;
    this.game = this.run();
  }

  view(): RevRollerView {
    return {
      screen: this.game.screen,
      width: this.game.width,
      question: this.question,
      race: this.highlight,
      pc: this.game.pc,
    };
  }

  private run(): RevGame {
    let next = 0;
    const take = (question: RevQuestion): Answer => {
      if (next === this.answers.length) throw new NeedsAnswer(question);
      return this.answers[next++];
    };
    const game = newRevGame({
      rng: new RecordedRandom(this.drawn),
      race: this.highlight,
      askRace: () => take('revRace') as number,
      askKeep: () => take('revKeep') as number,
      askClass: () => take('revClass') as number,
      askName: () => take('name') as string,
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
