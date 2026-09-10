import { MW_FROM_PAPER, MW_FROM_SCROLL, MW_FROM_SPELLBOOK, MW_FROM_WAND } from './magic';
import { mwMenuKey } from './screens';
import {
  MW_BOOK_SLOTS_PER_CATEGORY,
  MW_SPELL_CATEGORIES,
  MW_SPELL_NAMES,
  MW_SPELLS_PER_CATEGORY,
  MW_SPELLS_PER_LEVEL,
  mwMaximumSpellPointCost,
  mwSpellPointCost,
  mwSpellRecord,
} from './spells';
import type { MwGame } from './state';

/**
 * What the character is carrying: the four spell listings the P key opens and the magic items
 * under them.
 *
 * FUN_3000_a047 (WORLD.EXE 3000:a047) is the menu, FUN_3000_9cfb (exe 3000:9cfb) the two pages a
 * spell listing takes, and FUN_3000_9cd3 (exe 3000:9cd3) the one line at a time the magic items
 * are printed with. Every screen here draws with print_text at the game's own coordinates.
 *
 * A spell listing names the spells the character holds and says nothing about how many scrolls or
 * how many charges — {@link mwSpellHoldings} is the same 120 spells with those numbers, which is
 * what MORF-66 asks the browser game to show.
 */

/** Which of the four arrays a source names. */
function heldIn(game: MwGame, source: number): number[] {
  if (source === MW_FROM_SCROLL) return game.pc.scrolls;
  if (source === MW_FROM_WAND) return game.pc.wands;
  if (source === MW_FROM_PAPER) return game.pc.paper;
  return game.pc.spellbook;
}

/**
 * FUN_3000_a047 (WORLD.EXE 3000:a047, mw.c "FUN_3000_a047"): the menu the P key puts up.
 *
 * The seventh line of the box is a pointer into a table of floating point numbers rather than a
 * string, which reads back as empty; the line under it is the one that says how to leave.
 */
export function drawInventoryMenu(game: MwGame): void {
  // DS:54ba 54d4 54e2 54ed 54f6 5500 45cd 5515
  game.say(
    'WHICH DO YOU WISH TO SEE?',
    '1) SPELLBOOKS',
    '2) SCROLLS',
    '3) WANDS',
    '4) PAPERS',
    '5) MISC. MAGIC ITEMS',
    '',
    'ANY OTHER KEY TO RETURNS...',
  );
}

/** Where the level number, the left column and the right column of a listing are drawn. */
const LISTING_LEVEL_X = 0x1e;
const LISTING_LEFT_X = 0xb4;
const LISTING_RIGHT_X = 900;

/** The heading of each of the four columns a listing has (exe DS:546c, 547d, 5490, 54a5). */
const LISTING_HEADINGS = [
  'PERMANENT SPELLS',
  'PREPARATION SPELLS',
  'WIZARD BATTLE SPELLS',
  'PRIEST BATTLE SPELLS',
];

/**
 * FUN_3000_9cfb (WORLD.EXE 3000:9cfb, mw.c "FUN_3000_9cfb"): one page of a spell listing, two
 * categories side by side and thirty rows down.
 *
 * A row is drawn for every one of the thirty spells, and the level number down the left is
 * therefore printed three times over — once beside each spell of that level. The colour steps
 * through 6, 7 and 8 by level.
 *
 * A spell whose byte in the array is zero leaves its column blank, so what the page shows is what
 * the character holds and not how much of it.
 *
 * @param source {@link MW_FROM_SPELLBOOK}, {@link MW_FROM_SCROLL}, {@link MW_FROM_WAND} or
 *   {@link MW_FROM_PAPER}.
 * @param page 0 for the permanent and preparation categories, 1 for the two battle ones.
 */
export function drawInventoryPage(game: MwGame, source: number, page: number): void {
  const held = heldIn(game, source);
  game.eraseScreen();
  // DS:5466 with the two headings beside it
  game.draw({ text: 'LEVEL', x: 0, y: 0, font: 0, colour: 4 });
  game.draw({ text: LISTING_HEADINGS[page * 2], x: LISTING_LEFT_X, y: 0, font: 0, colour: 4 });
  game.draw({ text: LISTING_HEADINGS[page * 2 + 1], x: LISTING_RIGHT_X, y: 0, font: 0, colour: 4 });
  for (let row = 0; row < MW_SPELLS_PER_CATEGORY; row++) {
    const level = Math.trunc(row / MW_SPELLS_PER_LEVEL);
    const colour = (level % 3) + 6;
    const y = row * 0x26 + 0x3c;
    game.draw({ text: String(level + 1), x: LISTING_LEVEL_X, y, font: 0, colour });
    for (const column of [0, 1]) {
      const category = page * 2 + column;
      if (held[category * MW_BOOK_SLOTS_PER_CATEGORY + row] === 0) continue;
      game.draw({
        text: MW_SPELL_NAMES[category * MW_SPELLS_PER_CATEGORY + row],
        x: column === 0 ? LISTING_LEFT_X : LISTING_RIGHT_X,
        y,
        font: 0,
        colour,
      });
    }
  }
}

/** The row a line of the magic items page is drawn on (exe 3000:9cd3, which counts them itself). */
function miscLine(game: MwGame, row: number, text: string): void {
  game.draw({ text, x: 0x2d3, y: row * 0x28, font: 0, colour: 4 });
}

/**
 * FUN_3000_a047 (WORLD.EXE 3000:a047, mw.c "FUN_3000_a047"), its fifth choice: everything that is
 * not a spell, in three groups — the five items I uses with a number of its own, the six pills,
 * and the five things that work by being carried.
 *
 * The pills are not in the order they sit in the record: the six bytes from 0x15d run orange,
 * green, blue, red, white, yellow and the page lists green, orange, yellow, red, blue, white.
 */
export function drawMiscItems(game: MwGame): void {
  const pc = game.pc;
  game.eraseScreen();
  // DS:5531 5544 5562 557a 5597 55ad 55c1, each of the last five with its count on the end
  miscLine(game, 0, 'MISC. MAGIC ITEMS:');
  miscLine(game, 2, "HIT 'I' AND '5' TO USE THESE:");
  miscLine(game, 3, `1) HOLY HAND GRENADES: ${pc.grenades}`);
  miscLine(game, 4, `2) STONES OF TELEPORTATION: ${pc.teleportStones}`);
  miscLine(game, 5, `3) STONES OF SEEING: ${pc.seeingStones}`);
  miscLine(game, 6, `4) FLOOR SLOSHERS: ${pc.floorSloshers}`);
  miscLine(game, 7, `5) POTION OF HEALING: ${pc.healingPotions}`);
  // DS:55d8 55f6 5607 5619 562b 563a 564b
  miscLine(game, 9, "HIT 'I' AND '4' TO USE THESE:");
  miscLine(game, 10, `6) GREEN PILLS: ${pc.pills[1]}`);
  miscLine(game, 11, `7) ORANGE PILLS: ${pc.pills[0]}`);
  miscLine(game, 12, `8) YELLOW PILLS: ${pc.pills[5]}`);
  miscLine(game, 13, `9) RED PILLS: ${pc.pills[3]}`);
  miscLine(game, 14, `10) BLUE PILLS: ${pc.pills[2]}`);
  miscLine(game, 15, `11) WHITE PILLS: ${pc.pills[4]}`);
  // DS:565d 567d 5699 56b7 56d2 56e9 4a75
  miscLine(game, 17, 'THESE ARE AUTOMATICALLY IN USE:');
  miscLine(game, 18, `12) RINGS OF REGENERATION: ${pc.regenRings}`);
  miscLine(game, 19, `13) RING OF PROTECTION, PLUS ${pc.ringOfProtection}`);
  miscLine(game, 20, `14) ANTI-MAGIC RING, PLUS ${pc.antiMagicRing}`);
  miscLine(game, 21, `15) BODY ARMOR, LEVEL ${pc.bodyArmorLevel}`);
  miscLine(game, 22, `16) GAUNTLET, PLUS ${pc.gauntlet}`);
  miscLine(game, 24, 'HIT ANY KEY...');
}

/**
 * FUN_3000_a047 (WORLD.EXE 3000:a047, mw.c "FUN_3000_a047"): what the key at the inventory menu
 * opens.
 *
 * The menu takes 1 to 5 and anything else closes it, Escape included. A spell listing is two
 * pages with a wait between them, and the magic items are one.
 */
export function inventoryScreen(game: MwGame, key: number): void {
  const choice = mwMenuKey(1, 5, key) - 0x30;
  if (choice < 1 || choice > 5) return;
  game.events.push({ kind: 'pocketsRead', page: choice });
  if (choice === 5) {
    drawMiscItems(game);
    game.pressAnyKey();
    game.eraseScreen();
    return;
  }
  drawInventoryPage(game, choice, 0);
  game.pressAnyKey();
  drawInventoryPage(game, choice, 1);
  game.pressAnyKey();
  game.eraseScreen();
}

/** One of the 120 spells, with everything the character holds of it. */
export interface MwSpellHolding {
  /** 0 to 119, which record of SPELLS.HLP describes it. */
  record: number;
  /** 0 permanent, 1 preparation, 2 wizard, 3 priestly. */
  category: number;
  /** 1 to 10, the level the menu prints. */
  level: number;
  /** 0 to 2, the spell on that line. */
  slot: number;
  name: string;
  /** Whether the character can cast it out of their own head. */
  inSpellbook: boolean;
  /** How many scrolls of it are carried, each good for one casting. */
  scrolls: number;
  /** Charges left on its wand. */
  wands: number;
  /** Sheets of magic paper for it, which is the only magic a fighter has. */
  paper: number;
  /** What casting it out of the spellbook takes off the spell points, which is its level. */
  spellPointCost: number;
  /** What a permanent spell takes off the maximum as well, for good; 0 for the other three. */
  maximumCost: number;
}

/**
 * The four spell arrays of the character record, read out as the 120 spells they index.
 *
 * The inventory screens show which spells are held and the spell screen shows the cost only as a
 * sentence over the menu, so both numbers are here: MORF-66 asks the browser game to show the
 * charges on a wand, a scroll and a piece of paper, and what a spell will cost before it is cast.
 */
export function mwSpellHoldings(game: MwGame): MwSpellHolding[] {
  const holdings: MwSpellHolding[] = [];
  for (let category = 0; category < MW_SPELL_CATEGORIES.length; category++) {
    for (let index = 0; index < MW_SPELLS_PER_CATEGORY; index++) {
      const level = Math.trunc(index / MW_SPELLS_PER_LEVEL) + 1;
      const slot = index % MW_SPELLS_PER_LEVEL;
      const at = category * MW_BOOK_SLOTS_PER_CATEGORY + index;
      const record = mwSpellRecord(category, level, slot);
      holdings.push({
        record,
        category,
        level,
        slot,
        name: MW_SPELL_NAMES[record],
        inSpellbook: game.pc.spellbook[at] !== 0,
        scrolls: game.pc.scrolls[at],
        wands: game.pc.wands[at],
        paper: game.pc.paper[at],
        spellPointCost: mwSpellPointCost(level),
        maximumCost: mwMaximumSpellPointCost(category, level),
      });
    }
  }
  return holdings;
}

/**
 * What casting a spell will take off the spell points, before it is cast (WORLD.EXE 2000:ea27,
 * mw.c "spell_screen").
 *
 * A spell out of the spellbook costs its level. A scroll, a wand or a piece of magic paper costs
 * no spell points at all: one charge comes off the item instead. A permanent spell costs its level
 * off the maximum as well, which is {@link MwSpellHolding.maximumCost}.
 */
export function mwSpellCost(source: number, level: number): number {
  return source === MW_FROM_SPELLBOOK ? mwSpellPointCost(level) : 0;
}
