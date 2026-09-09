import { describe, expect, it } from 'vitest';
import { SCREEN_PIXELS } from './display';
import { GRADIENT_FIRST } from './plaque';
import { drawModuleTunnel, welcomeLine, TUNNEL_CRAWL_STEPS, type ModuleTunnel } from './tunnel';
import { newFrame, pixelAt, type Frame } from './view3d/frame';

/** The screen the game is played on here, which is what the tunnel's rings are drawn across. */
const SCREEN = SCREEN_PIXELS;
const RIGHT = SCREEN.width - 1;
const BOTTOM = SCREEN.height - 1;

function drawn(showing: ModuleTunnel = { module: 0, welcome: false }): Frame {
  const frame = newFrame(SCREEN.width, SCREEN.height);
  drawModuleTunnel(frame, SCREEN, showing);
  return frame;
}

/** The two colours FUN_4000_771b works out for the ring `inset` pixels in from the edge. */
function ringColours(inset: number): { outline: number; corner: number } {
  const away = Math.trunc((2 * RIGHT) / (Math.trunc(RIGHT / 2) - inset + 1));
  return { outline: 0xff - (away % 0x9f), corner: 0xff - ((away + 0x60) % 0x9f) };
}

describe('the tunnel a module teleporter draws', () => {
  it('runs its outermost ring right round the edge of the screen', () => {
    const frame = drawn();
    const { outline } = ringColours(0);
    expect(pixelAt(frame, 500, 0)).toBe(outline);
    expect(pixelAt(frame, 500, BOTTOM)).toBe(outline);
    expect(pixelAt(frame, 0, 400)).toBe(outline);
    expect(pixelAt(frame, RIGHT, 400)).toBe(outline);
  });

  it('gives every ring four corner pixels of a colour of its own', () => {
    const frame = drawn();
    const { outline, corner } = ringColours(0);
    expect(corner).not.toBe(outline);
    for (const x of [0, RIGHT]) for (const y of [0, BOTTOM]) expect(pixelAt(frame, x, y)).toBe(corner);
  });

  it('draws its rings out of the bank the palette crawl turns, so the tunnel moves', () => {
    expect(ringColours(0).outline).toBeGreaterThanOrEqual(GRADIENT_FIRST);
    expect(ringColours(400).outline).toBeGreaterThanOrEqual(GRADIENT_FIRST);
  });

  it('crowds the rings together towards the middle and leaves the far end black', () => {
    const frame = drawn();
    // The innermost ring is four pixels across, and what it encloses is the black the tunnel was
    // drawn on: the far end of it.
    expect(pixelAt(frame, 511, 383)).toBe(0);
    expect(pixelAt(frame, 510, 382)).not.toBe(0);
    // A ring's side runs down the column its inset names, so the rings leave no gaps between them
    // where they cross the middle of the screen.
    for (const inset of [1, 17, 200, 480]) {
      expect(pixelAt(frame, inset, 400)).toBe(ringColours(inset).outline);
    }
  });

  it('turns the bank 150 times before the welcome, which is the count the loop is given', () => {
    expect(TUNNEL_CRAWL_STEPS).toBe(0x96);
  });
});

describe('the welcome printed on the tunnel', () => {
  it('names each module by its numeral', () => {
    expect([0, 1, 2, 3, 4].map(welcomeLine)).toEqual([
      'WELCOME TO MODULE I!',
      'WELCOME TO MODULE II!',
      'WELCOME TO MODULE III!',
      'WELCOME TO MODULE IV!',
      'WELCOME TO MODULE V!',
    ]);
  });

  it('is drawn across the middle of the screen in white over red, and only once asked for', () => {
    const band = (frame: Frame, colour: number): number => {
      let count = 0;
      for (let y = 300; y <= 460; y++) for (let x = 60; x <= 960; x++) if (pixelAt(frame, x, y) === colour) count += 1;
      return count;
    };
    const welcomed = drawn({ module: 4, welcome: true });
    expect(band(welcomed, 15)).toBeGreaterThan(0);
    expect(band(welcomed, 6)).toBeGreaterThan(0);
    const bare = drawn();
    expect(band(bare, 15)).toBe(0);
    expect(band(bare, 6)).toBe(0);
  });
});
