import {
  drawDropCoinsMenu,
  drawDropMenu,
  dropArmor,
  dropCoins,
  dropWeapon,
} from '../../game/mw-port/items';
import { recomputeWeight } from '../../game/mw-port/magic';
import type { MwTurn } from './engine';
import { drawArmorSlotMenu, drawWeaponSlotMenu } from './menus';

/**
 * drop_item (WORLD.EXE 2000:7756): the L key, which puts a suit of armor, a weapon or a pile
 * of coins on the floor to save the weight of carrying it.
 *
 * Nothing lands anywhere: the count comes down and the thing is gone. The two slot menus are the
 * ones the W and A keys already build, and the weight carried is added up again whatever the
 * player picked — Escape included, which is where the recompute_weight call at the end of the
 * function sits.
 */

/** The lines of the opening box the choice is read off, and the digits they answer with. */
const KIND_LINES = { first: 3, last: 5 };
const ARMOR = 0x31;
const WEAPON = 0x32;
const MONEY = 0x33;

/** How many slots either of the two slot menus lists. */
const SLOTS = 8;

/** The lines of the coin box the choice is read off. */
const COIN_LINES = { first: 1, last: 5 };

export async function dropSomething(turn: MwTurn): Promise<void> {
  const { game, session } = turn;
  session.box = session.takeBoxes(() => drawDropMenu(game))[0] ?? [];
  const kind = await session.menuKey(KIND_LINES.first, KIND_LINES.last);
  session.clearBox();
  if (kind === ARMOR) {
    session.box = session.takeBoxes(() => drawArmorSlotMenu(game))[0] ?? [];
    const slot = await session.lineMenuKey(1, SLOTS);
    session.clearBox();
    dropArmor(game, slot);
    await session.settle();
  }
  if (kind === WEAPON) {
    session.box = session.takeBoxes(() => drawWeaponSlotMenu(game))[0] ?? [];
    const slot = await session.lineMenuKey(1, SLOTS);
    session.clearBox();
    dropWeapon(game, slot);
    await session.settle();
  }
  if (kind === MONEY) {
    session.box = session.takeBoxes(() => drawDropCoinsMenu(game))[0] ?? [];
    const pile = await session.menuKey(COIN_LINES.first, COIN_LINES.last);
    session.clearBox();
    dropCoins(game, pile - 0x30);
  }
  recomputeWeight(game);
}
