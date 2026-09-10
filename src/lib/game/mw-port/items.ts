import data from '../mw-data.json';
import { HINT, loadHBin } from './hints';
import { MW_FLOOR_ROWS, type MwGame } from './state';
import { DUNGEON_XMAX as MW_LAST_COLUMN } from '../mwmap.js';

/**
 * The three things a character does with what they are carrying: dropping it (drop_item,
 * WORLD.EXE 2000:7756), swallowing a vitamin pill (take_pill, exe 3000:9ac0) and using one
 * of the six magic items a kill turns up (use_magic_item, exe 3000:e221).
 *
 * Every one of them stops and reads the keyboard between one box and the next, so what is here
 * is the boxes and the effects; the choices are parameters, the way `src/lib/play/mw/` supplies
 * them.
 *
 * The message text is the exact bytes of the game's own strings, read out of the data segment of
 * the unpacked WORLD.EXE. The comment on each say call gives the address of every line it
 * prints, in order; `dotu-tools/reference/scripts/exe_strings.py --ds 2bb9` reads them back.
 */

const WEAPONS = data.weapons;
const ARMOUR = data.armour;

/**
 * The five magic items a kill turns up that are spent by using them, by the name the box that
 * hands each of them over calls it. The sixth line of the use menu is a joke and hands over
 * nothing.
 */
export const MW_FLOOR_SLOSHER = 'FLOOR SLOSHER';
export const MW_HEALING_POTION = 'POTION OF HEALING';
export const MW_SEEING_STONE = 'STONE OF SEEING';
export const MW_TELEPORT_STONE = 'STONE OF TELEPORTATION';
export const MW_HOLY_HAND_GRENADE = 'HOLY HAND GRENADE';

/**
 * The colour of each of the six vitamin pills, by the byte of the record it is counted in, which
 * runs orange, green, blue, red, white, yellow. The menu below lists them in another order again.
 */
export const MW_PILL_COLOURS = ['ORANGE', 'GREEN', 'BLUE', 'RED', 'WHITE', 'YELLOW'];

/**
 * drop_item's opening box: armor, a weapon or money.
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
 * drop_item's armor branch: one suit off the pile in the slot picked.
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
  if (pc.armorOwned[at] > 0) {
    pc.armorOwned[at] -= 1;
    game.events.push({ kind: 'dropped', what: 'armour', item: ARMOUR[at]?.name ?? '' });
  }
  if (pc.armor === at && pc.armorOwned[at] === 0) pc.armor = 0;
}

/** drop_item's weapon branch, which is the same over the eight weapon slots. */
export function dropWeapon(game: MwGame, slot: number): void {
  const pc = game.pc;
  if (slot === 1) {
    sayItWontComeOff(game);
    return;
  }
  const at = slot - 1;
  if (pc.weaponsOwned[at] > 0) {
    pc.weaponsOwned[at] -= 1;
    game.events.push({ kind: 'dropped', what: 'weapon', item: WEAPONS[at].name });
  }
  if (pc.weapon === at && pc.weaponsOwned[at] === 0) pc.weapon = 0;
}

/** H.BIN 0x21, the five kinds of coin, which drop_item puts up before it asks. */
export function drawDropCoinsMenu(game: MwGame): void {
  loadHBin(game, HINT.dropCoins);
}

/**
 * drop_item's money branch: the whole pile of one kind of coin goes on the floor.
 *
 * The menu offers five of the six stone piles, so jewel stones — the ones the store and the
 * temple are paid in — cannot be dropped at all.
 *
 * @param choice 1 to 5: copper, silver, ivory, gold or platinum.
 */
export function dropCoins(game: MwGame, choice: number): void {
  if (choice < 1 || choice > 5) return;
  const pile = game.pc.stones[choice - 1];
  if (pile !== 0) game.events.push({ kind: 'dropped', what: 'money', amount: pile });
  game.pc.stones[choice - 1] = 0;
}

/**
 * take_pill's box: the six vitamin pills, read off lines 1 to 6.
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

/** say_find_one_first (WORLD.EXE 3000:9a93): what a pill the character has none of says. */
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

/** One case of take_pill's switch. */
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
 * The six cases of take_pill's switch, in the order the menu lists them.
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
 * take_pill (WORLD.EXE 3000:9ac0, mw.c "take_pill"): swallow one of the six pills.
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
  game.events.push({ kind: 'itemUsed', item: `${MW_PILL_COLOURS[pill.held]} PILL` });
  pc[pill.raised] += PILL_RAISES;
  pc[pill.dropped] -= PILL_DROPS;
  game.say(...pill.said);
  game.pressAnyKey();
}

/** H.BIN 0x13, the six magic items use_magic_item opens with. */
export function drawMagicItemMenu(game: MwGame): void {
  loadHBin(game, HINT.magicItems);
}

/**
 * What use_magic_item says for an item the character does not have. Five of the six lines lead
 * here; the third, which is a joke, is free.
 */
export function sayNoSuchItem(game: MwGame): void {
  // DS:7286 72a0 72b5 72cd 72e6 72fe, DS:45cd, DS:4a75
  game.say(
    'MAGIC ITEMS ARE MUCH MORE',
    '  EFFECTIVE WHEN YOU',
    '  ACTUALLY POSESS THEM.',
    'KILL SOME MORE MONSTERS,',
    "  YOU'RE BOUND FIND ONE",
    '  EVENTUALLY.',
    '',
    'HIT ANY KEY...',
  );
  game.pressAnyKey();
}

/** The first floor a floor slosher will not go through. */
const DEEPEST_SLOSH = 0x4c;

/** The margin the square a slosher drops onto is rolled inside: `random(size - 5) + 2`. */
const SLOSH_MARGIN = { inset: 5, from: 2 };

/**
 * use_magic_item's first line: the floor slosher, which drops the character through the floor
 * onto the one below it.
 *
 * The square is the one they were standing on, rolled again until it is not rock. Nothing takes
 * the slosher off the character, so the one they have works for ever — and the game never lets
 * them hold more than one.
 *
 * @returns whether the character is on a new floor, which is where the original calls
 * enter_level (WORLD.EXE 2000:55fc).
 */
export function useFloorSlosher(game: MwGame): boolean {
  const pc = game.pc;
  if (pc.floorSloshers === 0) {
    sayNoSuchItem(game);
    return false;
  }
  if (pc.floor >= DEEPEST_SLOSH) {
    // DS:71c5, DS:45cd, DS:4a75
    game.say("DOESN'T WORK THIS DEEP!", '', 'HIT ANY KEY...');
    game.pressAnyKey();
    return false;
  }
  // DS:71dd 71fa
  game.say('YOU ARE SLIPPING THROUGH THE', '  FLOOR. HIT ANY KEY...');
  game.pressAnyKey();
  pc.floor += 1;
  while (game.isSolid(pc.x, pc.y, pc.floor, pc.dungeon)) {
    pc.x = game.rng.random(game.columns - SLOSH_MARGIN.inset) + SLOSH_MARGIN.from;
    pc.y = game.rng.random(game.rows - SLOSH_MARGIN.inset) + SLOSH_MARGIN.from;
  }
  game.recenterMap = true;
  game.events.push({ kind: 'itemUsed', item: MW_FLOOR_SLOSHER });
  return true;
}

/**
 * use_magic_item's second line: a potion of healing, which fills the hit points back up to the
 * maximum however far down they are.
 *
 * The original draws its one line at the top left of the screen in colour 15, where the fight's
 * lines go, rather than as a box; the port says it in the message box, the way dig_hole's lines
 * from the same corner are said.
 */
export function drinkHealingPotion(game: MwGame): void {
  const pc = game.pc;
  if (pc.healingPotions < 1) {
    sayNoSuchItem(game);
    return;
  }
  game.say('YOU FEEL GREAT! HIT A KEY...'); // DS:7212
  game.pressAnyKey();
  pc.hp = pc.maxHp;
  pc.healingPotions -= 1;
  game.events.push({ kind: 'itemUsed', item: MW_HEALING_POTION });
}

/** H.BIN 0x14, the four wishes the third line offers and the fifth line that leaves them. */
export function drawWishMenu(game: MwGame): void {
  loadHBin(game, HINT.wishes);
}

/**
 * use_magic_item's third line: the joke. Any of the four wishes is answered with the address to
 * send a million zillion dollars to and what a stamp costs, and the fifth goes back to the game.
 *
 * @param choice 1 to 5, the digit off the menu.
 */
export function askForAWish(game: MwGame, choice: number): void {
  if (choice < 1 || choice > 4) return;
  loadHBin(game, HINT.millionZillion);
  game.pressAnyKey();
  loadHBin(game, HINT.firstClassStamp);
  game.pressAnyKey();
}

/**
 * use_magic_item's fourth line: a stone of seeing, which marks every square of the floor that is
 * not rock as one the character has walked over — "SEEING STONE: MAPS ENTIRE LEVEL", as the
 * game's own help puts it.
 *
 * The loop runs the reachable floor exactly, column 0 to 78 and row 0 to 109: wall_side walls
 * off column 79 and everything past it, so nothing worth marking is missed.
 */
export function useSeeingStone(game: MwGame): void {
  const pc = game.pc;
  if (pc.seeingStones === 0) {
    sayNoSuchItem(game);
    return;
  }
  pc.seeingStones -= 1;
  game.events.push({ kind: 'itemUsed', item: MW_SEEING_STONE });
  for (let x = 0; x < MW_LAST_COLUMN; x++) {
    for (let y = 0; y < MW_FLOOR_ROWS; y++) {
      if (!game.isSolid(x, y, pc.floor, pc.dungeon)) game.markExplored(x, y);
    }
  }
  game.recenterMap = true;
  loadHBin(game, HINT.seeingStone);
  game.pressAnyKey();
}

/** The border the square a teleport stone lands on is looked for inside. */
const TELEPORT_MARGIN = 0x14;

/**
 * use_magic_item's fifth line: a stone of teleportation, which puts the character back in the
 * town.
 *
 * The square they land on is the last open one the search finds rather than the first: the two
 * loops never stop early, so every open square inside the border overwrites the one before it
 * and the character always arrives on the same square of the town.
 *
 * The original enters floor 0 before it looks for that square. Floor 0 is stocked with nothing
 * at all, so the port looks first and lets its caller enter the floor afterwards.
 *
 * @returns whether the character is on a new floor, which is where enter_level is called.
 */
export function useTeleportStone(game: MwGame): boolean {
  const pc = game.pc;
  if (pc.teleportStones < 1) {
    sayNoSuchItem(game);
    return false;
  }
  pc.teleportStones -= 1;
  game.events.push({ kind: 'itemUsed', item: MW_TELEPORT_STONE });
  pc.floor = 0;
  for (let x = TELEPORT_MARGIN; x < game.columns - TELEPORT_MARGIN; x++) {
    for (let y = TELEPORT_MARGIN; y < game.rows - TELEPORT_MARGIN; y++) {
      if (game.isSolid(x, y, pc.floor, pc.dungeon)) continue;
      pc.x = x;
      pc.y = y;
    }
  }
  game.engaged = -1;
  game.redrawView = true;
  game.recenterMap = true;
  loadHBin(game, HINT.teleportStone);
  game.pressAnyKey();
  return true;
}

/** The kind byte (row offset 0x10) of the ten monsters that catch a grenade. */
const SPELL_PROOF_KIND = 100;

/** The kind of each of the 112 monsters (exe DS:0247, one every 35 bytes). */
const MONSTER_KINDS = data.monsters.map((monster) => monster.kind);

/** What the grenade writes over the monster's hit points, which is what autokill writes. */
const GRENADE_HP = -100;

/**
 * use_magic_item's sixth line: the holy hand grenade, which kills whatever the character is
 * fighting outright.
 *
 * It writes −100 over the monster's hit points rather than killing it here, so the kill itself
 * happens where movecontrol makes it happen — after the key, through monster_killed, with all
 * of the loot and the experience.
 *
 * A monster of kind 100 — ZEUS, the DEVIL and the eight quest bosses — catches it instead, and
 * the grenade is not used up. With nothing being fought the game only asks whether the player
 * really means to throw one of the most powerful magic items in Moraff's World onto an empty
 * floor, and nothing is thrown either way.
 */
export function throwGrenade(game: MwGame): void {
  const pc = game.pc;
  if (pc.grenades !== 0 && game.engaged !== -1) {
    if (MONSTER_KINDS[game.monsters[game.engaged].type] === SPELL_PROOF_KIND) {
      // DS:722f 724a, DS:45cd 45cd 45cd, DS:621b
      game.say('   THE MONSTER CATCHES THE', 'GRADADE.', '', '', '', '      HIT ANY KEY...');
      game.pressAnyKey();
      loadHBin(game, HINT.grenadeCaught);
      game.pressAnyKey();
      return;
    }
    pc.grenades -= 1;
    game.events.push({ kind: 'itemUsed', item: MW_HOLY_HAND_GRENADE });
    game.monsters[game.engaged].hp = GRENADE_HP;
    // DS:7253 726d, DS:45cd, DS:4a75
    game.say('A MASSIVE EXPLOSION KILLS', '  THE MONSTER INSTANTLY.', '', 'HIT ANY KEY...');
    game.pressAnyKey();
    return;
  }
  if (pc.grenades === 0) {
    sayNoSuchItem(game);
    return;
  }
  loadHBin(game, HINT.grenadeOnEmptyFloor);
  game.pressAnyKey();
}
