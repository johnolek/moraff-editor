import { describe, expect, it } from 'vitest';
import { REV_VALUE_COUNT } from '../../game/rev-port/record';
import { revPlayerFromValues, setRevValue, type RevPc } from './record';
import {
  REV_MAGIC,
  REV_WORN,
  revBasicNumber,
  revFloorStats,
  revItemsHeld,
  revPillColour,
  revPillsHeld,
  revSpendItem,
  revSpendPill,
  revSpendWandCharge,
  revWandCharges,
  revWandColour,
  revWears,
} from './magic';

function character(): RevPc {
  return revPlayerFromValues(new Array<number>(REV_VALUE_COUNT).fill(0));
}

describe('the magic a character owns', () => {
  it('counts the nine items from value 47 on', () => {
    const pc = character();
    setRevValue(pc, 47, 3);
    setRevValue(pc, 55, 2);
    expect(revItemsHeld(pc, 1)).toBe(3);
    expect(revItemsHeld(pc, 9)).toBe(2);
    revSpendItem(pc, 1);
    expect(revItemsHeld(pc, 1)).toBe(2);
  });

  it('counts the pills from value 162 and the wand charges from value 168', () => {
    const pc = character();
    setRevValue(pc, 162, 4);
    setRevValue(pc, 176, 7);
    expect(revPillsHeld(pc, 1)).toBe(4);
    expect(revWandCharges(pc, 9)).toBe(7);
    revSpendPill(pc, 1);
    revSpendWandCharge(pc, 9);
    expect(revPillsHeld(pc, 1)).toBe(3);
    expect(revWandCharges(pc, 9)).toBe(6);
  });

  it('names the pills forwards and the wands backwards, which is one list read two ways', () => {
    expect(revPillColour(1)).toBe('BLUE');
    expect(revPillColour(6)).toBe('WHITE');
    expect(revWandColour(1)).toBe('PURPLE');
    expect(revWandColour(9)).toBe('BLUE');
  });

  it('reads the worn magic out of the bitfield of value 16', () => {
    const pc = character();
    pc.rings = REV_WORN.ringsOfHealth + REV_WORN.floorSlosher;
    expect(revWears(pc, REV_WORN.ringsOfHealth)).toBe(true);
    expect(revWears(pc, REV_WORN.floorSlosher)).toBe(true);
    expect(revWears(pc, REV_WORN.bagOfHolding)).toBe(false);
  });

  it('floors every characteristic at 1, which is what the wait for a key does', () => {
    const pc = character();
    pc.stats = [0, -3, 5, 1, 12, -1];
    revFloorStats(pc);
    expect(pc.stats).toEqual([1, 1, 5, 1, 12, 1]);
  });

  it("writes a number the way BASIC's PRINT writes one", () => {
    expect(revBasicNumber(7)).toBe(' 7 ');
    expect(revBasicNumber(-7)).toBe('-7 ');
  });

  it('names the fountain of youth and the three potions that wear off', () => {
    expect(REV_MAGIC.fountainColumn).toBe(150);
    expect(REV_MAGIC.fireUntil).toBe(152);
  });
});
