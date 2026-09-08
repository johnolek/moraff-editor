import { bundledMwDungeon } from '../../game/mw-dungeon';
import { loadHBin } from '../../game/mw-port/hints';
import { MW_ESCAPE } from '../../game/mw-port/screens';
import type { MwGame } from '../../game/mw-port/state';
import { bank, inn, store, temple } from '../../game/mw-port/town';
import type { MwGameSession, MwTurn } from './engine';

/**
 * The five things a square of floor 0 can hold, which the U key opens: the store, the temple,
 * the bank, the inn, and the gate out to the world map.
 *
 * What each of the four buildings does to the character is ported in
 * `../../game/mw-port/town.ts`, which takes its menus as parameters; what is here is putting
 * those boxes on the screen and reading the keys. The original draws a picture of the building
 * behind the menus out of WORLD.PIC; this port draws none of them.
 *
 * Each of the four is called twice over, once with a choice that buys nothing to put the menu up
 * and once with the answer. None of them rolls a random number for the menu, so the two runs
 * agree — except the temple, which rewrites the counter at 0x80a from a small roll every time it
 * is entered, and so draws that roll twice. Nothing in the game reads the counter back.
 */

/** How many boxes the first run of a building printed, which the second run prints again. */
async function askABuilding(
  session: MwGameSession,
  print: (choice: number) => void,
  first: number,
  last: number,
): Promise<number> {
  const menu = session.takeBoxes(() => print(0));
  await session.showBoxes(menu);
  return (await session.menuKey(first, last)) - 0x30;
}

/** The boxes the answer printed, which are the ones the menu did not. */
async function showTheAnswer(
  session: MwGameSession,
  print: () => void,
  alreadyShown: number,
): Promise<void> {
  const boxes = session.takeBoxes(print);
  await session.showBoxes(boxes.slice(alreadyShown));
}

/**
 * surface_feature (WORLD.EXE 2000:7c2d, mw.c "surface_feature"): what a square of floor 0 holds —
 * 1 store, 2 temple, 3 bank, 4 inn, 5 the gate out to the world map, and 0 for open ground.
 */
export function buildingUnder(game: MwGame): number {
  return bundledMwDungeon.surface(game.pc.x, game.pc.y, game.pc.floor, game.pc.dungeon);
}

/**
 * movecontrol's 0x75 branch on a square of the town that holds something: the building is
 * entered, played and left, and no moment passes for any of it.
 */
export async function enterBuilding(turn: MwTurn): Promise<void> {
  const session = turn.session;
  if (turn.building === 1) await visitTheStore(session);
  if (turn.building === 2) await visitTheTemple(session);
  if (turn.building === 3) await visitTheBank(session);
  if (turn.building === 4) await stayAtTheInn(session);
  if (turn.building === 5) await leaveByTheGate(session);
  session.clearBox();
  session.game.eraseScreen();
}

/** store (WORLD.EXE 2000:2ee7): weapons or armor, one purchase a visit. */
async function visitTheStore(session: MwGameSession): Promise<void> {
  const game = session.game;
  // The entry menu's three lines are lines 3 to 5 of its box.
  const what = await askABuilding(session, (choice) => store(game, choice, 0), 3, 5);
  if (what !== 1 && what !== 2) return;
  const shelf = session.takeBoxes(() => store(game, what, 0));
  await session.showBoxes(shelf.slice(1));
  const item = (await session.menuKey(1, 6)) - 0x30;
  await showTheAnswer(session, () => store(game, what, item), shelf.length);
}

/** The temple (WORLD.EXE 2000:3085): five cures and a raise-dead contract. */
async function visitTheTemple(session: MwGameSession): Promise<void> {
  const game = session.game;
  const menu = session.takeBoxes(() => temple(game, 0));
  await session.showBoxes(menu);
  const choice = (await session.menuKey(2, 7)) - 0x30;
  await showTheAnswer(session, () => temple(game, choice), menu.length);
}

/**
 * bank (WORLD.EXE 2000:3716): one pass round the bank, which the original repeats until the
 * player leaves it. A deposit and a withdrawal each ask for a number as well.
 */
async function visitTheBank(session: MwGameSession): Promise<void> {
  const game = session.game;
  for (;;) {
    const choice = await askABuilding(session, (answer) => bank(game, answer), 3, 7);
    if (choice === 5 || choice < 1 || choice > 5) return;
    let amount = 0;
    if (choice === 2 || choice === 3) {
      const asking = session.takeBoxes(() => bank(game, choice, 0));
      await session.showBoxes(asking.slice(1));
      amount = await typeANumber(session);
      await showTheAnswer(session, () => bank(game, choice, amount), asking.length);
      continue;
    }
    await showTheAnswer(session, () => bank(game, choice), 1);
  }
}

/** flea inn (WORLD.EXE 2000:35b1): a night's sleep, which is where a level is gained. */
async function stayAtTheInn(session: MwGameSession): Promise<void> {
  const game = session.game;
  const menu = session.takeBoxes(() => inn(game, false));
  await session.showBoxes(menu);
  const choice = (await session.menuKey(5, 6)) - 0x30;
  if (choice !== 1) return;
  await showTheAnswer(session, () => inn(game, true), menu.length);
}

/**
 * FUN_2000_7b4f (WORLD.EXE 2000:7b4f, mw.c "FUN_2000_7b4f"): the gate on top of the town, which
 * leads out to the world map.
 *
 * The overworld itself is not built. All the game does with it in the end is pick a dungeon out
 * of where the player stopped walking, so this port asks for that number and runs the rest of
 * the path — {@link gateArrival} and {@link walkIntoTheDungeon} — with what was typed.
 */
async function leaveByTheGate(session: MwGameSession): Promise<void> {
  const game = session.game;
  const menu = session.takeBoxes(() => loadHBin(game, WORLD_MAP_HINT));
  await session.showBoxes(menu);
  if ((await session.menuKey(2, 3)) !== 0x31) return;
  const asking = session.takeBoxes(() => game.say(...WHICH_DUNGEON));
  await session.showBoxes(asking);
  const chosen = await typeADungeonNumber(session, game.pc.dungeon);
  if (chosen === null) return;
  // FUN_2000_7b20 writes the block's explored map out before it walks the character onto the
  // world map, which is the last save before the gate throws the maps away.
  session.memory.save();
  walkIntoTheDungeon(session, chosen);
}

/**
 * What the box asks where the game would walk the character out onto the world map. The
 * overworld's own number picker is the cell they stopped walking on; here it is typed.
 *
 * Every line is under 27 characters, which is where the message box stops drawing a line at its
 * own size and squeezes it into the box's width instead. H.BIN's own records are written to that
 * limit, second lines indented by two spaces, and these are too.
 */
const WHICH_DUNGEON = [
  'THERE IS NO WORLD MAP:',
  '  PICK A DUNGEON INSTEAD.',
  '',
  'TYPE A DUNGEON NUMBER AND',
  '  HIT ENTER, OR ESCAPE TO',
  '  STAY IN THIS ONE.',
];

/**
 * The last of FUN_3000_8235 (WORLD.EXE 3000:8235), which is what the game does with the dungeon
 * it has just picked: the character stands on its gate square, on floor 0, and enter_level puts
 * them there.
 *
 * The original also throws away the explored map — it deletes the eight `.DUN` files, blanks
 * all 32 floors in memory and forgets which block is loaded — and this port keeps no explored
 * map to throw away. What it does not do is forget the monsters: the two floors behind the one
 * in play still belong to the dungeon being left, so climbing down a ladder soon after can find
 * the floor as the old dungeon left it. That is the original's own behaviour, since nothing
 * between here and generate_section clears those two tables.
 */
function walkIntoTheDungeon(session: MwGameSession, chosen: number): void {
  const pc = session.game.pc;
  const arrival = gateArrival(chosen);
  pc.dungeon = arrival.dungeon;
  pc.x = arrival.x;
  pc.y = arrival.y;
  session.enterFloor(0);
  // DS:123d: the map has been left behind by the character, so it is drawn again around them.
  session.game.recenterMap = true;
}

/** H.BIN record 34: "YOU ARE STANDING ON TOP OF THE TOWN." and its two choices. */
const WORLD_MAP_HINT = 0x22;

/** How far the scan for a gate square runs: x from 1 to 78, y from 1 to 108. */
const GATE_SCAN_COLUMNS = 0x4f;
const GATE_SCAN_ROWS = 0x6d;

/**
 * The square of a dungeon's town that the world map drops the character on, or null for a town
 * with no gate at all.
 *
 * The scan writes the character's position at every gate square it passes and never stops early,
 * so the last one it meets is the one they arrive on rather than the first.
 */
function gateSquare(dungeon: number): { x: number; y: number } | null {
  let found: { x: number; y: number } | null = null;
  for (let x = 1; x < GATE_SCAN_COLUMNS; x++) {
    for (let y = 1; y < GATE_SCAN_ROWS; y++) {
      if (bundledMwDungeon.surface(x, y, 0, dungeon) !== 5) continue;
      if (bundledMwDungeon.solid(x, y, 0, dungeon)) continue;
      found = { x, y };
    }
  }
  return found;
}

/**
 * FUN_3000_8235 (WORLD.EXE 3000:8235, mw.c "FUN_3000_8235") where it comes off the world map:
 * the dungeon the character walks into, and the square of its town they arrive on.
 *
 * The game works the number out of the overworld cell the player stopped walking on —
 * `(cx * cy * cx) / (abs(cy) + 1) % 31000` — and then counts it up until floor 0 of that
 * dungeon has a gate square that is not rock, so wherever they stop there is a way back off the
 * surface. `chosen` is where that count starts, which is the number this port asks the player
 * for instead of the overworld.
 *
 * The number is a signed 16-bit field of the character record, and the count wraps at 32767 the
 * way the original's does. Every dungeon the generator draws has gate squares — the fewest in
 * the first few hundred is thirteen — so in practice the count never moves at all.
 */
function gateArrival(chosen: number): { dungeon: number; x: number; y: number } {
  let dungeon = chosen;
  for (;;) {
    const square = gateSquare(dungeon);
    if (square) return { dungeon, x: square.x, y: square.y };
    dungeon = ((dungeon + 1) << 16) >> 16;
  }
}

/**
 * read_string (WORLD.EXE 4000:3db9) as the bank calls it: digits typed until Enter, which the
 * game parses into a 16-bit word.
 *
 * Enter finishes and Escape gives up, and the original ignores both until at least one character
 * has been typed — the test at 4000:3df3 is on the count of characters. Escape leaves the buffer
 * without its terminator, so what the bank reads back out of it is the digits typed either way.
 *
 * The original draws each character as it is typed and takes letters and spaces too; this takes
 * the digits and shows what has been typed so far on the last line of the box.
 */
async function typeANumber(session: MwGameSession): Promise<number> {
  const typed: string[] = [];
  const box = [...session.box];
  for (;;) {
    session.box = [...box.slice(0, 7), typed.join('')];
    const key = await session.key();
    const typedSomething = typed.length > 0;
    if (typedSomething && (key === 0x0d || key === MW_ESCAPE)) {
      return Number(typed.join('')) & 0xffff;
    }
    if (key === 0x08) typed.pop();
    else if (key >= 0x30 && key <= 0x39 && typed.length < 9) typed.push(String.fromCharCode(key));
  }
}

/**
 * The same prompt for the dungeon number, which the game never asks for and this port does.
 *
 * The number is a signed 16-bit field of the character record and the world map's own formula
 * lands on either side of zero, so a leading minus sign is taken as well as the digits. A lone
 * minus sign reads as zero, which is what the `atoi` behind read_string makes of it.
 *
 * The two ends of it are chosen rather than ported, since there is no original to follow. The
 * dungeon the character is in is already in the buffer, so Enter on its own goes back to the
 * town they left from; Escape gives the gate up and comes back null, rather than taking what has
 * been typed the way the bank's Escape does.
 */
async function typeADungeonNumber(
  session: MwGameSession,
  current: number,
): Promise<number | null> {
  const typed = [...String(current)];
  const box = [...session.box];
  for (;;) {
    session.box = [...box.slice(0, 7), typed.join('')];
    const key = await session.key();
    if (key === MW_ESCAPE) return null;
    if (key === 0x0d && typed.length > 0) return (Number(typed.join('')) << 16) >> 16;
    if (key === 0x08) typed.pop();
    else if (key === 0x2d && typed.length === 0) typed.push('-');
    else if (key >= 0x30 && key <= 0x39 && typed.length < 6) typed.push(String.fromCharCode(key));
  }
}
