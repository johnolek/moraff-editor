import { MENU_X, menuLine } from '../game/port/screens';
import type { Game, ScreenLine } from '../game/port/state';
import { BATTLE_SPELLS_BOX } from './display';

/**
 * The two places the game puts text while it is being played: the eight-line message box down
 * the right-hand side, and the screens that take the whole display over.
 *
 * Both are drawn in the grid pfont (exe 4000:0bb3) works in, 1600 across and 1200 down, and both
 * go through `src/lib/roller/screen.ts`, which is the same renderer the character roller's
 * screens use.
 */

/**
 * FUN_2000_2f5d (exe 2000:2f5d, unf.c "FUN_2000_2f5d"): how many lines a message box holds. The
 * game copies eight strings into the buffer at DS:c694 and draws all eight every time.
 */
export const MESSAGE_BOX_LINES = 8;

/**
 * The rectangle the message box fills, which is the two rectangles the game wipes it with:
 * FUN_2000_28be (exe 2000:28be) takes the strip along the top and FUN_2000_2820 (exe 2000:2820)
 * takes the eight lines under it. Together they run from x 0x398 to the right edge and from y
 * 0x2ff to the bottom of the screen. `dotu-tools/docs/SCREEN.md` measures the same box off a
 * screenshot: dark grey, with a green bar across its top.
 */
export const MESSAGE_BOX_RECT = { x: 0x398, y: 0x2ff, right: 0x640, bottom: 0x4b0 };

/** Where the eight lines start, which is the top of FUN_2000_2820's own rectangle. The strip
 *  above it is the green bar, and is the one line a prompt is drawn on. */
export const MESSAGE_BOX_LINES_TOP = 0x324;

/**
 * Whether a drawn line stands in the message box.
 *
 * The screen keeps a string's top left corner rather than the box its letters fill, so a line
 * counts as inside when the point it was drawn at is — which is the same test the two wipes make.
 */
export function onMessageBox(line: ScreenLine): boolean {
  return (
    line.x >= MESSAGE_BOX_RECT.x &&
    line.x < MESSAGE_BOX_RECT.right &&
    line.y >= MESSAGE_BOX_RECT.y &&
    line.y < MESSAGE_BOX_RECT.bottom
  );
}

/**
 * The lines of a message box, ready for the screen renderer. A box line and a menu line are the
 * same line in the same place: FUN_2000_2f5d and mset_gmenu (exe 2000:2b08) both draw the eight
 * strings of that buffer, so `menuLine` in `src/lib/game/port/screens.ts` is the geometry.
 */
export function messageBoxLines(lines: string[]): ScreenLine[] {
  return lines.slice(0, MESSAGE_BOX_LINES).map((text, index) => menuLine(text, index));
}

/**
 * Where the battle banner's five lines go, in the order engagement_timing (exe 2000:b782) prints
 * them: the monster's level, its name, what killing it is worth, the line its type carries, and
 * its hit points.
 *
 * Each is a plain pfont call at {@link MENU_X} in the body font, and the last of the five is
 * print_battle_hp_info's own (exe 2000:b68d, at 2000:b76f). None of them is spread out the way a
 * long menu line is.
 *
 * The hit points line lands third down the screen rather than last, and the gap it leaves — from
 * 0x379 to 0x441, three lines of the block's own spacing — is where strike (exe 2000:7e36) draws
 * the blow, at 0x3c9 and 0x3f1, over a banner nothing wipes for it.
 */
export const BATTLE_BANNER_Y = [0x329, 0x351, 0x441, 0x469, 0x379];

/** The colour every one of the five is drawn in: the word at DS:0435, which is 15 and which
 *  nothing in the game ever writes. */
export const BATTLE_BANNER_COLOUR = 15;

/** The battle banner's lines, ready for the screen renderer. */
export function battleBannerLines(lines: string[]): ScreenLine[] {
  return lines.slice(0, BATTLE_BANNER_Y.length).map((text, index) => ({
    text,
    x: MENU_X,
    y: BATTLE_BANNER_Y[index],
    font: 0,
    colour: BATTLE_BANNER_COLOUR,
  }));
}

/** What the game has drawn and where it stands, for {@link messageBoxScreen}. */
export interface MessageBoxShowing {
  /** The eight strings the last box filled the buffer with. */
  box: string[];
  /** The battle banner's own lines, which the session collects out of the box. */
  banner: string[];
  /** Every line the game has drawn with pfont, wherever it drew it. */
  drawn: ScreenLine[];
}

/**
 * The message box as the screen has it.
 *
 * The eight lines hold whichever of the game's two ways of filling them came last, and the game
 * makes that easy to tell: everything that draws its own lines down that block — mset_gmenu, the
 * pockets menu, view_prep_spells — wipes the block with FUN_2000_2820 first, and so does
 * FUN_2000_2f5d before it copies a box in. So a line drawn on the block is newer than the box,
 * and with nothing drawn there the box shows; with no box either, the battle banner does.
 *
 * The strip above the eight lines is drawn either way: it is where kill_monster puts "YOU KILLED
 * IT!" and FUN_3000_a1c4 puts "GOOD NEWS...", over whatever the block holds.
 *
 * The banner is engagement_timing (exe 2000:b782), which prints in that same block: it wipes the
 * eight lines with FUN_2000_2820 and draws its five over them at {@link BATTLE_BANNER_Y}, and
 * movecontrol wipes the block again as soon as there is no monster ahead any more (exe 2000:c308,
 * the DS:c657 branch).
 */
export function messageBoxScreen(showing: MessageBoxShowing): ScreenLine[] {
  const drawn = showing.drawn.filter(onMessageBox);
  const filled = drawn.some((line) => line.y >= MESSAGE_BOX_LINES_TOP);
  const lines = filled
    ? []
    : showing.box.length > 0
      ? messageBoxLines(showing.box)
      : battleBannerLines(showing.banner);
  return [...lines, ...drawn];
}

/**
 * Whether a drawn line stands in the panel of battle spells at the bottom left.
 *
 * view_battle_spells (exe 2000:9417) draws that panel and leaves it there, and nothing in the
 * loop ever wipes that corner. The port's screen paints the panel from the character every time
 * the tab draws, so what the 2 key and a cast leave behind is a second copy of a panel that is
 * already showing, and it is left out of everything below.
 */
function inTheBattleSpellsPanel(line: ScreenLine): boolean {
  return (
    line.x >= BATTLE_SPELLS_BOX.left &&
    line.x < BATTLE_SPELLS_BOX.right &&
    line.y >= BATTLE_SPELLS_BOX.top &&
    line.y < BATTLE_SPELLS_BOX.bottom
  );
}

/**
 * The lines the game has drawn anywhere but the message box, which is it taking the whole display
 * over: the help, the V screen, the monster manual and the pages behind the P key all draw across
 * the four views.
 */
export function screenTakenOver(drawn: ScreenLine[]): ScreenLine[] {
  return drawn.filter((line) => !onMessageBox(line) && !inTheBattleSpellsPanel(line));
}

/**
 * A key movecontrol reads that this port does not run yet: the message box says what the game
 * would have done, so the key is never silently nothing.
 */
export function notBuiltYet(game: Game, what: string): void {
  game.say(`NOT BUILT YET: ${what}`);
}
