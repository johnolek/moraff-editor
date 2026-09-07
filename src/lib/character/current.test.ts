import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { app, currentEntry } from '../app-state.svelte';
import {
  characterEdited,
  chooseCharacter,
  forgetCharacter,
  importCharacter,
  keepRolledCharacter,
  renameCharacter,
  restoreCharacterImport,
  restoreRoster,
  unloadCharacter,
} from './current';

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

/** A save file with a name in it and room for the rest of the record. */
function saveFile(name: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(2697);
  for (let i = 0; i < name.length; i++) bytes[i] = name.charCodeAt(i);
  return bytes;
}

beforeEach(() => {
  useStorage(fakeStorage());
  app.roster = [];
  app.characterId = null;
});

afterEach(() => useStorage(undefined));

describe('importing a save file', () => {
  it('puts it on the roster under the name in the record and starts working on it', () => {
    importCharacter('unforgiven', '21', saveFile('SAGEY'));
    expect(app.roster).toHaveLength(1);
    expect(currentEntry()?.name).toBe('SAGEY');
    expect(currentEntry()?.slot).toBe(21);
  });

  it('falls back to the file name for a record with no name in it', () => {
    importCharacter('unforgiven', 'sagey.sav', saveFile(''));
    expect(currentEntry()?.name).toBe('sagey.sav');
    expect(currentEntry()?.slot).toBeNull();
  });

  it('keeps the file exactly as it came in', () => {
    importCharacter('unforgiven', '21', saveFile('SAGEY'));
    const entry = currentEntry()!;
    entry.bytes[0x816] = 99;
    expect(entry.importedBytes![0x816]).toBe(0);
  });
});

describe('a character rolled here', () => {
  it('joins the roster with no import to go back to', () => {
    keepRolledCharacter('unforgiven', 'NEWBIE', 22, saveFile('NEWBIE'));
    expect(currentEntry()?.importedBytes).toBeNull();
  });
});

describe('the roster', () => {
  beforeEach(() => {
    importCharacter('unforgiven', '21', saveFile('SAGEY'));
    keepRolledCharacter('unforgiven', 'NEWBIE', 22, saveFile('NEWBIE'));
  });

  it('holds both characters, with the last one made current', () => {
    expect(app.roster.map((entry) => entry.name)).toEqual(['SAGEY', 'NEWBIE']);
    expect(currentEntry()?.name).toBe('NEWBIE');
  });

  it('goes back to the other character when it is picked', () => {
    chooseCharacter(app.roster[0].id);
    expect(currentEntry()?.name).toBe('SAGEY');
  });

  it('renames an entry without touching the record', () => {
    renameCharacter(app.roster[0].id, 'The tank');
    expect(app.roster[0].name).toBe('The tank');
  });

  it('keeps the name it has when the new one is blank', () => {
    renameCharacter(app.roster[0].id, '   ');
    expect(app.roster[0].name).toBe('SAGEY');
  });

  it('drops a character that is removed, and stops working on it', () => {
    forgetCharacter(app.roster[1].id);
    expect(app.roster.map((entry) => entry.name)).toEqual(['SAGEY']);
    expect(currentEntry()).toBeNull();
  });

  it('keeps the character on the roster when the editor is put down', () => {
    unloadCharacter();
    expect(app.roster).toHaveLength(2);
    expect(currentEntry()).toBeNull();
  });

  it('comes back after a reload, still on the same character', () => {
    const id = currentEntry()!.id;
    app.roster = [];
    app.characterId = null;
    restoreRoster();
    expect(app.roster.map((entry) => entry.name)).toEqual(['SAGEY', 'NEWBIE']);
    expect(currentEntry()?.id).toBe(id);
  });
});

describe('editing the character', () => {
  beforeEach(() => importCharacter('unforgiven', '21', saveFile('SAGEY')));

  it('is what a reload comes back to', () => {
    currentEntry()!.bytes[0x816] = 99;
    characterEdited();
    app.roster = [];
    restoreRoster();
    expect(currentEntry()!.bytes[0x816]).toBe(99);
  });

  it('is undone by restoring the import, in bytes the editor will notice', () => {
    const before = currentEntry()!.bytes;
    currentEntry()!.bytes[0x816] = 99;
    characterEdited();
    restoreCharacterImport(currentEntry()!.id);
    expect(currentEntry()!.bytes[0x816]).toBe(0);
    expect(currentEntry()!.bytes).not.toBe(before);
  });
});
