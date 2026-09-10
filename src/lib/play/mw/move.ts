import { startEngagementTimer } from '../../game/mw-port/combat';
import { mwOccupantAt } from '../../game/mw-port/state';
import type { MwTurn } from './engine';
import { arriveSquare, leaveSquare } from './moment';

/**
 * How long movecontrol leaves either jammed-door message up before the pass ends (WORLD.EXE
 * 2000:c05f and 2000:c08a), which is what stops it being wiped by the next pass before it has
 * been read.
 */
const JAMMED_MS = 0x15e;

/**
 * FUN_2000_a57e (WORLD.EXE 2000:a57e) wipes the top left of the screen before it takes the
 * character off the grid, which is what takes the last fight's lines down — and the whole
 * message box with them when it was flagged to go with the step (DS:45c7: a trap door's, EXP
 * NEEDED's, a kill's, a fight's).
 */
function leaveTheSquare(turn: MwTurn): void {
  turn.session.banner = [];
  if (turn.game.boxLeavesWithSquare) {
    turn.game.boxLeavesWithSquare = false;
    turn.session.box = [];
  }
  leaveSquare(turn.game);
}

/**
 * Turning and stepping: the four arrow keys, and the step movecontrol resolves at the end of
 * every pass round its loop.
 *
 * Moraff's World's arrows are compass directions rather than turns: the up arrow faces the
 * character north and asks for a step north, whatever they were facing before. The character
 * faces 0 north, 1 south, 2 west or 3 east.
 */

/** Which way each of the four arrows sends the character. */
const STEPS = [
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
  { dx: 1, dy: 0 },
];

/**
 * movecontrol's four arrow branches: face that way and ask for a step. The original raises a
 * pair of flags and turns them into a step at the end of the loop, which comes to the same
 * thing, since nothing between the two moves the character.
 */
export function turnAndStep(turn: MwTurn, dir: number): void {
  turn.game.pc.dir = dir;
  turn.step = { ...STEPS[dir] };
}

/**
 * movecontrol's 0x74 and 0x20 branches: T and the space bar leave the square and arrive on it
 * again, which spends a moment without going anywhere.
 */
export function waitAMoment(turn: MwTurn): void {
  turn.session.fighting(() => {
    leaveTheSquare(turn);
    turn.game.redrawView = true;
    arriveSquare(turn.game);
  });
  turn.game.events.push({ kind: 'waited' });
}

/**
 * The end of movecontrol's loop: the step the key asked for, if the square ahead will have it.
 *
 * A wall refuses; a monster standing in the way stops the step, and says so when the two squares
 * have a door between them. Anything else — an open side, a door, a secret door — is walked
 * through, and the step spends a moment.
 */
export function resolveStep(turn: MwTurn): void {
  const { game, step } = turn;
  const pc = game.pc;
  const side = sideStepped(turn);
  if (side === 0) {
    game.say('THE WALL REFUSES TO MOVE'); // DS:3509
    return;
  }
  // With no step at all this reads the character's own square, which holds their own marker
  // rather than -1, so the original takes the branch below and prints nothing for a side of -1.
  if (mwOccupantAt(game, pc.x + step.dx, pc.y + step.dy) !== -1) {
    step.dx = 0;
    step.dy = 0;
    if (side === 1) {
      game.say('THE DOOR IS JAMMED'); // DS:3522
      game.delay(JAMMED_MS);
    }
    if (side === 2) {
      game.say('THE SECRET DOOR IS JAMMED'); // DS:3535
      game.delay(JAMMED_MS);
    }
    return;
  }
  startEngagementTimer(game);
  // Each of the four branches below refuses a step off the edge of the floor, so what says the
  // step happened -- and with it the moment arriveSquare spends -- is the character being
  // somewhere else afterwards.
  const from = { x: pc.x, y: pc.y };
  if (step.dy < 0 && pc.y > 0) {
    leaveTheSquare(turn);
    pc.y -= 1;
    pc.mapCursorY -= 1;
    arriveSquare(game);
    if (pc.mapCursorY < 1) game.recenterMap = true;
  }
  if (step.dy > 0 && pc.y < game.rows) {
    leaveTheSquare(turn);
    pc.y += 1;
    pc.mapCursorY += 1;
    arriveSquare(game);
    if (pc.mapCursorY > game.mapViewRows - 2) game.recenterMap = true;
  }
  if (step.dx > 0 && pc.x < game.columns) {
    leaveTheSquare(turn);
    pc.x += 1;
    pc.mapCursorX += 1;
    arriveSquare(game);
    if (pc.mapCursorX > game.mapViewColumns - 2) game.recenterMap = true;
  }
  if (step.dx < 0 && pc.x > 0) {
    leaveTheSquare(turn);
    pc.x -= 1;
    pc.mapCursorX -= 1;
    arriveSquare(game);
    if (pc.mapCursorX < 1) game.recenterMap = true;
  }
  if (pc.x !== from.x || pc.y !== from.y) game.events.push({ kind: 'stepped', dir: pc.dir });
  if (pc.maxHp < pc.hp) pc.hp = pc.maxHp;
}

/**
 * The side of the square the step goes through, or -1 when no step was asked for. The original
 * reads all four before it takes a key and picks between them here.
 */
function sideStepped(turn: MwTurn): number {
  const { sides, step } = turn;
  if (step.dy < 0) return sides.n;
  if (step.dy > 0) return sides.s;
  if (step.dx > 0) return sides.e;
  if (step.dx < 0) return sides.w;
  return -1;
}
