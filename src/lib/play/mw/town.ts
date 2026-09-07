import { bundledMwDungeon } from '../../game/mw-dungeon';
import { loadHBin } from '../../game/mw-port/hints';
import { MW_ESCAPE } from '../../game/mw-port/screens';
import type { MwGame } from '../../game/mw-port/state';
import { bank, inn, store, temple } from '../../game/mw-port/town';
import type { MwGameSession, MwTurn } from './engine';
import { mwNotBuiltYet } from './screens';

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
 * leads out to the world map. The overworld is not built, so the first answer says so.
 */
async function leaveByTheGate(session: MwGameSession): Promise<void> {
  const game = session.game;
  const menu = session.takeBoxes(() => loadHBin(game, WORLD_MAP_HINT));
  await session.showBoxes(menu);
  if ((await session.menuKey(2, 3)) !== 0x31) return;
  mwNotBuiltYet(game, 'WALK OUT ONTO THE WORLD MAP AND FIND ANOTHER DUNGEON');
  await session.settle();
  await session.key();
}

/** H.BIN record 34: "YOU ARE STANDING ON TOP OF THE TOWN." and its two choices. */
const WORLD_MAP_HINT = 0x22;

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
