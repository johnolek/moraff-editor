import { afterEach, describe, expect, it } from 'vitest';
import type { Leaderboard, RosterEntry } from '../app-state.svelte';
import { RunRecorder, type RunSession } from '../play/run';
import { loadRoster, markDead, markEdited, newEntry, restoreImport, saveRoster, voidLeaderboard, withEntry, withoutEntry } from './roster';

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

function useStorage(storage: Storage | undefined): void {
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true, writable: true });
}

afterEach(() => useStorage(undefined));

/** One entry in the shape `saveRoster` writes, which is what an older stored roster is edited
 *  down from. */
function storedEntry(entry: RosterEntry): Record<string, unknown> {
  const storage = fakeStorage();
  useStorage(storage);
  saveRoster([entry], entry.id);
  return JSON.parse(storage.getItem('moraff-tools.roster')!).entries[0];
}

/** Put a roster of raw stored entries in a fresh storage, ready for `loadRoster` to read. */
function storeEntries(entries: unknown[]): void {
  const storage = fakeStorage();
  useStorage(storage);
  storage.setItem('moraff-tools.roster', JSON.stringify({ currentId: 'c', entries }));
}

const ROLLED_AT = new Date('2026-09-06T12:00:00Z');
const EDITED_AT = new Date('2026-09-07T09:30:00Z');

function imported(id = 'a'): RosterEntry {
  const bytes = Uint8Array.from([1, 2, 3]);
  return newEntry({ game: 'unforgiven', name: 'SAGEY', slot: 21, bytes, imported: true }, ROLLED_AT, id);
}

function rolled(id = 'b'): RosterEntry {
  const bytes = Uint8Array.from([9]);
  return newEntry({ game: 'unforgiven', name: 'NEWBIE', slot: 22, bytes, imported: false }, ROLLED_AT, id);
}

function rolledForTheBoard(board: Leaderboard, id = 'c'): RosterEntry {
  const bytes = Uint8Array.from([7]);
  return newEntry({ game: 'unforgiven', name: 'RACER', slot: 23, bytes, imported: false, leaderboard: board }, ROLLED_AT, id);
}

describe('a character put on the roster', () => {
  it('remembers the file it was imported from, apart from the one being edited', () => {
    const entry = imported();
    entry.bytes[0] = 99;
    expect([...entry.importedBytes!]).toEqual([1, 2, 3]);
    expect(entry.createdAt).toBe(ROLLED_AT.toISOString());
  });

  it('has no import to go back to when it was rolled here', () => {
    expect(rolled().importedBytes).toBeNull();
  });
});

describe('the board a character is rolled for', () => {
  it('is kept on the character that was rolled for it', () => {
    expect(rolledForTheBoard('speedrun').leaderboard).toBe('speedrun');
  });

  it('is nothing at all for a character rolled to be played for its own sake', () => {
    expect(rolled().leaderboard).toBeNull();
  });

  it('is never given to an imported file, whatever the caller asks for', () => {
    const bytes = Uint8Array.from([1, 2, 3]);
    const entry = newEntry({ game: 'unforgiven', name: 'SAGEY', slot: 21, bytes, imported: true, leaderboard: 'faithful' });
    expect(entry.leaderboard).toBeNull();
  });

  it('comes back after the roster has been stored and read again', () => {
    useStorage(fakeStorage());
    const entries = [rolledForTheBoard('faithful'), rolled()];
    saveRoster(entries, 'c');
    expect(loadRoster().entries.map((entry) => entry.leaderboard)).toEqual(['faithful', null]);
  });

  it('reads as free play in a roster stored before the site had leaderboards', () => {
    const { leaderboard, ...older } = storedEntry(rolledForTheBoard('faithful'));
    expect(leaderboard).toBe('faithful');
    storeEntries([older]);
    expect(loadRoster().entries[0].leaderboard).toBeNull();
  });

  it('reads as free play when the stored board is not one this build knows', () => {
    storeEntries([{ ...storedEntry(rolledForTheBoard('faithful')), leaderboard: 'cheating' }]);
    expect(loadRoster().entries[0].leaderboard).toBeNull();
  });
});

/** One sitting at a game, as the roster keeps it. */
function playedSession(actions: number): RunSession {
  const session = new RunRecorder({ game: 'unforgiven', name: 'NEWBIE', record: Uint8Array.from([9]) }).log();
  return { ...session, actions };
}

describe("the sessions of a character's run", () => {
  it('are none at all for a character that has just been rolled', () => {
    expect(rolled().run).toEqual([]);
  });

  it('come back in order after the roster has been stored and read again', () => {
    useStorage(fakeStorage());
    const entry = rolled();
    entry.run = [playedSession(4), playedSession(9)];
    saveRoster([entry], entry.id);

    expect(loadRoster().entries[0].run.map((session) => session.actions)).toEqual([4, 9]);
  });

  it('read as a character that has never been played in a roster stored before runs were kept', () => {
    const { run, ...older } = storedEntry(rolled());
    expect(run).toEqual([]);
    storeEntries([older]);

    expect(loadRoster().entries[0].run).toEqual([]);
  });

  it('leave out anything stored under them that is not a session at all', () => {
    storeEntries([{ ...storedEntry(rolled()), run: [playedSession(4), { seed: 'not a seed' }] }]);

    expect(loadRoster().entries[0].run.map((session) => session.actions)).toEqual([4]);
  });
});

describe('a record written from outside the game', () => {
  it('takes the character off its board and stamps the change', () => {
    const entry = rolledForTheBoard('faithful');
    expect(voidLeaderboard(entry, EDITED_AT)).toBe(true);
    expect(entry.leaderboard).toBeNull();
    expect(entry.editedAt).toBe(EDITED_AT.toISOString());
  });

  it('leaves a character that was on no board alone', () => {
    const entry = rolled();
    expect(voidLeaderboard(entry, EDITED_AT)).toBe(false);
    expect(entry.editedAt).toBe(ROLLED_AT.toISOString());
  });

  it('keeps the character off the board once the roster has been stored and read again', () => {
    useStorage(fakeStorage());
    const entry = rolledForTheBoard('speedrun');
    voidLeaderboard(entry, EDITED_AT);
    saveRoster([entry], entry.id);
    expect(loadRoster().entries[0].leaderboard).toBeNull();
  });
});

describe('the roster', () => {
  it('keeps the characters in the order they arrived', () => {
    const entries = withEntry(withEntry([], imported()), rolled());
    expect(entries.map((entry) => entry.id)).toEqual(['a', 'b']);
  });

  it('drops the character that is removed and leaves the rest', () => {
    const entries = withEntry(withEntry([], imported()), rolled());
    expect(withoutEntry(entries, 'a').map((entry) => entry.id)).toEqual(['b']);
  });
});

describe('editing a character', () => {
  it('stamps when it was last changed', () => {
    const entry = imported();
    markEdited(entry, EDITED_AT);
    expect(entry.editedAt).toBe(EDITED_AT.toISOString());
    expect(entry.createdAt).toBe(ROLLED_AT.toISOString());
  });
});

describe('a character that has died', () => {
  it('is marked and keeps its bytes', () => {
    const entry = imported();
    expect(entry.dead).toBe(false);
    markDead(entry, EDITED_AT);
    expect(entry.dead).toBe(true);
    expect([...entry.bytes]).toEqual([1, 2, 3]);
    expect(entry.editedAt).toBe(EDITED_AT.toISOString());
  });

  it('is still dead after the roster has been stored and read back', () => {
    useStorage(fakeStorage());
    const entry = imported();
    markDead(entry, EDITED_AT);
    saveRoster([entry], entry.id);
    expect(loadRoster().entries[0].dead).toBe(true);
  });
});

describe('restoring the import', () => {
  it('puts the file back as the character, in bytes of its own', () => {
    const entry = imported();
    entry.bytes[0] = 99;
    expect(restoreImport(entry, EDITED_AT)).toBe(true);
    expect([...entry.bytes]).toEqual([1, 2, 3]);
    expect(entry.bytes).not.toBe(entry.importedBytes);
    expect(entry.editedAt).toBe(EDITED_AT.toISOString());
  });

  it('does nothing for a character that was rolled here', () => {
    const entry = rolled();
    expect(restoreImport(entry)).toBe(false);
  });
});

describe('the stored roster', () => {
  it('comes back as it went in', () => {
    useStorage(fakeStorage());
    const entries = withEntry(withEntry([], imported()), rolled());
    saveRoster(entries, 'b');
    const restored = loadRoster();
    expect(restored.currentId).toBe('b');
    expect(restored.entries).toEqual(entries);
  });

  it('is empty when there is nothing stored', () => {
    useStorage(fakeStorage());
    expect(loadRoster()).toEqual({ entries: [], currentId: null });
  });

  it('leaves out an entry this build cannot read', () => {
    const storage = fakeStorage();
    useStorage(storage);
    storage.setItem(
      'moraff-tools.roster',
      JSON.stringify({ currentId: 'a', entries: [{ id: 'a' }, { id: 'b', game: 'unforgiven', name: 'X', slot: null, bytes: 'AQID', createdAt: 'x', editedAt: 'y', importedBytes: null }] }),
    );
    const restored = loadRoster();
    expect(restored.entries.map((entry) => entry.id)).toEqual(['b']);
  });

  it('forgets a current character that is no longer on the roster', () => {
    useStorage(fakeStorage());
    saveRoster([imported()], 'gone');
    expect(loadRoster().currentId).toBeNull();
  });

  it('is empty when the stored text is not a roster', () => {
    const storage = fakeStorage();
    useStorage(storage);
    storage.setItem('moraff-tools.roster', 'not json');
    expect(loadRoster()).toEqual({ entries: [], currentId: null });
  });
});
