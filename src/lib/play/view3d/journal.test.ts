import { describe, expect, it } from 'vitest';
import { JournalReplay, paintArea } from './journal';

const paint = (left: number, top: number, right: number, bottom: number) => ({ left, top, right, bottom });

describe('replaying a frame\'s paints over a while', () => {
  it('counts a paint\'s pixels with both edges in', () => {
    expect(paintArea(paint(2, 3, 4, 3))).toBe(3);
    expect(paintArea(paint(0, 0, 9, 9))).toBe(100);
  });

  it('deals the paints out in order as their pixels are paid for', () => {
    const replay = new JournalReplay();
    // 100, 100 and 50 pixels over 250 ms: a pixel a millisecond.
    replay.restart([paint(0, 0, 9, 9), paint(10, 0, 19, 9), paint(0, 10, 9, 14)], 250);
    expect(replay.advance(99)).toEqual([]);
    expect(replay.advance(1)).toEqual([paint(0, 0, 9, 9)]);
    expect(replay.running).toBe(true);
    expect(replay.advance(150)).toEqual([paint(10, 0, 19, 9), paint(0, 10, 9, 14)]);
    expect(replay.running).toBe(false);
  });

  it('carries time a paint did not use over to the next', () => {
    const replay = new JournalReplay();
    replay.restart([paint(0, 0, 9, 9), paint(10, 0, 19, 9)], 200);
    expect(replay.advance(130)).toEqual([paint(0, 0, 9, 9)]);
    expect(replay.advance(70)).toEqual([paint(10, 0, 19, 9)]);
  });

  it('pays for everything at once when there is no time to take', () => {
    const replay = new JournalReplay();
    replay.restart([paint(0, 0, 9, 9), paint(10, 0, 19, 9)], 0);
    expect(replay.advance(0)).toHaveLength(2);
    expect(replay.running).toBe(false);
  });

  it('is done at once with nothing to paint', () => {
    const replay = new JournalReplay();
    replay.restart([], 500);
    expect(replay.advance(0)).toEqual([]);
    expect(replay.running).toBe(false);
  });

  it('starts a new frame from its first paint and forgets the old one', () => {
    const replay = new JournalReplay();
    replay.restart([paint(0, 0, 9, 9), paint(10, 0, 19, 9)], 200);
    replay.advance(100);
    replay.restart([paint(0, 0, 4, 4)], 100);
    expect(replay.advance(99)).toEqual([]);
    expect(replay.advance(1)).toEqual([paint(0, 0, 4, 4)]);
  });

  it('gives nothing once stopped', () => {
    const replay = new JournalReplay();
    replay.restart([paint(0, 0, 9, 9)], 100);
    replay.stop();
    expect(replay.running).toBe(false);
    expect(replay.advance(1000)).toEqual([]);
  });
});
