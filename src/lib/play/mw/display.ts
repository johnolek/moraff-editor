import type { MwGame } from '../../game/mw-port/state';
import type { ScreenLine } from '../../game/port/state';
import type { MwTurn } from './engine';
import { MW_COLOURS } from './view3d/screen';

/**
 * movecontrol (WORLD.EXE 2000:aad5), the keys that are about the screen rather than the game: B
 * the brick speed, O the sound, X the whole floor at once, Z the 3-D view close up, and the
 * three that step one colour of the background on.
 *
 * Every one of them but X sets up a DOS display this port does not have, so the box says what the
 * game would have done. The wording of those boxes is this port's own.
 */

/** movecontrol's 0x62 branch: B steps DS:4390 through 0, 1 and 2 and draws the view again. */
export function changeTheBrickSpeed(turn: MwTurn): void {
  turn.game.say(
    'THE GAME WOULD STEP THROUGH THE',
    'THREE BRICK SPEEDS, WHICH SET',
    'HOW MUCH OF A WALL THE 3-D VIEW',
    'DRAWS. THIS PORT DRAWS THE MAP.',
  );
}

/** movecontrol's 0x6f branch: O flips DS:119f, which every call to the PC speaker asks first. */
export function switchTheSound(turn: MwTurn): void {
  turn.game.say(
    'THE GAME WOULD TURN THE SOUND',
    'ON AND OFF. THIS PORT MAKES NO',
    'SOUND AT ALL.',
  );
}

/** The line across the expanded map (DS:340b), and where movecontrol draws it. */
const EXPANDED_HEADLINE = 'EXPANDED DUNGEON MAP, HIT ANY KEY...';
const HEADLINE_X = 0;
const HEADLINE_Y = 0x47e;
const HEADLINE_COLOUR = MW_COLOURS.message;

/** Where FUN_2000_a8d7 puts the way to the quest boss, which is clear of the map's own 560
 *  pixels. Dungeons of the Unforgiven prints its own signpost at the same place. */
const SIGNPOST_X = 0x4b0;
const SIGNPOST_Y = 0x442;
const SIGNPOST_COLOUR = 4;

/** The first and last of the eight quest bosses, which are monsters 104 to 111. */
const FIRST_BOSS = 0x68;
const LAST_BOSS = 0x6f;

/**
 * FUN_2000_a8d7 (WORLD.EXE 2000:a8d7, mw.c "FUN_2000_a8d7"): the way to the floor's quest boss,
 * which the expanded map prints beside itself, or null where it prints nothing.
 *
 * It reads monster slot 0, which is where generate_section puts the quest boss, and says nothing
 * unless that slot still holds one of the eight: a floor with no boss, and one whose boss has been
 * killed and had its slot emptied down to type 0, both get no signpost at all. The axis with
 * further to go wins, and a tie between the two goes to north or south. `../misc.ts` has Dungeons
 * of the Unforgiven's, which is the same function three years earlier.
 */
export function mwBossSignpost(game: MwGame): ScreenLine | null {
  const boss = game.monsters[0];
  if (!boss || boss.type < FIRST_BOSS || boss.type > LAST_BOSS) return null;
  const pc = game.pc;
  const across = Math.abs(pc.y - boss.y) < Math.abs(pc.x - boss.x);
  // DS:3242, DS:324a, DS:3252 and DS:325b
  let text: string;
  if (across) text = boss.x < pc.x ? 'GO WEST' : 'GO EAST';
  else text = boss.y < pc.y ? 'GO NORTH' : 'GO SOUTH';
  return { text, x: SIGNPOST_X, y: SIGNPOST_Y, font: 0, colour: SIGNPOST_COLOUR };
}

/**
 * movecontrol's 0x78 branch: X clears the screen, fills it with the floor's own map and waits for
 * a key over it.
 *
 * The branch has two halves and the screen this game is played on here takes the second (exe
 * 2000:ac1b, which asks whether the screen is narrower than 321 pixels): a screen that wide gets
 * the whole floor at once, centred on column 40 and row 55, rather than the top, middle and bottom
 * thirds a 320-pixel screen is shown one after another, each with a heading of its own and a key
 * between them. The map itself is `map.ts`, and the way to the quest boss goes beside it.
 *
 * The original spends the wait redrawing the character's own square in a new colour every pass;
 * nothing here waits like that.
 */
export async function expandTheMap(turn: MwTurn): Promise<void> {
  const { game, session } = turn;
  // clear_screen (exe 4000:34d8) at the top of the branch, and the redraw flag DS:cd18 it puts up
  // for the play screen it comes back to.
  session.clearBox();
  session.banner = [];
  game.eraseScreen();
  game.redrawView = true;
  session.expandedMap = true;
  game.draw({
    text: EXPANDED_HEADLINE,
    x: HEADLINE_X,
    y: HEADLINE_Y,
    font: 0,
    colour: HEADLINE_COLOUR,
  });
  const signpost = mwBossSignpost(game);
  if (signpost) game.draw(signpost);
  await session.key();
  session.expandedMap = false;
  game.eraseScreen();
}

/**
 * FUN_2000_9968 (WORLD.EXE 2000:9968): Z asks which of the four sides to look at, fills the
 * screen with the 3-D view that way through FUN_2000_97b8 (exe 2000:97b8), and names the monster
 * standing on the square it looks at. Pressing Z again steps the zoom on to the next of three.
 */
export function zoomTheView(turn: MwTurn): void {
  turn.game.say(
    'THE GAME WOULD FILL THE SCREEN',
    'WITH THE VIEW ONE WAY AND NAME',
    'THE MONSTER STANDING IN IT.',
    'THIS PORT IS PLAYED ON THE MAP.',
  );
}

/**
 * movecontrol's 0x28, 0x29 and 0x2a branches: each adds sixteen to one of the three colour
 * components of palette entry 0 — the background the whole screen is cleared to — and loads the
 * palette again. The '(' key moves the green, ')' the blue and '*' the red.
 */
export function stepTheBackgroundColour(turn: MwTurn, colour: string): void {
  turn.game.say(
    'THE GAME WOULD ADD SIXTEEN TO',
    `THE ${colour} IN ITS BACKGROUND`,
    'COLOR. THIS PAGE PAINTS ITS',
    'OWN BACKGROUND.',
  );
}
