import { afterEach, describe, expect, it, vi } from 'vitest';
import { claimName, myName, playerSecret } from './player';

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

function useStorage(storage: Storage | undefined): Storage | undefined {
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true, writable: true });
  return storage;
}

/** A server that answers every call the same way, and the calls it was handed. */
function fakeServer(status: number, body: unknown): { calls: { url: string; init: RequestInit }[] } {
  const calls: { url: string; init: RequestInit }[] = [];
  vi.stubGlobal('fetch', (url: string, init: RequestInit = {}) => {
    calls.push({ url, init });
    return Promise.resolve(new Response(JSON.stringify(body), { status }));
  });
  return { calls };
}

function headerOf(init: RequestInit, name: string): string | undefined {
  return (init.headers as Record<string, string> | undefined)?.[name];
}

afterEach(() => {
  useStorage(undefined);
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('playerSecret', () => {
  it('makes a secret of 32 bytes on first use and keeps it', () => {
    const storage = useStorage(fakeStorage())!;

    const secret = playerSecret();

    expect(secret).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(storage.getItem('moraff-tools.player-secret')).toBe(secret);
    expect(playerSecret()).toBe(secret);
  });

  it('makes a fresh one when the browser keeps nothing', () => {
    useStorage(undefined);

    expect(playerSecret()).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it('replaces something in the key that is not a secret', () => {
    const storage = useStorage(fakeStorage())!;
    storage.setItem('moraff-tools.player-secret', 'nonsense');

    expect(playerSecret()).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });
});

describe('claimName', () => {
  it('does nothing and says so when the build has no server', async () => {
    useStorage(fakeStorage());
    vi.stubEnv('VITE_RUN_SERVER', '');
    const { calls } = fakeServer(200, { name: 'Moraff' });

    expect(await claimName('Moraff')).toEqual({ ok: false, message: expect.any(String) });
    expect(calls).toEqual([]);
  });

  it('sends the name with the secret and answers with the name that stands', async () => {
    useStorage(fakeStorage());
    vi.stubEnv('VITE_RUN_SERVER', 'https://runs.example.com');
    const { calls } = fakeServer(200, { name: 'Moraff' });

    expect(await claimName('Moraff')).toEqual({ ok: true, name: 'Moraff' });
    expect(calls[0].url).toBe('https://runs.example.com/players');
    expect(headerOf(calls[0].init, 'Authorization')).toBe(`Bearer ${playerSecret()}`);
    expect(calls[0].init.body).toBe('{"name":"Moraff"}');
  });

  it('shows the words the server refused with', async () => {
    useStorage(fakeStorage());
    vi.stubEnv('VITE_RUN_SERVER', 'https://runs.example.com');
    fakeServer(409, { error: 'That name is taken.' });

    expect(await claimName('Moraff')).toEqual({ ok: false, message: 'That name is taken.' });
  });

  it('says so when the server cannot be reached', async () => {
    useStorage(fakeStorage());
    vi.stubEnv('VITE_RUN_SERVER', 'https://runs.example.com');
    vi.stubGlobal('fetch', () => Promise.reject(new Error('offline')));

    expect(await claimName('Moraff')).toEqual({ ok: false, message: expect.any(String) });
  });
});

describe('myName', () => {
  it('is the name the server has for this secret', async () => {
    useStorage(fakeStorage());
    vi.stubEnv('VITE_RUN_SERVER', 'https://runs.example.com');
    const { calls } = fakeServer(200, { name: 'Moraff' });

    expect(await myName()).toBe('Moraff');
    expect(calls[0].url).toBe('https://runs.example.com/players/me');
    expect(headerOf(calls[0].init, 'Authorization')).toBe(`Bearer ${playerSecret()}`);
  });

  it('is nothing when the secret has claimed no name', async () => {
    useStorage(fakeStorage());
    vi.stubEnv('VITE_RUN_SERVER', 'https://runs.example.com');
    fakeServer(404, { error: 'This device has no name yet.' });

    expect(await myName()).toBeNull();
  });

  it('is nothing, and asks nobody, when the build has no server', async () => {
    useStorage(fakeStorage());
    vi.stubEnv('VITE_RUN_SERVER', '');
    const { calls } = fakeServer(200, { name: 'Moraff' });

    expect(await myName()).toBeNull();
    expect(calls).toEqual([]);
  });
});
