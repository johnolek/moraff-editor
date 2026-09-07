import { afterEach, describe, expect, it } from 'vitest';
import { KEY } from './keys';
import { arrowLabel, MOVEMENT_STYLES, readMovementStyle, writeMovementStyle } from './movement';

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

describe('whose arrows a game is played with', () => {
  it('is the game’s own until the player says otherwise', () => {
    useStorage(fakeStorage());
    expect(readMovementStyle('unforgiven')).toBe('unforgiven');
    expect(readMovementStyle('moraffsWorld')).toBe('moraffsWorld');
  });

  it('remembers the choice for one game without touching the other', () => {
    useStorage(fakeStorage());
    writeMovementStyle('unforgiven', 'moraffsWorld');
    expect(readMovementStyle('unforgiven')).toBe('moraffsWorld');
    expect(readMovementStyle('moraffsWorld')).toBe('moraffsWorld');
  });

  it('falls back to the game’s own when what is stored is not a game', () => {
    const storage = fakeStorage();
    useStorage(storage);
    storage.setItem('moraff-tools.play.unforgiven.movement', 'sideways');
    expect(readMovementStyle('unforgiven')).toBe('unforgiven');
  });

  it('is the game’s own where there is nowhere to remember anything', () => {
    useStorage(undefined);
    writeMovementStyle('moraffsWorld', 'unforgiven');
    expect(readMovementStyle('moraffsWorld')).toBe('moraffsWorld');
  });
});

describe('the control on the Play tab', () => {
  it('offers both games, each with a line about what its arrows do', () => {
    expect(MOVEMENT_STYLES.map((style) => style.id)).toEqual(['unforgiven', 'moraffsWorld']);
    expect(MOVEMENT_STYLES.map((style) => style.label)).toEqual(['Dungeons of the Unforgiven', "Moraff's World"]);
    expect(MOVEMENT_STYLES.every((style) => style.how.length > 0)).toBe(true);
  });

  it('says what an arrow does under the style being played', () => {
    expect(arrowLabel('unforgiven', KEY.arrowUp)).toBe('MOVE FORWARD');
    expect(arrowLabel('moraffsWorld', KEY.arrowUp)).toBe('FACE AND MOVE NORTH');
    expect(arrowLabel('moraffsWorld', KEY.arrowLeft)).toBe('FACE AND MOVE WEST');
  });

  it('says nothing about a key that is not one of the four arrows', () => {
    expect(arrowLabel('unforgiven', KEY.fight)).toBeNull();
    expect(arrowLabel('moraffsWorld', KEY.homeTurnLeft)).toBeNull();
  });
});
