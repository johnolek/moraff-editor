import type { ScreenRect } from '../game/port/state';
import type { Frame } from './view3d/frame';
import type { ViewPictures } from './view3d/pictures';
import { scaleImage } from './view3d/scale';
import { sectionMonsterRecords } from './section-screen';
import { SLAB_BASE, SLAB_TINT, TABLET_SLAB_IMAGE } from './tablet';

/**
 * The picture beside the taunt a section's Shadow boss sends: `boss_office_message` (exe
 * 3000:6c9d, unf.c "boss_office_message") lays a panel of the section's own wall material down
 * the left of the screen and stands the boss inside it, with three lines of the big font to its
 * right saying whose office the message is from.
 *
 * `office.ts` is the message itself and `src/lib/game/port/town.ts` prints the three lines.
 * Everything here is the drawing, and every coordinate is in the 1600 by 1200 grid the game
 * places everything in.
 *
 * Nothing is wiped first. The routine has already brought the stone tablet down (`tablet.ts`,
 * with DS:2412 set to 3, which drops the slab by 0xfa), and `FUN_3000_9026` fades the palette
 * down and back up around the slab rather than clearing the display, so the panel and its three
 * lines land on top of the four 3-D views the character was walking through.
 */

/** The screen the grid is drawn onto, in pixels. */
export interface BossOfficeScreen {
  width: number;
  height: number;
}

/**
 * The panel behind the boss (exe 3000:6d9d onwards), and the rectangle the picture is stretched
 * into inside it (exe 3000:6de0 onwards). Both take the whole 256 columns of their picture.
 */
const PANEL = { x1: 1, y1: 1, x2: 0x168, y2: 0x1ea };
const PICTURE = { x1: 0x19, y1: 0x19, x2: 0x145, y2: 0x1d1 };

/**
 * The same panel as a rectangle, for the lines the tab draws of its own accord.
 *
 * The original draws the key menu once, when `movecontrol` last came round, and the panel is laid
 * straight over the top of it; nothing puts those words back until the taunt has been read. The
 * tab paints its own lines afresh every pass, so it has to leave out the ones standing here.
 */
export const BOSS_OFFICE_PANEL: ScreenRect = {
  x: PANEL.x1,
  y: PANEL.y1,
  right: PANEL.x2,
  bottom: PANEL.y2,
};

/** What the tab needs to draw the screen: which section's boss is sending the message. */
export interface BossOffice {
  /** The section the character is standing in, 1 to 20. */
  section: number;
}

/**
 * The panel and the boss standing in it.
 *
 * The panel goes through `FUN_4000_433e` rather than `scale_image2`, and the two blitters have
 * colour rules of their own (see `dotu-tools/docs/PICTURES.md`); the wall material has no pixel
 * they disagree about, so the port draws it with the one drawer it has. The base is the 0x23
 * `FUN_3000_9004` left at DS:4fc1 for the tablet's slab, and the tint is whatever the last
 * picture on the screen left at DS:4fbd, which the port stands in for the same way `tablet.ts`
 * does.
 */
export function drawBossOffice(
  frame: Frame,
  screen: BossOfficeScreen,
  showing: BossOffice,
  pictures: ViewPictures,
): void {
  const stone = pictures.wall?.[TABLET_SLAB_IMAGE] ?? null;
  if (stone) {
    scaleImage(frame, PANEL.x1, PANEL.y1, PANEL.x2, PANEL.y2, stone, 0, 0xff, {
      screen,
      colours: { base: SLAB_BASE, tint: SLAB_TINT },
    });
  }
  // The record at DS:5247, which is the section's Shadow boss and the first of its five monsters.
  const boss = sectionMonsterRecords(showing.section)[0];
  if (!boss) return;
  const picture = pictures.monster(boss.picnum, false);
  if (!picture) return;
  scaleImage(frame, PICTURE.x1, PICTURE.y1, PICTURE.x2, PICTURE.y2, picture, 0, 0xff, {
    screen,
    colours: { base: boss.colorSet << 4, tint: boss.color },
  });
}
