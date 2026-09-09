import { townBuilding } from '../../game/revmap.js';
import { revExperienceForNextLevel } from './advice';
import type { RevMagicDesk } from './desk';
import { revWorkOutSpellPoints } from './fountain';
import { REV_FOUR_SECONDS } from './held';
import { revItemMenu } from './items';
import { revPlayInnHymn, revPlayTempleMarch } from './music';
import {
  REV_ARMOUR_VALUE,
  REV_UNBANKED_EXPERIENCE_VALUE,
  REV_VALUE,
  revValue,
  setRevValue,
  wearsRingsOfHealth,
} from './record';
import { revEndPreppedSpells } from './spells';
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

/**
 * 1000:2522's own lines, and the five prices its `ON spell GOTO` subtracts. The march is played
 * between the two halves (1000:2543), so the temple is heard before it makes its offer.
 */
const TEMPLE_OPENS = ['A man in robes says, `Welcome to the', '   temple.'];
const TEMPLE_ASKS = [
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

/** 1000:2522: the temple's five spells. */
export async function revVisitTemple(game: RevGame, desk: RevTownDesk): Promise<void> {
  const pc = game.pc;
  game.say(...TEMPLE_OPENS);
  revPlayTempleMarch(game);
  game.say(...TEMPLE_ASKS);
  for (;;) {
    game.say(`Your health points: ${Math.trunc(pc.hp)} of ${Math.trunc(pc.maxHp)}`, ...TEMPLE_MENU);
    const key = await desk.key();
    if (key === LEAVE) return;
    const spell = key - '1'.charCodeAt(0);
    if (spell < 0 || spell >= TEMPLE_PRICES.length) continue;
    if (pc.money < TEMPLE_PRICES[spell]) {
      game.say(`Jewel pieces with character: ${Math.trunc(pc.money)}`, '. The good', '   cleric throws you out.');
      // 1000:27F4.
      game.delay(REV_FOUR_SECONDS);
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
      setRevValue(pc, REV_VALUE.disease, 0);
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
const NOT_FOR_A_WIZARD = ["You can't use that because you are a", '   magic user.'];

/**
 * 1000:281E: the store.
 *
 * Its eighth line offers the town for a million and falls past the seven-target jump table to the
 * joke at 1000:2B67, so the town is never for sale however much money is in the purse. A suit of
 * armour is refused only to a character who already wears that one or a better one — the four
 * branches test `armour <= the suit's own number - 1` (1000:2A76, 2AAC, 2AE2, 2B18) — so a
 * character with the money can buy field plate on the first day and never own the other three.
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
    // 1000:2974: a wizard is refused every line but the first, which is the knife — the only
    // weapon `F1.COM` says a wizard can use.
    if (line > 0 && pc.cls !== 1) {
      game.say(...NOT_FOR_A_WIZARD);
      // 1000:29B3.
      game.delay(REV_FOUR_SECONDS);
      continue;
    }
    if (goods.owned !== null && revValue(pc, goods.owned) === 1) {
      game.say(ALREADY_HAVE);
      // 1000:2BB2, which both refusals of the store fall into.
      game.delay(REV_FOUR_SECONDS);
      continue;
    }
    if (goods.owned === null && revValue(pc, REV_ARMOUR_VALUE) >= goods.armour) {
      game.say(DONT_NEED);
      // 1000:2BB2 again.
      game.delay(REV_FOUR_SECONDS);
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

/** 1000:2C52 and 1000:2DF0: what the guild asks once it has been paid. */
const GUILD_ITEM_SETS = [
  'P=Prep items (used while not fighting)',
  'B=Battle items   L=Leave',
];
const GUILD_SPELL_SETS = [
  'P=Prep spells (used while not fighting)',
  'B=Battle spells   L=Leave',
];

/** 1000:2EF3: what it says to a character who cannot pay. */
const CANNOT_PAY = [
  'You do not have enough money. You find',
  '   yourself floating out of the guild...',
];

const PREP = 'P'.charCodeAt(0);
const BATTLE = 'B'.charCodeAt(0);

/**
 * 1000:2BB8: the wizard's guild, which sells what things do rather than the things.
 *
 * Everything it reads out is the text of `F1.COM` and `F2.COM`. A level of spells costs
 * `INT(level ^ 1.75 * 220)` and the list of what one magic item does costs a flat 800, and both
 * are charged only where something was actually read out.
 */
export async function revVisitGuild(game: RevGame, desk: RevTownDesk, magic: RevMagicDesk): Promise<void> {
  const pc = game.pc;
  for (;;) {
    game.say(...GUILD_OPENS);
    const key = await desk.key();
    if (key === LEAVE) return;
    if (key === '2'.charCodeAt(0)) {
      game.say('This will cost you 800 JP.');
      if (pc.money < REV_MAGIC_ITEM_LIST_PRICE) {
        game.say(...CANNOT_PAY);
        // 1000:2F14.
        game.delay(REV_FOUR_SECONDS);
        return;
      }
      await readOutAnItem(game, desk, magic);
      continue;
    }
    if (key !== '1'.charCodeAt(0)) continue;
    const level = await desk.number(['Type the spell level (1-6): ']);
    if (level === null || level < 1 || level > 6) continue;
    const price = revSpellLevelPrice(level);
    game.say(`That will cost you ${price} JP.`);
    if (price > pc.money) {
      game.say(...CANNOT_PAY);
      // 1000:2F14 again, which is where both ways of not affording the guild end up.
      game.delay(REV_FOUR_SECONDS);
      return;
    }
    await readOutASpell(game, desk, level, price);
  }
}

/** 1000:2C4F: the guild runs one of the two item menus and reads out what the chosen item
 *  does. */
async function readOutAnItem(game: RevGame, desk: RevTownDesk, magic: RevMagicDesk): Promise<void> {
  game.say(...GUILD_ITEM_SETS);
  const key = await desk.key();
  if (key !== PREP && key !== BATTLE) return;
  const which = key === PREP ? 'prep' : 'battle';
  // 1000:2C86: it puts one of the game's own item menus up with the fight prompt's flag set, so
  // it has "L = LEAVE" on the bottom -- and so the guild will only talk about an item the
  // character already owns, since that menu turns a line they have none of into nothing chosen.
  const item = await revItemMenu(game, magic, which, true);
  if (item === 0) return;
  game.pc.money -= REV_MAGIC_ITEM_LIST_PRICE;
  const text = which === 'prep' ? REV_ITEM_TABLE.prepText : REV_ITEM_TABLE.battleText;
  game.say(text[item - 1] ?? '');
}

/** 1000:2DED: the two sentences a level of spells buys. */
async function readOutASpell(game: RevGame, desk: RevTownDesk, level: number, price: number): Promise<void> {
  game.say(...GUILD_SPELL_SETS);
  const key = await desk.key();
  if (key !== PREP && key !== BATTLE) return;
  const which = key === PREP ? 'prep' : 'battle';
  const spells = revSpellsAt(level, which);
  game.say(
    which === 'prep' ? 'PREP SPELLS' : 'BATTLE SPELLS',
    '',
    spells[0]?.text ?? '',
    '',
    spells[1]?.text ?? '',
  );
  game.pc.money -= price;
}
