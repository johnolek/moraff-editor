import type { Rgb } from './game/dotu-pic.js';

/**
 * Moraff's Revenge is the one game whose colours the site keeps as CSS strings: they are CGA's
 * sixteen and the two `SCREEN 1` palettes, written the way a stylesheet writes them. Everything
 * that paints pixels wants the three bytes instead.
 */
export function rgbFromHex(colour: string): Rgb {
  const value = parseInt(colour.slice(1), 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}
