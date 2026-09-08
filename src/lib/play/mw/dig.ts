import { monstersMove } from '../../game/mw-port/combat';
import { innClearPreparation } from '../../game/mw-port/town';
import { MONSTER_SLOTS } from '../../game/mw-port/stocking';
import { mwClearMessageLine, type MwGame } from '../../game/mw-port/state';
import type { ScreenLine } from '../../game/port/state';
import type { MwTurn } from './engine';
import { MW_TEXT_COLOUR } from './screens';

/**
 * dig_hole (WORLD.EXE 2000:a19d, mw.c "dig_hole"): D on a square with no ladder digs through the
 * floor to whatever is under it.
 *
 * It is refused below floor 120, and everywhere else it takes six moments the monsters spend
 * walking towards the character without being allowed to swing — one that reaches them stops the
 * dig. Digging costs the same battle spells a night at the inn does.
 */

/** The deepest floor a hole can be started from. */
const DEEPEST_DIG = 0x78;

/** The two lines of the question, which are lines 6 and 7 of its box. */
const QUESTION_LINES = { first: 6, last: 7 };
const DIG = 0x31;

/** How long every monster's attack timer is held at while the digging goes on. */
const HELD_TIMER = -1200;

/** How many moments the digging takes. */
const DIGGING_MOMENTS = 6;

/**
 * The flashing of 'DIGGING... DIGGING...' (exe 2000:a2e5 and 2000:a37c): four times over, the
 * strip wiped for {@link DIG_BLANK_MS} and the line drawn again for as long as the run asks.
 *
 * The second run of four is reached only from the top floor down to floor 15 (exe 2000:a34e
 * tests the floor against 16), and it holds the line half a second longer.
 */
const DIG_FLASHES = 4;
const DIG_BLANK_MS = 300;
const DIG_LINE_MS = 1500;
const DIG_SHALLOW_LINE_MS = 2000;
const DIG_SECOND_RUN_STOPS_AT = 0x10;

/** How long the line saying a monster has interrupted the dig stands (exe 2000:a2c2), and the
 *  colour print_text draws it in, which is not the one every other line here uses. */
const MONSTER_HELPS_MS = 1000;
const MONSTER_HELPS_COLOUR = 4;

const stripLine = (text: string, colour: number): ScreenLine => ({ text, x: 0, y: 0, font: 0, colour });

/** One run of four flashes, each wiping the strip and drawing the line again. */
export function digging(game: MwGame, lineMs: number): void {
  for (let flash = 0; flash < DIG_FLASHES; flash++) {
    mwClearMessageLine(game);
    game.delay(DIG_BLANK_MS);
    game.draw(stripLine('DIGGING... DIGGING...', MW_TEXT_COLOUR)); // DS:308c
    game.delay(lineMs);
  }
}

/** Below this floor the hole is dug upwards instead, and the rescue puts the character one
 *  floor deeper only while they are above it. */
const DIG_UPWARDS_BELOW = 0x96;

/** Where the search for a floor to land on turns round, and how many floors it tries. */
const TURNING_FLOOR = 0x7c;
const GIVE_UP_AFTER = 0x82;

/** The rectangle the rescue searches for any open square at all. */
const RESCUE = { fromX: 0x15, toX: 0x3a, fromY: 0x15, toY: 0x58 };

/** @returns whether a hole was dug, which is what puts the character off a building square. */
export async function digAHole(turn: MwTurn): Promise<boolean> {
  const { game, session } = turn;
  const pc = game.pc;
  if (pc.floor > DEEPEST_DIG) {
    // DS:2f4d 2f68 2f83 2f9b 2fb3 29a4, DS:1476, DS:20bd
    game.say(
      'THE FLOOR SEEMS TO BE MADE',
      '  OF SOLID ROCK. IT IS NOT',
      '  POSSIBLE TO DIG HERE.',
      'A LITTLE MOUSE SUGGESTS',
      '  YOU USE A LADDER OR A',
      '  SPELL.',
      '',
      'HIT ANY KEY...',
    );
    game.pressAnyKey();
    return false;
  }
  // DS:2fcb 2fe5 2ff5 3010 302b, DS:1476, DS:3041 305c
  game.say(
    'DO YOU WISH TO DIG A HOLE',
    '  IN THE FLOOR?',
    'IT MAY TAKE SOME TIME, BUT',
    '  IF YOU ARE TRAPPED, THEN',
    '  YOU HAVE NO CHOICE.',
    '',
    '1) DIG A HOLE IN THE FLOOR',
    '2) FORGET THE HOLE IDEA',
  );
  await session.settle();
  if ((await session.menuKey(QUESTION_LINES.first, QUESTION_LINES.last)) !== DIG) return false;
  session.clearBox();
  for (let slot = 0; slot < MONSTER_SLOTS; slot++) game.monsterTimers[slot] = HELD_TIMER;
  session.fighting(() => {
    for (let moment = 0; moment < DIGGING_MOMENTS; moment++) monstersMove(game);
  });
  for (let slot = 0; slot < MONSTER_SLOTS; slot++) game.monsterTimers[slot] = 0;
  if (session.faceTheMonster() !== -1) {
    game.redrawView = true;
    mwClearMessageLine(game);
    game.draw(stripLine('A MONSTER WANTS TO HELP', MONSTER_HELPS_COLOUR)); // DS:3074
    game.delay(MONSTER_HELPS_MS);
    return false;
  }
  digging(game, DIG_LINE_MS);
  // DS:30a2 30b9 30d1 30e9 3104 311e 3137, DS:20bd
  game.say(
    'BOY THIS IS HARD WORK!',
    'YOUR HANDS ARE RAW FROM',
    '  DIGGING. BLISTERS ARE',
    '  DEVELOPING ON YOUR HANDS',
    '  MAKING IT A LITTLE MORE',
    '  DIFFICULT TO HOLD YOUR',
    '  WEAPONS.',
    'HIT ANY KEY...',
  );
  game.pressAnyKey();
  await session.settle();
  if (game.pc.floor < DIG_SECOND_RUN_STOPS_AT) digging(game, DIG_SHALLOW_LINE_MS);
  session.flushKeys();
  game.engaged = -1;
  // The same floor is entered again before the hole goes anywhere, which is neither the floor
  // the second table holds nor the third, so the monsters of the floor being left are rolled
  // afresh and the old table is pushed back a place under the same floor number.
  session.enterFloor(pc.floor);
  game.recenterMap = true;
  let landing = pc.floor;
  let step = pc.floor < DIG_UPWARDS_BELOW ? 1 : -1;
  // The original never sets this counter before it reads it, so how many floors a hole tries
  // before it gives up is whatever was on the stack; here it starts at none tried.
  let tried = 0;
  for (;;) {
    landing += step;
    if (landing === TURNING_FLOOR) step = -1;
    if (landing === 1) step = 1;
    if (!game.isSolid(pc.x, pc.y, landing, pc.dungeon)) break;
    if (tried > GIVE_UP_AFTER) {
      if (pc.floor < DIG_UPWARDS_BELOW) pc.floor += 1;
      for (let x = RESCUE.fromX; x < RESCUE.toX; x++) {
        for (let y = RESCUE.fromY; y < RESCUE.toY; y++) {
          if (game.isSolid(x, y, pc.floor, pc.dungeon)) continue;
          pc.x = x;
          pc.y = y;
          session.enterFloor(pc.floor);
          return true;
        }
      }
    }
    tried += 1;
  }
  innClearPreparation(game);
  session.enterFloor(landing);
  return true;
}
