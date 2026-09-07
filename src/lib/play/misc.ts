import { resetViewCaches } from '../game/port/character';
import { showHint } from '../game/port/drops';
import { clearMenuBlock, clearMessageLine } from '../game/port/screens';
import { showMoney } from '../game/port/town';
import type { Turn } from './engine';
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

/** What the four switches in the middle of the menu are answered with. */
const NOT_A_PORT_SETTING = [
  'THAT SWITCH IS FOR THE DOS',
  "GAME'S SCREEN AND ITS MOUSE,",
  'NEITHER OF WHICH THIS PORT',
  'HAS.',
];

/**
 * movecontrol's 0x6f branch (exe 2000:d9ca), case 6 of the switch at 2000:d5b0: the O key.
 *
 * The first entry is the high speed option (DS:00c3), which stops the game saying that money was
 * found, throws away the drops the character has no use for, and skips most of its delays; the
 * last shows what the game has to say about sound. The four in between set the palette, turn the
 * mouse on and off, move it, and pick how the menu highlights a line.
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
const NO_THREE_D_VIEWS = [
  'THE GRAPHICS MENU SETS UP THE',
  '3-D VIEWS AND THE WALLS AND',
  'FLOORS THEY ARE DRAWN WITH.',
  'THIS PORT IS PLAYED ON THE MAP',
  'AND DRAWS NONE OF THEM.',
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
  game.say(...NO_THREE_D_VIEWS);
  game.pressAnyKey();
}

/** The port's answer for the X key. */
const MAP_ALREADY_DRAWN = [
  'THE GAME WOULD FILL THE SCREEN',
  'WITH THE FLOOR, A THIRD OF IT',
  'AT A TIME. THE WHOLE FLOOR IS',
  'ALREADY DRAWN HERE.',
];

/**
 * movecontrol's 0x78 branch (exe 2000:d2fe): the X key, which draws the floor over the whole
 * screen in three pieces and waits for a key on each of them.
 */
export function expandTheMap(turn: Turn): void {
  turn.game.say(...MAP_ALREADY_DRAWN);
  turn.game.pressAnyKey();
}

/** The port's answer for the Z key. */
const NO_FORWARD_VIEW = [
  'THE GAME WOULD SWAP THE MAP',
  'FOR THE VIEW AHEAD. THIS PORT',
  'IS PLAYED ON THE MAP AND HAS',
  'NO OTHER VIEW TO SWAP TO.',
];

/**
 * movecontrol's 0x7a branch (exe 2000:d69c): the Z key, which flips DS:c307 between the map and
 * the 3-D view of what is in front of the character.
 */
export function zoomTheView(turn: Turn): void {
  turn.game.say(...NO_FORWARD_VIEW);
  turn.game.pressAnyKey();
}
