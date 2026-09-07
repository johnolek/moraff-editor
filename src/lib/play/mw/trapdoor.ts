import { bundledMwDungeon } from '../../game/mw-dungeon';
import { arrivalHint } from '../../game/mw-port/town';
import type { MwGame } from '../../game/mw-port/state';
import type { MwTurn } from './engine';

/** The trap doors: the box one puts up every pass round the loop, and the K key that opens it. */

/** How many floors apart the trap door keys are: one key per ten floors. */
const KEY_STEP = 10;

/**
 * trapdoor_target (WORLD.EXE 2000:a698, mw.c "trapdoor_target"): the floor a trap door on this
 * square leads to, and -1 for a square with no trap door.
 */
export function trapdoorUnder(game: MwGame): number {
  return bundledMwDungeon.trapdoor(game.pc.x, game.pc.y, game.pc.floor, game.pc.dungeon);
}

/**
 * FUN_2000_a791 (WORLD.EXE 2000:a791, mw.c "FUN_2000_a791"): the box a trap door puts up every
 * pass round movecontrol's loop, which is either how to use it or how to find the key. Returns
 * whether the character has that key, which is what decides whether K does anything.
 *
 * The keyhole is labelled with the floor the door leads to, and the flag for that floor sits one
 * byte past the start of the key array: the door to floor 10 reads the first flag. Since
 * trapdoor_target never offers a floor past 170, the flags for 180, 190 and 200 can never be
 * used.
 */
export function explainTrapdoor(game: MwGame, destination: number): boolean {
  const held = game.pc.trapdoorKeys[Math.trunc(destination / KEY_STEP) - 1] !== 0;
  if (!held) {
    // DS:3142, DS:315f with the number and DS:1c1f, DS:3177 318f 31a9 31c0 31d9 31f0
    game.say(
      '  YOU HAVE FOUND A TRAP DOOR',
      `WITH A KEYHOLE LABELED ${destination}.`,
      '  UNFORTUNATELY, YOU DO',
      'NOT HAVE THE CORRECT KEY.',
      '  THIS KEY CAN ONLY BE',
      'FOUND BY KILLING A LEVEL',
      'DRAINER NEAR THE LEVEL',
      'THIS TRAP DOOR LEADS TO.',
    );
    return false;
  }
  // DS:3142, DS:315f with the number and DS:1c1f, then DS:3209 3222 323a
  game.say(
    '  YOU HAVE FOUND A TRAP DOOR',
    `WITH A KEYHOLE LABELED ${destination}.`,
    '',
    'TO USE THE KEY YOU FOUND',
    "EARLIER, HIT 'K' TO USE",
    'DOOR...',
  );
  return true;
}

/**
 * movecontrol's 0x6b branch: K opens the trap door and drops the character onto the one square
 * every trap door to that floor lands on.
 */
export function goThroughTrapDoor(turn: MwTurn): void {
  const { game, session } = turn;
  if (turn.trapdoor < 1) {
    // DS:32b7 32cc, DS:1476, DS:32e8
    game.say("I DON'T SEE ANY TRAP", '  DOOR HERE. KEEP SEARCHING', '', '      HIT ANY KEY...');
    game.pressAnyKey();
    return;
  }
  game.engaged = -1;
  const [x, y] = bundledMwDungeon.trapdoorDest(turn.trapdoor, game.pc.dungeon);
  game.pc.x = x;
  game.pc.y = y;
  session.enterFloor(turn.trapdoor);
  arrivalHint(game, game.pc.floor);
  game.recenterMap = true;
}
