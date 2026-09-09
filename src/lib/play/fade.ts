import type { Rgb } from '../game/dotu-pic.js';

/**
 * The two palette fades: `FUN_4000_5b91` (exe 4000:5b91) brings a screen up out of black and
 * `FUN_4000_5c25` (exe 4000:5c25) takes one down into it.
 *
 * Both walk the whole 0x300 bytes of the DAC one step at a time with `delay(7)` (exe 1000:2789)
 * between the steps, and both do nothing at all outside a 256-colour mode (DS:c6e9 of 0x100).
 * The fade in starts from black and raises every byte that is under the palette's own until it
 * reaches it, 64 times over — enough for the brightest. The fade out starts from the palette and
 * lowers every byte above zero, 60 times over, which leaves a component that started at the top
 * of the DAC's range standing at 3 rather than 0: the game never quite reaches black on the way
 * down, and what follows the fade blanks the screen anyway.
 *
 * `dotu-tools/docs/FAITHFUL-GAPS.md` says which screens run them.
 */

/** Which way a fade goes. */
export type Fade = 'in' | 'out';

/** How long the game waits between one DAC step and the next (exe 4000:5bc1, 4000:5c58). */
export const FADE_STEP_MS = 7;

/** How many steps each fade takes (exe 4000:5c19, 4000:5cad). */
const FADE_STEPS: Record<Fade, number> = { in: 0x40, out: 0x3c };

export const fadeSteps = (fade: Fade): number => FADE_STEPS[fade];

/** How long a fade lasts, which is its steps at seven milliseconds each. */
export const fadeMs = (fade: Fade): number => fadeSteps(fade) * FADE_STEP_MS;

/** The 0 to 63 the DAC holds for a component the palette gives as 0 to 255. `vgaToRgb` scales
 *  the other way with `value * 255 / 63`, so this rounds back to the byte the game wrote. */
const toDac = (value: number): number => Math.round((value * 63) / 255);

/** And back, the way `vgaToRgb` does it. */
const fromDac = (dac: number): number => ((dac * 255) / 63) | 0;

/**
 * The palette as the DAC holds it `step` steps into a fade.
 *
 * Every component moves by one a step, so the fade is not a dimming of the whole picture the way
 * a transparency would be: a component of 8 is gone after eight steps while one of 63 is still
 * more than half up, which is what makes the game's screens fall away to their brightest colours
 * and come back the same way.
 */
export function fadedPalette(palette: Rgb[], fade: Fade, step: number): Rgb[] {
  return palette.map(([r, g, b]) => {
    const at = (value: number): number => {
      const target = toDac(value);
      return fromDac(fade === 'in' ? Math.min(target, step) : Math.max(0, target - step));
    };
    return [at(r), at(g), at(b)] as Rgb;
  });
}
