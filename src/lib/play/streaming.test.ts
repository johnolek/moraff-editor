import { afterEach, describe, expect, it, vi } from 'vitest';
import { setOffTheBoards } from '../player';
import type { RunSession } from './run';
import { streamRun, type RunMark } from './streaming';
import type { StreamedSession } from './stream';

/** Enough of the browser's Storage to stand in for it. */
function fakeStorage(): Storage {
  const items = new Map<string, string>();
  return {
    get length() {
      return items.size;
    },
    clear: () => items.clear(),
    getItem: (key: string) => items.get(key) ?? null,
    key: (index: number) => [...items.keys()][index] ?? null,
    removeItem: (key: string) => void items.delete(key),
    setItem: (key: string, value: string) => void items.set(key, value),
  };
}

/** Enough of `window` for the sender to hang its pagehide listener on, since these tests run
 *  under Node and there is no browser here. */
function fakeWindow(): void {
  vi.stubGlobal('window', { addEventListener: () => undefined, removeEventListener: () => undefined });
}

function sitting(): StreamedSession {
  const log: RunSession = {
    engine: 'a'.repeat(40),
    game: 'unforgiven',
    mode: 'speedrun',
    leaderboard: 'speedrun',
    sound: null,
    name: 'Grond',
    startedAt: '2026-09-09T12:00:00.000Z',
    seed: 12345,
    record: 'AAEC',
    inputs: [104, 106],
    actions: 2,
    time: 4,
    milestones: [],
    edits: 0,
  };
  return { index: 0, log: () => log, presses: () => 2 };
}

/** A sender pointed at a server that takes everything, and what the Play tab was told. */
function sender(): { stop(): void; posts: string[]; marks: RunMark[] } {
  const posts: string[] = [];
  vi.stubGlobal('fetch', (url: string) => {
    posts.push(url);
    return Promise.resolve(new Response(JSON.stringify({ received: 0 }), { status: 200 }));
  });
  const marks: RunMark[] = [];
  const streamer = streamRun({
    characterId: 'k3p9x1-ab12cd',
    session: sitting(),
    earlier: [],
    mode: () => 'faithful',
    onMark: (mark) => marks.push(mark),
  });
  if (streamer === null) throw new Error('The build under test has no run server.');
  return { stop: () => streamer.stop(), posts, marks };
}

/** The sender posts from an async method, so a turn of the microtask queue is what it takes for
 *  a batch to have gone out. */
function settled(): Promise<void> {
  return new Promise((wake) => setTimeout(wake, 0));
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('sending a run while the player is off the boards', () => {
  it('sends nothing at all, and says so', async () => {
    Object.defineProperty(globalThis, 'localStorage', { value: fakeStorage(), configurable: true, writable: true });
    fakeWindow();
    vi.stubEnv('VITE_RUN_SERVER', 'https://runs.example.com');
    setOffTheBoards(true);

    const run = sender();
    run.stop();
    await settled();

    expect(run.posts).toEqual([]);
    expect(run.marks[0]).toEqual({
      words: 'Off the boards.',
      note: 'Nothing about this run is being sent.',
      tone: 'plain',
    });
  });

  it('sends once the player is back on them', async () => {
    Object.defineProperty(globalThis, 'localStorage', { value: fakeStorage(), configurable: true, writable: true });
    fakeWindow();
    vi.stubEnv('VITE_RUN_SERVER', 'https://runs.example.com');
    setOffTheBoards(false);

    const run = sender();
    run.stop();
    await settled();

    expect(run.posts).toEqual(['https://runs.example.com/runs/k3p9x1-ab12cd/batches']);
  });
});
