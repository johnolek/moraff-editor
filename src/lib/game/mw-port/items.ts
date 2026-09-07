import { HINT, loadHBin } from './hints';
import type { MwGame } from './state';

/**
 * The three things a character does with what they are carrying: dropping it (FUN_2000_7756,
 * WORLD.EXE 2000:7756), swallowing a vitamin pill (FUN_3000_9ac0, exe 3000:9ac0) and using one
 * of the six magic items a kill turns up (FUN_3000_e221, exe 3000:e221).
 *
 * Every one of them stops and reads the keyboard between one box and the next, so what is here
 * is the boxes and the effects; the choices are parameters, the way `src/lib/play/mw/` supplies
 * them.
 *
 * The message text is the exact bytes of the game's own strings, read out of the data segment of
 * the unpacked WORLD.EXE. The comment on each say call gives the address of every line it
 * prints, in order; `dotu-tools/reference/scripts/exe_strings.py --ds 2bb9` reads them back.
 */

/**
 * FUN_2000_7756's opening box: armor, a weapon or money.
 *
 * The choice is read off lines 3 to 5 of it, so the digits it takes are '1' to '3'.
 */
export function drawDropMenu(game: MwGame): void {
  // DS:2b5a 2b77, DS:1476, DS:2b87 2b90 2b9a, DS:1476 1476
  game.say(
    'WHICH TYPE OF ITEM WOULD YOU',
    '  LIKE TO DROP:',
    '',
    '1) ARMOR',
    '2) WEAPON',
    '3) MONEY',
  );
}

/**
 * The refusal the first line of either slot menu gets: bare skin and a bare fist are the first
 * row of the armor table and the first of the weapon table, and neither can be put down.
 *
 * The original draws the two lines at y 0x28 and y 0x78 in colour 4 rather than as a box of its
 * own, so the second sits between the message box's second line and its third.
 */
function sayItWontComeOff(game: MwGame): void {
  // DS:2bac, DS:20bd
  game.say("OWE! IT JUST WON'T COME OFF!", 'HIT ANY KEY...');
  game.pressAnyKey();
}

/**
 * FUN_2000_7756's armor branch: one suit off the pile in the slot picked.
 *
 * The count and the suit worn are two separate tests, so dropping a slot that holds nothing
 * while wearing it still strips the character back to their skin.
 *
 * @param slot 1 to 8, the line of the menu. Escape hands back -1, and the original then reads
 * the second byte in front of the armor counts rather than one of them; that byte is zero on
 * every character, so escaping drops nothing.
 */
export function dropArmor(game: MwGame, slot: number): void {
  const pc = game.pc;
  if (slot === 1) {
    sayItWontComeOff(game);
    return;
  }
  const at = slot - 1;
  if (pc.armorOwned[at] > 0) pc.armorOwned[at] -= 1;
  if (pc.armor === at && pc.armorOwned[at] === 0) pc.armor = 0;
}

/** FUN_2000_7756's weapon branch, which is the same over the eight weapon slots. */
export function dropWeapon(game: MwGame, slot: number): void {
  const pc = game.pc;
  if (slot === 1) {
    sayItWontComeOff(game);
    return;
  }
  const at = slot - 1;
  if (pc.weaponsOwned[at] > 0) pc.weaponsOwned[at] -= 1;
  if (pc.weapon === at && pc.weaponsOwned[at] === 0) pc.weapon = 0;
}

/** H.BIN 0x21, the five kinds of coin, which FUN_2000_7756 puts up before it asks. */
export function drawDropCoinsMenu(game: MwGame): void {
  loadHBin(game, HINT.dropCoins);
}

/**
 * FUN_2000_7756's money branch: the whole pile of one kind of coin goes on the floor.
 *
 * The menu offers five of the six stone piles, so jewel stones — the ones the store and the
 * temple are paid in — cannot be dropped at all.
 *
 * @param choice 1 to 5: copper, silver, ivory, gold or platinum.
 */
export function dropCoins(game: MwGame, choice: number): void {
  if (choice < 1 || choice > 5) return;
  game.pc.stones[choice - 1] = 0;
}

/**
 * FUN_3000_9ac0's box: the six vitamin pills, read off lines 1 to 6.
 */
export function drawPillMenu(game: MwGame): void {
  // DS:5233 524d 525b 526a 5279 5285 5292 52a0
  game.say(
    'PRESS 1-6 TO TAKE A PILL:',
    '1) GREEN PILL',
    '2) ORANGE PILL',
    '3) YELLOW PILL',
    '4) RED PILL',
    '5) BLUE PILL',
    '6) WHITE PILL',
    'HIT ESCAPE TO RETURN TO GAME',
  );
}

/** FUN_3000_9a93 (WORLD.EXE 3000:9a93): what a pill the character has none of says. */
function sayFindOneFirst(game: MwGame): void {
  // DS:51e6 5203 5221, DS:45cd, DS:4a75
  game.say(
    "DON'T YOU THINK YOU'D BETTER",
    '  FIND ONE FIRST? TRY KILLING',
    '  LEVEL DRAINERS.',
    '',
    'HIT ANY KEY...',
  );
  game.pressAnyKey();
}

/** The six characteristics a pill moves, by the field of the record each is kept in. */
type MwPillStat = 'str' | 'iq' | 'wis' | 'con' | 'dex' | 'luck';

/** One case of FUN_3000_9ac0's switch. */
interface MwPill {
  /** Which of the six bytes at record offset 0x15d this pill is counted in. */
  held: number;
  raised: MwPillStat;
  dropped: MwPillStat;
  said: string[];
}

/** What a pill adds to one characteristic, and what it takes off another. */
const PILL_RAISES = 4;
const PILL_DROPS = 2;

/**
 * The six cases of FUN_3000_9ac0's switch, in the order the menu lists them.
 *
 * The menu reads green, orange, yellow, red, blue, white; the six bytes the pills are counted in
 * run orange, green, blue, red, white, yellow, so no line of the menu is the byte beside it.
 */
const PILLS: MwPill[] = [
  {
    held: 1,
    raised: 'iq',
    dropped: 'dex',
    // DS:52bd 52d8 52ef 530b, DS:45cd, DS:4a75
    said: [
      'YOUR INTELLIGENCE HAS BEEN',
      '  RAISED FOUR AND YOUR',
      '  DEXTERITY HAS DROPPED TWO',
      '  POINTS.',
      '',
      'HIT ANY KEY...',
    ],
  },
  {
    held: 0,
    raised: 'str',
    dropped: 'luck',
    // DS:5315 5333 534c, DS:45cd, DS:4a75
    said: [
      'YOUR STRENGTH HAS BEEN RAISED',
      '  FOUR AND YOUR LUCK HAS',
      '  DROPPED TWO POINTS.',
      '',
      'HIT ANY KEY...',
    ],
  },
  {
    held: 5,
    raised: 'luck',
    dropped: 'str',
    // DS:5362 537c 534c, DS:45cd, DS:4a75
    said: [
      'YOUR LUCK HAS BEEN RAISED',
      '  FOUR AND YOUR STRENGTH HAS',
      '  DROPPED TWO POINTS.',
      '',
      'HIT ANY KEY...',
    ],
  },
  {
    held: 3,
    raised: 'con',
    dropped: 'wis',
    // DS:5399 53b4 53d2, DS:45cd, DS:4a75
    said: [
      'YOUR CONSTITUTION HAS BEEN',
      '  RAISED FOUR AND YOUR WISDOM',
      '  HAS DROPPED TWO POINTS.',
      '',
      'HIT ANY KEY...',
    ],
  },
  {
    held: 2,
    raised: 'wis',
    dropped: 'con',
    // DS:53ec 5408 53d2, DS:45cd, DS:4a75
    said: [
      'YOUR WISDOM HAS BEEN RAISED',
      '  FOUR AND YOUR CONSTITUTION',
      '  HAS DROPPED TWO POINTS.',
      '',
      'HIT ANY KEY...',
    ],
  },
  {
    held: 4,
    raised: 'dex',
    dropped: 'iq',
    // DS:5425 52d8 543d 5458, DS:45cd, DS:4a75
    said: [
      'YOUR DEXTERITY HAS BEEN',
      '  RAISED FOUR AND YOUR',
      '  INTELLIGENCE HAS DROPPED',
      '  TWO POINTS.',
      '',
      'HIT ANY KEY...',
    ],
  },
];

/**
 * FUN_3000_9ac0 (WORLD.EXE 3000:9ac0, mw.c "FUN_3000_9ac0"): swallow one of the six pills.
 *
 * Every pill is four points onto one characteristic and two off another, and the three pairs are
 * swapped between the two halves of the menu: green and white trade intelligence against
 * agility, orange and yellow strength against luck, red and blue constitution against wisdom.
 * Nothing caps either number, so a pill taken often enough drives one characteristic negative.
 *
 * @param choice 1 to 6, the digit off the menu. Anything else, Escape included, takes nothing.
 */
export function takeAPill(game: MwGame, choice: number): void {
  if (choice < 1 || choice > PILLS.length) return;
  const pill = PILLS[choice - 1];
  const pc = game.pc;
  if (pc.pills[pill.held] < 1) {
    sayFindOneFirst(game);
    return;
  }
  pc.pills[pill.held] -= 1;
  pc[pill.raised] += PILL_RAISES;
  pc[pill.dropped] -= PILL_DROPS;
  game.say(...pill.said);
  game.pressAnyKey();
}
