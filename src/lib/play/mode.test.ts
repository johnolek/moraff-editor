import { afterEach, describe, expect, it } from 'vitest';
import type { StockedMonster } from '../map/stocking';
import {
  DEFAULT_PLAY_MODE,
  debugDrawn,
  defaultPlayDisplay,
  monstersDrawn,
  panelVisible,
  PLAY_DISPLAYS,
  PLAY_MODES,
  readPlayDisplay,
  readPlayMode,
  sidePicturesVisible,
  writePlayDisplay,
  writePlayMode,
  zoomMapMonsters,
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

  it('does not promise that debug shows the top-down map, which the switch alone decides', () => {
    const debug = PLAY_MODES.find((mode) => mode.id === 'debug')!;
    expect(debug.how).not.toContain('top-down');
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

describe("the marks debug mode puts on the game's own screen", () => {
  const sight = { monsters: [monster(0), monster(1), monster(2)], visible: [monster(2)], engaged: monster(1) };

  it('is drawn in debug alone', () => {
    expect(debugDrawn('faithful')).toBe(false);
    expect(debugDrawn('speedrun')).toBe(false);
    expect(debugDrawn('debug')).toBe(true);
  });

  it('marks every monster on the floor on the zoom map in debug', () => {
    expect(zoomMapMonsters('debug', sight)).toEqual(sight.monsters);
  });

  it('marks none at all in faithful or in speedrun, which no game ever did', () => {
    expect(zoomMapMonsters('faithful', sight)).toEqual([]);
    expect(zoomMapMonsters('speedrun', sight)).toEqual([]);
  });
});

describe('the two pictures beside the stage', () => {
  it("are left out in faithful with the game's own screen up, which draws them both", () => {
    expect(sidePicturesVisible('faithful', 'screen')).toBe(false);
  });

  it('are shown with the map, which draws neither', () => {
    expect(sidePicturesVisible('faithful', 'map')).toBe(true);
  });

  it('are shown in the two modes that show more than the game does', () => {
    expect(sidePicturesVisible('speedrun', 'screen')).toBe(true);
    expect(sidePicturesVisible('debug', 'screen')).toBe(true);
  });
});

describe('which of the two a mode shows until the player switches', () => {
  it("is the game's screen whatever the mode", () => {
    expect(defaultPlayDisplay('faithful')).toBe('screen');
    expect(defaultPlayDisplay('speedrun')).toBe('screen');
    expect(defaultPlayDisplay('debug')).toBe('screen');
  });

  it('offers the two, each with a label', () => {
    expect(PLAY_DISPLAYS.map((display) => display.id)).toEqual(['screen', 'map']);
    expect(PLAY_DISPLAYS.every((display) => display.label.length > 0)).toBe(true);
  });
});

describe('the switch between the screen and the map', () => {
  it('shows the screen in every mode until it has been touched', () => {
    useStorage(fakeStorage());
    expect(readPlayDisplay('unforgiven', 'faithful')).toBe('screen');
    expect(readPlayDisplay('unforgiven', 'debug')).toBe('screen');
  });

  it('remembers the choice for one game without touching the other', () => {
    useStorage(fakeStorage());
    writePlayDisplay('unforgiven', 'map');
    expect(readPlayDisplay('unforgiven', 'faithful')).toBe('map');
    expect(readPlayDisplay('moraffsWorld', 'faithful')).toBe('screen');
  });

  it('overrides the mode both ways', () => {
    useStorage(fakeStorage());
    writePlayDisplay('revenge', 'screen');
    expect(readPlayDisplay('revenge', 'debug')).toBe('screen');
  });

  it('falls back to the mode when what is stored is not one of the two', () => {
    const storage = fakeStorage();
    useStorage(storage);
    storage.setItem('moraff-tools.play.revenge.display', 'both');
    expect(readPlayDisplay('revenge', 'faithful')).toBe('screen');
  });

  it('shows what the mode shows where there is nowhere to remember anything', () => {
    useStorage(undefined);
    writePlayDisplay('moraffsWorld', 'map');
    expect(readPlayDisplay('moraffsWorld', 'faithful')).toBe('screen');
  });
});
