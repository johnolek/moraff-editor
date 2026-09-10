import { typedName } from '../game/port/character';
import {
  bankDeposit,
  bankWithdraw,
  buyArmor,
  buyCultureStock,
  buyMagicCrystals,
  buyWeapon,
  convertDollars,
  cultureStockPrice,
  enterBank,
  enterInn,
  enterStore,
  enterTemple,
  INN_NAMES,
  magicCrystalPrice,
  robBank,
  stayTheNight,
  temple,
} from '../game/port/town';
import { ARMOURY, BANK, INN, STORE, TEMPLE, WEAPONRY } from './building';
import { printMenus, printMenusEndingInAMenu } from './boxes';
import type { GameSession, Turn } from './engine';
import { KEY, menuEntry, menuKeys } from './keys';

/**
 * movecontrol's 0x75 branch on one of the town's building squares: the store, the temple, the
 * bank and the inn, and the menus each of them is played through.
 *
 * The four buildings are g_store (exe 2000:45ab), temple (exe 2000:4d39), bank (exe 2000:568b)
 * and flea_inn (exe 2000:4fe7). What each one does to the character is ported in
 * `src/lib/game/port/town.ts`; what is here is the boxes they put up and the keys they read.
 *
 * Each of them draws a picture of the building behind its menus, and the store draws a different
 * one for each of its three screens. Setting `session.buildingScreen` is what puts one up; the
 * pictures themselves are `building.ts`.
 *
 * The message text is the exact bytes of the game's own strings, read out of the data segment of
 * the unpacked executable. The comment on each say call gives the address of every line it
 * prints, in order; dotu-tools/reference/scripts/exe_strings.py reads them back.
 */

/** g_store's own menu: four things to buy and a fifth entry that leaves. */
const STORE_MENU = menuKeys(5);

/** The weapon and the armor menus, which both offer six. */
const SHELF_MENU = menuKeys(6);

/** The temple's menu: five cures, a needy child and a seventh entry that leaves. */
const TEMPLE_MENU = menuKeys(7);

/** The bank's menu: the money changer, a deposit, a withdrawal, a robbery and the way out. */
const BANK_MENU = menuKeys(5);

/** The inn's offer: stay the night, or run for your life. */
const INN_MENU = menuKeys(2);

/** The six weapons the store sells (exe DS:0ca6), priced in JP rather than in the rubles the
 *  armor menu next to them is priced in. */
const WEAPONS = [
  '1) STICK..........1 JP',
  '2) CLUB..........15 JP',
  '3) MACE.........300 JP',
  '4) KNIFE.........30 JP',
  '5) SHORTSWORD...250 JP',
  '6) LONG SWORD...450 JP',
];

/** The six suits of armor (exe DS:0d68), whose first entry is the skin the player already has. */
const ARMOR = [
  '1) ROBES (USELESS).1 RUBLES',
  '2) LEATHER........50 RUBLES',
  '3) CHAIN.........300 RUBLES',
  '4) SCALE........1500 RUBLES',
  '5) PLATE........4000 RUBLES',
  '6) FIELD PLATE..9900 RUBLES',
];

/**
 * typed_name (exe 4000:55b2) as g_store and bank call it: nine characters drawn between two x's
 * in colour 9, with the lines above them in colour 5.
 */
const TYPED = { x: 0x3a2, to: 0x49c, length: 9, colour: 9 } as const;
const PROMPT_COLOUR = 5;

/** Where g_store draws the lines above a typed amount, and the line the amount is typed on. */
const STORE_PROMPT_Y = [0x329, 0x351, 0x38d, 0x3b5, 0x3dd];
const STORE_TYPED_Y = 0x42d;

/** Where the bank draws the same thing, which is three lines and the last line of the box. */
const BANK_PROMPT_Y = [0x329, 0x35b, 0x38d];
const BANK_TYPED_Y = 0x487;

/**
 * What the game calls the building on a square of the town: 1 the store, 2 the temple, 3 the
 * bank, 4 the inn.
 *
 * The first three name themselves in the message each greets the player with -- UH.BIN 93 "YOU
 * HAVE ENTERED A STORE", 95 "EXIT THE TEMPLE" and 100 "LEAVE BANK" -- and the inn has a name of
 * its own in each module ({@link INN_NAMES}, exe DS:039b).
 */
export function buildingName(module: number, building: number): string {
  if (building === 1) return 'STORE';
  if (building === 2) return 'TEMPLE';
  if (building === 3) return 'BANK';
  return INN_NAMES[module];
}

/**
 * movecontrol's 0x75 branch when the square holds a building: the town is entered, played and
 * left, and no moment passes for any of it.
 */
export async function enterBuilding(turn: Turn): Promise<void> {
  const session = turn.session;
  if (turn.building === 1) await store(session);
  if (turn.building === 2) await visitTheTemple(session);
  if (turn.building === 3) await visitTheBank(session);
  if (turn.building === 4) await stayAtTheInn(session);
  session.buildingScreen = null;
  // erase_menu_block (exe 4000:42b4) and erase_message_block (exe 4000:430e), which movecontrol
  // runs on the way back out to the map.
  session.game.eraseScreen();
  session.box = [];
}

/** g_store (exe 2000:45ab, unf.c "g_store"): the store, until the player leaves it. */
async function store(session: GameSession): Promise<void> {
  const game = session.game;
  for (;;) {
    session.buildingScreen = STORE;
    enterStore(game);
    const chosen = await session.choice(STORE_MENU);
    if (chosen === KEY.escape) return;
    const entry = menuEntry(chosen);
    if (entry === 5) return;
    if (entry === 1) await buyAWeapon(session);
    if (entry === 2) await buyASuitOfArmor(session);
    if (entry === 3) await buyStock(session);
    if (entry === 4) await buyCrystals(session);
  }
}

/**
 * g_store's first entry: the weapon menu, whose prices are written into the text of its lines.
 * A weapon purchase always has something to say afterwards, whether it went through or not.
 */
async function buyAWeapon(session: GameSession): Promise<void> {
  const game = session.game;
  session.buildingScreen = WEAPONRY;
  // DS:0c8e, the six of DS:0ca6, then DS:0d30 with the money after it
  game.say('PLEASE SELECT A WEAPON:', ...WEAPONS, `MONEY ON HAND: ${game.pc.money}`);
  const chosen = await session.choice(SHELF_MENU);
  if (chosen === KEY.escape) return;
  await printMenus(session, () => buyWeapon(game, menuEntry(chosen)));
}

/**
 * g_store's second entry: the armor menu, which is the weapon menu again. A suit of armor that
 * was bought says nothing at all, so the only box to wait on is the refusal.
 */
async function buyASuitOfArmor(session: GameSession): Promise<void> {
  const game = session.game;
  session.buildingScreen = ARMOURY;
  // DS:0d53, the six of DS:0d68, then DS:0d30 with the money after it
  game.say('PLEASE SELECT ARMOR:', ...ARMOR, `MONEY ON HAND: ${game.pc.money}`);
  const chosen = await session.choice(SHELF_MENU);
  if (chosen === KEY.escape) return;
  await printMenus(session, () => buyArmor(game, menuEntry(chosen)));
}

/** g_store's third entry: culture stock, bought by the ruble rather than by the unit. */
async function buyStock(session: GameSession): Promise<void> {
  const game = session.game;
  const price = cultureStockPrice(game);
  // DS:0e10 0e2d 0e49, 0e5e with the price after it, 0e6f 0e87 0ea6, 06f0
  await printMenus(session, () =>
    game.say(
      'CULTURE STOCK HELPS KEEP YOU',
      'YOUNG WHILE YOU ARE RESTING',
      'BETWEEN EXPEDITIONS.',
      `PRICE PER UNIT: ${price}`,
      'THIS PRICE INCREASES AS',
      'YOU GAIN LEVELS, SO YOU SHOULD',
      'STOCK UP WHEN POSSIBLE.',
      '',
    ),
  );
  // DS:0ebe with the money after it, 0e5e with the price after it, 0ed0, 0eea, 0f03
  const rubles = await typedAmount(
    session,
    [
      `MONEY AVAILABLE: ${game.pc.money}`,
      `PRICE PER UNIT: ${price}`,
      'PLEASE TYPE THE NUMBER OF',
      'RUBLES YOU WISH TO SPEND',
      'ON CULTURE STOCK:',
    ].map((text, line) => ({ text, y: STORE_PROMPT_Y[line] })),
    STORE_TYPED_Y,
  );
  await printMenus(session, () => buyCultureStock(game, rubles));
}

/** g_store's fourth entry: magic crystals, which are the same purchase at a different price. */
async function buyCrystals(session: GameSession): Promise<void> {
  const game = session.game;
  const price = magicCrystalPrice(game);
  // DS:0f65 0f84 0fa3, 0e5e with the price after it, 0e6f 0e87 0ea6 0fc1
  await printMenus(session, () =>
    game.say(
      'MAGIC CRYSTALS ARE REQUIRED TO',
      'REGAIN SPELL POINTS. 1 CRYSTAL',
      'IS USED FOR EACH SPELL POINT.',
      `PRICE PER UNIT: ${price}`,
      'THIS PRICE INCREASES AS',
      'YOU GAIN LEVELS, SO YOU SHOULD',
      'STOCK UP WHEN POSSIBLE.',
      "(FIGHTERS CAN'T USE THESE)",
    ),
  );
  // DS:0ebe with the money after it, 0e5e with the price after it, 0ed0, 0fdc, 0ff5
  const rubles = await typedAmount(
    session,
    [
      `MONEY AVAILABLE: ${game.pc.money}`,
      `PRICE PER UNIT: ${price}`,
      'PLEASE TYPE THE NUMBER OF',
      'RUBLES YOU WANT TO SPEND',
      'ON MAGIC CRYSTALS:',
    ].map((text, line) => ({ text, y: STORE_PROMPT_Y[line] })),
    STORE_TYPED_Y,
  );
  await printMenus(session, () => buyMagicCrystals(game, rubles));
}

/**
 * temple (exe 2000:4d39, unf.c "temple"): the temple, until the player leaves it.
 *
 * The money is drawn above the box rather than printed in it, and it is drawn again every time
 * round, so a cure that has just been paid for shows what is left straight away.
 */
async function visitTheTemple(session: GameSession): Promise<void> {
  const game = session.game;
  for (;;) {
    session.buildingScreen = TEMPLE;
    // DS:101a with the money after it
    game.draw({ text: `MONEY WITH YOU: ${game.pc.money}`, x: 0x3a2, y: 0x301, font: 0, colour: 8 });
    enterTemple(game);
    const chosen = await session.choice(TEMPLE_MENU);
    if (chosen === KEY.escape) return;
    const entry = menuEntry(chosen);
    await printMenus(session, () => temple(game, entry));
    if (entry === 7) return;
  }
}

/**
 * bank (exe 2000:568b, unf.c "bank"): the bank, until the player leaves it. It pays no interest
 * and charges nothing; all it does is hold money and change dollars into rubles.
 */
async function visitTheBank(session: GameSession): Promise<void> {
  const game = session.game;
  for (;;) {
    session.buildingScreen = BANK;
    enterBank(game);
    const chosen = await session.choice(BANK_MENU);
    if (chosen === KEY.escape) return;
    const entry = menuEntry(chosen);
    if (entry === 5) return;
    if (entry === 1) await printMenus(session, () => convertDollars(game));
    if (entry === 2) await depositMoney(session);
    if (entry === 3) await withdrawMoney(session);
    if (entry === 4) await printMenus(session, () => robBank(game));
  }
}

/** bank's second entry: a deposit, asked for over what the character is carrying. */
async function depositMoney(session: GameSession): Promise<void> {
  const game = session.game;
  const rubles = await typedAmount(session, bankPrompt(game.pc.money), BANK_TYPED_Y);
  await printMenus(session, () => bankDeposit(game, rubles));
}

/** bank's third entry: a withdrawal, asked for over the balance instead. */
async function withdrawMoney(session: GameSession): Promise<void> {
  const game = session.game;
  const rubles = await typedAmount(session, bankPrompt(game.pc.bank), BANK_TYPED_Y);
  await printMenus(session, () => bankWithdraw(game, rubles));
}

/** The three lines the bank asks for an amount under. */
function bankPrompt(available: number): PromptLine[] {
  // DS:0ebe with the number after it, DS:118a, DS:11a1
  return [
    `MONEY AVAILABLE: ${available}`,
    'PLEASE TYPE THE AMOUNT',
    '  AND HIT ENTER:',
  ].map((text, line) => ({ text, y: BANK_PROMPT_Y[line] }));
}

/**
 * flea_inn (exe 2000:4fe7, unf.c "flea_inn"): the inn, which is one visit and not a loop. The
 * sign, what the night will cost in culture stock and crystals, the room and its price, and then
 * back out to the map whichever way the offer is answered.
 *
 * The night is where a character ages, fills their spell points back up and gains the levels
 * their experience has earned. Nothing is written to the character's file here, which is what
 * the original does too: the inn is not one of its save points.
 */
async function stayAtTheInn(session: GameSession): Promise<void> {
  const game = session.game;
  session.buildingScreen = INN;
  await printMenusEndingInAMenu(session, () => enterInn(game));
  const chosen = await session.choice(INN_MENU);
  if (menuEntry(chosen) === 1) await printMenus(session, () => stayTheNight(game));
}

/** One of the lines a typed amount is asked for under, at the y the game draws it at. */
interface PromptLine {
  text: string;
  y: number;
}

/**
 * typed_name (exe 4000:55b2, unf.c "typed_name") as g_store and bank call it: a number typed a
 * key at a time under `lines`, each character drawn as it is typed and the backspace rubbing the
 * last one out again.
 *
 * Enter finishes and Escape gives up, and both are ignored until at least one character has been
 * typed. Escape leaves the buffer without its terminator, so what the store and the bank read
 * back out of it with atol is the digits that were typed either way.
 *
 * The original draws these lines over the message box, which is somewhere else on the screen in
 * this port, so the box is emptied while they are up.
 */
async function typedAmount(
  session: GameSession,
  lines: PromptLine[],
  y: number,
): Promise<number> {
  const game = session.game;
  session.box = [];
  for (const line of lines) {
    game.draw({ text: line.text, x: TYPED.x, y: line.y, font: 0, colour: PROMPT_COLOUR });
  }
  let typed = '';
  for (;;) {
    const key = await game.key();
    if (typed !== '' && (key === KEY.enter || key === KEY.escape)) break;
    if (key === KEY.backspace) {
      if (typed === '') continue;
      typed = typed.slice(0, -1);
      game.draw({ text: '', x: characterX(typed.length), y, font: 0, colour: 0 });
      continue;
    }
    const character = key < 0 ? '' : typedName(String.fromCharCode(key));
    if (character === '' || typed.length === TYPED.length) continue;
    game.draw({ text: character, x: characterX(typed.length), y, font: 0, colour: TYPED.colour });
    typed += character;
  }
  game.eraseScreen();
  return atol(typed);
}

/** Where the nth typed character goes: typed_name spreads the field out between its two x's. */
function characterX(index: number): number {
  return TYPED.x + Math.trunc(((TYPED.to - TYPED.x) * index) / TYPED.length);
}

/** atol (exe 1000:3cb2): the number at the front of what was typed, and 0 when there is none. */
function atol(typed: string): number {
  const digits = /^ *[+-]?[0-9]*/.exec(typed)?.[0] ?? '';
  return Number.parseInt(digits, 10) || 0;
}
