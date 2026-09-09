import { describe, expect, it } from 'vitest';
import { REV_KEY } from './keys';
import { revArrowRun, revRedrawDelay, revRedrawMs } from './pace';

describe('the arrows held down so far', () => {
  it('counts every arrow, not the same one twice', () => {
    let run = 0;
    for (const key of [REV_KEY.arrowUp, REV_KEY.arrowLeft, REV_KEY.arrowUp, REV_KEY.arrowRight]) {
      run = revArrowRun(run, key);
    }
    expect(run).toBe(4);
  });

  it('is ended by any other key', () => {
    expect(revArrowRun(7, REV_KEY.cast)).toBe(0);
    expect(revArrowRun(7, REV_KEY.escape)).toBe(0);
    expect(revArrowRun(0, REV_KEY.arrowDown)).toBe(1);
  });
});

describe('what is left of the redraw delay', () => {
  it('is the whole of it before any arrow', () => {
    expect(revRedrawDelay(3000, 0)).toBe(3000);
  });

  it('loses a sixth of it for every arrow', () => {
    expect(revRedrawDelay(3000, 1)).toBe(2500);
    expect(revRedrawDelay(3000, 2)).toBe(2000);
    expect(revRedrawDelay(3000, 3)).toBe(1500);
  });

  it('is nothing at all past the third arrow', () => {
    expect(revRedrawDelay(3000, 4)).toBe(0);
    expect(revRedrawDelay(3000, 40)).toBe(0);
  });

  it('takes nothing off a delay of under six, whose sixth is nothing', () => {
    expect(revRedrawDelay(5, 3)).toBe(5);
    expect(revRedrawDelay(6, 3)).toBe(3);
  });
});

describe('how long the screen takes to appear', () => {
  it('is the slider on its own while the game has no delay set', () => {
    expect(revRedrawMs(800, 0, 0)).toBe(800);
    expect(revRedrawMs(800, 0, 9)).toBe(800);
  });

  it('is nothing at all with the slider at instant', () => {
    expect(revRedrawMs(0, 9, 2)).toBe(0);
  });

  it('shortens by as much as the game shortens its own wait', () => {
    expect(revRedrawMs(600, 6, 0)).toBe(600);
    expect(revRedrawMs(600, 6, 1)).toBe(500);
    expect(revRedrawMs(600, 6, 3)).toBe(300);
    expect(revRedrawMs(600, 6, 4)).toBe(0);
  });

  it('comes straight back once the run is broken', () => {
    const held = revRedrawMs(900, 9, revArrowRun(3, REV_KEY.arrowUp));
    expect(held).toBe(0);
    expect(revRedrawMs(900, 9, revArrowRun(4, REV_KEY.cast))).toBe(900);
  });
});
