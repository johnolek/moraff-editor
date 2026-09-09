import { describe, expect, it, vi } from 'vitest';
import { runPlayLoop, type PlayLoopSession } from './loop';

/** As much of a session as starting a loop needs, with the redraws and the run writes it asked
 *  for. */
function stubSession(): PlayLoopSession & { redraws: number; runsKept: number } {
  return {
    over: false,
    stopped: null,
    redraws: 0,
    runsKept: 0,
    changed() {
      this.redraws += 1;
    },
    keepRun() {
      this.runsKept += 1;
    },
  };
}

describe('a loop that comes back the way it is meant to', () => {
  it('leaves the session as the loop left it', async () => {
    const session = stubSession();
    await runPlayLoop(session, Promise.resolve());

    expect(session.stopped).toBeNull();
    expect(session.over).toBe(false);
    expect(session.redraws).toBe(0);
  });

  it('writes the run down where it comes back, which is where a death is', async () => {
    const session = stubSession();
    await runPlayLoop(session, Promise.resolve());

    expect(session.runsKept).toBe(1);
  });
});

describe('a loop that throws', () => {
  it('ends the session, keeps the message and asks for a draw', async () => {
    const session = stubSession();
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    await runPlayLoop(session, Promise.reject(new Error('the floor is not there')));
    logged.mockRestore();

    expect(session.stopped).toBe('the floor is not there');
    expect(session.over).toBe(true);
    expect(session.redraws).toBe(1);
    expect(session.runsKept).toBe(1);
  });

  it('says what was thrown when it was not an error', async () => {
    const session = stubSession();
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    await runPlayLoop(session, Promise.reject('nothing'));
    logged.mockRestore();

    expect(session.stopped).toBe('nothing');
  });

  it('is logged once, since the stack is the only place the line it threw on is written', async () => {
    const session = stubSession();
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    await runPlayLoop(session, Promise.reject(new Error('the floor is not there')));

    expect(logged).toHaveBeenCalledTimes(1);
    logged.mockRestore();
  });
});
