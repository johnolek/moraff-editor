import type { MwGame } from '../../game/mw-port/state';
import { newMwGame } from '../../game/mw-port/state';
import type { Rng } from '../../game/port/rng';
import type { MwGameSession } from './engine';
import { MW_MESSAGE_BOX } from './screens';

/**
 * Asking a menu in the middle of a ported function.
 *
 * The port stops for a menu by calling into the `MwGame` or into a function it was handed, and
 * carries straight on with the answer. A browser cannot: it has to stop and wait for a key. So a
 * function that asks is run twice over — once on a copy of the game, which throws the moment it
 * wants an answer nobody has given yet, and once for real when every answer is in.
 *
 * The copy draws its random numbers through {@link MwRecordedRng}, which keeps them, so the run
 * for real makes exactly the same decisions and prints exactly the same boxes. That is the same
 * trick `src/lib/roller/mw-session.ts` plays on `roll_char`.
 */

/** Thrown out of a menu the run has no answer for yet. */
export class MwNeedsAnswer {
  constructor(readonly question: string) {}
}

/**
 * Random (WORLD.EXE 2000:2d36) over numbers that are kept and handed back in the same order.
 *
 * The fraction rather than the number is what is kept, because `Random(n)` divides the same
 * fifteen bits up however many ways its caller asks for: a run that draws `random(3)` where an
 * earlier run drew `random(80)` still gets the number that generator would have produced.
 */
export class MwRecordedRng implements Rng {
  private at = 0;

  constructor(
    private readonly drawn: number[],
    private readonly source: Rng,
  ) {}

  /** Start again from the first number, for the run that counts. */
  rewind(): void {
    this.at = 0;
  }

  random(n: number): number {
    if (this.at === this.drawn.length) this.drawn.push(this.source.random(0x8000) / 0x8000);
    return Math.trunc(this.drawn[this.at++] * n);
  }
}

/** The answers given so far, one list per menu, replayed from the top on every run. */
class MwAnswers {
  private readonly given = new Map<string, unknown[]>();
  private readonly taken = new Map<string, number>();

  rewind(): void {
    this.taken.clear();
  }

  take(question: string): unknown {
    const at = this.taken.get(question) ?? 0;
    const given = this.given.get(question) ?? [];
    if (at === given.length) throw new MwNeedsAnswer(question);
    this.taken.set(question, at + 1);
    return given[at];
  }

  add(question: string, answer: unknown): void {
    const given = this.given.get(question) ?? [];
    given.push(answer);
    this.given.set(question, given);
  }
}

/** A ported function that stops for a menu, and everything the play side needs to run it. */
export interface MwAsking<T> {
  /**
   * The ported function, with its menus wired to the answers given so far. `take` throws when
   * the menu it names has not been answered yet, which is what ends a run.
   */
  run(game: MwGame, take: (question: string) => unknown): T;
  /** Put the menu up and read the answer. The box the port printed for it is already showing. */
  ask(question: string): Promise<unknown>;
}

/** The menus a spell asks through the game itself, which the run for real has to put back. */
const GAME_MENUS = ['chooseWeaponSlot', 'chooseArmorSlot', 'chooseDirection', 'chooseSpellToWrite'] as const;

/**
 * A copy of the game to try a run on: everything a ported function reads, and none of the
 * screen. What it prints is thrown away and what it changes is never seen.
 */
function copyOfGame(game: MwGame, rng: Rng): MwGame {
  return newMwGame({
    pc: structuredClone(game.pc),
    slot: game.slot,
    rng,
    mapViewColumns: game.mapViewColumns,
    mapViewRows: game.mapViewRows,
    monsters: game.monsters.map((monster) => ({ ...monster })),
    engaged: game.engaged,
    monsterMap: new Uint8Array(game.monsterMap),
    monsterTimers: [...game.monsterTimers],
    columns: game.columns,
    rows: game.rows,
    monsterStatusLine: game.monsterStatusLine,
    recenterMap: game.recenterMap,
    redrawView: game.redrawView,
    engagedBanner: game.engagedBanner,
    lastStrikeDamage: game.lastStrikeDamage,
    lastMonsterDamage: game.lastMonsterDamage,
    movesTaken: game.movesTaken,
    isSolid: game.isSolid,
    wallSide: game.wallSide,
  });
}

/**
 * Run a ported function that stops for menus, asking each of them as it comes and showing the
 * boxes it printed on the way.
 *
 * The boxes come from the copy, which prints them in the same order the run for real will; the
 * run for real is silent, since the player has already read them.
 */
export async function runAsking<T>(session: MwGameSession, plan: MwAsking<T>): Promise<T> {
  const drawn: number[] = [];
  const answers = new MwAnswers();
  let shown = 0;
  for (;;) {
    const copy = copyOfGame(session.game, new MwRecordedRng(drawn, session.game.rng));
    const boxes: string[][] = [];
    copy.say = (...lines: string[]) => {
      let last = lines.length;
      while (last > 0 && lines[last - 1] === '') last--;
      boxes.push(lines.slice(0, last));
    };
    answers.rewind();
    let question: string | null = null;
    try {
      plan.run(copy, (asked) => answers.take(asked));
    } catch (thrown) {
      if (!(thrown instanceof MwNeedsAnswer)) throw thrown;
      question = thrown.question;
    }
    if (question === null) {
      await showBoxes(session, boxes.slice(shown));
      const rng = new MwRecordedRng(drawn, session.game.rng);
      answers.rewind();
      const was = session.game.rng;
      const menus = GAME_MENUS.map((menu) => session.game[menu]);
      session.game.rng = rng;
      try {
        let answer!: T;
        session.takeBoxes(() => {
          answer = plan.run(session.game, (asked) => answers.take(asked));
        });
        return answer;
      } finally {
        session.game.rng = was;
        GAME_MENUS.forEach((menu, at) => Object.assign(session.game, { [menu]: menus[at] }));
      }
    }
    await showBoxes(session, boxes.slice(shown, -1));
    session.box = (boxes[boxes.length - 1] ?? []).slice(0, MW_MESSAGE_BOX.lines);
    answers.add(question, await plan.ask(question));
    shown = boxes.length;
  }
}

/** Boxes shown one after another, each waiting for a key, with the last one left up. */
async function showBoxes(session: MwGameSession, boxes: string[][]): Promise<void> {
  for (let at = 0; at < boxes.length; at++) {
    session.box = boxes[at].slice(0, MW_MESSAGE_BOX.lines);
    if (at < boxes.length - 1) await session.key();
  }
}
