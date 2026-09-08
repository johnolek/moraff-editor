import { townBuilding } from '../../game/revmap.js';
import { REV_ARMOUR_VALUE, REV_VALUE, revValue, setRevValue } from './record';
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
  /** 1000:21F3: a number typed and ended with return, or null for nothing typed. */
  number(prompt: string[]): Promise<number | null>;
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

/** Value 144, the fourth of the two hundred singles at DGROUP 1B92, which the Flea Bag Inn sets
 *  when the room makes the character ill (1000:1ED6). */
const DISEASED_VALUE = 144;

const YES = 'Y'.charCodeAt(0);
const NO = 'N'.charCodeAt(0);
const LEAVE = 'L'.charCodeAt(0);

/** The three inns, in the order `ON building GOTO` lists them. */
const INNS = [
  { line: 'Flea Bag Inn.  A room       will cost 10 jewel pieces.', price: 10, heals: 1, routine: '1000:1E0A' },
  { line: 'Yuppydom Inn.  A suite      will cost 200 jewel pieces.', price: 200, heals: 3, routine: '1000:1F3D' },
  { line: 'Kings Inn.  A grand suite   will cost 6000 jewel pieces.', price: 6000, heals: 0, routine: '1000:1FCD' },
];

/** 1000:1EE2: one night in ten leaves the character with nothing — not the money, and not the
 *  weapons either. */
function maybeRobbed(game: RevGame): void {
  if (game.rng.random(10) !== 1) return;
  const pc = game.pc;
  pc.money = 0;
  setRevValue(pc, REV_VALUE.knife, 0);
  setRevValue(pc, REV_VALUE.sword, 0);
  setRevValue(pc, REV_VALUE.mace, 0);
  setRevValue(pc, REV_VALUE.swordPlus, 0);
  setRevValue(pc, REV_VALUE.macePlus, 0);
  game.say(ROBBED);
}

/** Whether the character wears the rings of health, which heal in full at the two cheaper inns
 *  (`CINT(B558) AND 1`, 1000:1E5C and 1000:1F92). */
function wearsRings(game: RevGame): boolean {
  return (Math.round(game.pc.rings) & 1) !== 0;
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
    game.say(SLEEPING, 'A hotel staff cleric heals all of your', '   wounds.');
    return;
  }
  pc.hp += inn.heals;
  if (wearsRings(game)) pc.hp = pc.maxHp;
  game.say(SLEEPING);
  maybeRobbed(game);
  // 1000:1E7B: the Flea Bag's own second roll, which the two better inns do not make.
  if (which === 0 && game.rng.random(10) === 1) {
    pc.stats[3] -= 1;
    setRevValue(pc, DISEASED_VALUE, 1);
    game.say(...SICK);
  }
}

/** 1000:22F7's own lines. */
const BANK_SIGN = ['A sign says: Bank for sale, ', '   5,000,000 JP.  Heh heh heh.'];
const BANK_OPENS = ['You are in the bank. Your treasure has', '   been exchanged for jewelry.'];
const BANK_KEYS = ["Hit `D' to deposit jewelry, `W' to", "   withdraw jewelry, and `L' to leave."];
const DEPOSIT_PROMPT = ['Type the amount that you wish to deposit', '   and hit return:'];
const WITHDRAW_PROMPT = ['Type the amount  of the  withdrawal  and   hit return:'];

const DEPOSIT = 'D'.charCodeAt(0);
const WITHDRAW = 'W'.charCodeAt(0);

/**
 * 1000:22F7: the bank.
 *
 * Walking in exchanges whatever treasure is being carried for jewel pieces and recomputes the
 * weight from the armour worn, which is what makes the bank worth the walk: a character loaded
 * with coins is heard by every monster on the level.
 */
export async function revVisitBank(game: RevGame, desk: RevTownDesk): Promise<void> {
  const pc = game.pc;
  pc.money += pc.treasure;
  pc.treasure = 0;
  pc.weight = 25 * revValue(pc, REV_ARMOUR_VALUE) + 150;
  for (;;) {
    game.say(
      ...BANK_SIGN,
      ...BANK_OPENS,
      `Jewel pieces in the bank:   ${Math.trunc(pc.bank)}`,
      `Jewel pieces in your pocket:${Math.trunc(pc.money)}`,
      ...BANK_KEYS,
    );
    const key = await desk.key();
    if (key === LEAVE) return;
    if (key === DEPOSIT) {
      const amount = await desk.number(DEPOSIT_PROMPT);
      if (amount !== null && amount > 0 && amount <= pc.money) {
        pc.money -= amount;
        pc.bank += amount;
      }
    } else if (key === WITHDRAW) {
      const amount = await desk.number(WITHDRAW_PROMPT);
      if (amount !== null && amount > 0 && amount <= pc.bank) {
        pc.bank -= amount;
        pc.money += amount;
      }
    }
  }
}

/** 1000:2522's own lines, and the five prices its `ON spell GOTO` subtracts. */
const TEMPLE_OPENS = [
  'A man in robes says, `Welcome to the',
  '   temple.',
  '  Do you wish to purchase',
  "   a spell?'  You can hear many coins",
  '   jingling in his robes.',
];
const TEMPLE_MENU = [
  'Which spell?',
  '1) Cure wounds: 75 JP',
  '2) Heal all wounds: 1000 JP',
  '3) Cure disease: 400 JP',
  '4) Remove poison: 20000 JP',
  '5) Gain level: 500000 JP',
  'L = Leave',
];
const TEMPLE_PRICES = [75, 1000, 400, 20000, 500000];
const NO_DIFFERENCE = "You don't feel any different.";

/** Values 145 and 146, the fifth and sixth of the two hundred singles at DGROUP 1B92: the
 *  disease and the poison the temple's third and fourth spells clear. */
const POISONED_VALUE = 145;

/**
 * 1000:2044: a level gained. It is the temple's fifth spell and nothing else in the game reaches
 * it — no amount of experience gains a level on its own.
 */
export function revGainALevel(game: RevGame): void {
  const pc = game.pc;
  pc.level += 1;
  const gained = game.rng.random(15) + pc.fromHealth + pc.level;
  pc.maxHp += gained;
  pc.hp += gained;
  game.events.push({ kind: 'levelGained', level: pc.level });
}

/** 1000:2522: the temple's five spells. */
export async function revVisitTemple(game: RevGame, desk: RevTownDesk): Promise<void> {
  const pc = game.pc;
  game.say(...TEMPLE_OPENS);
  for (;;) {
    game.say(`Your health points: ${Math.trunc(pc.hp)} of ${Math.trunc(pc.maxHp)}`, ...TEMPLE_MENU);
    const key = await desk.key();
    if (key === LEAVE) return;
    const spell = key - '1'.charCodeAt(0);
    if (spell < 0 || spell >= TEMPLE_PRICES.length) continue;
    if (pc.money < TEMPLE_PRICES[spell]) {
      game.say(`Jewel pieces with character: ${Math.trunc(pc.money)}`, '. The good', '   cleric throws you out.');
      return;
    }
    pc.money -= TEMPLE_PRICES[spell];
    if (spell === 0) {
      pc.hp += game.rng.random(8) + 4;
      game.say(NO_DIFFERENCE);
    } else if (spell === 1) {
      pc.hp = pc.maxHp;
      game.say('You feel perfect.');
    } else if (spell === 2) {
      setRevValue(pc, DISEASED_VALUE, 0);
      game.say("You don't feel sick anymore.");
    } else if (spell === 3) {
      setRevValue(pc, POISONED_VALUE, 0);
      game.say('The poison is gone.');
    } else {
      game.say('You feel EXTREMELY good.');
      revGainALevel(game);
    }
    game.say('Another spell?');
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

const STORE_JOKE = ["I'm also selling the Brooklyn bridge,      want to it, too?"];
const ALREADY_HAVE = 'You already have that weapon.';
const DONT_NEED = "You don't need that anymore.";

/**
 * 1000:281E: the store.
 *
 * Its eighth line offers the town for a million and falls past the seven-target jump table to the
 * joke at 1000:2B67, so the town is never for sale however much money is in the purse.
 */
export async function revVisitStore(game: RevGame, desk: RevTownDesk): Promise<void> {
  const pc = game.pc;
  for (;;) {
    game.say(
      'You are in the store.',
      '   Which would you like to buy?',
      ...STORE_GOODS.map((goods) => goods.line),
      '8) The Town: 1000000 JP',
      'L = Leave',
    );
    const key = await desk.key();
    if (key === LEAVE) return;
    const line = key - '1'.charCodeAt(0);
    if (line === 7) {
      game.say(...STORE_JOKE);
      continue;
    }
    const goods = STORE_GOODS[line];
    if (!goods) continue;
    if (goods.owned !== null && revValue(pc, goods.owned) === 1) {
      game.say(ALREADY_HAVE);
      continue;
    }
    if (goods.owned === null && revValue(pc, REV_ARMOUR_VALUE) >= goods.armour) {
      game.say(DONT_NEED);
      continue;
    }
    if (pc.money < goods.price) continue;
    pc.money -= goods.price;
    if (goods.owned !== null) setRevValue(pc, goods.owned, 1);
    else setRevValue(pc, REV_ARMOUR_VALUE, goods.armour);
  }
}

/** 1000:2BB8's own lines. */
const GUILD_OPENS = [
  "You are in the wizard's guild.",
  'You may find out what the various spells',
  '   and magic items do.',
  '1-SPELLS',
  '2-MAGIC ITEMS',
  "L-LEAVE WIZARD'S GUILD",
];

/** 1000:2DAE: what one level of spells costs, `INT(level ^ 1.75 * 220)`. */
export function revSpellLevelPrice(level: number): number {
  return Math.trunc(level ** 1.75 * 220);
}

/** What the magic-item list costs (the literal at 1000:2C38). */
export const REV_MAGIC_ITEM_LIST_PRICE = 800;

/**
 * 1000:2BB8: the wizard's guild, which sells what things do rather than the things.
 *
 * What it sells is the text of `F1.COM` and `F2.COM`, which this port does not show — the spells
 * and the magic items are not built. The prices are charged and the guild says so, which is the
 * whole of what the transaction does to the character.
 */
export async function revVisitGuild(game: RevGame, desk: RevTownDesk): Promise<void> {
  const pc = game.pc;
  for (;;) {
    game.say(...GUILD_OPENS);
    const key = await desk.key();
    if (key === LEAVE) return;
    if (key === '2'.charCodeAt(0)) {
      game.say('This will cost you 800 JP.');
      if (pc.money >= REV_MAGIC_ITEM_LIST_PRICE) pc.money -= REV_MAGIC_ITEM_LIST_PRICE;
      game.say(...REV_GUILD_NOT_BUILT);
      continue;
    }
    if (key !== '1'.charCodeAt(0)) continue;
    const level = await desk.number(['Type the spell level (1-6): ']);
    if (level === null || level < 1 || level > 6) continue;
    const price = revSpellLevelPrice(level);
    game.say(`That will cost you ${price} JP.`);
    if (pc.money >= price) pc.money -= price;
    game.say(...REV_GUILD_NOT_BUILT);
  }
}

/** What the guild says in place of the pages of `F1.COM` and `F2.COM` it would have shown. */
export const REV_GUILD_NOT_BUILT = [
  'NOT BUILT YET: the guild reads out what',
  '   the spells and the magic items do.',
];
