import type { Milestone, RunSession } from './run';

/**
 * A run on its way to the run server, a stretch at a time.
 *
 * The server measures how long a run took, and it can only measure what it sees, so a run is sent
 * while it is being played rather than posted whole at the end: every few seconds, and again when
 * the game is left. Each stretch is stamped as it arrives and the gaps between the stamps are the
 * run's play time — time the player spent away from the game is a gap too long to count and comes
 * to nothing. `server/README.md` is the other half of this.
 *
 * Nothing here touches the browser. What a batch holds and when the next one starts is worked out
 * here; posting it, the five-second tick and the last batch a page on its way out sends are
 * `streaming.ts`.
 */

/** The fixed facts about one sitting, which the first batch of that sitting carries. */
export interface BatchSession {
  seed: number;
  engine: string;
  game: string;
  leaderboard: string | null;
  sound: boolean | null;
  name: string;
  startedAt: string;
  /** The character's record as the sitting began, base64. */
  record: string;
}

/** What the sitting claims to have come to, which every batch carries and a replay checks. */
export interface BatchClaims {
  mode: string | null;
  actions: number;
  time: number;
  edits: number;
  milestones: Milestone[];
}

/** One stretch of a sitting, as the server is sent it. */
export interface RunBatch {
  /** Where the sitting comes in the character's run, counting from zero. */
  sessionIndex: number;
  /**
   * Which batch of that sitting this is, counting from zero.
   *
   * It moves on only once the server has said it has this one, so a batch whose answer was lost
   * is sent again under the same number and the server recognises it rather than playing it
   * twice.
   */
  sequence: number;
  inputs: number[];
  /** How many of those inputs the player pressed, which is what the server holds a run to a
   *  human speed by. */
  pressed: number;
  /** The character died or won, so this is the last batch of the run. */
  ending: boolean;
  claims: BatchClaims;
  /** The first batch of a sitting carries the sitting; the ones after it do not. */
  session?: BatchSession;
}

/** The sitting being played, as the sender reads it. */
export interface StreamedSession {
  /** Where it comes in the character's run, counting from zero. */
  index: number;
  /** The sitting as it stands, which is where the keys and the claims come from. */
  log(): RunSession;
  /** How many of its inputs the player pressed. */
  presses(): number;
}

/**
 * What came of posting a batch: the server has it, it refused it in words, or it was not reached
 * at all.
 *
 * The two failures are not the same. A refusal is the server saying this run is not one it will
 * take — the character is somebody else's, the device has claimed no name — and sending it again
 * would only be refused again. Being unreachable is nothing at all having happened, and the
 * stretch waits for the next batch.
 */
export type BatchAnswer = { took: true } | { took: false; refusal: string | null };

export type PostBatch = (batch: RunBatch) => Promise<BatchAnswer>;

/** What a round of sending came to. */
export type SendResult =
  | { sent: 'nothing' }
  | { sent: 'taken' }
  | { sent: 'unreachable' }
  | { sent: 'refused'; because: string };

/**
 * The sender for one sitting at a game.
 *
 * A stretch that failed to go is kept simply by not being marked as sent: the next batch is built
 * from everything since the last one the server said it had, so it carries the failed stretch and
 * whatever has been played since.
 */
export class RunStream {
  /** The sittings of this character played before this one, each waiting to go as one batch. */
  private readonly earlier: RunBatch[];
  private sequence = 0;
  /** How much of this sitting the server has, so that a batch is what comes after it. */
  private sent = 0;
  private sentPresses = 0;
  private started = false;
  /** The server's words for a run it will not take, once it has said them. */
  private refused: string | null = null;

  constructor(
    private readonly session: StreamedSession,
    private readonly post: PostBatch,
    /** The sittings already in the character's run, which the server has never been told about
     *  unless it was sent them before. */
    earlier: readonly RunSession[] = [],
  ) {
    this.earlier = earlier.map(catchUpBatch);
  }

  /**
   * The batch to send now, or null when nothing has been played since the last one.
   *
   * It is built rather than sent so that a page on its way out can hand it to `sendBeacon`, which
   * takes a body and answers nothing to wait on.
   */
  next(ending: boolean): RunBatch | null {
    const waiting = this.earlier[0];
    if (waiting !== undefined) return waiting;
    const log = this.session.log();
    const inputs = log.inputs.slice(this.sent);
    if (inputs.length === 0 && this.started && !ending) return null;
    return {
      sessionIndex: this.session.index,
      sequence: this.sequence,
      inputs,
      pressed: this.session.presses() - this.sentPresses,
      ending,
      claims: {
        mode: log.mode,
        actions: log.actions,
        time: log.time,
        edits: log.edits,
        milestones: log.milestones,
      },
      session: this.started ? undefined : sessionHeader(log),
    };
  }

  /**
   * The server has the batch, so the next one starts after it.
   *
   * What was sent is counted rather than where the log now stands: the game goes on being played
   * while a batch is in the air, and those keys belong to the batch after this one.
   */
  took(batch: RunBatch): void {
    if (batch.sessionIndex !== this.session.index) {
      this.earlier.shift();
      return;
    }
    this.sent += batch.inputs.length;
    this.sentPresses += batch.pressed;
    this.sequence += 1;
    this.started = true;
  }

  /** Send everything played since the last batch, and the sittings before this one that have
   *  never gone. */
  async send(ending: boolean): Promise<SendResult> {
    if (this.refused !== null) return { sent: 'refused', because: this.refused };
    let anything = false;
    for (;;) {
      const batch = this.next(ending);
      if (batch === null) return anything ? { sent: 'taken' } : { sent: 'nothing' };
      const answer = await this.post(batch);
      if (!answer.took) {
        if (answer.refusal === null) return { sent: 'unreachable' };
        this.refused = answer.refusal;
        return { sent: 'refused', because: answer.refusal };
      }
      this.took(batch);
      anything = true;
      // The sittings before this one go first, all of them, and then the one being played.
      if (batch.sessionIndex === this.session.index) return { sent: 'taken' };
    }
  }
}

function sessionHeader(log: RunSession): BatchSession {
  return {
    seed: log.seed,
    engine: log.engine,
    game: log.game,
    leaderboard: log.leaderboard,
    sound: log.sound,
    name: log.name,
    startedAt: log.startedAt,
    record: log.record,
  };
}

/**
 * A sitting played before the server was ever told about this character, as one batch.
 *
 * Without them the server would hold a chain starting part-way through, and a replay of that
 * chain would arrive at numbers the log never claimed. It counts no presses, because how many of
 * those keys were pressed was never written down; one batch on its own has no gap before it, so
 * there is no stretch of time for the count to be judged against and none of it is play time.
 */
function catchUpBatch(log: RunSession, index: number): RunBatch {
  return {
    sessionIndex: index,
    sequence: 0,
    inputs: [...log.inputs],
    pressed: 0,
    ending: false,
    claims: { mode: log.mode, actions: log.actions, time: log.time, edits: log.edits, milestones: log.milestones },
    session: sessionHeader(log),
  };
}
