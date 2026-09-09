import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { newFrame, type Frame } from '../view3d/frame';
import { REV_FOUR_SECONDS, REV_TWO_SECONDS, RevHeldScreens } from './held';

/** A screen told from the others by the one pixel that is painted on it. */
function marked(colour: number): Frame {
  const frame = newFrame(4, 4);
  frame.pixels[0] = colour;
  return frame;
}

const mark = (frame: Frame | null): number | null => (frame === null ? null : frame.pixels[0]);

describe('the screens Moraff\'s Revenge leaves up for a moment', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows nothing of its own while the game has asked for nothing', () => {
    const held = new RevHeldScreens(() => {});
    expect(held.holding).toBe(false);
    expect(held.showing()).toBeNull();
  });

  it('shows each frame for the time it was asked for and then hands the screen back', () => {
    const held = new RevHeldScreens(() => {});
    held.hold(marked(1), REV_TWO_SECONDS, [], []);
    held.hold(marked(2), REV_FOUR_SECONDS, [], []);
    expect(mark(held.showing())).toBe(1);
    vi.advanceTimersByTime(REV_TWO_SECONDS - 1);
    expect(mark(held.showing())).toBe(1);
    vi.advanceTimersByTime(1);
    expect(mark(held.showing())).toBe(2);
    vi.advanceTimersByTime(REV_FOUR_SECONDS);
    expect(held.holding).toBe(false);
    expect(held.showing()).toBeNull();
  });

  it('gives up the frames still to come when a key is pressed', () => {
    const held = new RevHeldScreens(() => {});
    held.hold(marked(1), REV_FOUR_SECONDS, [], []);
    held.hold(marked(2), REV_FOUR_SECONDS, [], []);
    held.release();
    expect(held.holding).toBe(false);
    vi.advanceTimersByTime(REV_FOUR_SECONDS * 2);
    expect(held.showing()).toBeNull();
  });

  it('keeps the words it was handed rather than a reference to them', () => {
    const held = new RevHeldScreens(() => {});
    const box = ['SOUND OFF'];
    held.hold(marked(1), REV_TWO_SECONDS, box, []);
    box.length = 0;
    expect(held.showingBox(box)).toEqual(['SOUND OFF']);
    vi.advanceTimersByTime(REV_TWO_SECONDS);
    expect(held.showingBox(['NOW'])).toEqual(['NOW']);
  });

  it('draws when a frame goes up and when the last one comes down', () => {
    let draws = 0;
    const held = new RevHeldScreens(() => (draws += 1));
    held.hold(marked(1), REV_TWO_SECONDS, [], []);
    expect(draws).toBe(1);
    vi.advanceTimersByTime(REV_TWO_SECONDS);
    expect(draws).toBe(2);
  });
});
