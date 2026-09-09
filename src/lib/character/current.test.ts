import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { app, currentEntry } from '../app-state.svelte';
import {
  characterEdited,
  chooseCharacter,
  forgetCharacter,
  importCharacter,
  importRevExploredMap,
  keepRolledCharacter,
  rememberNow,
  renameCharacter,
  restoreCharacterImport,
  restoreGame,
  restoreRoster,
  switchGame,
  unloadCharacter,
} from './current';
import { RevMapMemory, revCharacterMap } from '../play/rev/memory';
import { REV_VALUE_COUNT } from '../game/rev-port/record';
import { revPlayerFromValues, saveRevPlayer } from '../play/rev/record';
import { characterStatus } from './record';

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

/** Enough of the browser's History for the one entry that says which tab is showing. */
function fakeHistory(): Pick<History, 'state' | 'replaceState'> {
  let entry: unknown = null;
  return {
    get state() {
      return entry;
    },
    replaceState: (next: unknown) => void (entry = next),
  };
}

/** A Moraff's Revenge character file, which holds no name and so is known by its level. */
function revengeSave(level: number): Uint8Array<ArrayBuffer> {
  const pc = revPlayerFromValues(Array<number>(REV_VALUE_COUNT).fill(0));
  pc.level = level;
  return saveRevPlayer(pc);
}

/** A save file with a name in it and room for the rest of the record. */
function saveFile(name: string): Uint8Array<ArrayBuffer> {
  const bytes = new Uint8Array(2697);
  for (let i = 0; i < name.length; i++) bytes[i] = name.charCodeAt(i);
  return bytes;
}

beforeEach(() => {
  useStorage(fakeStorage());
  vi.stubGlobal('history', fakeHistory());
  app.roster = [];
  app.characterId = null;
  app.game = 'unforgiven';
  app.tab = 'map';
  app.rosterKept = true;
});

afterEach(() => {
  useStorage(undefined);
  vi.unstubAllGlobals();
});

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

  it('makes a Moraff’s Revenge save the character the site is on', () => {
    importCharacter('revenge', '3.EXE', revengeSave(6));
    expect(app.game).toBe('revenge');
    expect(currentEntry()?.name).toBe('3.EXE');
    // The bottom bar names a character only once the record can be read, which is what left a
    // Moraff's Revenge character showing as no character at all.
    expect(characterStatus(currentEntry()!)?.lev).toBe(6);
  });

  it('keeps the file exactly as it came in', () => {
    importCharacter('unforgiven', '21', saveFile('SAGEY'));
    const entry = currentEntry()!;
    entry.bytes[0x816] = 99;
    expect(entry.importedBytes![0x816]).toBe(0);
  });
});

describe('an explored map dropped beside the character', () => {
  /** A Moraff's Revenge record holds no name, so the roster falls back to the file name. */
  const revenge = () => new Uint8Array(0) as Uint8Array<ArrayBuffer>;

  it('brings the squares the character walked in DOS across to the site', () => {
    importCharacter('revenge', '1.EXE', revenge());
    const walked = new RevMapMemory();
    walked.markStep(5, 7, 3);

    const kept = importRevExploredMap(walked.bytes());

    expect(kept?.name).toBe('1.EXE');
    expect(new RevMapMemory(revCharacterMap(kept!.id)).isKnown(5, 7, 3)).toBe(true);
  });

  it('is refused when the character being worked on belongs to another game', () => {
    importCharacter('unforgiven', '21', saveFile('SAGEY'));
    expect(importRevExploredMap(new RevMapMemory().bytes())).toBeNull();
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
  beforeEach(() => {
    vi.useFakeTimers();
    importCharacter('unforgiven', '21', saveFile('SAGEY'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('is what a reload comes back to, once the typing has stopped', () => {
    currentEntry()!.bytes[0x816] = 99;
    characterEdited();
    vi.runAllTimers();
    app.roster = [];
    restoreRoster();
    expect(currentEntry()!.bytes[0x816]).toBe(99);
  });

  it('is written once for a burst of keystrokes', () => {
    const writes = vi.spyOn(globalThis.localStorage, 'setItem');
    for (const digit of [1, 2, 3, 4, 5]) {
      currentEntry()!.bytes[0x816] = digit;
      characterEdited();
    }
    expect(writes).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(writes).toHaveBeenCalledTimes(1);
  });

  it('is written at once for a page on its way out', () => {
    currentEntry()!.bytes[0x816] = 99;
    characterEdited();
    rememberNow();
    app.roster = [];
    restoreRoster();
    expect(currentEntry()!.bytes[0x816]).toBe(99);
  });

  it('says so when the browser will not keep the roster', () => {
    vi.spyOn(globalThis.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    characterEdited();
    vi.runAllTimers();
    expect(app.rosterKept).toBe(false);
  });

  it('stops saying so once a write goes through', () => {
    app.rosterKept = false;
    characterEdited();
    vi.runAllTimers();
    expect(app.rosterKept).toBe(true);
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

describe('switching games', () => {
  beforeEach(() => {
    importCharacter('unforgiven', '21', saveFile('SAGEY'));
    keepRolledCharacter('moraffsWorld', 'WANDA', 3, saveFile('WANDA'));
  });

  it('keeps the whole roster and works on the other game’s character', () => {
    switchGame('unforgiven');
    expect(app.game).toBe('unforgiven');
    expect(app.roster).toHaveLength(2);
    expect(currentEntry()?.name).toBe('SAGEY');
  });

  it('goes back to the character last worked on under each game', () => {
    keepRolledCharacter('unforgiven', 'BRUISER', 22, saveFile('BRUISER'));
    chooseCharacter(app.roster[0].id);
    switchGame('moraffsWorld');
    switchGame('unforgiven');
    expect(currentEntry()?.name).toBe('SAGEY');
  });

  it('works on the newest of a game’s characters when none was worked on before', () => {
    keepRolledCharacter('unforgiven', 'BRUISER', 22, saveFile('BRUISER'));
    switchGame('moraffsWorld');
    useStorage(fakeStorage());
    switchGame('unforgiven');
    expect(currentEntry()?.name).toBe('BRUISER');
  });

  it('leaves no character to work on when the game has none', () => {
    forgetCharacter(app.roster[0].id);
    switchGame('unforgiven');
    expect(currentEntry()).toBeNull();
  });

  it('moves off a tab the other game does not have', () => {
    switchGame('unforgiven');
    app.tab = 'calculators';
    switchGame('moraffsWorld');
    expect(app.tab).toBe('editor');
  });

  it('stays on a tab both games have', () => {
    switchGame('unforgiven');
    app.tab = 'map';
    switchGame('moraffsWorld');
    expect(app.tab).toBe('map');
  });

  it('follows the game of a save file that is opened', () => {
    switchGame('unforgiven');
    importCharacter('moraffsWorld', '3', saveFile('WANDA II'));
    expect(app.game).toBe('moraffsWorld');
  });

  it('is the game a reload comes back to', () => {
    switchGame('unforgiven');
    app.game = 'moraffsWorld';
    restoreGame();
    expect(app.game).toBe('unforgiven');
    expect(currentEntry()?.name).toBe('SAGEY');
  });

  it('takes the game from the character in hand when no game was stored', () => {
    useStorage(fakeStorage());
    app.game = 'unforgiven';
    restoreGame();
    expect(app.game).toBe('moraffsWorld');
    expect(currentEntry()?.name).toBe('WANDA');
  });
});
