import type { RevMagicDesk } from './desk';
import { REV_FOUR_SECONDS } from './held';
import { revClearScreen } from './screens';
import { REV_KEY } from './keys';
import { REV_FEEL_VERY_GOOD } from './items';
import {
  REV_MAGIC,
  REV_WORN,
  revBasicNumber,
  revFraction,
  revGainItem,
  revGainPill,
  revGainWandCharges,
  revPillColour,
  revWandColour,
  revWears,
} from './magic';
import { REV_ARMOUR_VALUE, REV_VALUE, revValue, setRevValue } from './record';
import { REV_ITEM_TABLE, REV_SPELL_LEVEL_COUNT, revSpellsAt } from './tables';
import type { RevGame } from './state';

/**
 * What a kill leaves behind, which is six things rolled one after another from DUNSMALL.EXE
 * 1000:A4E7 to 1000:B0E0.
 *
 * It waits at HIT RETURN (1000:A505) and then rolls, in this order: the **coins** (1000:A522),
 * the **spellbook** (1000:AA18), a plain **weapon or suit of armour** (1000:B1DF), a **wand**
 * (1000:B156), a **pill** (1000:B0E3), and the twenty-two-line table of **magic** at
 * 1000:AC87. Only the first two are rolled for every kill: the armour wants one of the first
 * eight levels of the dungeon, the wand and the pill want a monster of the right kind, and the
 * table wants the fourth level and deeper.
 *
 * A monster drops coins one time in five, and the six kinds of coin are rolled one at a time
 * with the depth and the monster's own level in every sum. They weigh something and are worth
 * something, and the two are not the same number — which is what the bank is for, and why a
 * character walks back up with them rather than casting Feather.
 *
 * The spellbook is rolled one time in five as well, and it is the only way a character is ever
 * taught a spell.
 */

/** 1000:A89F onwards: the six kinds of coin, in the order they are rolled and printed. */
export interface RevCoins {
  copper: number;
  silver: number;
  ivory: number;
  gold: number;
  platinum: number;
  jewels: number;
  /** DGROUP B76C: what the pile weighs, in pounds. */
  weight: number;
  /** DGROUP B770: what the bank will give for it. */
  value: number;
}

const NOTHING: RevCoins = {
  copper: 0,
  silver: 0,
  ivory: 0,
  gold: 0,
  platinum: 0,
  jewels: 0,
  weight: 0,
  value: 0,
};

/** 1000:A537: one kill in five leaves anything at all. */
export function revDropsTreasure(game: RevGame): boolean {
  return game.rng.random(5) === 1;
}

/**
 * 1000:A561: the pile itself.
 *
 * Every kind but gold and platinum is gated on `INT(INT(depth / 2) + RND * n) = 1`, so the
 * shallow levels drop copper and nothing else and the deep ones drop nothing but by accident.
 * The monster's level in these sums is DGROUP B6B4, which the kill has already overwritten with
 * the depth (1000:A3C8) — so a monster's own level has nothing to do with what it drops.
 */
export function revRollTreasure(game: RevGame): RevCoins {
  const rng = game.rng;
  const rnd = () => revFraction(rng);
  const depth = game.pc.dungeonLevel;
  const monster = game.lastMonsterLevel;
  const half = Math.floor(depth * 0.5);
  const coins = { ...NOTHING };

  if (Math.floor(rnd() * 4 + half) === 1) {
    coins.copper = Math.floor(rnd() ** 2.3 * 8000 + rnd() * 1000 + 1);
  }
  if (Math.floor(rnd() * 3 + half) === 1) {
    coins.silver = Math.floor(rnd() ** 2 * depth * monster * 400 + rnd() * 400 + 1);
  }
  if (Math.floor(rnd() * 5 + half) === 1) {
    coins.ivory = Math.floor(rnd() ** 2 * monster ** 0.8 * depth * 45 + rnd() * 200 + 1);
  }
  if (Math.floor(rnd() * 3) === 1) {
    coins.gold = Math.floor(rnd() * rnd() * (depth + 1) ** 0.7 * monster * 25) + 1;
  }
  if (Math.floor(rnd() * 5) === 1) {
    coins.platinum = Math.floor(rnd() ** 2 * (depth + 1) ** 1.85 * 6 + rnd() * 30 + 1);
  }
  // 1000:A7B6: jewels want the fourth level as well as the roll.
  if (Math.floor(rnd() * 4) === 1 && depth > 3) {
    coins.jewels = Math.floor(rnd() * monster * depth * 29) + 1;
  }

  // 1000:A7F5: the jewels weigh nothing, which is what makes a deep pile worth carrying.
  const pounds = coins.copper + coins.silver + coins.ivory + coins.gold + coins.platinum;
  coins.value = Math.floor(
    coins.copper / 100 + coins.silver / 10 + coins.ivory * 0.5 + coins.platinum * 6 + coins.gold + coins.jewels,
  );
  coins.weight = Math.floor(pounds * 0.0625);
  return coins;
}

/** 1000:A89C onwards: the pile as the screen reads it out, a line to a kind. */
export function revTreasureFound(coins: RevCoins): string[] {
  const lines = ['YOU HAVE FOUND:'];
  const kinds: [string, number][] = [
    ['COPPER', coins.copper],
    ['SILVER', coins.silver],
    ['IVORY', coins.ivory],
    ['GOLD', coins.gold],
    ['PLATINUM', coins.platinum],
    ['JEWELS', coins.jewels],
  ];
  for (const [name, many] of kinds) {
    if (many > 0) lines.push(`${name}${' '.repeat(PRINT_ZONE - (name.length % PRINT_ZONE))}${revBasicNumber(many)}`);
  }
  return lines;
}

/** How wide a BASIC print zone is, which is where the comma between a coin and its number
 *  moves to. */
const PRINT_ZONE = 14;

/** 1000:A95F: the weight a character cannot walk away from a pile with. */
const TOO_HEAVY_AT = 350;

export const REV_TOO_HEAVY = "IT'S TOO HEAVY FOR YOU TO CARRY";
export const REV_TAKE_OR_LEAVE = 'T=TAKE COINS  L=LEAVE COINS';

const TAKE_KEYS = ['T'.charCodeAt(0), 't'.charCodeAt(0)];
const LEAVE_KEYS = ['L'.charCodeAt(0), 'l'.charCodeAt(0)];

/** 1000:A508: what the kill waits at before it hands anything over. */
export const REV_HIT_RETURN = 'HIT RETURN';

/** Where it waits: `LOCATE 17, 26` at 1000:A4F9, on the row under YOU KILLED IT!! and over the
 *  same picture. */
const HIT_RETURN_ROW = 17;
const HIT_RETURN_COLUMN = 26;

/**
 * 1000:A505: the kill waits at HIT RETURN.
 *
 * The keyboard is thrown away first (1000:2FCB), so whatever was typed while the monster was
 * dying is not what answers this; then nothing but Return will do, and 1000:A514 asks again for
 * every other key.
 */
async function waitForReturn(game: RevGame, desk: RevMagicDesk): Promise<void> {
  game.kept.printAt(HIT_RETURN_ROW, HIT_RETURN_COLUMN, REV_HIT_RETURN);
  game.say(REV_HIT_RETURN);
  game.flushKeys();
  for (;;) {
    const key = await desk.poll();
    // The original asks again for the space the poll hands back while a monster stands on the
    // character's square, which is a wait that never ends; a browser cannot spin there, so the
    // drops are handed over rather than the game stopping.
    if (key === null || key === REV_KEY.enter) return;
  }
}

/**
 * 1000:A4E7: everything the kill hands over.
 *
 * It waits at HIT RETURN first. The coins are offered and can be turned down; a pile that would
 * put the character over 350 pounds is not offered at all. Then, whatever happened to the coins,
 * the same kill rolls for a spellbook.
 */
export async function revTreasureFromAKill(game: RevGame, desk: RevMagicDesk): Promise<void> {
  await waitForReturn(game, desk);
  if (revDropsTreasure(game)) await offerTheCoins(game, desk);
  await offerASpellbook(game, desk);
  await theRestOfTheDrops(game, desk);
}

/**
 * 1000:AB7F: the four more things a kill can hand over once the coins and the spellbook are out
 * of the way.
 *
 * Every one of them rolls whether or not the test beside it could have passed, so a kill costs
 * the run's generator the same numbers however it went.
 */
async function theRestOfTheDrops(game: RevGame, desk: RevMagicDesk): Promise<void> {
  const rng = game.rng;
  const depth = game.pc.dungeonLevel;
  // 1000:AB7F: the plain weapon or suit of armour a character is meant to be kitted out with,
  // which only the first eight levels of the dungeon hand over.
  const kitRoll = rng.random(8);
  if (depth < 9 && kitRoll === 1) armourOrAWeapon(game);
  // 1000:ABB5 and 1000:ABF4: the wand and the pill the monster's own kind allows, each on a roll
  // the depth widens — a wand comes off about one such kill in seven on the first level and
  // better than one in three on the seventieth.
  const wandRoll = rng.random(300);
  if (game.dropsAWand && wandRoll < depth + 40) aWand(game);
  const pillRoll = rng.random(160);
  if (game.dropsAPill && pillRoll < depth + 25) aPill(game);
  // 1000:AC33: and then the table, on a depth roll the first three levels of the dungeon can
  // never pass and that grows likelier all the way down, and one kill in five of those.
  const deepEnough = Math.floor(revFraction(rng) * depth + 7) + 1 > 10;
  const lucky = rng.random(5) + 1 === 1;
  if (deepEnough && lucky) await theTable(game, desk);
}

/** 1000:B292 and 1000:B2BA: the two weapons the shallow levels hand out. */
export const REV_YOU_FIND_A_SWORD = 'You find a sword.';
export const REV_YOU_FIND_A_MACE = 'You find a mace.';

/**
 * 1000:024C: the five suits of armour by the number the record keeps them as, which is what the
 * store sells as its lines 4 to 7 and what a character with none is wearing.
 *
 * The trailing spaces are the game's own: each of the four is a name joined to the ` armor. ' at
 * 1000:0202.
 */
export const REV_ARMOUR_WORN = [
  'robes.    ',
  'leather armor. ',
  'chain armor. ',
  'plate armor. ',
  'field plate armor. ',
];

/**
 * 1000:B1DF: the next suit of armour up, or a sword, or a mace.
 *
 * A wizard is handed none of it, the way the store refuses them everything but the knife. Three
 * rolls in five offer armour, and what is offered is the **next suit up from the one worn**
 * rather than a rolled one — so this stops at plate, and field plate is only ever bought or
 * turned up by 1000:AC87.
 *
 * A roll of four offers a sword; a five, or a four to a character who has a sword already, falls
 * through to the mace (1000:B2A6).
 */
function armourOrAWeapon(game: RevGame): void {
  const pc = game.pc;
  if (pc.cls === 2) return;
  const roll = game.rng.random(5) + 1;
  game.scratch = roll;
  if (roll <= 3) {
    const next = revValue(pc, REV_ARMOUR_VALUE) + 1;
    game.scratch = next;
    if (next > 3) return;
    game.say(`You find ${REV_ARMOUR_WORN[next]}`);
    setRevValue(pc, REV_ARMOUR_VALUE, next);
    game.events.push({ kind: 'found', find: { what: 'armour', item: REV_ARMOUR_WORN[next] } });
    return;
  }
  if (roll === 4 && revValue(pc, REV_VALUE.sword) === 0) {
    game.say(REV_YOU_FIND_A_SWORD);
    setRevValue(pc, REV_VALUE.sword, 1);
    game.events.push({ kind: 'found', find: { what: 'weapon', item: 'sword' } });
    return;
  }
  if (revValue(pc, REV_VALUE.mace) === 0) {
    game.say(REV_YOU_FIND_A_MACE);
    setRevValue(pc, REV_VALUE.mace, 1);
    game.events.push({ kind: 'found', find: { what: 'weapon', item: 'mace' } });
  }
}

/** 1000:B112 and 1000:B185: what a found pill and a found wand are announced with. */
const YOU_HAVE_FOUND_A = 'You have found a ';

/**
 * 1000:B156: a wand, which a kill of kind 5 or kind 7 can leave.
 *
 * The colour is one of nine and the wand arrives with one charge or two. `revWandColour` is what
 * reads the colour list backwards, so wand 1 is purple and wand 9 blue.
 */
function aWand(game: RevGame): void {
  const colour = game.rng.random(9) + 1;
  game.scratch = colour;
  game.say(`${YOU_HAVE_FOUND_A}${revWandColour(colour)} wand!`);
  const charges = game.rng.random(2) + 1;
  revGainWandCharges(game.pc, colour, charges);
  game.events.push({ kind: 'wandFound', colour: revWandColour(colour), charges });
}

/** 1000:B0E3: a pill, which only a kill of kind 5 can leave. One pill of one of six colours. */
function aPill(game: RevGame): void {
  const colour = game.rng.random(6) + 1;
  game.scratch = colour;
  game.say(`${YOU_HAVE_FOUND_A}${revPillColour(colour)} pill!`);
  revGainPill(game.pc, colour);
  game.events.push({ kind: 'pillFound', colour: revPillColour(colour) });
}

async function offerTheCoins(game: RevGame, desk: RevMagicDesk): Promise<void> {
  const pc = game.pc;
  const coins = revRollTreasure(game);
  if (coins.value <= 0) return;
  // 1000:A890: the treasure takes the screen over, which is what finally rubs out the dead
  // monster and the two lines printed across it. 1000:A896 and A899 put the flat map and the
  // box between the views back on it, and nothing else; the coin list prints from row 1.
  revClearScreen(game, 'map');
  game.say(...revTreasureFound(coins));
  if (pc.weight + coins.weight >= TOO_HEAVY_AT) {
    game.say(REV_TOO_HEAVY);
    await desk.poll();
    return;
  }
  for (;;) {
    game.say(REV_TAKE_OR_LEAVE);
    const key = await desk.poll();
    // The original asks again for anything that is neither, which for the space it hands back
    // while a monster stands on the square is forever; a browser cannot spin there, so the pile
    // is left behind.
    if (key === null || LEAVE_KEYS.includes(key)) return;
    if (!TAKE_KEYS.includes(key)) continue;
    pc.weight += coins.weight;
    pc.treasure += coins.value;
    game.events.push({ kind: 'found', find: { what: 'money', amount: coins.value } });
    return;
  }
}

/** 1000:AB31: what a spellbook says, and the three lines of advice under it. */
export const REV_SPELLBOOK_ADVICE = [
  '   If you have have enough spell points,',
  'you can  see  which  spells you  have by',
  "hitting `C'.  You can find out what they",
  "do at the Wizard's Guild.               ",
];

/**
 * 1000:AA18: one kill in five leaves a spellbook, which is the only way a character is taught
 * anything.
 *
 * The level is rolled against the depth and rerolled until it is one of the six, the set is a
 * coin toss, and which of the level's two spells it teaches is another. A book for a spell the
 * character already knows is nothing at all and says nothing.
 */
async function offerASpellbook(game: RevGame, desk: RevMagicDesk): Promise<void> {
  if (game.rng.random(5) !== 1) return;
  const pc = game.pc;
  const depth = pc.dungeonLevel;
  let level = 0;
  do {
    level = Math.floor(revFraction(game.rng) * Math.floor(depth * 0.5 + 1)) + 1;
  } while (level > REV_SPELL_LEVEL_COUNT);
  const bit = game.rng.random(2) + 1;
  // 1000:AA89: the second set is the fight's, and the first the dungeon's.
  const dungeonsOwn = game.rng.random(2) === 1;
  const value = (dungeonsOwn ? 115 : 116) + 2 * level;
  const known = Math.round(revValue(pc, value));
  if ((known & bit) !== 0) return;
  setRevValue(pc, value, known | bit);
  const set = dungeonsOwn ? 'prep' : 'battle';
  const name = revSpellsAt(level, set)[bit - 1]?.name ?? '';
  game.events.push({ kind: 'spellLearned', set, level, name });
  game.say(`YOU FIND A LEVEL ${revBasicNumber(level)} SPELLBOOK     `, ...REV_SPELLBOOK_ADVICE);
  await desk.poll();
}


/** 1000:AC99: what the table is announced with, and 1000:B0D1 what a line with nothing to give
 *  says. */
export const REV_YOU_FIND = 'YOU FIND... ';
export const REV_NOTHING = 'NOTHING';

/** 1000:AD38 onwards: the lines of the table that name what they hand over outright. */
const A_RING_OF_HEALTH = ' A RING OF HEALTH';
const A_BAG_OF_HOLDING = ' A BAG OF HOLDING';
const A_HOLY_HAND_GRENADE = ' A HOLY HAND GRENADE!';
const A_FLOOR_SLOSHER = ' A FLOOR SLOSHER';

/** 1000:B07A and 1000:B096: what a book of a characteristic says. */
const A_BOOK_OF = 'You have found a book of ';
const PRESS_ANY_KEY_TO_READ = '   Press any key to read it.';

/** 1000:B03E: the five characteristics a book can be of, in the order the record keeps them and
 *  with the game's own spelling of the third. */
const BOOK_SUBJECTS = ['strength.', 'learning.', 'wizdom.', 'health.', 'agility.'];

/**
 * 1000:AC87: the twenty-two things a deep kill can turn up.
 *
 * Two numbers are rolled before the table is read: the plus every magic thing in it carries,
 * which is a third of a roll on the depth, and which of the twenty-two lines it is. Lines 1 to 8
 * are the magic a character wears, 9 to 17 the nine scrolls and potions the store also sells,
 * and 18 to 22 a book that puts a point on a characteristic.
 *
 * A line that has nothing to give — magic the character already has better of, and anything at
 * all offered to a wizard — says NOTHING instead.
 *
 * The four seconds 1000:2F35 holds YOU FIND... on the screen for are held here as a frame, and
 * so are the two flushes of the keyboard around them.
 */
async function theTable(game: RevGame, desk: RevMagicDesk): Promise<void> {
  const rng = game.rng;
  // 1000:AC87, AC8D and AC90: the screen is cleared, the keyboard is emptied and the screen is
  // cleared again, so the table's own line is on a screen with nothing else on it at all.
  revClearScreen(game);
  game.flushKeys();
  revClearScreen(game);
  game.say(REV_YOU_FIND);
  // 1000:ACA2: four seconds with the line alone on a screen the table has just cleared.
  game.delay(REV_FOUR_SECONDS);
  const plus = Math.floor(Math.floor(revFraction(rng) * game.pc.dungeonLevel) / 3) + 1;
  const line = rng.random(22) + 1;
  game.scratch = line;
  if (line > 17 && line < 23) await aBookOfACharacteristic(game, desk);
  else if (line > 8) oneOfTheNineItems(game, line);
  else theMagicWorn(game, line, plus);
  game.flushKeys();
}

/** 1000:B0CE: the line had nothing this character does not have better of. */
function nothing(game: RevGame): void {
  game.say(REV_NOTHING);
}

/** One of the table's lines handed over, by the name its own line calls it. */
function foundInTheTable(game: RevGame, item: string): void {
  game.events.push({ kind: 'found', find: { what: 'item', item: item.trim() } });
}

/** 1000:AD35 to 1000:AFE0: the eight lines that hand over magic the character wears. */
function theMagicWorn(game: RevGame, line: number, plus: number): void {
  const pc = game.pc;
  if (line === 1) {
    game.say(A_RING_OF_HEALTH);
    foundInTheTable(game, A_RING_OF_HEALTH);
    // The bit says the character wears rings of health at all and value 38 says how many, so a
    // second ring raises only the count.
    if (!revWears(pc, REV_WORN.ringsOfHealth)) pc.rings += REV_WORN.ringsOfHealth;
    setRevValue(pc, REV_MAGIC.ringsOfHealth, revValue(pc, REV_MAGIC.ringsOfHealth) + 1);
    return;
  }
  if (line === 2 && !revWears(pc, REV_WORN.bagOfHolding)) {
    game.say(A_BAG_OF_HOLDING);
    foundInTheTable(game, A_BAG_OF_HOLDING);
    pc.rings += REV_WORN.bagOfHolding;
    return;
  }
  // 1000:AD7D: a second bag of holding does not say NOTHING — it falls into the next line of the
  // program, which is the sword, so the character is offered one of those instead.
  if (line <= 3) {
    game.scratch = plus;
    if (pc.cls === 2 || revValue(pc, REV_VALUE.swordPlus) >= plus) return nothing(game);
    game.say(` A +${revBasicNumber(plus)}SWORD`);
    foundInTheTable(game, `+${plus} SWORD`);
    setRevValue(pc, REV_VALUE.sword, 1);
    if (!revWears(pc, REV_WORN.magicSword)) pc.rings += REV_WORN.magicSword;
    setRevValue(pc, REV_VALUE.swordPlus, plus);
    return;
  }
  if (line === 4) {
    game.scratch = plus;
    if (pc.cls === 2 || revValue(pc, REV_VALUE.macePlus) >= plus) return nothing(game);
    game.say(` A +${revBasicNumber(plus)}MACE`);
    foundInTheTable(game, `+${plus} MACE`);
    setRevValue(pc, REV_VALUE.mace, 1);
    if (!revWears(pc, REV_WORN.magicMace)) pc.rings += REV_WORN.magicMace;
    setRevValue(pc, REV_VALUE.macePlus, plus);
    return;
  }
  // 1000:AEB5: the ring is the one piece of magic in the table a wizard is allowed.
  if (line === 5) {
    if (revValue(pc, REV_VALUE.armourBonus) >= plus) return nothing(game);
    game.say(` +${revBasicNumber(plus)}RING`);
    foundInTheTable(game, `+${plus} RING`);
    if (!revWears(pc, REV_WORN.magicRing)) pc.rings += REV_WORN.magicRing;
    setRevValue(pc, REV_VALUE.armourBonus, plus);
    return;
  }
  if (line === 6) {
    if (pc.cls === 2 || revValue(pc, REV_MAGIC.magicArmour) >= plus) return nothing(game);
    game.say(` +${revBasicNumber(plus)}FIELD PLATE ARMOR`);
    foundInTheTable(game, `+${plus} FIELD PLATE ARMOR`);
    if (!revWears(pc, REV_WORN.magicArmour)) pc.rings += REV_WORN.magicArmour;
    setRevValue(pc, REV_MAGIC.magicArmour, plus);
    // 1000:AF8B: and the suit worn becomes field plate, which nothing else in the dungeon hands
    // over.
    setRevValue(pc, REV_ARMOUR_VALUE, 4);
    return;
  }
  if (line === 7) {
    game.say(A_HOLY_HAND_GRENADE);
    foundInTheTable(game, A_HOLY_HAND_GRENADE);
    setRevValue(pc, REV_MAGIC.holyHandGrenades, revValue(pc, REV_MAGIC.holyHandGrenades) + 1);
    return;
  }
  if (revWears(pc, REV_WORN.floorSlosher)) return nothing(game);
  game.say(A_FLOOR_SLOSHER);
  foundInTheTable(game, A_FLOOR_SLOSHER);
  pc.rings += REV_WORN.floorSlosher;
}

/** 1000:AFE1: lines 9 to 17 are the nine scrolls and potions, one more of the line's own. */
function oneOfTheNineItems(game: RevGame, line: number): void {
  const which = line - 8;
  game.scratch = which;
  game.say(`${REV_ITEM_TABLE.names[which - 1]}  `);
  revGainItem(game.pc, which);
  game.events.push({
    kind: 'found',
    find: { what: 'item', item: REV_ITEM_TABLE.names[which - 1].trim() },
  });
}

/**
 * 1000:B023: lines 18 to 22 are all the same book, of one of five characteristics rolled here.
 *
 * The wait is the game's own blocking one, so the characteristics are floored at 1 on the way out
 * of it (1000:2F43) before the point is put on.
 */
async function aBookOfACharacteristic(game: RevGame, desk: RevMagicDesk): Promise<void> {
  const stat = game.rng.random(5) + 1;
  game.scratch = stat;
  game.say(`${A_BOOK_OF}${BOOK_SUBJECTS[stat - 1]}`, PRESS_ANY_KEY_TO_READ);
  await desk.wait();
  game.pc.stats[stat - 1] += 1;
  game.events.push({
    kind: 'found',
    find: { what: 'item', item: `book of ${BOOK_SUBJECTS[stat - 1].replace('.', '')}` },
  });
  game.say(REV_FEEL_VERY_GOOD);
}
