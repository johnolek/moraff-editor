import { describe, expect, it } from 'vitest';
import type { MwEvent } from '../../game/mw-port/state';
import { MapMemory, type MapStore, type StoredMaps } from '../memory';
import { mwDeleteTheMaps, mwFilesWereDeleted, mwLeaveTheDungeon } from './memory';

/** A store that lives in the test rather than in the browser. */
function store(): MapStore & { maps: StoredMaps } {
  return {
    maps: {},
    read() {
      return this.maps;
    },
    write(maps: StoredMaps) {
      this.maps = { ...maps };
    },
    clear() {
      this.maps = {};
    },
  };
}

/** A character who has walked one square of floor 3 of dungeon 0 and had it written out. */
function played(): { kept: MapStore & { maps: StoredMaps }; memory: MapMemory } {
  const kept = store();
  const memory = new MapMemory(kept);
  memory.enterFloor(0, 3);
  memory.markStep(4, 7);
  memory.save();
  return { kept, memory };
}

describe('what a death does to the maps', () => {
  it('deletes them, files and all', () => {
    const { kept, memory } = played();
    mwDeleteTheMaps(memory);
    expect(kept.maps).toEqual({});
    memory.enterFloor(0, 3);
    expect(memory.isKnown(4, 7)).toBe(false);
  });

  it('is a death that recorded the files as deleted, and no other', () => {
    const gone: MwEvent[] = [{ kind: 'levelEntered', floor: 0 }, { kind: 'characterFilesDeleted', slot: 3 }];
    expect(mwFilesWereDeleted(gone, 0)).toBe(true);
    // Only the events the death itself added count: an earlier one belongs to an earlier death.
    expect(mwFilesWereDeleted(gone, 2)).toBe(false);
    expect(mwFilesWereDeleted([{ kind: 'playerSaved' }], 0)).toBe(false);
  });
});

describe('what the gate does to the maps', () => {
  it('blanks what is in memory and leaves the files alone for the same dungeon', () => {
    const { kept, memory } = played();
    mwLeaveTheDungeon(memory, 0, 0);
    expect(Object.keys(kept.maps)).toEqual(['0:3']);
    memory.enterFloor(0, 3);
    expect(memory.isKnown(4, 7)).toBe(true);
  });

  it('deletes them outright for another dungeon', () => {
    const { kept, memory } = played();
    mwLeaveTheDungeon(memory, 0, 12);
    expect(kept.maps).toEqual({});
  });
});
