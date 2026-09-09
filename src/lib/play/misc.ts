import { resetViewCaches } from '../game/port/character';
import { showHint } from '../game/port/drops';
import { clearMenuBlock, clearMessageLine } from '../game/port/screens';
import { showMoney } from '../game/port/town';
import type { Game, ScreenLine } from '../game/port/state';
import type { Turn } from './engine';
import { BOSS_KIND } from './floor';
import { COLOUR_SETTINGS } from '../game/dotu-pic.js';
import { KEY, menuEntry, menuKeys } from './keys';

/**
 * movecontrol (exe 2000:c308, unf.c "movecontrol"), the keys that are one branch each: M, the
 * financial statement; O and G, the two settings menus; and X and Z, which change how much of
 * the dungeon is on the screen.
 *
 * The menus themselves are UH.BIN's own messages. Every setting behind them but one is the DOS
 * game's mouse, or a choice about the screen and the 3-D views that this port makes for itself
 * and offers no switch for, so the box says so instead and the wording of those boxes is the
 * port's own.
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

/** The line across the expanded map (exe DS:1e27), and where movecontrol draws it. */
const EXPANDED_HEADLINE = 'EXPANDED DUNGEON MAP, HIT ANY KEY...';
const HEADLINE_X = 0;
const HEADLINE_Y = 0x47e;
const HEADLINE_COLOUR = 15;

/** Where FUN_2000_bf91 puts the way to the boss, which is clear of the map's own 560 pixels. */
const SIGNPOST_X = 0x4b0;
const SIGNPOST_Y = 0x442;
const SIGNPOST_COLOUR = 4;

/**
 * FUN_2000_bf91 (exe 2000:bf91, unf.c "FUN_2000_bf91"): the way to the section's Shadow boss,
 * which the expanded map prints beside itself, or null where it prints nothing.
 *
 * It reads monster slot 0, which is where stock_level puts the boss, and says nothing unless that
 * slot still holds one: a floor with no boss, and one whose boss has been killed and had his slot
 * emptied into the garbage can, both get no signpost at all. The axis with further to go wins,
 * and a tie between the two goes to north or south.
 */
export function bossSignpost(game: Game): ScreenLine | null {
  if (game.monsters[0].type !== BOSS_KIND) return null;
  const boss = game.monsters[0];
  const pc = game.pc;
  const across = Math.abs(pc.y - boss.y) < Math.abs(pc.x - boss.x);
  // DS:1cba, DS:1cc2, DS:1cca and DS:1cd3
  let text: string;
  if (across) text = boss.x < pc.x ? 'GO WEST' : 'GO EAST';
  else text = boss.y < pc.y ? 'GO NORTH' : 'GO SOUTH';
  return { text, x: SIGNPOST_X, y: SIGNPOST_Y, font: 0, colour: SIGNPOST_COLOUR };
}

/**
 * movecontrol's 0x78 branch (exe 2000:d2fe): the X key, which fills the screen with the floor's
 * map and waits for a key.
 *
 * The branch has two halves and the screen the game is played on here takes the second (exe
 * 2000:d330, which asks whether the screen is narrower than 321 pixels): a screen that wide gets
 * the whole floor at once, centred on column 40 and row 55, rather than the top, middle and
 * bottom thirds a 320-pixel screen is shown one after another. The headline says so — the wide
 * screen's is "EXPANDED DUNGEON MAP" where the narrow one's reads "DUNGEON MAP, TOP THIRD".
 *
 * `drawExpandedMap` in `display.ts` is the map itself. The original spends the wait redrawing
 * the character's own square in a new colour every pass; nothing here waits like that.
 */
export async function expandTheMap(turn: Turn): Promise<void> {
  const { game, session } = turn;
  // erase_menu_block at 2000:d31c, and the redraw flag the branch puts up beside it.
  session.wipeMessageBlock();
  session.box = [];
  game.redrawView = true;
  session.expandedMap = true;
  game.draw({ text: EXPANDED_HEADLINE, x: HEADLINE_X, y: HEADLINE_Y, font: 0, colour: HEADLINE_COLOUR });
  const signpost = bossSignpost(game);
  if (signpost) game.draw(signpost);
  await game.key();
  session.expandedMap = false;
  game.eraseScreen();
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
