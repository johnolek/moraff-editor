import { scaleImage } from './view3d/scale';
import { drawStrokeLine } from './view3d/stroke-font';
import type { PicRowImage } from './view3d/texture';
import type { Frame } from './view3d/frame';
import { TABLET_SLAB_IMAGE, SLAB_TINT } from './tablet';

/**
 * The picture of a town building, which stands on the screen while the building is dealt with.
 *
 * `load_building_picture` (exe 3000:974d, unf.c "load_building_picture") draws it, and each of
 * the four town routines calls that once per screen it puts up, after framing the space it goes
 * in with `FUN_2000_4506` (exe 2000:4506) and writing a heading over it with `FUN_4000_0885`
 * (exe 4000:0885). Every coordinate here is in the 1600 by 1200 grid everything the game draws
 * is placed in.
 */

/** The screen the picture is drawn on, in pixels. */
export interface BuildingScreen {
  width: number;
  height: number;
}

/** One of the six screens a town building puts up. */
export interface TownBuilding {
  /** The `.pic` file, as the town routine names it. */
  file: string;
  /** The heading written across the top, in the game's own spelling. */
  heading: string;
  /** Where that heading is spread from and to. */
  headingLeft: number;
  headingRight: number;
  /** DS:4fc1 when the frame around the picture is drawn, which the routine sets before it. */
  frameBase: number;
}

/**
 * The six screens, with the values each routine passes: g_store (exe 2000:45cf, 2000:4654 and
 * 2000:474c), temple (exe 2000:4d4e), bank (exe 2000:5692) and flea_inn (exe 2000:4ff8).
 */
export const STORE: TownBuilding = { file: 'store.pic', heading: 'Store', headingLeft: 0x8c, headingRight: 0x366, frameBase: 0x19 };
export const WEAPONRY: TownBuilding = { file: 'weaponry.pic', heading: 'Weapons', headingLeft: 0x8c, headingRight: 0x366, frameBase: 0x28 };
export const ARMOURY: TownBuilding = { file: 'armoury.pic', heading: 'Armour', headingLeft: 0x8c, headingRight: 0x366, frameBase: 0x28 };
export const TEMPLE: TownBuilding = { file: 'temple.pic', heading: 'Temple', headingLeft: 0x8c, headingRight: 0x366, frameBase: 0x20 };
export const BANK: TownBuilding = { file: 'bank.pic', heading: 'The Bank', headingLeft: 0x8c, headingRight: 0x366, frameBase: 0x2d };
/** The inn spreads its heading across the whole width of the picture rather than the middle. */
export const INN: TownBuilding = { file: 'inn.pic', heading: 'Grub-Sleep', headingLeft: 0x50, headingRight: 0x3ac, frameBase: 3 };

/** The pictures one building screen is drawn from. */
export interface BuildingPictures {
  /** The four images of the building's own file, or null when the bundle has not got it. */
  building: PicRowImage[] | null;
  /** The section's wall pictures, whose image 5 the frame is cut from. */
  wall: PicRowImage[] | null;
}

/** The rectangle every town routine gives `load_building_picture`. */
const PICTURE = { left: 0x50, top: 100, right: 0x3ac, bottom: 0x320 };

/**
 * Where the wide picture ends and the narrow strip beside it begins. The routine works it out as
 * a fifth off the right edge and then overlaps the two by two units either side of it, which is
 * how the 256-column picture and the 64-column strip end up the same size on screen as they are
 * in the file.
 */
const SEAM = PICTURE.right - Math.trunc((PICTURE.right - PICTURE.left) / 5);
const OVERLAP = 2;

/**
 * The four images in the order they are drawn, with the colour-set base each is drawn at: 0x100
 * adds 0x20 to every pixel value and 0x101 adds 0x3f, so the two land in the two banks the shop
 * palette fills. Images 2 and 3 are the strip, and only their first 64 columns are used.
 */
const LAYERS = [
  { image: 0, base: 0x100, strip: false },
  { image: 1, base: 0x101, strip: false },
  { image: 2, base: 0x100, strip: true },
  { image: 3, base: 0x101, strip: true },
];

/** The last column of the strip images the drawer is given; the wide ones get all 256. */
const STRIP_COLUMNS = 0x3f;

/**
 * The four panels `FUN_2000_4506` lays around the picture: above it in two halves, and down
 * either side. Each is a window of the section's third wall material, and the two windows are
 * the ones the stone tablet uses, so the frame is the same stone the tablet is cut from.
 */
const FRAME_PANELS = [
  { x1: 1, y1: 1, x2: 0x1db, y2: 100, srcX1: 3, srcX2: 0xd2 },
  { x1: 0x1d6, y1: 1, x2: 0x3fc, y2: 100, srcX1: 0x28, srcX2: 0xfc },
  { x1: 1, y1: 100, x2: 0x50, y2: 0x334, srcX1: 3, srcX2: 0xd2 },
  { x1: 0x3ac, y1: 100, x2: 0x3fc, y2: 0x334, srcX1: 0x28, srcX2: 0xfc },
];

/** Where the heading stands, and the two passes that cut it out of the screen: a fat stroke in
 *  one colour and a thin one over it, which is how the stone tablet's lines are drawn too. The
 *  colours are the two DS:c6ba takes in a 256-colour mode and the pens the two floats beside
 *  them (exe 4000:0885). */
const HEADING_TOP = 0x14;
const HEADING_BOTTOM = 0x4b;
const HEADING_PASSES = [
  { colour: 0x16, pen: 13 },
  { colour: 0x19, pen: 7 },
];

/** The frame around the picture: four panels of the section's own wall stone. */
function drawFrame(frame: Frame, screen: BuildingScreen, building: TownBuilding, wall: PicRowImage[] | null): void {
  const stone = wall?.[TABLET_SLAB_IMAGE] ?? null;
  if (!stone) return;
  // FUN_2000_4506 sets no tint of its own, so the original draws the frame in whatever the last
  // picture left at DS:4fbd; this uses the tint a plain wall face is drawn with, as the tablet does.
  const options = { screen, colours: { base: building.frameBase, tint: SLAB_TINT } };
  for (const panel of FRAME_PANELS) {
    scaleImage(frame, panel.x1, panel.y1, panel.x2, panel.y2, stone, panel.srcX1, panel.srcX2, options);
  }
}

/** One building screen: the frame, the four layers of the picture, and the heading over them. */
export function drawBuilding(
  frame: Frame,
  screen: BuildingScreen,
  building: TownBuilding,
  pictures: BuildingPictures,
): void {
  drawFrame(frame, screen, building, pictures.wall);
  for (const layer of LAYERS) {
    const picture = pictures.building?.[layer.image] ?? null;
    if (!picture) continue;
    const left = layer.strip ? SEAM - OVERLAP : PICTURE.left;
    const right = layer.strip ? PICTURE.right : SEAM + OVERLAP;
    scaleImage(frame, left, PICTURE.top, right, PICTURE.bottom, picture, 0, layer.strip ? STRIP_COLUMNS : 0xff, {
      screen,
      // Bases 0x100 and 0x101 take no tint: the drawer adds a fixed number to every value.
      colours: { base: layer.base, tint: 0 },
    });
  }
  for (const pass of HEADING_PASSES) {
    drawStrokeLine(
      frame,
      screen,
      'dotu',
      building.heading,
      building.headingLeft,
      HEADING_TOP,
      building.headingRight,
      HEADING_BOTTOM,
      pass.colour,
      pass.pen,
    );
  }
}
