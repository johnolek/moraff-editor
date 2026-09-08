import { describe, expect, it } from 'vitest';
import { EXPLORED_STRIDE } from '../map/explored';
import { MapMemory } from './memory';

function at(x: number, y: number): number {
  return y * EXPLORED_STRIDE + x;
}

describe('what a step marks', () => {
  it('marks the square underfoot and nothing beside it', () => {
    const memory = new MapMemory();
    memory.enterFloor(0, 1);
    memory.markStep(4, 7);
    expect(memory.isKnown(4, 7)).toBe(true);
    expect(memory.isKnown(3, 7)).toBe(false);
    expect(memory.isKnown(5, 7)).toBe(false);
    expect(memory.isKnown(4, 6)).toBe(false);
    expect([...memory.knownSquares()]).toEqual([at(4, 7)]);
  });

  it('drops a mark that would land outside the floor rather than write it somewhere else', () => {
    const memory = new MapMemory();
    memory.enterFloor(0, 1);
    memory.markStep(-1, 7);
    memory.markStep(80, 7);
    memory.markStep(4, 110);
    expect([...memory.knownSquares()]).toEqual([]);
  });

  it('keeps every floor of the block apart, and each of them between visits', () => {
    const memory = new MapMemory();
    memory.enterFloor(0, 1);
    memory.markStep(4, 7);
    memory.enterFloor(0, 2);
    expect(memory.isKnown(4, 7)).toBe(false);
    memory.enterFloor(0, 1);
    expect(memory.isKnown(4, 7)).toBe(true);
  });

  it('leaves the block behind when the character crosses out of its 32 floors', () => {
    const memory = new MapMemory();
    memory.enterFloor(0, 31);
    memory.markStep(4, 7);
    memory.enterFloor(0, 32);
    memory.enterFloor(0, 31);
    expect(memory.isKnown(4, 7)).toBe(false);
  });
});
