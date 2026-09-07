import { monstersMove, spendTime } from '../../game/mw-port/combat';
import {
  castSpell,
  MW_FROM_PAPER,
  MW_FROM_SCROLL,
  MW_FROM_SPELLBOOK,
  MW_FROM_WAND,
} from '../../game/mw-port/magic';
import {
  applySpellCategory,
  drawSpellCategoryMenu,
  drawSpellGrid,
  drawWriteSpellCategoryMenu,
  drawWriteSpellLevelMenu,
  drawWriteSpellSlotMenu,
  MW_ESCAPE,
  showSpellDescription,
  spellGridKey,
  writeSpellCategoryKey,
  writeSpellLevelKey,
} from '../../game/mw-port/screens';
import type { MwGame, MwSpellChoice } from '../../game/mw-port/state';
import type { MwGameSession, MwTurn } from './engine';
import { MW_KEY } from './keys';
import { drawArmorSlotMenu, drawDirectionMenu, drawWeaponSlotMenu } from './menus';
import { runAsking } from './replay';
import { mwNotBuiltYet, MW_TEXT_COLOUR } from './screens';

/**
 * The C key and the I key: the spell screen, and everything a spell stops to ask.
 *
 * spell_screen (WORLD.EXE 2000:ea27) is the menus; `castSpell` in
 * `../../game/mw-port/magic.ts` is what happens once a spell has been picked. Four spells stop
 * for a menu of their own on the way — the two enchantments, Pass Wall, and Write Scroll — and
 * those go through `./replay.ts`, since a ported function cannot wait for a key.
 */

/** The four menus a spell can stop for, by the name {@link runAsking} knows them by. */
const WEAPON_SLOT = 'weaponSlot';
const ARMOR_SLOT = 'armorSlot';
const DIRECTION = 'direction';
const WRITE_SPELL = 'writeSpell';

/** The three menus Write Scroll and Enchant Wand walk through, as one answer. */
const WRITE_CATEGORY = 'writeCategory';
const WRITE_LEVEL = 'writeLevel';
const WRITE_SLOT = 'writeSlot';

/** How much game time a spell can ask for before movecontrol spends it a minute at a time. */
const A_MINUTE = 0x3c;
const TOO_LONG = 30000;

/**
 * movecontrol, the 0x63 branch of its letter switch: the C key opens the spell screen on the
 * character's own spellbook, and then spends whatever game time the spell cost.
 */
export async function castAtTheSpellScreen(turn: MwTurn): Promise<void> {
  const { game, session } = turn;
  const cost = await spellScreen(session, MW_FROM_SPELLBOOK);
  if (cost === 0) return;
  spendTheSpellsTime(game, cost);
  monstersMove(game);
  game.redrawView = true;
}

/**
 * movecontrol, case 0x69 of the same switch: the I key asks what kind of thing is being used
 * before it does anything with it.
 *
 * The first three answers open the spell screen on the scrolls, the wands and the magic paper.
 * The fourth is the vitamin pills and the fifth the six things a kill turns up; neither is
 * ported. Unlike the C key, none of this lets the monsters move.
 */
export async function useAnItem(turn: MwTurn): Promise<void> {
  const { game, session } = turn;
  game.draw({ text: 'USE MAGIC MENU:', x: 0, y: 0, font: 0, colour: MW_TEXT_COLOUR }); // DS:34ab
  // DS:34bb, DS:1476, DS:34cf 34d9 34e1 34ea 3500, DS:1476
  game.say(
    'WHICH TYPE OF ITEM?',
    '',
    '1) SCROLL',
    '2) WAND',
    '3) PAPER',
    '4) MAGIC VITAMIN PILL',
    '5) OTHER',
  );
  await session.settle();
  const key = await session.menuKey(2, 6);
  session.clearBox();
  game.eraseScreen();
  const answer = key - 0x30;
  if (answer >= 1 && answer <= 3) {
    const source = [MW_FROM_SCROLL, MW_FROM_WAND, MW_FROM_PAPER][answer - 1];
    const cost = await spellScreen(session, source);
    if (cost !== 0) spendTheSpellsTime(game, cost);
    return;
  }
  if (answer === 4) mwNotBuiltYet(game, 'SWALLOW A MAGIC VITAMIN PILL');
  if (answer === 5) mwNotBuiltYet(game, 'USE A RING, A GRENADE OR ANOTHER MAGIC ITEM');
}

/**
 * What movecontrol does with the number spell_screen hands back: anything under a minute is
 * spent in one go, and anything under 30,000 a minute at a time.
 *
 * A permanent spell asks for 36,096, which falls through both tests, so the month it is
 * advertised to take never passes.
 */
function spendTheSpellsTime(game: MwGame, cost: number): void {
  if (cost < A_MINUTE) {
    spendTime(game, cost);
    return;
  }
  if (cost < TOO_LONG) {
    for (let minutes = 0; minutes < Math.trunc(cost / A_MINUTE); minutes++) {
      spendTime(game, A_MINUTE);
    }
  }
}

/**
 * spell_screen (WORLD.EXE 2000:ea27, mw.c "spell_screen"): the source heading, the category
 * menu, the grid of thirty and the cast.
 *
 * @returns the game time the caller charges for the spell, and 0 for a screen that cast nothing.
 */
async function spellScreen(session: MwGameSession, source: number): Promise<number> {
  const game = session.game;
  let opened = false;
  const boxes = session.takeBoxes(() => {
    opened = drawSpellCategoryMenu(game, source);
  });
  if (!opened) {
    // A fighter out of anything but magic paper is turned away before the menu is drawn.
    await session.showBoxes(boxes);
    return 0;
  }
  session.box = boxes[boxes.length - 1] ?? [];
  let category = -1;
  const choice = await session.lineMenuKey(1, 8);
  const gated = session.takeBoxes(() => {
    category = applySpellCategory(game, source, choice);
  });
  if (category === -1) {
    game.eraseScreen();
    await session.showBoxes(gated);
    return 0;
  }
  session.clearBox();
  drawSpellGrid(game, source, category);
  let index = -1;
  for (;;) {
    const key = await session.key();
    if (key === MW_ESCAPE) {
      game.eraseScreen();
      return 0;
    }
    index = spellGridKey(game, source, category, key);
    if (index !== -1) break;
  }
  game.eraseScreen();
  const level = Math.trunc(index / 3);
  const slot = index % 3;
  if (category > 3) {
    await session.showBoxes(session.takeBoxes(() => showSpellDescription(game, category, level, slot)));
    return 0;
  }
  return castTheSpell(session, source, category, level, slot);
}

/** The cast itself, with the four menus a spell can stop for wired up to the keyboard. */
async function castTheSpell(
  session: MwGameSession,
  source: number,
  category: number,
  level: number,
  slot: number,
): Promise<number> {
  let writeUpTo = 0;
  return runAsking<number>(session, {
    run(game, take) {
      game.chooseWeaponSlot = () => take(WEAPON_SLOT) as number;
      game.chooseArmorSlot = () => take(ARMOR_SLOT) as number;
      game.chooseDirection = () => take(DIRECTION) as number;
      game.chooseSpellToWrite = (maxLevel) => {
        writeUpTo = maxLevel;
        return take(WRITE_SPELL) as MwSpellChoice | null;
      };
      return castSpell(game, source, category, level, slot);
    },
    ask: (question) => askSpellMenu(session, question, writeUpTo),
  });
}

/** One of the four menus, put up and read. */
async function askSpellMenu(
  session: MwGameSession,
  question: string,
  writeUpTo: number,
): Promise<unknown> {
  const game = session.game;
  if (question === WEAPON_SLOT) {
    session.box = session.takeBoxes(() => drawWeaponSlotMenu(game))[0] ?? [];
    return session.lineMenuKey(1, 8);
  }
  if (question === ARMOR_SLOT) {
    session.box = session.takeBoxes(() => drawArmorSlotMenu(game))[0] ?? [];
    return session.lineMenuKey(1, 8);
  }
  if (question === DIRECTION) {
    session.box = session.takeBoxes(() => drawDirectionMenu(game))[0] ?? [];
    // The reader takes lines 2 to 6 of the box, which is the five directions.
    return (await session.menuKey(2, 6)) - 0x30;
  }
  return askWhichSpellToWrite(session, writeUpTo);
}

/**
 * cast_spell (WORLD.EXE 2000:c546, mw.c "cast_spell"): the three menus Write Scroll and Enchant
 * Wand walk through — the kind of spell, its level, and which of the three on that line.
 *
 * The fourth line of the last menu goes back to the one before it, and Escape at either of the
 * first two gives the spell up.
 */
async function askWhichSpellToWrite(
  session: MwGameSession,
  maxLevel: number,
): Promise<MwSpellChoice | null> {
  const game = session.game;
  for (;;) {
    session.box = session.takeBoxes(() => drawWriteSpellCategoryMenu(game))[0] ?? [];
    const category = writeSpellCategoryKey(await session.key());
    if (category === -1) return null;
    for (;;) {
      session.box = session.takeBoxes(() => drawWriteSpellLevelMenu(game, maxLevel))[0] ?? [];
      let level = -1;
      for (;;) {
        const key = await session.key();
        if (key === MW_ESCAPE) break;
        level = writeSpellLevelKey(maxLevel, key);
        if (level !== -1) break;
      }
      if (level === -1) break;
      session.box =
        session.takeBoxes(() => drawWriteSpellSlotMenu(game, maxLevel, category, level))[0] ?? [];
      const slot = await session.lineMenuKey(1, 4);
      if (slot === 4) continue;
      return { category, level, slot: slot - 1 };
    }
  }
}
