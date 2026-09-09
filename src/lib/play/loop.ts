/**
 * Starting one of the three play loops.
 *
 * Each game has a loop of its own — `runMoveControl`, `runMwMoveControl`, `runRevDungeon` — and
 * each of them is an async function nobody awaits: the tab starts it and then feeds it keys, and
 * so does a replay. An error thrown inside one of those is therefore a rejected promise with
 * nothing attached to it, which the browser reports to nobody and Node prints as a stack trace
 * over whatever the command was saying. Either way the loop has stopped reading keys and the
 * session goes on claiming to be a game in progress.
 *
 * This is where that is caught. What the three sessions have in common is the little they need
 * for it: a flag saying the loop has come back, a message saying why, and a way to ask for a
 * redraw.
 */

/** What starting a loop needs of the session it is played out of. */
export interface PlayLoopSession {
  /** The loop has come back: the character quit, died, or the loop stopped. */
  over: boolean;
  /** Why the loop stopped, or null when it came back the way a loop is meant to. */
  stopped: string | null;
  /** Draw the session again. */
  changed(): void;
  /** Write the run down as it stands. */
  keepRun(): void;
}

/**
 * Play a loop out, and end the session rather than freeze it if the loop throws.
 *
 * The error is kept on the session so that the tab can say what happened and a replay can hand
 * the message to whoever asked for a verdict, and it is logged as well, since a loop that throws
 * is a bug in the engine and the stack is the only place the line it threw on is written down.
 */
export function runPlayLoop(session: PlayLoopSession, loop: Promise<void>): Promise<void> {
  return loop
    .catch((thrown: unknown) => {
      console.error('The play loop stopped', thrown);
      session.stopped = thrown instanceof Error ? thrown.message : String(thrown);
      session.over = true;
      session.changed();
    })
    // A death is the last thing a run has to say and the game writes no record over it, so the
    // run is written down once more where the loop comes back rather than at the last save.
    .finally(() => session.keepRun());
}
