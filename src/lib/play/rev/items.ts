import type { RevMagicDesk } from './desk';
import type { RevSwing } from './fight';
import { revKillMonster } from './kill';
import {
  REV_MAGIC,
  REV_PILL_COLOURS,
  REV_WAND_COLOURS,
  REV_WORN,
  revBasicNumber,
  revFloorStats,
  revItemsHeld,
  revPillColour,
  revPillsHeld,
  revSpendItem,
  revSpendPill,
  revSpendWandCharge,
  revWandCharges,
  revWandColour,
  revWears,
} from './magic';
import { REV_ARMOUR_VALUE, REV_VALUE, revValue, setRevValue } from './record';
import { REV_ITEM_TABLE } from './tables';
import { REV_BATTLE_SPELLS, revArriveInTheTown, revCapHitPoints } from './spells';
import type { RevGame } from './state';

/**
 * The magic items: the I key (DUNSMALL.EXE 1000:1340 and, in a fight, 1000:95BA), the M key that
 * lists them (1000:3B16), the T key that takes a pill (1000:7C49) and the W key that uses a wand
 * (1000:7AA1).
 *
 * There are two lists of six. The scrolls and the two permanent items are used out of a fight and
 * the potions and the grenade in one, and the I key puts up whichever list the character is in
 * front of. The pills and the wands are their own keys and work anywhere.
 */

/** 1000:135D and 1000:95CF: what the two item menus ask. */
export const REV_WHICH_ITEM = 'WHICH ITEM?';
export const REV_WHICH_ITEM_IN_A_FIGHT = 'WHICH ITEM:   ';

/** 1000:145A and 1000:969B: the line the fight prompt and the wizard's guild add. */
export const REV_LEAVE = 'L = LEAVE';

/** 1000:1360: what a line of the first menu says where the character has none of that item. */
const NOTHING = ' ------------------';

/** 1000:95F2: what a line of the second says, which is the item's own number and a rule. */
const NOTHING_IN_A_FIGHT = ')------';

/** 1000:1372 onwards: the six lines of the first menu, spaced as the literals are. */
const PREP_ITEM_LINES = [
  '1) TELEPORT SCROLL   ',
  '2) SCROLL OF SEEING  ',
  '3) SCROLL OF HEALING ',
  '4) SPELL POINT SCROLL',
  '5) BAG OF HOLDING    ',
  '6) FLOOR SLOSHER     ',
];

/** 1000:038F onwards and 1000:966C: the six lines of the second. */
const BATTLE_ITEM_LINES = [
  '1) POTION OF SPEED      ',
  '2) POTION OF FIRE       ',
  '3) POTION OF SHIELDING  ',
  '4) POTION OF HEALTH     ',
  '5) POTION OF RELOCATION ',
  '6) HOLY HAND GRENADE    ',
];

/** How many the character has of the thing on a line of the first menu: a count for the four
 *  scrolls, and a bit of value 16 for the two they either own or do not (1000:1514). */
function prepItemsHeld(game: RevGame, item: number): number {
  if (item === 5) return revWears(game.pc, REV_WORN.bagOfHolding) ? 1 : 0;
  if (item === 6) return revWears(game.pc, REV_WORN.floorSlosher) ? 1 : 0;
  return revItemsHeld(game.pc, item);
}

/** The same for the second menu: the five potions are items 5 to 9, and the grenade is value
 *  43 (1000:9604 and 1000:9661). */
function battleItemsHeld(game: RevGame, item: number): number {
  if (item === 6) return revValue(game.pc, REV_MAGIC.holyHandGrenades);
  return revItemsHeld(game.pc, item + 4);
}

/** The number `VAL` reads out of one key, and 0 for anything that is not a digit. */
function typedNumber(key: number | null): number {
  if (key === null) return 0;
  const digit = key - '0'.charCodeAt(0);
  return digit >= 0 && digit <= 9 ? digit : 0;
}

const LEAVE_KEYS = ['L'.charCodeAt(0), 'l'.charCodeAt(0)];

/** How many lines each menu has. */
const ITEMS_ON_A_MENU = 6;

/**
 * 1000:1340 and 1000:95BA: one of the two menus, and the item the player picks off it.
 *
 * `leaving` is the flag at DGROUP B55C, which the fight prompt and the wizard's guild set: it
 * adds the "L = LEAVE" line, and it makes a choice the character does not own come back as
 * nothing instead of dropping out of the routine. It comes back 0 for "nothing chosen".
 */
export async function revItemMenu(
  game: RevGame,
  desk: RevMagicDesk,
  which: 'prep' | 'battle',
  leaving: boolean,
): Promise<number> {
  const lines = which === 'prep' ? PREP_ITEM_LINES : BATTLE_ITEM_LINES;
  const held = (item: number) => (which === 'prep' ? prepItemsHeld(game, item) : battleItemsHeld(game, item));
  for (;;) {
    game.say(which === 'prep' ? REV_WHICH_ITEM : REV_WHICH_ITEM_IN_A_FIGHT);
    for (let item = 1; item <= ITEMS_ON_A_MENU; item++) {
      const line = lines[item - 1];
      if (held(item) > 0) game.say(line);
      else game.say(which === 'prep' ? `${item})${NOTHING}` : `${item}${NOTHING_IN_A_FIGHT}`);
    }
    if (leaving) game.say(REV_LEAVE);
    const key = await desk.wait();
    if (leaving && LEAVE_KEYS.includes(key)) return 0;
    const choice = typedNumber(key);
    // 1000:14BF: the fight's menu asks again where the dungeon's gives up and goes back to the
    // loop.
    if (choice < 1 || choice > ITEMS_ON_A_MENU) {
      if (leaving) continue;
      return 0;
    }
    if (held(choice) === 0) return 0;
    return choice;
  }
}

/** 1000:1708: `A Teleport Scroll' puts the character down in the town, on the square the rope
 *  comes out at. */
function teleportScroll(game: RevGame, desk: RevMagicDesk): void {
  const pc = game.pc;
  revSpendItem(pc, 1);
  pc.column = 18;
  pc.row = 17;
  revArriveInTheTown(game);
  desk.enterLevel(0);
}

/** 1000:1729: `A Scroll of Seeing' fills in every row of the level the character is on. */
function scrollOfSeeing(game: RevGame): void {
  revSpendItem(game.pc, 2);
  game.memory.markLevelSeen(game.pc.dungeonLevel);
}

/** 1000:1797: `A Scroll of Healing' puts the hit points back to the maximum. */
function scrollOfHealing(game: RevGame, desk: RevMagicDesk): void {
  const pc = game.pc;
  pc.hp = pc.maxHp;
  revSpendItem(pc, 3);
  desk.stats();
}

/** 1000:17B4: `A Spell Point Scroll' is worth ten spell points. */
function spellPointScroll(game: RevGame, desk: RevMagicDesk): void {
  const pc = game.pc;
  pc.spellPoints += 10;
  revSpendItem(pc, 4);
  desk.stats();
}

/** 1000:17D6's own numbers: what the bag holds, what a pound of treasure weighs, and the weight
 *  a character carries before any treasure at all. */
const BAG_HOLDS = 15008;
const PER_POUND = 16;
const ARMOUR_WEIGHT = 25;
const EMPTY_WEIGHT = 2400;

/**
 * 1000:17D6: `The Bag of Holding' takes the coins off the character's back.
 *
 * How much treasure they are carrying is not stored anywhere: it is worked back out of the
 * weight, by taking off what they weigh with nothing on them and what their armour weighs. A
 * character in magic armour is measured by a second sum that forgets the armour, so the bag
 * takes rather more off them than they were carrying.
 */
function bagOfHolding(game: RevGame): void {
  const pc = game.pc;
  const room = BAG_HOLDS - revValue(pc, REV_MAGIC.bagOfHolding);
  let carried = PER_POUND * (pc.weight - ARMOUR_WEIGHT * revValue(pc, REV_ARMOUR_VALUE)) - EMPTY_WEIGHT;
  if (revWears(pc, REV_WORN.magicArmour)) carried = PER_POUND * pc.weight - EMPTY_WEIGHT;
  if (room < carried) carried = room;
  carried = PER_POUND * Math.floor(carried / PER_POUND);
  if (carried < 0) carried = 0;
  setRevValue(pc, REV_MAGIC.bagOfHolding, revValue(pc, REV_MAGIC.bagOfHolding) + carried);
  pc.weight -= carried / PER_POUND;
}

/** 1000:1889: how deep `The Floor Slosher' stops working. */
const FLOOR_SLOSHER_STOPS_AT = 40;

export const REV_TOO_DEEP = "DOESN'T WORK THIS DEEP";
export const REV_SLIPPING_THROUGH = 'YOU ARE SLIPPING THROUGH THE FLOOR.';

/** 1000:1889: `The Floor Slosher' lowers the character a level, and is not used up doing it. */
function floorSlosher(game: RevGame, desk: RevMagicDesk): void {
  if (game.pc.dungeonLevel > FLOOR_SLOSHER_STOPS_AT) {
    game.say(REV_TOO_DEEP);
    return;
  }
  game.say(REV_SLIPPING_THROUGH);
  desk.enterLevel(game.pc.dungeonLevel + 1);
}

/** One of the six on a menu, with the address of the arm of the `ON ... GOTO` it is. */
interface RevItem {
  c: string;
  use(game: RevGame, desk: RevMagicDesk): void;
}

/** 1000:16EA's six: what the I key does outside a fight. */
export const REV_PREP_ITEMS: RevItem[] = [
  { c: '1000:16FA, A TELEPORT SCROLL', use: teleportScroll },
  { c: '1000:1729, A SCROLL OF SEEING', use: (game) => scrollOfSeeing(game) },
  { c: '1000:1797, A SCROLL OF HEALING', use: scrollOfHealing },
  { c: '1000:17B4, A SPELL POINT SCROLL', use: spellPointScroll },
  { c: '1000:17D6, THE BAG OF HOLDING', use: (game) => bagOfHolding(game) },
  { c: '1000:1889, THE FLOOR SLOSHER', use: floorSlosher },
];

/** How long a potion that wears off lasts, in seconds (1000:991F's `TIMER + 100`). */
const POTION_SECONDS = 100;

/** 1000:98FD: `A Potion of Speed' adds thirteen to agility for a hundred seconds. */
function potionOfSpeed(game: RevGame): void {
  const pc = game.pc;
  revSpendItem(pc, 5);
  pc.stats[4] += 13;
  setRevValue(pc, REV_MAGIC.speedUntil, game.seconds + POTION_SECONDS);
}

/** 1000:992E: `A Potion of Fire' is what the B key of the fight prompt needs. */
function potionOfFire(game: RevGame): void {
  const pc = game.pc;
  setRevValue(pc, REV_MAGIC.fireUntil, game.seconds + POTION_SECONDS);
  revSpendItem(pc, 6);
}

/** 1000:9951: `A Potion of Shielding' puts the armour the monster has to beat at fifteen. */
function potionOfShielding(game: RevGame): void {
  const pc = game.pc;
  setRevValue(pc, REV_MAGIC.shieldingUntil, game.seconds + POTION_SECONDS);
  revSpendItem(pc, 7);
  game.shielding = 15;
}

/** 1000:0303: what a potion of health points says. */
export const REV_FEEL_VERY_GOOD = 'You feel very good.';

/** 1000:997D: `A Potion of Health Points' is worth seventy-five of them. */
function potionOfHealth(game: RevGame): void {
  const pc = game.pc;
  game.say(REV_FEEL_VERY_GOOD);
  revSpendItem(pc, 8);
  pc.hp += 75;
  revCapHitPoints(pc);
}

/** 1000:99B7: `A Potion of Relocation' drops the character somewhere else on the same level. */
function potionOfRelocation(game: RevGame): void {
  const pc = game.pc;
  revSpendItem(pc, 9);
  pc.column = game.rng.random(16) + 3;
  pc.row = game.rng.random(16) + 3;
}

export const REV_THERES_AN_EXPLOSION = "THERE'S AN EXPLOSION";

/** 1000:99FD: `The Holy Hand Grenade' kills the monster, whatever it is. */
function holyHandGrenade(game: RevGame): void {
  const pc = game.pc;
  game.say(REV_THERES_AN_EXPLOSION);
  setRevValue(pc, REV_MAGIC.holyHandGrenades, revValue(pc, REV_MAGIC.holyHandGrenades) - 1);
  revKillMonster(game);
}

/** 1000:98ED's six: what the I key does at the fight prompt. */
export const REV_BATTLE_ITEMS: RevItem[] = [
  { c: '1000:98FD, A POTION OF SPEED', use: (game) => potionOfSpeed(game) },
  { c: '1000:992E, A POTION OF FIRE', use: (game) => potionOfFire(game) },
  { c: '1000:9951, A POTION OF SHIELDING', use: (game) => potionOfShielding(game) },
  { c: '1000:997D, A POTION OF HEALTH POINTS', use: (game) => potionOfHealth(game) },
  { c: '1000:99B7, A POTION OF RELOCATION', use: (game) => potionOfRelocation(game) },
  { c: '1000:99FD, THE HOLY HAND GRENADE', use: (game) => holyHandGrenade(game) },
];

/** 1000:1340: the I key in the dungeon. */
export async function revUseAnItem(game: RevGame, desk: RevMagicDesk): Promise<void> {
  const choice = await revItemMenu(game, desk, 'prep', false);
  if (choice === 0) return;
  REV_PREP_ITEMS[choice - 1].use(game, desk);
}

/** 1000:95BA: the I key at the fight prompt. */
export async function revUseAnItemInAFight(game: RevGame, desk: RevMagicDesk): Promise<void> {
  const choice = await revItemMenu(game, desk, 'battle', true);
  if (choice === 0) return;
  REV_BATTLE_ITEMS[choice - 1].use(game, desk);
}

/** 1000:7C5A and 1000:7AAA: what the pill and wand menus ask. */
export const REV_PICK_A_COLOR_PILL = 'PICK A COLOR PILL: ';
export const REV_WHICH_WAND = 'WHICH WAND:';

/** 1000:7ADD: the line a colour the character has none of prints. */
const NO_MORE = '--------------- ';

/** How many characteristics there are, which the pill counts round twice: once forwards from the
 *  colour for the one it lowers (1000:7D5D) and once backwards for the one it raises
 *  (1000:7DA0). */
const REV_STATS = 6;

/**
 * 1000:7C49: the T key, which takes a pill.
 *
 * Every pill takes two off one characteristic and puts four on another, and which two they are
 * comes out of the colour: three along the six for the one it takes off, and the one opposite
 * that for the one it puts on. Nothing says which colour does what, so the first of each is
 * found out by swallowing it.
 */
export async function revTakeAPill(game: RevGame, desk: RevMagicDesk): Promise<void> {
  const pc = game.pc;
  game.say(REV_PICK_A_COLOR_PILL);
  for (let colour = 1; colour <= REV_PILL_COLOURS; colour++) {
    const held = revPillsHeld(pc, colour);
    if (held > 0) game.say(`${revBasicNumber(colour)}${revPillColour(colour)}${revBasicNumber(held)} `);
    else game.say(`${revBasicNumber(colour)}${NO_MORE}`);
  }
  const colour = typedNumber(await desk.poll());
  if (colour < 1 || colour > REV_PILL_COLOURS) return;
  if (revPillsHeld(pc, colour) < 1) return;
  revSpendPill(pc, colour);
  let lowered = colour + 3;
  if (lowered > REV_STATS) lowered -= REV_STATS;
  pc.stats[lowered - 1] -= 2;
  // 1000:7D9D: the game's own wait for a key is what floors a characteristic a pill has taken
  // below one, and the pill calls it for that alone.
  revFloorStats(pc);
  pc.stats[REV_STATS + 1 - lowered - 1] += 4;
}

/**
 * 1000:7AA1: the W key, which spends one charge of a wand.
 *
 * Nine colours, and the charge is spent whether or not the wand does anything where it is used.
 * Six to eight are battle spells and print "NO EFFECT" outside a fight (1000:0FAD); nine heals
 * anywhere. The colours run backwards down the same list the pills run forwards up.
 *
 * It comes back with the wand that was used, or 0, because the fight prompt dispatches on that
 * rather than on anything this does (1000:88EF).
 */
export async function revUseAWand(game: RevGame, desk: RevMagicDesk): Promise<number> {
  const pc = game.pc;
  game.say(REV_WHICH_WAND);
  for (let colour = 1; colour <= REV_WAND_COLOURS; colour++) {
    const charges = revWandCharges(pc, colour);
    if (charges > 0) game.say(`${revBasicNumber(colour)}${revWandColour(colour)}${revBasicNumber(charges)} `);
    else game.say(`${revBasicNumber(colour)}${NO_MORE}`);
  }
  const colour = typedNumber(await desk.poll());
  if (colour < 1 || colour > REV_WAND_COLOURS) return 0;
  if (revWandCharges(pc, colour) < 1) return 0;
  revSpendWandCharge(pc, colour);
  // 1000:7BC9: the ninth wand heals in full, and does it before the five that have a routine.
  if (colour === REV_WAND_COLOURS) pc.hp = pc.maxHp;
  if (colour <= 5) REV_WANDS[colour - 1].use(game, desk);
  return colour;
}

/** 1000:7BE7's five: what a wand of the first five colours does wherever it is used. */
const REV_WANDS: RevItem[] = [
  // 1000:7BF6: up a level, which the dungeon redraws for (1000:0FA0).
  { c: '1000:7BF6, the first wand', use: (game, desk) => desk.enterLevel(game.pc.dungeonLevel - 1) },
  // 1000:7C0B: back to the middle of the level.
  {
    c: '1000:7C0B, the second wand',
    use: (game) => {
      game.pc.column = 10;
      game.pc.row = 10;
    },
  },
  // 1000:7C1B: twenty-five hit points, capped at the maximum.
  {
    c: '1000:7C1B, the third wand',
    use: (game) => {
      game.pc.hp += 25;
      revCapHitPoints(game.pc);
    },
  },
  // 1000:7C3C: ten more turns the monster cannot strike on.
  { c: '1000:7C3C, the fourth wand', use: (game) => void (game.monsterHeld += 10) },
  // 1000:7C42: 240 points on the character's next swing.
  { c: '1000:7C42, the fifth wand', use: (game) => void (game.swingBonus = 240) },
];

/** 1000:0FCF: what the three battle wands say where there is no monster to use them on. */
export const REV_NO_EFFECT = 'NO EFFECT';

/**
 * 1000:88CC: the W key at the fight prompt, which is the same wand and then a jump table of its
 * own on which one was used.
 *
 * Wands six, seven and eight cast the fight's Strength, Lightning and Explosion for nothing —
 * except that the spell points they hand back are not the ones the spell then takes off. The
 * spell charges whatever level was last typed at a cast prompt, which for a character who has
 * never cast anything is none at all.
 */
export async function revUseAWandInAFight(game: RevGame, desk: RevMagicDesk): Promise<void> {
  const colour = await revUseAWand(game, desk);
  const pc = game.pc;
  if (colour === 6) {
    pc.spellPoints += 3;
    REV_BATTLE_SPELLS[5].cast(game, desk, game.spellLevel);
    return;
  }
  if (colour === 7) {
    pc.spellPoints += 3;
    REV_BATTLE_SPELLS[4].cast(game, desk, game.spellLevel);
    return;
  }
  if (colour === 8) {
    pc.spellPoints += 5;
    REV_BATTLE_SPELLS[9].cast(game, desk, game.spellLevel);
  }
}

/** 1000:0FAD: outside a fight the three battle wands say so and do nothing. */
export async function revUseAWandInTheDungeon(game: RevGame, desk: RevMagicDesk): Promise<void> {
  const colour = await revUseAWand(game, desk);
  if (colour > 5 && colour < REV_WAND_COLOURS) game.say(REV_NO_EFFECT);
}

/**
 * 1000:3B16: the M key, which lists every magic thing the character owns.
 *
 * It reads the whole of the second array rather than the nine items `F2.COM` names — the four
 * lines past the end of that table print with a blank where the name goes — and the pills are
 * listed whether the character has any or not.
 */
export function revMagicItemsOwned(game: RevGame): string[] {
  const pc = game.pc;
  const lines = [`${YOU_HAVE}THE FOLLOWING MAGIC ITEMS:`];
  if (revWears(pc, REV_WORN.ringsOfHealth)) {
    lines.push(`${YOU_HAVE}${revBasicNumber(revValue(pc, REV_MAGIC.ringsOfHealth))}RINGS OF HEALTH `);
  }
  if (revWears(pc, REV_WORN.bagOfHolding)) {
    lines.push(
      `YOUR BAG OF HOLDING CONTAINS ${revBasicNumber(revValue(pc, REV_MAGIC.bagOfHolding))}`,
      '      COINS ',
    );
  }
  if (revValue(pc, REV_VALUE.swordPlus) > 0) {
    lines.push(`${YOU_HAVE}A +${revBasicNumber(revValue(pc, REV_VALUE.swordPlus))}MAGIC SWORD `);
  }
  if (revValue(pc, REV_VALUE.macePlus) > 0) {
    lines.push(`${YOU_HAVE}A +${revBasicNumber(revValue(pc, REV_VALUE.macePlus))}MAGIC MACE `);
  }
  if (revWears(pc, REV_WORN.magicRing)) {
    lines.push(`${YOU_HAVE}A +${revBasicNumber(revValue(pc, REV_VALUE.armourBonus))}MAGIC RING `);
  }
  if (revWears(pc, REV_WORN.magicArmour)) {
    lines.push(`${YOU_HAVE}+${revBasicNumber(revValue(pc, REV_MAGIC.magicArmour))}MAGIC ARMOR `);
  }
  if (revWears(pc, REV_WORN.floorSlosher)) lines.push(`${YOU_HAVE}A FLOOR SLOSHER `);
  if (revValue(pc, REV_MAGIC.holyHandGrenades) > 0) {
    lines.push(`${YOU_HAVE}${revBasicNumber(revValue(pc, REV_MAGIC.holyHandGrenades))} HOLY HAND GRENADES`);
  }
  // 1000:3CD1: the loop runs to thirteen where the table of names stops at nine, so an item in
  // one of the last four lines is listed with nothing to call it.
  for (let item = 1; item <= ITEMS_LISTED; item++) {
    const held = revItemsHeld(pc, item);
    if (held > 0) lines.push(` ${REV_ITEM_TABLE.headings[item - 1] ?? ''}${revBasicNumber(held)}`);
  }
  lines.push('YOU ALSO HAVE: ');
  for (let colour = 1; colour <= REV_WAND_COLOURS; colour++) {
    const charges = revWandCharges(pc, colour);
    if (charges > 0) lines.push(`${revBasicNumber(charges)}${revWandColour(colour)} WAND CHARGES`);
  }
  // 1000:3D3E: the pills have no "if you have any" around them, so all six colours are listed.
  for (let colour = 1; colour <= REV_PILL_COLOURS; colour++) {
    lines.push(`${revBasicNumber(revPillsHeld(pc, colour))}${revPillColour(colour)} PILLS`);
  }
  return lines;
}

/** 1000:3B1C: the string every line of the list but the bag's own two is printed after. */
const YOU_HAVE = 'YOU HAVE ';

/** 1000:3CD1's own thirteen: how far the list of counted items runs. */
const ITEMS_LISTED = 13;

/**
 * 1000:8977: whether the potion of fire is still burning.
 *
 * The B key of the fight prompt is not even looked for otherwise, so a character whose potion
 * has run out presses it and nothing at all happens.
 */
export function revCanBreatheFire(game: RevGame): boolean {
  return revValue(game.pc, REV_MAGIC.fireUntil) > game.seconds;
}

/**
 * 1000:8993: the breath, which is between 10 and 39 points and cannot miss.
 *
 * It goes through the swing's own damage arithmetic (1000:8CEE) and prints one of the five lines
 * a hit prints, so the words are the sword's words.
 */
export function revBreatheFire(game: RevGame): RevSwing | null {
  if (!revCanBreatheFire(game)) return null;
  const damage = game.rng.random(30) + 10;
  const fight = game.fight;
  if (fight) fight.hitPoints -= damage;
  return { roll: 0, target: 0, damage };
}
