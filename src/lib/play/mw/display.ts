import type { MwTurn } from './engine';

/**
 * movecontrol (WORLD.EXE 2000:aad5), the keys that are about the screen rather than the game: B
 * the brick speed, O the sound, X the whole floor at once, Z the 3-D view close up, and the
 * three that step one colour of the background on.
 *
 * Every one of them sets up a DOS display this port does not have, so the box says what the game
 * would have done. The wording of those boxes is this port's own.
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

/**
 * movecontrol's 0x78 branch: X clears the screen and draws the floor over the whole of it in
 * three pieces, waiting for a key on each — "DUNGEON MAP: TOP THIRD", the middle and the bottom.
 */
export function expandTheMap(turn: MwTurn): void {
  turn.game.say(
    'THE GAME WOULD FILL THE SCREEN',
    'WITH THE FLOOR, A THIRD OF IT',
    'AT A TIME. THE WHOLE FLOOR IS',
    'ALREADY DRAWN HERE.',
  );
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
