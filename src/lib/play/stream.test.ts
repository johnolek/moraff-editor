import { describe, expect, it } from 'vitest';
import { RunStream, type BatchAnswer, type RunBatch, type StreamedSession } from './stream';
import type { RunSession } from './run';

function session(over: Partial<RunSession> = {}): RunSession {
  return {
    engine: 'a'.repeat(40),
    game: 'unforgiven',
    mode: 'speedrun',
    leaderboard: 'speedrun',
    sound: null,
    name: 'Grond',
    startedAt: '2026-09-09T12:00:00.000Z',
    seed: 12345,
    record: 'AAEC',
    inputs: [],
    actions: 0,
    time: 0,
    milestones: [],
    edits: 0,
    ...over,
  };
}

/** A sitting whose keys a test pushes, standing in for the game being played. */
function played(index = 0): { sitting: StreamedSession; press(...keys: number[]): void; unpressed(key: number): void } {
  const inputs: number[] = [];
  let presses = 0;
  return {
    sitting: {
      index,
      log: () => session({ inputs: [...inputs], actions: inputs.length }),
      presses: () => presses,
    },
    press(...keys) {
      inputs.push(...keys);
      presses += keys.length;
    },
    unpressed(key) {
      inputs.push(key);
    },
  };
}

/** A server that takes everything, keeping what it was sent. */
function takesEverything(): { post: (batch: RunBatch) => Promise<BatchAnswer>; sent: RunBatch[] } {
  const sent: RunBatch[] = [];
  return {
    sent,
    post: (batch) => {
      sent.push(structuredClone(batch));
      return Promise.resolve({ took: true });
    },
  };
}

describe('sending a run as it is played', () => {
  it('sends the sitting itself with the first batch and not with the ones after it', async () => {
    const game = played();
    const server = takesEverything();
    const stream = new RunStream(game.sitting, server.post);

    game.press(104, 106);
    await stream.send(false);
    game.press(107);
    await stream.send(false);

    expect(server.sent[0].session).toMatchObject({ seed: 12345, record: 'AAEC', engine: 'a'.repeat(40) });
    expect(server.sent[0].sequence).toBe(0);
    expect(server.sent[1].session).toBeUndefined();
    expect(server.sent[1].sequence).toBe(1);
  });

  it('sends only what has been played since the last batch', async () => {
    const game = played();
    const server = takesEverything();
    const stream = new RunStream(game.sitting, server.post);

    game.press(104, 106);
    await stream.send(false);
    game.press(107, 108);
    await stream.send(false);

    expect(server.sent.map((batch) => batch.inputs)).toEqual([
      [104, 106],
      [107, 108],
    ]);
  });

  it('sends nothing when nothing has been played', async () => {
    const game = played();
    const server = takesEverything();
    const stream = new RunStream(game.sitting, server.post);

    game.press(104);
    await stream.send(false);

    expect(await stream.send(false)).toEqual({ sent: 'nothing' });
    expect(server.sent).toHaveLength(1);
  });

  it('counts the keys the player pressed rather than the inputs', async () => {
    const game = played();
    const server = takesEverything();
    const stream = new RunStream(game.sitting, server.post);

    game.press(104);
    game.unpressed(70);
    game.unpressed(70);
    await stream.send(false);

    expect(server.sent[0].inputs).toHaveLength(3);
    expect(server.sent[0].pressed).toBe(1);
  });

  it('keeps a stretch the server never took and sends it with the next one', async () => {
    const game = played();
    const server = takesEverything();
    let reachable = false;
    const stream = new RunStream(game.sitting, (batch) =>
      reachable ? server.post(batch) : Promise.resolve({ took: false, refusal: null }),
    );

    game.press(104, 106);
    expect(await stream.send(false)).toEqual({ sent: 'unreachable' });
    game.press(107);
    reachable = true;
    await stream.send(false);

    expect(server.sent).toHaveLength(1);
    expect(server.sent[0].inputs).toEqual([104, 106, 107]);
    expect(server.sent[0].sequence).toBe(0);
  });

  it('sends the same sequence again when an answer never came back', async () => {
    const game = played();
    const sent: RunBatch[] = [];
    let answer = false;
    const stream = new RunStream(game.sitting, (batch) => {
      sent.push(structuredClone(batch));
      return Promise.resolve(answer ? { took: true } : { took: false, refusal: null });
    });

    game.press(104);
    await stream.send(false);
    answer = true;
    await stream.send(false);

    expect(sent.map((batch) => batch.sequence)).toEqual([0, 0]);
  });

  it('stops for good once the server has refused the run', async () => {
    const game = played();
    let asked = 0;
    const stream = new RunStream(game.sitting, () => {
      asked += 1;
      return Promise.resolve({ took: false, refusal: 'That character belongs to another player.' });
    });

    game.press(104);
    expect(await stream.send(false)).toEqual({
      sent: 'refused',
      because: 'That character belongs to another player.',
    });
    game.press(106);
    expect(await stream.send(false)).toEqual({
      sent: 'refused',
      because: 'That character belongs to another player.',
    });
    expect(asked).toBe(1);
  });

  it('marks the last batch of a run as the end of it', async () => {
    const game = played();
    const server = takesEverything();
    const stream = new RunStream(game.sitting, server.post);

    game.press(104);
    await stream.send(true);

    expect(server.sent[0].ending).toBe(true);
  });

  it('sends a last batch at the end even with nothing played since the one before', async () => {
    const game = played();
    const server = takesEverything();
    const stream = new RunStream(game.sitting, server.post);

    game.press(104);
    await stream.send(false);
    expect(await stream.send(true)).toEqual({ sent: 'taken' });

    expect(server.sent[1]).toMatchObject({ inputs: [], ending: true, sequence: 1 });
  });

  it('sends the sittings played before this one, oldest first', async () => {
    const game = played(2);
    const server = takesEverything();
    const stream = new RunStream(game.sitting, server.post, [
      session({ inputs: [1, 2], actions: 2 }),
      session({ inputs: [3], actions: 3 }),
    ]);

    game.press(104);
    await stream.send(false);

    expect(server.sent.map((batch) => [batch.sessionIndex, batch.sequence, batch.inputs])).toEqual([
      [0, 0, [1, 2]],
      [1, 0, [3]],
      [2, 0, [104]],
    ]);
    // Nobody wrote down how many of those keys were pressed, and a batch on its own has no
    // stretch of time to be judged over.
    expect(server.sent[0].pressed).toBe(0);
  });

  it('holds the sitting being played back until the ones before it have gone', async () => {
    const game = played(1);
    const server = takesEverything();
    let reachable = false;
    const stream = new RunStream(
      game.sitting,
      (batch) => (reachable ? server.post(batch) : Promise.resolve({ took: false, refusal: null })),
      [session({ inputs: [1, 2] })],
    );

    game.press(104);
    expect(await stream.send(false)).toEqual({ sent: 'unreachable' });
    reachable = true;
    await stream.send(false);

    expect(server.sent.map((batch) => batch.sessionIndex)).toEqual([0, 1]);
  });

  it('hands over a batch to send without posting it, for a page on its way out', async () => {
    const game = played();
    const server = takesEverything();
    const stream = new RunStream(game.sitting, server.post);

    game.press(104);
    const batch = stream.next(false);
    expect(batch).not.toBeNull();
    if (batch === null) return;
    stream.took(batch);

    game.press(106);
    await stream.send(false);

    expect(server.sent[0].inputs).toEqual([106]);
    expect(server.sent[0].sequence).toBe(1);
  });
});
