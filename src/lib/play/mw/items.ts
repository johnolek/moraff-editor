import {
  askForAWish,
  drawMagicItemMenu,
  drawWishMenu,
  drinkHealingPotion,
  throwGrenade,
  useFloorSlosher,
  useSeeingStone,
  useTeleportStone,
} from '../../game/mw-port/items';
import type { MwGameSession } from './engine';

/**
 * use_magic_item (WORLD.EXE 3000:e221): the I key's fifth answer, the six magic items a kill
 * turns up — the floor slosher, the potion of healing, the joke behind WIN GAME, the stone of
 * seeing, the stone of teleportation and the holy hand grenade.
 *
 * The grenade writes −100 over the monster's hit points and stops there, so the kill happens
 * where movecontrol makes every kill happen: `./kill.ts`, after the key, with the loot and the
 * experience a swing would have earned.
 */

/** The lines of the opening box the choice is read off, which are the six items. */
const ITEM_LINES = { first: 1, last: 6 };

/** The lines of the wish box, whose first line is a heading rather than a wish. */
const WISH_LINES = { first: 2, last: 6 };

const FLOOR_SLOSHER = 1;
const HEALING_POTION = 2;
const WISH = 3;
const SEEING_STONE = 4;
const TELEPORT_STONE = 5;
const GRENADE = 6;

export async function useAMagicItem(session: MwGameSession): Promise<void> {
  const game = session.game;
  session.box = session.takeBoxes(() => drawMagicItemMenu(game))[0] ?? [];
  const chosen = (await session.menuKey(ITEM_LINES.first, ITEM_LINES.last)) - 0x30;
  session.clearBox();
  if (chosen === FLOOR_SLOSHER && useFloorSlosher(game)) session.enterFloor(game.pc.floor);
  if (chosen === HEALING_POTION) drinkHealingPotion(game);
  if (chosen === WISH) await makeAWish(session);
  if (chosen === SEEING_STONE) useSeeingStone(game);
  if (chosen === TELEPORT_STONE && useTeleportStone(game)) session.enterFloor(game.pc.floor);
  if (chosen === GRENADE) throwGrenade(game);
  await session.settle();
}

/** The second menu, which the WIN GAME line opens: four wishes and a way back to the game. */
async function makeAWish(session: MwGameSession): Promise<void> {
  const game = session.game;
  session.box = session.takeBoxes(() => drawWishMenu(game))[0] ?? [];
  const chosen = (await session.menuKey(WISH_LINES.first, WISH_LINES.last)) - 0x30;
  session.clearBox();
  askForAWish(game, chosen);
}
