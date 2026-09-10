import { playerSecret } from '../player';
import { runServerUrl } from '../run-server';
import type { PlayMode } from './mode';
import type { RunRecorder, RunSession } from './run';
import { RunStream, type BatchAnswer, type RunBatch, type StreamedSession } from './stream';

/**
 * Sending a run to the run server while it is being played.
 *
 * `stream.ts` works out what each batch holds; this is the part that touches the browser — the
 * tick it goes on, the last one a page on its way out sends, and asking for the verdict once the
 * run has ended. A build with no server address behaves as the site always has and none of this
 * runs.
 *
 * The words the Play tab shows are here as well, since they are all about what became of the
 * sending.
 */

/**
 * How often a run is sent. The server counts a gap of up to three of these as play and anything
 * longer as time the player was away, so this is the coarseness of its wall clock.
 */
const SEND_EVERY_MS = 5000;

/** How often the site asks whether the verdict is in, once the run has ended. */
const ASK_EVERY_MS = 2000;

/** How long it goes on asking. A long chain takes a while to replay; past this the tab stops
 *  asking and the verdict is there next time the run is looked at. */
const ASK_FOR_AT_MOST_MS = 120_000;

/** What the Play tab says about a run being sent. */
export interface RunMark {
  words: string;
  /** A line under the words, or null. */
  note: string | null;
  tone: 'plain' | 'good' | 'bad';
}

const SENDING: RunMark = { words: 'Sending to the boards.', note: null, tone: 'plain' };
const UNREACHABLE: RunMark = { words: 'The boards are not answering.', note: null, tone: 'bad' };
const CHECKING: RunMark = { words: 'Checking the run.', note: null, tone: 'plain' };
const NOT_CHECKED_YET: RunMark = { words: 'Still being checked.', note: null, tone: 'plain' };
const OFF_THE_CLOCK = 'Off the wall clock: more keys than a person could press.';

function refusedMark(why: string): RunMark {
  return { words: 'The boards refused the run.', note: why, tone: 'bad' };
}

function verdictMark(verdict: RunVerdictAnswer): RunMark {
  if (verdict.status === 'verified') {
    return { words: 'Run verified.', note: verdict.timed ? null : OFF_THE_CLOCK, tone: 'good' };
  }
  const words = verdict.status === 'failed' ? 'Run not verified.' : 'Run cannot be checked.';
  return { words, note: verdict.reason, tone: 'bad' };
}

/** The verdict as `GET /runs/:id` gives it. */
interface RunVerdictAnswer {
  status: string;
  reason: string | null;
  timed: boolean;
  eligible: boolean;
  playMs: number;
}

/** A run being sent, which the Play tab starts with the game and stops when the game is left. */
export interface RunStreamer {
  /** The character has died or won, which is the last batch of the run. */
  ended(): void;
  /** The game is being left: whatever is left goes, and nothing more is sent. */
  stop(): void;
}

/** The recorder of the game being played, as the sender reads it. */
export function streamedSession(run: RunRecorder, index: number): StreamedSession {
  return { index, log: () => run.log(), presses: () => run.presses };
}

export interface StreamRun {
  /** The roster entry's id, which is what the character is called on the server. */
  characterId: string;
  session: StreamedSession;
  /** The sittings the character was played in before this one. */
  earlier: readonly RunSession[];
  /** How the game is being shown now. Nothing is sent while it is debug: that is the mode with
   *  the game's hidden numbers on the screen, and no run played that way is one for the boards. */
  mode: () => PlayMode;
  onMark: (mark: RunMark) => void;
}

/**
 * Start sending a run, or null when this build has no server to send it to.
 */
export function streamRun(run: StreamRun): RunStreamer | null {
  const server = runServerUrl();
  if (server === null) return null;
  return new Streamer(server, run);
}

class Streamer implements RunStreamer {
  private readonly stream: RunStream;
  private readonly tick: ReturnType<typeof setInterval>;
  /** A batch is in the air, so the next tick leaves it alone rather than sending the same
   *  stretch twice. */
  private sending = false;
  private over = false;
  private stopped = false;
  /**
   * The page is going away, so the batch is sent in a way that outlives it. It is not the usual
   * way because a request that outlives its page may carry only a small body, and a batch that
   * has been waiting through a stretch with no server can be much bigger than that.
   */
  private leaving = false;
  private readonly onHide = () => {
    this.leaving = true;
    void this.send(false);
  };

  constructor(
    private readonly server: string,
    private readonly run: StreamRun,
  ) {
    this.stream = new RunStream(run.session, (batch) => this.postBatch(batch), run.earlier);
    this.tick = setInterval(() => void this.send(false), SEND_EVERY_MS);
    window.addEventListener('pagehide', this.onHide);
  }

  ended(): void {
    if (this.over || this.stopped) return;
    this.over = true;
    void this.send(true).then(() => this.askForTheVerdict());
  }

  stop(): void {
    if (this.stopped) return;
    this.stopped = true;
    clearInterval(this.tick);
    window.removeEventListener('pagehide', this.onHide);
    if (!this.over) void this.send(false);
  }

  private async send(ending: boolean): Promise<void> {
    // Debug shows the numbers the game never prints, so a run is not sent while it is on. The
    // keys go on being written down and the stretch goes with the next batch after the mode has
    // been put back.
    if (this.sending || this.run.mode() === 'debug') {
      this.leaving = false;
      return;
    }
    this.sending = true;
    try {
      const result = await this.stream.send(ending);
      if (result.sent === 'unreachable') this.run.onMark(UNREACHABLE);
      else if (result.sent === 'refused') this.run.onMark(refusedMark(result.because));
      else if (!this.over) this.run.onMark(SENDING);
      else this.run.onMark(CHECKING);
    } finally {
      this.sending = false;
      this.leaving = false;
    }
  }

  /** Replaying a run happens behind the answer to the batch that ended it, so the verdict is
   *  asked for until it is there. */
  private async askForTheVerdict(): Promise<void> {
    const until = Date.now() + ASK_FOR_AT_MOST_MS;
    for (;;) {
      const verdict = await this.readVerdict();
      if (verdict !== null) {
        this.run.onMark(verdictMark(verdict));
        return;
      }
      if (Date.now() > until || this.stopped) {
        this.run.onMark(NOT_CHECKED_YET);
        return;
      }
      await new Promise((wake) => setTimeout(wake, ASK_EVERY_MS));
    }
  }

  private async readVerdict(): Promise<RunVerdictAnswer | null> {
    try {
      const response = await fetch(`${this.server}/runs/${encodeURIComponent(this.run.characterId)}`, {
        headers: { Authorization: `Bearer ${playerSecret()}` },
      });
      if (!response.ok) return null;
      const body: unknown = await response.json();
      const verdict = (body as { verdict?: unknown } | null)?.verdict;
      return verdict === null || verdict === undefined ? null : (verdict as RunVerdictAnswer);
    } catch {
      return null;
    }
  }

  private async postBatch(batch: RunBatch): Promise<BatchAnswer> {
    try {
      const response = await fetch(`${this.server}/runs/${encodeURIComponent(this.run.characterId)}/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${playerSecret()}` },
        body: JSON.stringify(batch),
        keepalive: this.leaving,
      });
      if (response.ok) return { took: true };
      // A server that broke or is not up is not a run being refused: the stretch waits and goes
      // with the next batch, the way it does when nothing answered at all.
      if (response.status >= 500) return { took: false, refusal: null };
      // A refusal carries the words to show: the server is where the rules about a run live.
      const body: unknown = await response.json().catch(() => null);
      const refusal = (body as { error?: unknown } | null)?.error;
      return { took: false, refusal: typeof refusal === 'string' ? refusal : 'The boards refused the run.' };
    } catch {
      return { took: false, refusal: null };
    }
  }
}
