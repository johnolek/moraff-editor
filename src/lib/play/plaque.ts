import type { Rgb } from '../game/dotu-pic.js';
import { hitAnyKeyLines, HIT_ANY_KEY_X, HIT_ANY_KEY_Y } from '../game/port/screens';
import { fillRect, type Frame } from './view3d/frame';
import type { PicRowImage } from './view3d/texture';
import { scaleImage } from './view3d/scale';
import { drawDotuScreenText } from './view3d/text';

/**
 * `FUN_2000_3e73` (exe 2000:3e73, unf.c "FUN_2000_3e73"): the little stone plaque that says a key
 * is wanted, which the wait behind every eight-line message box puts on the screen.
 *
 * `FUN_2000_4054` (exe 2000:4054) is that wait and 31 functions reach it; `FUN_2000_412a` (exe
 * 2000:412a) is the same thing without the status block's caches thrown away, which the stone
 * tablet and a monster's blow wait with. Both put the plaque at the same corner.
 *
 * What it does, in order: the rectangle the plaque will stand in is filled with colour 0, the game
 * waits {@link PLAQUE_DELAY_MS} in `delay` (exe 1000:2789) with that hole in the screen, a slab of
 * the section's wall material is scaled into it, the two words are printed on the slab, and a
 * frame is drawn round the whole rectangle. Then `FUN_2000_2a2e` (exe 2000:2a2e) spins on the
 * keyboard, rotating the palette's gradient bank once per poll, which is what makes the frame's
 * bands crawl.
 */

/** The screen the plaque is drawn on, in pixels. */
export interface PlaqueScreen {
  width: number;
  height: number;
}

/** How long the rectangle stands empty before the plaque is drawn on it (exe 2000:3ecc). */
export const PLAQUE_DELAY_MS = 0x14a;

/**
 * How far outside the slab the blanked rectangle and the frame around it reach, and how far the
 * slab itself runs from the corner the plaque is given (exe 2000:3e7e onwards).
 */
const PLAQUE = { margin: 10, right: 0xf0, bottom: 0x8c, slabBottom: 0x82 };

/**
 * The colour-set base the slab is drawn at (exe 2000:3ee6), which is the picture bank rather than
 * the wall colours the same image wears in the corridor.
 */
const SLAB_BASE = 0x22;

/**
 * The tint the slab's value-17 pixels take. `FUN_2000_3e73` sets none of its own, so the original
 * draws the slab in whatever DS:4fbd was left holding by the last picture on the screen; the port
 * uses the 12 `FUN_3000_342d` (exe 3000:342d) gives a plain wall face, the same choice `tablet.ts`
 * makes, so the plaque comes out the same every time it goes up.
 */
const SLAB_TINT = 12;

/** `ufwall<section>.pic` image 5, the section's third wall material — DS:c3eb, the same picture
 *  the stone tablet is cut from. */
export const PLAQUE_SLAB_IMAGE = 5;

/**
 * How thick the frame's bands are, in pixels, and the palette entry the first row of it is drawn
 * with (exe 4000:3283, the arm of `FUN_4000_2d90` the game's own video mode takes).
 */
const BAND = 10;
export const GRADIENT_FIRST = 0x60;
export const GRADIENT_LAST = 0xff;
const GRADIENT_ENTRIES = GRADIENT_LAST - GRADIENT_FIRST + 1;

/**
 * How many times a second the port turns the gradient bank.
 *
 * The original turns it once for every pass of a busy loop: `movecontrol` (exe 2000:c308) does it
 * every time round the loop it waits for a key in, `FUN_2000_2a2e` (exe 2000:2a2e) once per poll
 * behind a message box's plaque, and `FUN_2000_2d93` (exe 2000:2d93) once per poll while a menu
 * waits for its choice. So the pace is the machine's rather than the game's, and one number sets
 * it here instead. Everything that crawls takes it: the plaque's frame, the shimmer on a
 * teleporter's face, the square the X key's map flickers and the 150 turns the module tunnel runs.
 */
export const GRADIENT_STEPS_PER_SECOND = 30;

/** How long one of those turns lasts, for a timer that steps on its own rather than a repaint
 *  that paces itself off the clock. */
export const GRADIENT_STEP_MS = 1000 / GRADIENT_STEPS_PER_SECOND;

/**
 * Whether anything on this screen is drawn out of the gradient bank, which is what says the crawl
 * has something to move.
 *
 * The original turns the palette whether or not the bank is on the screen, since turning it costs
 * one write to the DAC. The port shows a turn by painting the whole 1024 by 768 frame again, so a
 * screen with no such pixel on it — a message box on black, the X key's map — is left alone and no
 * repaint loop runs at all.
 */
export function holdsGradientBank(frame: Frame): boolean {
  const pixels = frame.pixels;
  for (let at = 0; at < pixels.length; at++) {
    if (pixels[at] >= GRADIENT_FIRST) return true;
  }
  return false;
}

/**
 * How much the palette entry steps down the frame. DS:4ec1 is the switch the options menu calls
 * the menu highlighting, and the data segment starts it at 1, so the band runs down the gradient
 * bank a step a row; set to 0 it would be one flat colour instead.
 */
const BAND_STEP = 1;

/** Where a corner in the 1600 by 1200 grid lands on the real screen: FUN_4000_3adc (exe
 *  4000:3adc) and FUN_4000_3b05 (exe 4000:3b05), which scale by the screen's last column and row. */
const acrossTo = (screen: PlaqueScreen, x: number): number => Math.trunc((x * (screen.width - 1)) / 0x63f);
const downTo = (screen: PlaqueScreen, y: number): number => Math.trunc((y * (screen.height - 1)) / 0x4af);

/** A rectangle of the real screen, both edges inside it. */
export interface PlaqueRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** The rectangle the plaque is blanked into and framed inside, in screen pixels. */
export function plaqueRect(screen: PlaqueScreen): PlaqueRect {
  return {
    left: acrossTo(screen, HIT_ANY_KEY_X - PLAQUE.margin),
    top: downTo(screen, HIT_ANY_KEY_Y - PLAQUE.margin),
    right: acrossTo(screen, HIT_ANY_KEY_X + PLAQUE.right),
    bottom: downTo(screen, HIT_ANY_KEY_Y + PLAQUE.bottom),
  };
}

/** The hole the plaque stands in, which the game leaves empty for the length of the delay. */
export function blankPlaque(frame: Frame, screen: PlaqueScreen): void {
  const rect = plaqueRect(screen);
  fillRect(frame, rect.left, rect.top, rect.right, rect.bottom, 0);
}

/** The plaque as it stands once the delay is up: the slab, the two words and the frame. */
export function drawPlaque(frame: Frame, screen: PlaqueScreen, wall: PicRowImage[] | null): void {
  blankPlaque(frame, screen);
  const slab = wall?.[PLAQUE_SLAB_IMAGE] ?? null;
  if (slab) {
    scaleImage(
      frame,
      HIT_ANY_KEY_X,
      HIT_ANY_KEY_Y,
      HIT_ANY_KEY_X + PLAQUE.right,
      HIT_ANY_KEY_Y + PLAQUE.slabBottom,
      slab,
      0,
      0xff,
      { screen, colours: { base: SLAB_BASE, tint: SLAB_TINT } },
    );
  }
  drawDotuScreenText(frame, screen, hitAnyKeyLines(HIT_ANY_KEY_X, HIT_ANY_KEY_Y));
  drawPlaqueFrame(frame, plaqueRect(screen));
}

/**
 * The frame around the plaque: four bands ten pixels thick, exclusive-ORed into the screen a row
 * at a time by `FUN_2000_1392` (exe 2000:1392), each row at the gradient entry its distance from
 * the top names.
 *
 * A run is exclusive-ORed rather than painted, so where the band lies on the black margin it comes
 * out as that entry exactly and where it lies on the slab it comes out as the slab's own byte
 * turned by it. That is also why `monster_manual` can rub its highlight out by drawing it twice.
 */
function drawPlaqueFrame(frame: Frame, rect: PlaqueRect): void {
  const band = (left: number, row: number, width: number): void => {
    const colour = GRADIENT_FIRST + (((row - rect.top) % GRADIENT_ENTRIES) * BAND_STEP);
    for (let x = left; x <= Math.min(left + width, frame.width - 1); x++) {
      if (x < 0 || row < 0 || row >= frame.height) continue;
      frame.pixels[row * frame.width + x] ^= colour & 0xff;
    }
  };
  const width = rect.right - rect.left;
  for (let row = rect.top; row <= rect.top + BAND; row++) band(rect.left, row, width);
  for (let row = rect.bottom - BAND; row <= rect.bottom; row++) band(rect.left, row, width);
  for (let row = rect.top + BAND; row < rect.bottom - BAND; row++) {
    band(rect.left, row, BAND);
    band(rect.right - BAND, row, BAND);
  }
}

/**
 * `FUN_4000_3b44` (exe 4000:3b44): the palette's gradient bank rotated by one, which is what the
 * game does once for every poll of the keyboard while it waits. Entry 96 takes what entry 255 held
 * and everything between takes its neighbour, so the colours crawl through entries 96 to 255.
 *
 * The rotation is of the palette itself, so everything on the screen drawn out of the bank crawls
 * together: the plaque's frame, the distance shading on the walls, and the teleporter faces, whose
 * picture values 18 and 19 read the bank by screen column (`view3d/texture.ts`, exe 4000:53d1).
 * The port turns the bank for the whole screen wherever the game waits for a key, at
 * {@link GRADIENT_STEPS_PER_SECOND}.
 */
export function cycleGradientBank(palette: Rgb[], steps: number): Rgb[] {
  const turned = palette.slice();
  const by = ((steps % GRADIENT_ENTRIES) + GRADIENT_ENTRIES) % GRADIENT_ENTRIES;
  for (let entry = GRADIENT_FIRST; entry <= GRADIENT_LAST; entry++) {
    const from = GRADIENT_FIRST + (((entry - GRADIENT_FIRST - by) % GRADIENT_ENTRIES) + GRADIENT_ENTRIES) % GRADIENT_ENTRIES;
    turned[entry] = palette[from];
  }
  return turned;
}
