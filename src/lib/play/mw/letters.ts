import { experienceNeeded } from '../../game/mw-port/levels';
import { drawInventoryMenu, inventoryScreen } from '../../game/mw-port/inventory';
import {
  drawHelpMenu,
  drawSpellsInForce,
  helpMenuFile,
  showHelp,
  viewStats,
} from '../../game/mw-port/screens';
import { financialStatement } from '../../game/mw-port/town';
import type { MwTurn } from './engine';
import { drawArmorMenu, drawWeaponMenu } from './menus';

/**
 * The letters that only put a screen up: V, 1, 2, P, H, F1, E, M, W and A.
 *
 * None of them spends a moment, and none of them lets the monsters move — movecontrol runs
 * nothing of its own after a key that only reads.
 */

/** How many levels ahead experience_for_level lists. */
const LEVELS_LISTED = 7;

/** view_stats (WORLD.EXE 2000:933a): the V key. */
export async function showVitalStats(turn: MwTurn): Promise<void> {
  await turn.session.showScreens(() => viewStats(turn.game));
}

/**
 * FUN_2000_7421 (WORLD.EXE 2000:7421): the 1 and 2 keys, which draw the preparation spells in
 * force and the battle spells in force down the left-hand edge.
 *
 * The original leaves the panel there and draws the view again over the top of it; here it is a
 * screen of its own and stays until a key arrives.
 */
export async function showSpellsInForce(turn: MwTurn, half: number): Promise<void> {
  const { game, session } = turn;
  drawSpellsInForce(game, half);
  await session.key();
  game.eraseScreen();
}

/**
 * FUN_3000_a047 (WORLD.EXE 3000:a047): the P key, which is the menu of the four spell listings
 * and the magic items, and the pages the key off it opens.
 */
export async function showPockets(turn: MwTurn): Promise<void> {
  const { game, session } = turn;
  session.box = session.takeBoxes(() => drawInventoryMenu(game))[0] ?? [];
  const key = await session.key();
  session.clearBox();
  await session.showScreens(() => inventoryScreen(game, key));
}

/**
 * FUN_2000_919a (WORLD.EXE 2000:919a): the H and F1 keys, which open the menu of twenty-eight
 * help topics and stay open until Escape.
 */
export async function showHelpMenu(turn: MwTurn): Promise<void> {
  const { game, session } = turn;
  for (;;) {
    drawHelpMenu(game);
    const file = helpMenuFile(await session.key());
    game.eraseScreen();
    if (file === -1) return;
    await session.showScreens(() => showHelp(game, file));
  }
}

/**
 * experience_for_level (WORLD.EXE 2000:5a42, mw.c "experience_for_level"): the E key, which
 * lists the next seven levels and what each one takes.
 *
 * The line is labelled with the level after the one it prints the number for: the label counts
 * from the character's level plus one and the number is worked out for the character's level
 * plus none, so a level 3 character reads level 4 against what level 3 took.
 *
 * The number is printed with "%-20.0f", so it is padded out to twenty characters with the spaces
 * that rub a longer number out from under it.
 */
export function showExperienceNeeded(turn: MwTurn): void {
  const lev = turn.game.pc.lev;
  // DS:45c7: the box goes with the character's next step off the square (FUN_2000_a57e).
  turn.game.boxLeavesWithSquare = true;
  // DS:26ad, then DS:1ba6 between the level and the number
  turn.game.say(
    'EXPERIENCE NEEDED FOR LEVEL:',
    ...Array.from(
      { length: LEVELS_LISTED },
      (unused, ahead) =>
        `${lev + ahead + 1}) ${experienceNeeded(lev + ahead).toFixed(0).padEnd(20)}`,
    ),
  );
}

/** financial_statement (WORLD.EXE 2000:342d): the M key. */
export function showMoney(turn: MwTurn): void {
  financialStatement(turn.game);
}

/**
 * movecontrol's 0x77 branch: the W key picks the weapon in hand out of the eight slots.
 *
 * A slot the character owns nothing in does nothing at all. A Worshipper and a Monk can only
 * hold their fists; a Wizard and a Sage can hold a stick or a knife as well; and the great sword
 * is a Fighter's alone.
 */
export async function chooseWeapon(turn: MwTurn): Promise<void> {
  const { game, session } = turn;
  const pc = game.pc;
  session.box = session.takeBoxes(() => drawWeaponMenu(game))[0] ?? [];
  const chosen = await session.lineMenuKey(1, 8);
  game.eraseScreen();
  session.clearBox();
  // Escape hands back -1, and the original then reads the byte in front of the weapon counts
  // rather than one of them; that byte is zero, so escaping picks nothing.
  const slot = chosen - 1;
  if (!(pc.weaponsOwned[slot] > 0)) return;
  const allowed =
    (slot < 1 || (pc.cls !== 1 && pc.cls !== 2)) &&
    (slot < 2 || slot === 4 || (pc.cls !== 3 && pc.cls !== 5)) &&
    (slot !== 7 || pc.cls === 0);
  if (allowed) {
    const wasHolding = pc.weapon;
    pc.weapon = slot;
    if (slot !== wasHolding) game.events.push({ kind: 'gearSwitched' });
  } else {
    // DS:339b 33b4 33cf 33e7 3401, DS:1476, DS:20bd, DS:1476
    game.say(
      'CHARACTERS OF YOUR CLASS',
      '  CAN NOT USE THAT WEAPON.',
      '  YOU SHOULD, THEREFORE',
      '  DROP THE WEAPON TO SAVE',
      '  WEIGHT.',
      '',
      'HIT ANY KEY...',
    );
    game.pressAnyKey();
  }
  session.flushKeys();
}

/**
 * movecontrol's 0x61 branch: the A key picks the armor worn. A Worshipper and a Wizard can wear
 * nothing but their skin, and a Monk and a Sage nothing past leather.
 */
export async function chooseArmor(turn: MwTurn): Promise<void> {
  const { game, session } = turn;
  const pc = game.pc;
  session.box = session.takeBoxes(() => drawArmorMenu(game))[0] ?? [];
  const chosen = await session.lineMenuKey(1, 8);
  game.eraseScreen();
  session.clearBox();
  const slot = chosen - 1;
  if (!(pc.armorOwned[slot] > 0)) return;
  const allowed =
    (slot < 1 || (pc.cls !== 1 && pc.cls !== 3)) && (slot < 2 || (pc.cls !== 2 && pc.cls !== 5));
  if (allowed) {
    const wasWearing = pc.armor;
    pc.armor = slot;
    if (slot !== wasWearing) game.events.push({ kind: 'gearSwitched' });
    return;
  }
  // DS:3317 3335 3357 3377, DS:1476, DS:20bd, DS:1476, DS:1476
  game.say(
    'CHARACTERS OF YOUR PROFESSION',
    '  CAN NOT WEAR ARMOR OF THIS TYPE',
    '  YOU CONTINUE TO WEAR YOUR OLD',
    '  ARMOR.',
    '',
    'HIT ANY KEY...',
  );
  game.pressAnyKey();
}
