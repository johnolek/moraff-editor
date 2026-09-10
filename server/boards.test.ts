import { describe, expect, it } from 'vitest';
import type { Milestone, MilestoneKind } from '../src/lib/play/run';
import { deepestReach, highestLevel } from './boards';

function reached(kind: MilestoneKind, which: number, floor = 0): Milestone {
  return { kind, which, actions: 0, time: 0, floor };
}

describe('how far a run got', () => {
  it('is the furthest module a run of Dungeons of the Unforgiven reached', () => {
    expect(deepestReach('unforgiven', [reached('dungeon', 1), reached('dungeon', 3), reached('dungeon', 2)])).toBe(3);
  });

  it("is the furthest dungeon a run of Moraff's World reached", () => {
    expect(deepestReach('moraffsWorld', [reached('dungeon', 4), reached('level', 9)])).toBe(4);
  });

  it('is the place a run started in when it never left it', () => {
    expect(deepestReach('unforgiven', [reached('level', 2), reached('death', 0, 7)])).toBe(0);
  });

  it("is the deepest floor a run of Moraff's Revenge stood on", () => {
    expect(deepestReach('revenge', [reached('floor', 12, 12), reached('death', 0, 9)])).toBe(12);
  });

  it("counts a floor a run of Moraff's Revenge reached without a milestone of its own", () => {
    expect(deepestReach('revenge', [reached('death', 0, 1)])).toBe(1);
  });

  it('is nothing for a run with no milestones at all', () => {
    expect(deepestReach('unforgiven', [])).toBe(0);
  });
});

describe('the highest level a run reached', () => {
  it('is the highest of its level milestones', () => {
    expect(highestLevel([reached('level', 2), reached('level', 5), reached('boss', 1)])).toBe(5);
  });

  it('is nothing for a character that never gained one', () => {
    expect(highestLevel([reached('dungeon', 2), reached('death', 0, 4)])).toBe(0);
  });
});
