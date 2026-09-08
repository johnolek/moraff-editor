import type { RevMagicDesk } from './desk';
import { REV_KEY } from './keys';
import {
  revBasicNumber,
  revFraction,
  revGainPill,
  revGainWandCharges,
  revPillColour,
  revWandColour,
} from './magic';
import { revValue, setRevValue } from './record';
import { REV_SPELL_LEVEL_COUNT } from './tables';
import type { RevGame } from './state';

/**
 * What a kill leaves behind: the coins at DUNSMALL.EXE 1000:A522 and the spellbook at
 * 1000:AA18.
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

/**
 * 1000:A505: the kill waits at HIT RETURN.
 *
 * The keyboard is thrown away first (1000:2FCB), so whatever was typed while the monster was
 * dying is not what answers this; then nothing but Return will do, and 1000:A514 asks again for
 * every other key.
 */
async function waitForReturn(game: RevGame, desk: RevMagicDesk): Promise<void> {
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
  theRestOfTheDrops(game);
}

/**
 * 1000:AB7F: the three more rolls a kill makes once the coins and the spellbook are out of the
 * way.
 *
 * Every one of them rolls whether or not the test in front of it could have passed, so a kill
 * costs the run's generator the same three numbers however it went.
 */
function theRestOfTheDrops(game: RevGame): void {
  const depth = game.pc.dungeonLevel;
  // 1000:ABB5 and 1000:ABF4: the wand and the pill the monster's own kind allows, each on a roll
  // the depth widens — a wand comes off about one such kill in seven on the first level and
  // better than one in three on the seventieth.
  const wandRoll = game.rng.random(300);
  if (game.dropsAWand && wandRoll < depth + 40) aWand(game);
  const pillRoll = game.rng.random(160);
  if (game.dropsAPill && pillRoll < depth + 25) aPill(game);
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
  revGainWandCharges(game.pc, colour, game.rng.random(2) + 1);
}

/** 1000:B0E3: a pill, which only a kill of kind 5 can leave. One pill of one of six colours. */
function aPill(game: RevGame): void {
  const colour = game.rng.random(6) + 1;
  game.scratch = colour;
  game.say(`${YOU_HAVE_FOUND_A}${revPillColour(colour)} pill!`);
  revGainPill(game.pc, colour);
}

async function offerTheCoins(game: RevGame, desk: RevMagicDesk): Promise<void> {
  const pc = game.pc;
  const coins = revRollTreasure(game);
  if (coins.value <= 0) return;
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
  const value = (game.rng.random(2) === 1 ? 115 : 116) + 2 * level;
  const known = Math.round(revValue(pc, value));
  if ((known & bit) !== 0) return;
  setRevValue(pc, value, known | bit);
  game.say(`YOU FIND A LEVEL ${revBasicNumber(level)} SPELLBOOK     `, ...REV_SPELLBOOK_ADVICE);
  await desk.poll();
}
