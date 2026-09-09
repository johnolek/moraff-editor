import { describe, expect, it } from 'vitest';
import type { Rgb } from '../game/dotu-pic.js';
import { fadedPalette, fadeMs, fadeSteps, FADE_STEP_MS } from './fade';

/** A bright colour, a colour one DAC step off black, and black. */
const PALETTE: Rgb[] = [
  [255, 0, 0],
  [4, 255, 255],
  [0, 0, 0],
];

describe('the palette fades', () => {
  it('takes 64 steps up and 60 down, seven milliseconds apart', () => {
    expect([fadeSteps('in'), fadeSteps('out')]).toEqual([0x40, 0x3c]);
    expect(FADE_STEP_MS).toBe(7);
    expect([fadeMs('in'), fadeMs('out')]).toEqual([448, 420]);
  });

  it('starts a fade in from black and reaches the palette in its 64 steps', () => {
    expect(fadedPalette(PALETTE, 'in', 0)).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
    expect(fadedPalette(PALETTE, 'in', fadeSteps('in'))).toEqual(PALETTE);
  });

  it('raises every component by one a step, so a dim colour arrives first', () => {
    // The second entry is one DAC step off black, so one step has it where it belongs while the
    // first entry is still 62 steps short of its own.
    expect(fadedPalette(PALETTE, 'in', 1)).toEqual([
      [4, 0, 0],
      [4, 4, 4],
      [0, 0, 0],
    ]);
  });

  it('leaves the brightest colours standing at the end of a fade out', () => {
    // 60 steps down from the top of the DAC's range is 3, not 0: the game never quite reaches
    // black on the way down.
    expect(fadedPalette(PALETTE, 'out', fadeSteps('out'))).toEqual([
      [12, 0, 0],
      [0, 12, 12],
      [0, 0, 0],
    ]);
  });

  it('leaves the palette alone at the first step of a fade out', () => {
    expect(fadedPalette(PALETTE, 'out', 0)).toEqual(PALETTE);
  });
});
