import { townBuilding } from '../../game/revmap.js';
import { revExperienceForNextLevel } from './advice';
import type { RevMagicDesk } from './desk';
import { revWorkOutSpellPoints } from './fountain';
import { REV_FOUR_SECONDS } from './held';
import { revItemMenu } from './items';
import { revBasicNumber } from './magic';
import { revPlayInnHymn, revPlayTempleMarch } from './music';
import { REV_BANK_DIGITS, revTypeANumber, revTypedDigit } from './number';
import {
  REV_ARMOUR_VALUE,
  REV_UNBANKED_EXPERIENCE_VALUE,
  REV_VALUE,
  revValue,
  setRevValue,
  wearsRingsOfHealth,
} from './record';
import { revClearScreen, revHitAnyKey, revSayKeepingTheCursor } from './screens';
import { revCapHitPoints, revEndPreppedSpells } from './spells';
import { revPrintUsing, revWearingAndWeapons } from './stats';
import { REV_ITEM_TABLE, revSpellsAt } from './tables';
import type { RevGame } from './state';

/**
 * The town's ten squares and the seven routines behind them (1000:10FD, and 1000:132A's
 * `ON building GOTO 1E0A 1F3D 1FCD 22F7 2522 281E 2BB8`).
 *
 * Walking onto one of the ten prints "There's a rope above. Hit U to climb it." (1000:12C6) and
 * U is what climbs it. Every message and every price below is the literal the routine prints or
 * subtracts, read out of DUNSMALL.EXE.
 */

/** What the town asks for, since a building is a conversation rather than one key. */
export interface RevTownDesk {
  /** 1000:2F71: a key, once there is one. */
  key(): Promise<number>;
}

/** The building on a town square, 1 to 7, and 0 for open ground. */
export function revBuildingUnder(column: number, row: number, level: number): number {
  return level === 0 ? townBuilding(column, row) : 0;
}

/** 1000:1DE5 and 1000:1DF2: what an inn asks, and what it says to a character who cannot pay. */
const STAY = 'Do you want to stay (Y or N)?           ';
const THROWN_OUT = ['A gaurd throws you out because you', "   don't have enough money."];
const SLEEPING = 'You are sleeping...';
const ROBBED = 'I think that you were robbed.';
const SICK = ['sick.  You throw up on    ', '   the bed.  I think you should see a   ', '   doctor.   '];

const YES = 'Y'.charCodeAt(0);
const NO = 'N'.charCodeAt(0);
const LEAVE = 'L'.charCodeAt(0);

/** The three inns, in the order `ON building GOTO` lists them. */
const INNS = [
  { line: 'Flea Bag Inn.  A room       will cost 10 jewel pieces.', price: 10, heals: 1, routine: '1000:1E0A' },
  { line: 'Yuppydom Inn.  A suite      will cost 200 jewel pieces.', price: 200, heals: 3, routine: '1000:1F3D' },
  { line: 'Kings Inn.  A grand suite   will cost 6000 jewel pieces.', price: 6000, heals: 0, routine: '1000:1FCD' },
];

/**
 * 1000:1FBD: the line every night ends up on, and the hymn behind it.
 *
 * All three inns call it (1000:1E75, 1FAB and 203B) once the price has been paid, and the
 * robbery roll and the Flea Bag's own sickness roll are both made afterwards, so every night a
 * character can afford hears the tune.
 */
function revSleep(game: RevGame): void {
  game.say(SLEEPING);
  // 1000:1FC9: the hymn, which with the sound off is four seconds of nothing instead.
  revPlayInnHymn(game);
}

/** 1000:1EE2: one night in ten leaves the character with nothing — not the money, and not the
 *  weapons either. */
function maybeRobbed(game: RevGame): void {
  // 1000:1EE5: the ten the roll is against is left in the scratch cell on the way past.
  game.scratch = 10;
  if (game.rng.random(10) !== 1) return;
  const pc = game.pc;
  pc.money = 0;
  setRevValue(pc, REV_VALUE.knife, 0);
  setRevValue(pc, REV_VALUE.sword, 0);
  setRevValue(pc, REV_VALUE.mace, 0);
  setRevValue(pc, REV_VALUE.swordPlus, 0);
  setRevValue(pc, REV_VALUE.macePlus, 0);
  game.say(ROBBED);
  // 1000:1F39.
  game.delay(REV_FOUR_SECONDS);
}

/** 1000:1E0A, 1F3D and 1FCD: a night at one of the three inns. */
export async function revStayAtInn(game: RevGame, which: number, desk: RevTownDesk): Promise<void> {
  const inn = INNS[which];
  const pc = game.pc;
  game.say(inn.line, STAY);
  const answer = await desk.key();
  if (answer === NO) return;
  if (answer !== YES) return;
  if (pc.money < inn.price) {
    game.say(...THROWN_OUT);
    return;
  }
  pc.money -= inn.price;
  if (inn.heals === 0) {
    // 1000:2014: the Kings Inn's own cleric, which is the whole of what the price buys.
    pc.hp = pc.maxHp;
    game.say('A hotel staff cleric heals all of your', '   wounds.');
    revSleep(game);
    // 1000:203E: the wait the inn takes on top of the tune, whichever it was.
    game.delay(REV_FOUR_SECONDS);
  } else {
    pc.hp += inn.heals;
    if (wearsRingsOfHealth(pc)) pc.hp = pc.maxHp;
    // 1000:1E72 and 1FA8: both of the cheap inns put the hit points back down to the maximum
    // before the night, so a character who was already full gains nothing from the point or the
    // three.
    revCapHitPoints(pc);
    revSleep(game);
    // 1000:1FAE: the Yuppydom leaves a twenty in the scratch cell that nothing reads.
    if (which === 1) game.scratch = 20;
    maybeRobbed(game);
    // 1000:1E7B: the Flea Bag's own second roll, which the two better inns do not make.
    if (which === 0 && game.rng.random(10) === 1) {
      pc.stats[3] -= 1;
      setRevValue(pc, REV_VALUE.disease, 1);
      game.say(...SICK);
      // 1000:1ED0 and 1ED3: the wait twice over, so this is the longest the game holds anything.
      game.delay(REV_FOUR_SECONDS);
      game.delay(REV_FOUR_SECONDS);
    }
  }
  // 1000:1E92, 1EDF, 1FBA and 2041: all four ways a night can go end in the same place, the
  // robbed night and the sick one included.
  revNightsExperience(game);
}

/**
 * 1000:2094: what a night at an inn is really for.
 *
 * A kill puts its experience in a pot of its own (record value 21) and the character sheet
 * prints only the banked number, so nothing in the dungeon ever moves it. Here the two together
 * buy a level for every threshold they are past, and then the pot is folded into the banked
 * number and emptied — which is why the sheet does not show a kill's experience until its
 * killer has slept somewhere.
 */
function revNightsExperience(game: RevGame): void {
  const pc = game.pc;
  for (;;) {
    const earned = pc.experience + revValue(pc, REV_UNBANKED_EXPERIENCE_VALUE);
    if (earned <= revExperienceForNextLevel(pc.level)) break;
    revGainALevel(game);
  }
  // 1000:20EB: the spell points are worked out again from the level the night has left.
  revWorkOutSpellPoints(game);
  pc.experience = Math.floor(pc.experience + revValue(pc, REV_UNBANKED_EXPERIENCE_VALUE));
  setRevValue(pc, REV_UNBANKED_EXPERIENCE_VALUE, 0);
  // 1000:210F: a night in a bed is where the two prep spells wear off.
  revEndPreppedSpells(game);
}

/**
 * DGROUP B494, built at 1000:0231: the words three of the four buildings turn a purchase down
 * with. What follows the money is each building's own.
 */
const NOT_ENOUGH_MONEY = 'You do not have enough money';

/** 1000:25FA and 28EB: the last line of three of the menus. */
const LEAVE_LINE = 'L = Leave';

/** 1000:27BD: the line the temple and the store both print the money with. */
const JEWEL_PIECES_WITH_CHARACTER = 'Jewel pieces with character: #########';

/**
 * A menu's key wait (1000:23E7, 2614, 28F7, 2C16, 2C67, 2D60 and 2E05).
 *
 * A key none of the menu's branches answer falls off the end of the chain and jumps back to the
 * wait rather than to the printing above it, so the menu is on the screen once however many keys
 * are pressed at it.
 */
async function menuKey(desk: RevTownDesk, answers: (key: number) => boolean): Promise<number> {
  for (;;) {
    const key = await desk.key();
    if (answers(key)) return key;
  }
}

/**
 * 1000:22F7's own lines.
 *
 * `a$` (DGROUP B45E) is CHR$(13), which the run-time takes as a line break, so a line printed
 * with one after it has a blank row under it; that is what the empty strings here are.
 */
const BANK_FOR_SALE = 'A sign says: Bank for sale, ';
const BANK_PRICE = '   5,000,000 JP.  Heh heh heh.';
const BANK_OPENS = ['You are in the bank. Your treasure has', '   been exchanged for jewelry.', ''];
const BANK_HOLDS = 'Jewel pieces in the bank:   #########';
const POCKET_HOLDS = 'Jewel pieces in your pocket:#########';
const BANK_KEYS = ["Hit `D' to deposit jewelry, `W' to", "   withdraw jewelry, and `L' to leave.", ''];
const DEPOSIT_PROMPT = ['Type the amount that you wish to deposit', '   and hit return:'];
const WITHDRAW_PROMPT = 'Type the amount  of the  withdrawal  and   hit return:';

const DEPOSIT = 'D'.charCodeAt(0);
const WITHDRAW = 'W'.charCodeAt(0);

/** 1000:2325: what the weight comes back to, which is the armour and the character themselves. */
const POUNDS_PER_SUIT = 25;
const POUNDS_OF_CHARACTER = 150;

/**
 * 1000:22F7: the bank.
 *
 * Walking in exchanges whatever treasure is being carried for jewel pieces and recomputes the
 * weight from the armour worn, which is what makes the bank worth the walk: a character loaded
 * with coins is heard by every monster on the level.
 *
 * The sign is up only for the character who owns the town, since the bank is what they would be
 * selling. The screen is cleared once on the way in (1000:2358) and again after every deposit
 * and every withdrawal, and what comes back is the loop head alone (1000:23AB) — the two jewel
 * lines and the three keys, without the sign or the sentence about the treasure.
 */
export async function revVisitBank(game: RevGame, desk: RevTownDesk): Promise<void> {
  const pc = game.pc;
  game.flushKeys();
  pc.money += pc.treasure;
  pc.treasure = 0;
  pc.weight = POUNDS_PER_SUIT * revValue(pc, REV_ARMOUR_VALUE) + POUNDS_OF_CHARACTER;
  revClearScreen(game);
  if (revValue(pc, REV_VALUE.town) === 1) game.say(`${BANK_FOR_SALE}${game.name}`, BANK_PRICE, '');
  game.say(...BANK_OPENS);
  for (;;) {
    game.say(revPrintUsing(BANK_HOLDS, pc.bank), revPrintUsing(POCKET_HOLDS, pc.money), ...BANK_KEYS);
    const key = await menuKey(desk, (typed) => typed === DEPOSIT || typed === WITHDRAW || typed === LEAVE);
    if (key === LEAVE) return;
    if (key === WITHDRAW) {
      revSayKeepingTheCursor(game, WITHDRAW_PROMPT);
      const amount = await revTypeANumber(game, desk, REV_BANK_DIGITS);
      // 1000:2479: asking for more than is banked takes all of it rather than being refused.
      if (amount > pc.bank) {
        pc.money += pc.bank;
        pc.bank = 0;
      } else {
        pc.bank -= amount;
        pc.money += amount;
      }
    } else {
      game.say(DEPOSIT_PROMPT[0]);
      revSayKeepingTheCursor(game, DEPOSIT_PROMPT[1]);
      const amount = await revTypeANumber(game, desk, REV_BANK_DIGITS);
      // 1000:24D5: and offering more than is carried banks all of it.
      if (amount > pc.money) {
        pc.bank += pc.money;
        pc.money = 0;
      } else {
        pc.money -= amount;
        pc.bank += amount;
      }
    }
    // 1000:2493, 24C0, 24EF and 251C: all four ways through clear the screen on the way back.
    revClearScreen(game);
  }
}

/**
 * 1000:2522's own lines, and the five prices its `ON spell GOTO` subtracts.
 *
 * The march is played after the second line (1000:2543), which ends with a semicolon, so the
 * cursor is still on that row while the temple is heard and the third line carries on along it.
 */
const TEMPLE_OPENS = 'A man in robes says, `Welcome to the';
const TEMPLE_ROBES = '   temple.';
const TEMPLE_ASKS = [
  '  Do you wish to purchase',
  "   a spell?'  You can hear many coins",
  '   jingling in his robes.',
  '',
];
const TEMPLE_HEALTH = 'Your health points: ';
const WHICH_SPELL = 'Which spell?';
const ANOTHER_SPELL = 'Another spell?';
const TEMPLE_MENU = [
  '',
  '1) Cure wounds: 75 JP',
  '2) Heal all wounds: 1000 JP',
  '3) Cure disease: 400 JP',
  '4) Remove poison: 20000 JP',
  '5) Gain level: 500000 JP',
];
const TEMPLE_PRICES = [75, 1000, 400, 20000, 500000];
const NO_DIFFERENCE = "You don't feel any different.";
const THROWN_OUT_OF_THE_TEMPLE = [`${NOT_ENOUGH_MONEY}. The good`, '   cleric throws you out.'];

/** Values 145 and 146, the fifth and sixth of the two hundred singles at DGROUP 1B92: the
 *  disease and the poison the temple's third and fourth spells clear. */
const POISONED_VALUE = 145;

/**
 * 1000:2044: a level gained, which the temple's fifth spell buys outright and a night at an inn
 * hands out for the experience the character has earned.
 */
export function revGainALevel(game: RevGame): void {
  const pc = game.pc;
  pc.level += 1;
  // 1000:2054 to 206D: the hit points are the roll, the character's own health bonus and a flat
  // one, and the flat one is the constant the level was raised by two instructions earlier —
  // 1000:206B loads the address of the 1 again, not the address of the level.
  const gained = game.rng.random(15) + pc.fromHealth + 1;
  // 1000:2070: the gain is left in the scratch cell (`attack.ts` says what that cell is for).
  game.scratch = gained;
  pc.maxHp += gained;
  pc.hp += gained;
  game.events.push({ kind: 'levelGained', level: pc.level });
}

/**
 * 1000:2671 to 27B7: what each of the five spells does to the character, and what it says
 * afterwards.
 *
 * The money is gone before any of this runs, which is why the two cures charge for finding
 * nothing to cure.
 */
function castTempleSpell(game: RevGame, spell: number): string {
  const pc = game.pc;
  if (spell === 1) {
    pc.hp += game.rng.random(8) + 4;
    // 1000:26AD: the clamp, so the cure never leaves a character over their maximum.
    revCapHitPoints(pc);
    return 'You feel very good.';
  }
  if (spell === 2) {
    pc.hp = pc.maxHp;
    return 'You feel perfect.';
  }
  if (spell === 3) {
    // 1000:271E and 2763: nothing to cure and the words are the only thing the money buys.
    if (revValue(pc, REV_VALUE.disease) === 0) return NO_DIFFERENCE;
    setRevValue(pc, REV_VALUE.disease, 0);
    return "You don't feel sick anymore.";
  }
  if (spell === 4) {
    if (revValue(pc, POISONED_VALUE) === 0) return NO_DIFFERENCE;
    setRevValue(pc, POISONED_VALUE, 0);
    return 'The poison is gone.';
  }
  revGainALevel(game);
  return 'You feel EXTREMELY good.';
}

/**
 * 1000:2522: the temple's five spells, on a screen of their own.
 *
 * Every purchase clears the screen, prints its one line and comes back to the head of the menu
 * (1000:2570), so what is on the screen afterwards is that line and the menu under it. The
 * question at the top of the menu is `Which spell?` the first time and `Another spell?` on every
 * pass after it, which is DGROUP B5B0 — set as the menu is printed and put back to zero on both
 * ways out.
 */
export async function revVisitTemple(game: RevGame, desk: RevTownDesk): Promise<void> {
  const pc = game.pc;
  game.flushKeys();
  revClearScreen(game);
  game.say(TEMPLE_OPENS);
  revSayKeepingTheCursor(game, TEMPLE_ROBES);
  revPlayTempleMarch(game);
  game.say(...TEMPLE_ASKS);
  let asked = false;
  for (;;) {
    game.say(
      '',
      revPrintUsing(JEWEL_PIECES_WITH_CHARACTER, pc.money),
      `${TEMPLE_HEALTH}${revBasicNumber(pc.hp)}of${revBasicNumber(pc.maxHp)}`,
      asked ? ANOTHER_SPELL : WHICH_SPELL,
      ...TEMPLE_MENU,
      LEAVE_LINE,
    );
    asked = true;
    const key = await menuKey(desk, (typed) => typed === LEAVE || (revTypedDigit(typed) >= 1 && revTypedDigit(typed) <= TEMPLE_PRICES.length));
    if (key === LEAVE) return;
    const spell = revTypedDigit(key);
    if (pc.money < TEMPLE_PRICES[spell - 1]) {
      game.say(...THROWN_OUT_OF_THE_TEMPLE);
      // 1000:27F4, and then the screen is cleared on the way out.
      game.delay(REV_FOUR_SECONDS);
      revClearScreen(game);
      return;
    }
    pc.money -= TEMPLE_PRICES[spell - 1];
    const said = castTempleSpell(game, spell);
    revClearScreen(game);
    game.say(said);
  }
}

/** 1000:281E: what the store sells, in the order its `ON GOTO` lists it. */
interface RevGoods {
  line: string;
  price: number;
  /** The record value the purchase sets, or null for the armour, which is one number 1 to 4. */
  owned: number | null;
  /** Which armour it is, 1 to 4, for the four suits. */
  armour: number;
}

const STORE_GOODS: RevGoods[] = [
  { line: '1) Knife:  10 JP', price: 10, owned: REV_VALUE.knife, armour: 0 },
  { line: '2) Mace:  200 JP', price: 200, owned: REV_VALUE.mace, armour: 0 },
  { line: '3) Sword:  200 JP', price: 200, owned: REV_VALUE.sword, armour: 0 },
  { line: '4) Leather armor: 200 JP', price: 200, owned: null, armour: 1 },
  { line: '5) Chain armor: 500 JP', price: 500, owned: null, armour: 2 },
  { line: '6) Plate armor: 3000 JP', price: 3000, owned: null, armour: 3 },
  { line: '7) Field plate armor: 10000 JP', price: 10000, owned: null, armour: 4 },
];

const STORE_OPENS = 'You are in the store.';
const WHICH_WOULD_YOU_LIKE = '   Which would you like to buy?';
const THE_TOWN_LINE = '8) The Town: 1000000 JP';
const STORE_JOKE = "I'm also selling the Brooklyn bridge,      want to it, too?";
const CANNOT_AFFORD_IT = `${NOT_ENOUGH_MONEY}.`;
const ALREADY_HAVE = 'You already have that weapon.';
const DONT_NEED = "You don't need that anymore.";
const NOT_FOR_A_WIZARD = ["You can't use that because you are a", '   magic user.'];

/** 1000:2B48 and 28CA: what the town costs, and how rich a character has to look before it is
 *  offered at all. */
const TOWN_PRICE = 1000000;
const TOWN_OFFERED_OVER = 99999;

/** The line the town is on, which is the one line the seven-target jump table has no entry
 *  for. */
const THE_TOWN = 8;

/**
 * 1000:281E: the store.
 *
 * Its eighth line offers the town for a million, and is printed only while the character does
 * not own it and their pocket and their bank together are over 99,999 — so it appears out of
 * nowhere once a character has done well, and goes away for good when they buy it. All the town
 * buys is a joke, the bank's sign and the line going away.
 *
 * A suit of armour is refused only to a character who already wears that one or a better one —
 * the four branches test `armour <= the suit's own number - 1` (1000:2A76, 2AAC, 2AE2, 2B18) —
 * so a character with the money can buy field plate on the first day and never own the other
 * three.
 *
 * Every purchase and every refusal comes back to the top (1000:281E), which clears the screen
 * and prints the lot again, so what a character owns and what they are wearing is right in front
 * of them.
 */
export async function revVisitStore(game: RevGame, desk: RevTownDesk): Promise<void> {
  const pc = game.pc;
  for (;;) {
    game.flushKeys();
    revClearScreen(game);
    const townForSale = revValue(pc, REV_VALUE.town) === 0 && pc.money + pc.bank > TOWN_OFFERED_OVER;
    game.say(
      STORE_OPENS,
      ...revWearingAndWeapons(pc),
      '',
      revPrintUsing(JEWEL_PIECES_WITH_CHARACTER, pc.money),
      WHICH_WOULD_YOU_LIKE,
      '',
      ...STORE_GOODS.map((goods) => goods.line),
      ...(townForSale ? [THE_TOWN_LINE] : []),
      LEAVE_LINE,
    );
    const key = await menuKey(desk, (typed) => {
      const line = revTypedDigit(typed);
      return typed === LEAVE || (line >= 1 && line <= STORE_GOODS.length) || (line === THE_TOWN && townForSale);
    });
    if (key === LEAVE) return;
    const line = revTypedDigit(key);
    if (line === THE_TOWN) {
      if (pc.money < TOWN_PRICE) {
        game.say(CANNOT_AFFORD_IT);
        game.delay(REV_FOUR_SECONDS);
        continue;
      }
      pc.money -= TOWN_PRICE;
      game.say(STORE_JOKE);
      setRevValue(pc, REV_VALUE.town, 1);
      // 1000:2B79: the one purchase the store waits at before it puts the player back outside.
      await revHitAnyKey(game, desk);
      return;
    }
    const goods = STORE_GOODS[line - 1];
    // 1000:2974: a wizard is refused every line but the first, which is the knife — the only
    // weapon `F1.COM` says a wizard can use.
    if (line > 1 && pc.cls !== 1) {
      game.say(...NOT_FOR_A_WIZARD);
      // 1000:29B3.
      game.delay(REV_FOUR_SECONDS);
      continue;
    }
    if (goods.owned !== null && revValue(pc, goods.owned) === 1) {
      game.say(ALREADY_HAVE);
      // 1000:2BB2, which all three of the store's refusals fall into.
      game.delay(REV_FOUR_SECONDS);
      continue;
    }
    if (goods.owned === null && revValue(pc, REV_ARMOUR_VALUE) >= goods.armour) {
      game.say(DONT_NEED);
      game.delay(REV_FOUR_SECONDS);
      continue;
    }
    if (pc.money < goods.price) {
      // 1000:2B7F, which every line of the store falls into when the money is short.
      game.say(CANNOT_AFFORD_IT);
      game.delay(REV_FOUR_SECONDS);
      continue;
    }
    pc.money -= goods.price;
    if (goods.owned !== null) setRevValue(pc, goods.owned, 1);
    else setRevValue(pc, REV_ARMOUR_VALUE, goods.armour);
  }
}

/**
 * 1000:2BB8's own lines, with the blank rows the two `a$`s leave in them (1000:2BCA and 2BEA).
 */
const GUILD_OPENS = [
  "You are in the wizard's guild.",
  '',
  'You may find out what the various spells',
  '   and magic items do.',
  '',
  '1-SPELLS',
  '2-MAGIC ITEMS',
  "L-LEAVE WIZARD'S GUILD",
];

/** 1000:2D57: what the guild asks before it reads a spell level. */
const SPELL_LEVEL_PROMPT = 'Type the spell level (1-6): ';

/** 1000:2DAE: what one level of spells costs, `INT(level ^ 1.75 * 220)`. */
export function revSpellLevelPrice(level: number): number {
  return Math.trunc(level ** 1.75 * 220);
}

/** What the magic-item list costs (the literal at 1000:2C38). */
export const REV_MAGIC_ITEM_LIST_PRICE = 800;

/** 1000:2C38: what the guild says before it charges for one. */
const ITEM_LIST_PRICE = 'This will cost you 800 JP.';

/** 1000:2DC9 and 2DD4: what it says a level of spells will cost. */
const SPELLS_COST = 'That will cost you';
const JEWEL_PIECES = 'JP.';

/** The two sets the guild will talk about, and how deep its levels go. */
const SPELL_LEVELS = 6;

/** 1000:2C52 and 1000:2DF0: what the guild asks once it has been paid. */
const GUILD_ITEM_SETS = ['P=Prep items (used while not fighting)', 'B=Battle items   L=Leave'];
const GUILD_SPELL_SETS = ['P=Prep spells (used while not fighting)', 'B=Battle spells   L=Leave'];

/** 1000:2EF3: what it says to a character who cannot pay. */
const CANNOT_PAY = [`${NOT_ENOUGH_MONEY}. You find`, '   yourself floating out of the guild...'];

const PREP = 'P'.charCodeAt(0);
const BATTLE = 'B'.charCodeAt(0);
const SPELLS = '1'.charCodeAt(0);
const MAGIC_ITEMS = '2'.charCodeAt(0);

/**
 * 1000:2BB8: the wizard's guild, which sells what things do rather than the things.
 *
 * Everything it reads out is the text of `F1.COM` and `F2.COM`. A level of spells costs
 * `INT(level ^ 1.75 * 220)` and the list of what one magic item does costs a flat 800, and both
 * are charged only where something was actually read out.
 *
 * The screen is cleared and the opening printed again for every question the guild is asked, and
 * `L` at any of its prompts is the way out of the whole building rather than back a step.
 */
export async function revVisitGuild(game: RevGame, desk: RevTownDesk, magic: RevMagicDesk): Promise<void> {
  const pc = game.pc;
  for (;;) {
    revClearScreen(game);
    game.flushKeys();
    game.say(...GUILD_OPENS);
    const key = await menuKey(desk, (typed) => typed === LEAVE || typed === SPELLS || typed === MAGIC_ITEMS);
    if (key === LEAVE) return;
    if (key === MAGIC_ITEMS) {
      game.say(ITEM_LIST_PRICE);
      if (pc.money < REV_MAGIC_ITEM_LIST_PRICE) {
        await floatOutOfTheGuild(game);
        return;
      }
      if (await readOutAnItem(game, desk, magic)) return;
      continue;
    }
    if (await readOutASpell(game, desk)) return;
  }
}

/** 1000:2EF3 and 2F14: neither price can be met, so the guild says so and puts the character
 *  back outside four seconds later. */
async function floatOutOfTheGuild(game: RevGame): Promise<void> {
  game.say(...CANNOT_PAY);
  game.delay(REV_FOUR_SECONDS);
}

/**
 * 1000:2C4F: the guild runs one of the two item menus and reads out what the chosen item does.
 *
 * Says whether the character has left the guild, which `L` at either prompt does.
 */
async function readOutAnItem(game: RevGame, desk: RevTownDesk, magic: RevMagicDesk): Promise<boolean> {
  game.say(...GUILD_ITEM_SETS);
  const key = await menuKey(desk, (typed) => typed === LEAVE || typed === PREP || typed === BATTLE);
  if (key === LEAVE) return true;
  const which = key === PREP ? 'prep' : 'battle';
  // 1000:2C8F and 2CF6: the menu goes on a screen of its own.
  revClearScreen(game);
  // 1000:2C86: it puts one of the game's own item menus up with the fight prompt's flag set, so
  // it has "L = LEAVE" on the bottom -- and so the guild will only talk about an item the
  // character already owns, since that menu turns a line they have none of into nothing chosen.
  const item = await revItemMenu(game, magic, which, true);
  if (item === 0) return false;
  game.pc.money -= REV_MAGIC_ITEM_LIST_PRICE;
  // 1000:2CBF and 2D23: and the sentence goes on a screen of its own as well.
  revClearScreen(game);
  const text = which === 'prep' ? REV_ITEM_TABLE.prepText : REV_ITEM_TABLE.battleText;
  game.say(text[item - 1] ?? '');
  // 1000:2CD9 and 2D40: a plain key, with nothing on the screen to say one is wanted.
  await desk.key();
  return false;
}

/** 1000:2D54: the two sentences a level of spells buys, and the level it is asked for first. */
async function readOutASpell(game: RevGame, desk: RevTownDesk): Promise<boolean> {
  const pc = game.pc;
  revSayKeepingTheCursor(game, SPELL_LEVEL_PROMPT);
  // 1000:2D60: the level is one key rather than a typed line, so `L` and every other letter read
  // as a 0 and ask again.
  const key = await menuKey(desk, (typed) => typed === LEAVE || (revTypedDigit(typed) >= 1 && revTypedDigit(typed) <= SPELL_LEVELS));
  if (key === LEAVE) return true;
  const level = revTypedDigit(key);
  // DGROUP B5B2, which the wands that cast a spell for nothing read back (1000:9555).
  game.spellLevel = level;
  // 1000:2DA0: the level is printed where the prompt left the cursor, which is the only echo the
  // guild gives.
  game.say(revBasicNumber(level));
  const price = revSpellLevelPrice(level);
  game.say(`${SPELLS_COST}${revBasicNumber(price)}${JEWEL_PIECES}`);
  if (price > pc.money) {
    await floatOutOfTheGuild(game);
    return true;
  }
  game.say(...GUILD_SPELL_SETS);
  const set = await menuKey(desk, (typed) => typed === LEAVE || typed === PREP || typed === BATTLE);
  if (set === LEAVE) return true;
  const which = set === PREP ? 'prep' : 'battle';
  const spells = revSpellsAt(level, which);
  game.say(
    which === 'prep' ? 'PREP SPELLS' : 'BATTLE SPELLS',
    '',
    spells[0]?.text ?? '',
    '',
    spells[1]?.text ?? '',
  );
  pc.money -= price;
  // 1000:2E7D and 2EEA.
  await revHitAnyKey(game, desk);
  return false;
}
