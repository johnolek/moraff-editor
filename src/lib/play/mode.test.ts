import { afterEach, describe, expect, it } from 'vitest';
import type { StockedMonster } from '../map/stocking';
import {
  DEFAULT_PLAY_MODE,
  monstersDrawn,
  panelVisible,
  PLAY_MODES,
  readPlayMode,
  screenDrawn,
  writePlayMode,
} from './mode';

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

const monster = (slot: number): StockedMonster => ({ slot, x: slot, y: 1, monsterId: '1', level: 3, hp: 20 });

describe('which mode a game is played in', () => {
  it('is faithful until the player says otherwise', () => {
    useStorage(fakeStorage());
    expect(DEFAULT_PLAY_MODE).toBe('faithful');
    expect(readPlayMode('unforgiven')).toBe('faithful');
    expect(readPlayMode('moraffsWorld')).toBe('faithful');
  });

  it('remembers the choice for one game without touching the other', () => {
    useStorage(fakeStorage());
    writePlayMode('unforgiven', 'debug');
    expect(readPlayMode('unforgiven')).toBe('debug');
    expect(readPlayMode('moraffsWorld')).toBe('faithful');
  });

  it('falls back to faithful when what is stored is not a mode', () => {
    const storage = fakeStorage();
    useStorage(storage);
    storage.setItem('moraff-tools.play.unforgiven.mode', 'cheating');
    expect(readPlayMode('unforgiven')).toBe('faithful');
  });

  it('is faithful where there is nowhere to remember anything', () => {
    useStorage(undefined);
    writePlayMode('moraffsWorld', 'speedrun');
    expect(readPlayMode('moraffsWorld')).toBe('faithful');
  });
});

describe('the control on the Play tab', () => {
  it('offers the three modes, each with a line about what it shows', () => {
    expect(PLAY_MODES.map((mode) => mode.id)).toEqual(['faithful', 'speedrun', 'debug']);
    expect(PLAY_MODES.map((mode) => mode.label)).toEqual(['Faithful', 'Speedrun', 'Debug']);
    expect(PLAY_MODES.every((mode) => mode.how.length > 0)).toBe(true);
  });
});

describe('the panel of numbers the game never prints', () => {
  it('is shown in debug alone', () => {
    expect(panelVisible('faithful')).toBe(false);
    expect(panelVisible('speedrun')).toBe(false);
    expect(panelVisible('debug')).toBe(true);
  });
});

describe('the monsters the map draws', () => {
  const sight = { monsters: [monster(0), monster(1), monster(2)], visible: [monster(2)], engaged: monster(1) };

  it('is the ones the views drew, and the one being fought besides, in faithful', () => {
    expect(monstersDrawn('faithful', sight)).toEqual([monster(2), sight.engaged]);
  });

  it('does not draw the one being fought twice when the views drew it too', () => {
    expect(monstersDrawn('faithful', { ...sight, visible: [monster(1)] })).toEqual([monster(1)]);
  });

  it('is none at all in faithful with nothing in sight and nothing being fought', () => {
    expect(monstersDrawn('faithful', { ...sight, visible: [], engaged: null })).toEqual([]);
  });

  it('is every monster on the floor in speedrun and in debug', () => {
    expect(monstersDrawn('speedrun', sight)).toEqual(sight.monsters);
    expect(monstersDrawn('debug', sight)).toEqual(sight.monsters);
    expect(monstersDrawn('debug', { ...sight, engaged: null })).toEqual(sight.monsters);
  });
});

describe('which stage the tab shows', () => {
  it('draws the game screen in faithful and speedrun and the map in debug', () => {
    expect(screenDrawn('faithful')).toBe(true);
    expect(screenDrawn('speedrun')).toBe(true);
    expect(screenDrawn('debug')).toBe(false);
  });
});
