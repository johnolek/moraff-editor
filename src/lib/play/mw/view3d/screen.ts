import type { ViewRect } from '../../view3d/geometry';
import type { ZoomMapWindow } from '../../zoom-monsters';

/**
 * Where everything Moraff's World draws while it is being played goes, in the 1600 by 1200 grid
 * the game works in. `mw-tools/docs/SCREEN.md` describes the finished screen; these are the
 * code's own numbers, which win where the two differ.
 */

/** The whole screen. `print_text` divides x by 1600 and y by 1200; `fill_rect`'s callers use the
 *  1599 and 1199 one less, which is why both numbers appear below. */
export const MW_SCREEN_UNITS_X = 1600;
export const MW_SCREEN_UNITS_Y = 1200;

/** One of the twelve screens the game can run in. */
export interface MwVideoMode {
  /** The number DS:cd94 holds, which is what the code branches on. */
  mode: number;
  width: number;
  height: number;
  colours: number;
}

/**
 * The twelve video modes, from the switch in FUN_2000_1485 (WORLD.EXE 2000:1485, mw.c
 * "FUN_2000_1485"). Each case sets the screen's last column at DS:cd96 and its last row at
 * DS:cd9a — one less than the sizes below — and the number of colours at DS:cdd5.
 */
export const MW_VIDEO_MODES: MwVideoMode[] = [
  { mode: 0, width: 720, height: 348, colours: 2 },
  { mode: 1, width: 320, height: 200, colours: 4 },
  { mode: 2, width: 320, height: 200, colours: 16 },
  { mode: 3, width: 320, height: 200, colours: 256 },
  { mode: 4, width: 360, height: 480, colours: 256 },
  { mode: 5, width: 640, height: 350, colours: 16 },
  { mode: 6, width: 640, height: 480, colours: 16 },
  { mode: 7, width: 800, height: 600, colours: 16 },
  { mode: 8, width: 1024, height: 768, colours: 16 },
  { mode: 9, width: 1024, height: 768, colours: 256 },
  { mode: 10, width: 1024, height: 768, colours: 256 },
  { mode: 11, width: 640, height: 480, colours: 256 },
];

/** The mode the game is played in here: 1024 by 768 in 256 colours, which is the one John's
 *  screen recording is of. */
export const MW_SCREEN_MODE = MW_VIDEO_MODES[9];
export const MW_SCREEN_PIXELS = { width: MW_SCREEN_MODE.width, height: MW_SCREEN_MODE.height } as const;

/**
 * Which of the four views a number means, as FUN_3000_1a08 (WORLD.EXE 3000:1a08) takes it. The
 * game has no facing: all four are compass directions and all four are always drawn.
 */
export const MW_VIEW_NORTH = 0;
export const MW_VIEW_SOUTH = 1;
export const MW_VIEW_WEST = 2;
export const MW_VIEW_EAST = 3;

/**
 * The rectangles FUN_2000_8b3f (WORLD.EXE 2000:8b3f, mw.c "FUN_2000_8b3f") hands FUN_3000_1a08 for
 * the four views.
 *
 * The game keeps three sets of them and the Z key cycles DS:45c9 between them — "COMPRESSED AND
 * EXPANDED 3D GRAPHICS FOR SPEED" — but it forces the largest whenever a monster is standing
 * beside the character, so the big ones are what a fight is always drawn in. Only they are ported.
 */
export const MW_FRONT_VIEW: ViewRect = { left: 723, top: 0, right: 1156, bottom: 600 };
export const MW_WEST_VIEW: ViewRect = { left: 283, top: 430, right: 717, bottom: 1030 };
export const MW_BACK_VIEW: ViewRect = { left: 723, top: 605, right: 1156, bottom: 1159 };
export const MW_EAST_VIEW: ViewRect = { left: 1162, top: 430, right: 1598, bottom: 1030 };

/** The four in the order their view number indexes them. */
export const MW_VIEWS: ViewRect[] = [MW_FRONT_VIEW, MW_BACK_VIEW, MW_WEST_VIEW, MW_EAST_VIEW];

/** The whole screen, which is what FUN_2000_97b8 (exe 2000:97b8) gives a view the Z key zooms. */
export const MW_WHOLE_SCREEN_VIEW: ViewRect = { left: 0, top: 0, right: 0x63f, bottom: 0x4af };

/**
 * The boxes FUN_2000_8b3f blanks before it redraws the views at a new size, which are the four
 * rectangles a little larger than the views themselves.
 */
export const MW_VIEW_BOXES: ViewRect[] = [
  { left: 721, top: 0, right: 1158, bottom: 602 },
  { left: 721, top: 603, right: 1158, bottom: 1199 },
  { left: 279, top: 428, right: 719, bottom: 1032 },
  { left: 1160, top: 428, right: 1599, bottom: 1032 },
];

/**
 * The message box down the left. movecontrol (exe 2000:aad5) clears 0 to 0x2d0 by 0 to 0x1ae;
 * FUN_2000_216b, which prints the eight-line box, stops two units short at 0x1ac.
 */
export const MW_MESSAGE_BOX_RECT: ViewRect = { left: 0, top: 0, right: 0x2d0, bottom: 0x1ae };

/**
 * The key menu top right, from FUN_4000_3a72 (exe 4000:3a72, mw.c "FUN_4000_3a72"). It clears
 * from half of 0x915 across to the right-hand edge, and down to 0x1ac.
 */
export const MW_KEY_MENU_RECT: ViewRect = { left: 1162, top: 0, right: 0x63f, bottom: 0x1ac };

/**
 * The zoom map at the far left of the middle band, from set_map_view (exe 2000:3ae1) and
 * FUN_3000_b066 (exe 3000:b066). The cell size goes to DS:4488, the columns to DS:4489 and the
 * rows to DS:448a out of a table the video mode indexes: 8 pixels in 14 columns by 30 rows on a
 * 640 by 480 screen, and 10 in 18 by 38 on a 1024 by 768 one. The character is always in the
 * middle of it.
 */
export const MW_MAP_CELL = 10;
export const MW_MAP_COLUMNS = 18;
export const MW_MAP_ROWS = 38;
/** DS:448f, which holds 4 and which nothing in the executable ever assigns. */
export const MW_MAP_LEFT = 4;
/** DS:cd7e and DS:4491, both `0x1ae * maxY / 0x4b0`: 171 rows down a 480-row screen and 274 down
 *  a 768-row one. */
export const mwMapTop = (height: number): number => Math.trunc((0x1ae * (height - 1)) / 0x4b0);
export const MW_MAP_TOP_PIXELS = mwMapTop(MW_SCREEN_PIXELS.height);

/** The same map as one window, for anything drawn on top of it. */
export const MW_ZOOM_MAP: ZoomMapWindow = {
  left: MW_MAP_LEFT,
  top: MW_MAP_TOP_PIXELS,
  cell: MW_MAP_CELL,
  columns: MW_MAP_COLUMNS,
  rows: MW_MAP_ROWS,
};

/** The colours the screen is drawn in. Entries 1 to 15 are the same in all eleven floor palettes,
 *  so a floor never changes any of these. */
export const MW_COLOURS = {
  /** DS:1303: every line movecontrol draws straight onto the play screen. */
  message: 15,
  /** FUN_2000_216b's eight-line box, and the dig prompt. */
  box: 5,
  /** FUN_4000_3a72's two passes: the words, then the key letters over them. */
  menuBody: 8,
  menuKey: 4,
  /** DS:142b and DS:142d: the character's own numbers, and the six characteristics. */
  status: 6,
  characteristics: 3,
  /** FUN_3000_b066: the box the zoom map is drawn on in a 256-colour mode. */
  map: 10,
  /** draw_wall_side (exe 3000:a5f7) marks a wall on the map in this, and draw_cell_corners
   *  (exe 3000:a932) puts the corner dots in 6. */
  mapWall: 15,
  mapCorner: 6,
  /** A ladder or a trap door on the map, and a chute. */
  mapLadder: 4,
  mapChute: 3,
  /** DS:4396: the bar FUN_2000_8728 (exe 2000:8728) puts the engaged monster's hit points on. */
  monsterBar: 14,
  /** The same function prints over it in this. */
  monsterText: 15,
} as const;

/**
 * Where FUN_2000_a9bd (WORLD.EXE 2000:a9bd, mw.c "FUN_2000_a9bd") prints the line under the two
 * stacked views saying what the square underfoot offers: spread between x 0x2da and 0x47e at
 * y 0x48d in colour 5, and redrawn only when it changes. The four strings it chooses between are
 * {@link ladderPrompt}.
 */
export const MW_DIG_PROMPT = { left: 0x2da, y: 0x48d, right: 0x47e, colour: MW_COLOURS.box } as const;
