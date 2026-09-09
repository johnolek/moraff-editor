import { GRADIENT_STEP_MS } from './plaque';
import { fillRect, plot, type Frame } from './view3d/frame';
import { drawStrokeLine } from './view3d/stroke-font';

/**
 * `FUN_4000_771b` (exe 4000:771b, unf.c "FUN_4000_771b"): the tunnel of nested rectangles a module
 * teleporter rushes at the player, and the welcome printed over it.
 *
 * `change_module` (exe 2000:c0a5) calls it with the module being arrived in, once the direction is
 * settled and before the module index changes. What the original does after drawing is turn the
 * palette's gradient bank {@link TUNNEL_CRAWL_STEPS} times, call `erase_message_block` (exe
 * 4000:430e), print the welcome twice over, put the HIT ANY KEY plaque at its usual corner and
 * spin on the keyboard with the bank still turning. `engine.ts` is where that order is kept and
 * this file is only the drawing.
 */

/** The screen the tunnel is drawn on, in pixels. */
export interface TunnelScreen {
  width: number;
  height: number;
}

/** What the crossing has on the screen. */
export interface ModuleTunnel {
  /** The module the character is arriving in, 0 to 4. */
  module: number;
  /** The turns of the gradient bank are behind it and the welcome is printed on the tunnel. */
  welcome: boolean;
}

/** How many times the bank is turned over the tunnel before the welcome is printed: the 0x96 the
 *  loop at exe 4000:7803 counts down. */
export const TUNNEL_CRAWL_STEPS = 0x96;

/** How long those turns take at the crawl's own pace (`plaque.ts`), which is how long the tunnel
 *  stands on its own. */
export const TUNNEL_CRAWL_MS = TUNNEL_CRAWL_STEPS * GRADIENT_STEP_MS;

/**
 * How the colours fall away with distance. Each outline is drawn at 0xff minus its number of the
 * way in modulo 0x9f (exe 4000:7772), and the four corner pixels at 0xff minus that number plus
 * 0x60 modulo 0x9f (exe 4000:7787). That offset is what makes the corners a different colour from
 * the ring they sit on, so the eye reads four diagonals running from the screen's corners into the
 * middle.
 */
const COLOUR_TOP = 0xff;
const COLOUR_SPAN = 0x9f;
const CORNER_OFFSET = 0x60;

/**
 * The tunnel on a black screen: an outline for every inset from the middle out to the edge, and
 * the four corner pixels of each in a colour of their own.
 *
 * The colour of a ring comes from 2W over how far in it is, so the rings crowd together and change
 * colour quickly near the middle and spread out slowly at the edge, which is what makes the flat
 * picture read as depth.
 */
export function drawModuleTunnel(frame: Frame, screen: TunnelScreen, showing: ModuleTunnel): void {
  const right = screen.width - 1;
  const bottom = screen.height - 1;
  fillRect(frame, 0, 0, right, bottom, 0);
  const middle = Math.trunc(right / 2);
  for (let inset = middle - 1; inset >= 0; inset--) {
    const away = Math.trunc((2 * right) / (middle - inset + 1));
    const outline = COLOUR_TOP - (away % COLOUR_SPAN);
    const corner = COLOUR_TOP - ((away + CORNER_OFFSET) % COLOUR_SPAN);
    const top = Math.trunc((bottom * inset) / right);
    const far = right - inset;
    const low = bottom - top;
    fillRect(frame, inset, top, far, top, outline);
    fillRect(frame, inset, low, far, low, outline);
    fillRect(frame, inset, top, inset, low, outline);
    fillRect(frame, far, top, far, low, outline);
    for (const x of [inset, far]) for (const y of [top, low]) plot(frame, x, y, corner);
  }
  if (showing.welcome) drawWelcome(frame, screen, showing.module);
}

/** The words at DS:7431 and the numeral each module is given at DS:7444, 7447, 744b, 7450 and
 *  7451. */
const WELCOME = 'WELCOME TO MODULE ';
const MODULE_NUMERALS = ['I!', 'II!', 'III!', 'IV!', 'V!'];

/** What the welcome reads in the module of this index. */
export const welcomeLine = (module: number): string => WELCOME + (MODULE_NUMERALS[module] ?? '');

/** Where that line stands in the 1600 by 1200 grid, as `FUN_4000_069a` is given it (exe
 *  4000:7826). */
const WELCOME_BOX = { x: 100, y: 500, spreadTo: 0x5dc, strokeBottom: 700 };

/**
 * The two passes it is drawn in, which is how every line of the big font is cut: a fat white
 * stroke and a thinner red one over it. The colours are what DS:c6ba is set to and the pens the
 * two floats at DS:7454 and DS:7458.
 */
const WELCOME_PASSES = [
  { colour: 15, pen: 15 },
  { colour: 6, pen: 7 },
];

function drawWelcome(frame: Frame, screen: TunnelScreen, module: number): void {
  const text = welcomeLine(module);
  const box = WELCOME_BOX;
  for (const pass of WELCOME_PASSES) {
    drawStrokeLine(frame, screen, 'dotu', text, box.x, box.y, box.spreadTo, box.strokeBottom, pass.colour, pass.pen);
  }
}
