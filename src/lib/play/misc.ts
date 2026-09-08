import { resetViewCaches } from '../game/port/character';
import { showHint } from '../game/port/drops';
import { clearMenuBlock, clearMessageLine } from '../game/port/screens';
import { showMoney } from '../game/port/town';
import type { Turn } from './engine';
import { COLOUR_SETTINGS } from '../game/dotu-pic.js';
import { KEY, menuEntry, menuKeys } from './keys';

/**
 * movecontrol (exe 2000:c308, unf.c "movecontrol"), the keys that are one branch each: M, the
 * financial statement; O and G, the two settings menus; and X and Z, which change how much of
 * the dungeon is on the screen.
 *
 * The menus themselves are UH.BIN's own messages. Every setting behind them but one is the DOS
 * game's screen, its mouse or its 3-D views, none of which this port has, so the box says so
 * instead and the wording of those boxes is the port's own.
 */

/**
 * show_money (exe 2000:438f, unf.c "show_money"), which movecontrol's 0x6d branch calls straight:
 * the statement goes up, the player reads it, and the column and the line above it are wiped.
 */
export async function countTheMoney(turn: Turn): Promise<void> {
  const { game, session } = turn;
  showMoney(game);
  await game.key();
  clearMenuBlock(game);
  clearMessageLine(game);
  session.box = [];
}

/** UH.BIN 109, the six lines of the options menu, and what its first and last entries answer. */
const OPTIONS_MENU = 109;
const HIGH_SPEED_ON = 112;
const HIGH_SPEED_OFF = 113;
const NO_SOUND = 114;

/** What the three switches this port has nothing behind are answered with. */
const NOT_A_PORT_SETTING = [
  'THAT SWITCH IS FOR THE DOS',
  "GAME'S MOUSE, WHICH THIS PORT",
  'DOES NOT HAVE.',
];

/**
 * movecontrol's 0x6f branch (exe 2000:d9ca), case 6 of the switch at 2000:d5b0: the O key.
 *
 * The first entry is the high speed option (DS:00c3), which stops the game saying that money was
 * found, throws away the drops the character has no use for, and skips most of its delays; the
 * second steps the colour setting (DS:4df2) round its four values; the last shows what the game
 * has to say about sound. The three in between turn the mouse on and off, move it, and pick how
 * the menu highlights a line.
 */
export async function openOptions(turn: Turn): Promise<void> {
  const { game, session } = turn;
  showHint(game, OPTIONS_MENU);
  resetViewCaches(game);
  const chosen = await session.choice(menuKeys(6));
  if (chosen === KEY.escape) return;
  const entry = menuEntry(chosen);
  if (entry === 1) {
    game.highSpeed = !game.highSpeed;
    showHint(game, game.highSpeed ? HIGH_SPEED_ON : HIGH_SPEED_OFF);
  } else if (entry === 2) {
    // The game answers this one by redrawing rather than by saying anything.
    game.colourSetting = (game.colourSetting + 1) % COLOUR_SETTINGS;
    return;
  } else if (entry === 6) {
    showHint(game, NO_SOUND);
  } else {
    game.say(...NOT_A_PORT_SETTING);
  }
  game.pressAnyKey();
}

/** UH.BIN 42, the seven lines of the graphics menu. */
const GRAPHICS_MENU = 42;

/** The port's answer for every one of them. */
const NOTHING_TO_SET = [
  'THE GRAPHICS MENU SETS UP THE',
  '3-D VIEWS AND THE WALLS AND',
  'FLOORS THEY ARE DRAWN WITH.',
  'THIS PORT DRAWS THEM ONE WAY',
  'AND HAS NOTHING TO SET.',
];

/**
 * movecontrol's 0x67 branch (exe 2000:d8b0): the G key. Its seven entries are the default view
 * settings, the wall image, the full screen zoom, the expanded and the normal 3-D views, the
 * size of the forward view and the floor tiles.
 */
export async function openGraphics(turn: Turn): Promise<void> {
  const { game, session } = turn;
  showHint(game, GRAPHICS_MENU);
  resetViewCaches(game);
  const chosen = await session.choice(menuKeys(7));
  if (chosen === KEY.escape) return;
  game.say(...NOTHING_TO_SET);
  game.pressAnyKey();
}

/** The port's answer for the X key. */
const NO_EXPANDED_MAP = [
  'THE GAME WOULD FILL THE SCREEN',
  'WITH THE FLOOR, A THIRD OF IT',
  'AT A TIME. THIS PORT DRAWS THE',
  'SMALL MAP IN THE CORNER ONLY.',
];

/**
 * movecontrol's 0x78 branch (exe 2000:d2fe): the X key, which draws the floor over the whole
 * screen in three pieces and waits for a key on each of them.
 */
export function expandTheMap(turn: Turn): void {
  turn.game.say(...NO_EXPANDED_MAP);
  turn.game.pressAnyKey();
}

/** The port's answer for the Z key. */
const ONLY_FOUR_VIEWS = [
  'THE GAME WOULD FILL THE SCREEN',
  'WITH THE VIEW AHEAD AND HIDE',
  'THE ZOOM MAP. THIS PORT DRAWS',
  'THE FOUR VIEWS ONLY.',
];

/**
 * movecontrol's 0x7a branch (exe 2000:d69c): the Z key, which flips DS:c307 between the four
 * views with the zoom map beside them and one view of what is ahead filling the screen.
 */
export function zoomTheView(turn: Turn): void {
  turn.game.say(...ONLY_FOUR_VIEWS);
  turn.game.pressAnyKey();
}
