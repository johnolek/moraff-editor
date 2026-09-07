import { afterEach, describe, expect, it } from 'vitest';
import type { RosterEntry } from '../app-state.svelte';
import { loadRoster, markDead, markEdited, newEntry, restoreImport, saveRoster, withEntry, withoutEntry } from './roster';

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
