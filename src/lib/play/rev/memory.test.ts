import { describe, expect, it } from 'vitest';
import { EXPLORED_STRIDE, readBinFile } from '../../map/explored';
import { RevMapMemory, type RevMapStore } from './memory';

/** A store that keeps the bytes in hand rather than in the browser. */
function inHand(): RevMapStore & { bytes: Uint8Array | null } {
  return {
    bytes: null,
    read() {
      return this.bytes;
    },
    write(bytes) {
      this.bytes = bytes;
    },
    clear() {
      this.bytes = null;
    },
  };
}

describe('a new character', () => {
  it('starts with the twenty rows of the town CHCHAR seeds into every one', () => {
    const memory = new RevMapMemory();
    // The Flea Bag Inn's own square is one of the four the seeded path has walked over.
    expect(memory.isKnown(7, 3, 0)).toBe(true);
    expect(memory.isKnown(7, 3, 1)).toBe(false);
  });
});

describe('a step', () => {
  it('marks the square underfoot and nothing beside it', () => {
    const memory = new RevMapMemory();
    memory.markStep(5, 7, 3);
    expect(memory.isKnown(5, 7, 3)).toBe(true);
    expect(memory.isKnown(6, 7, 3)).toBe(false);
    expect(memory.isKnown(5, 8, 3)).toBe(false);
    expect(memory.isKnown(5, 7, 4)).toBe(false);
  });

  it('adds the bit once, since the guard above the add is what keeps it safe', () => {
    const memory = new RevMapMemory();
    expect(memory.markStep(1, 1, 1)).toBe(true);
    expect(memory.markStep(1, 1, 1)).toBe(false);
    expect(memory.walkedSquares(1)).toEqual([{ column: 1, row: 1 }]);
  });

  it('keeps every level at once, so returning to one loses nothing', () => {
    const memory = new RevMapMemory();
    memory.markStep(2, 2, 1);
    memory.markStep(3, 3, 2);
    expect(memory.isKnown(2, 2, 1)).toBe(true);
    expect(memory.isKnown(3, 3, 2)).toBe(true);
  });
});

describe('the map the canvas draws', () => {
  it('answers in the canvas own zero-based coordinates', () => {
    const memory = new RevMapMemory();
    memory.markStep(1, 1, 4);
    const map = memory.discovered(4);
    expect(map.known(0, 0)).toBe(true);
    expect(map.known(1, 0)).toBe(false);
  });
});

describe('the Scroll of Seeing', () => {
  it('marks rows 1 to 20 of the level, one more than the nineteen that exist', () => {
    const memory = new RevMapMemory();
    memory.markLevelSeen(4);
    expect(memory.walkedSquares(4)).toHaveLength(20 * 19);
    expect(memory.isKnown(20, 20, 4)).toBe(true);
  });
});

describe('the fountain of youth', () => {
  it('clears every dungeon level and leaves the town', () => {
    const memory = new RevMapMemory();
    memory.markStep(4, 4, 0);
    memory.markStep(4, 4, 1);
    memory.markStep(4, 4, 70);
    memory.forgetTheDungeon();
    expect(memory.isKnown(4, 4, 0)).toBe(true);
    expect(memory.isKnown(4, 4, 1)).toBe(false);
    expect(memory.isKnown(4, 4, 70)).toBe(false);
  });
});

describe('the file beside the character', () => {
  it('writes a BSAVE image the explored-map reader reads back square for square', () => {
    const memory = new RevMapMemory();
    memory.markStep(1, 1, 6);
    memory.markStep(20, 19, 6);
    memory.markStep(7, 3, 5);
    const file = readBinFile('1.BIN', memory.bytes());
    expect([...file.floors[6].squares].sort((a, b) => a - b)).toEqual([0, 18 * EXPLORED_STRIDE + 19]);
    expect([...file.floors[5].squares]).toEqual([2 * EXPLORED_STRIDE + 6]);
  });

  it('reads back the map it saved', () => {
    const store = inHand();
    const memory = new RevMapMemory(store);
    memory.markStep(9, 9, 9);
    memory.save();
    expect(new RevMapMemory(store).isKnown(9, 9, 9)).toBe(true);
  });

  it('seeds the town for a character with nothing beside them yet, as CHCHAR does', () => {
    expect(new RevMapMemory(inHand()).isKnown(7, 3, 0)).toBe(true);
  });

  it('takes the whole map a character walked in DOS, town and all', () => {
    const dos = new RevMapMemory();
    dos.markStep(11, 12, 13);
    const store = inHand();
    store.write(dos.bytes());

    const memory = new RevMapMemory(store);

    expect(memory.isKnown(11, 12, 13)).toBe(true);
    expect(memory.isKnown(7, 3, 0)).toBe(true);
  });

  it('deletes the file and the array with it, which is what a death does', () => {
    const store = inHand();
    const memory = new RevMapMemory(store);
    memory.markStep(9, 9, 9);
    memory.save();
    memory.forgetEverything();
    expect(memory.isKnown(9, 9, 9)).toBe(false);
    expect(store.bytes).toBeNull();
  });
});
