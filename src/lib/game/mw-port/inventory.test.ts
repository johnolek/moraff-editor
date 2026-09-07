import { describe, expect, it } from 'vitest';
import {
  drawInventoryMenu,
  drawInventoryPage,
  drawMiscItems,
  inventoryScreen,
  mwSpellCost,
  mwSpellHoldings,
} from './inventory';
import { MW_FROM_PAPER, MW_FROM_SCROLL, MW_FROM_SPELLBOOK, MW_FROM_WAND } from './magic';
import { MW_ESCAPE } from './screens';
import { MW_BOOK_SLOTS_PER_CATEGORY } from './spells';
import { newMwGame } from './state';

describe('drawInventoryMenu', () => {
  it('offers the four spell listings and the magic items', () => {
    const game = newMwGame();
    drawInventoryMenu(game);
    expect(game.messages).toEqual([
      'WHICH DO YOU WISH TO SEE?',
      '1) SPELLBOOKS',
      '2) SCROLLS',
      '3) WANDS',
      '4) PAPERS',
      '5) MISC. MAGIC ITEMS',
      '',
      'ANY OTHER KEY TO RETURNS...',
    ]);
  });
});

describe('drawInventoryPage', () => {
  it('names the spells held and leaves the rest of the column blank', () => {
    const game = newMwGame();
    game.pc.spellbook[0] = 1;
    game.pc.spellbook[MW_BOOK_SLOTS_PER_CATEGORY + 2] = 1;
    drawInventoryPage(game, MW_FROM_SPELLBOOK, 0);
    expect(game.messages.slice(0, 3)).toEqual([
      'LEVEL',
      'PERMANENT SPELLS',
      'PREPARATION SPELLS',
    ]);
    expect(game.messages).toContain('ENCHANT WEAPON LEVEL 1');
    expect(game.messages).toContain('LITTLE CURE');
    expect(game.messages).not.toContain('EXTRA HEALTH POINT');
  });

  it('prints the level three times over, once beside each spell of it', () => {
    const game = newMwGame();
    drawInventoryPage(game, MW_FROM_WAND, 0);
    const levels = game.screen.filter((line) => line.x === 0x1e).map((line) => line.text);
    expect(levels).toHaveLength(30);
    expect(levels.slice(0, 4)).toEqual(['1', '1', '1', '2']);
  });

  it('reads the wizard and priestly halves on the second page', () => {
    const game = newMwGame();
    game.pc.wands[MW_BOOK_SLOTS_PER_CATEGORY * 2] = 3;
    game.pc.wands[MW_BOOK_SLOTS_PER_CATEGORY * 3 + 29] = 1;
    drawInventoryPage(game, MW_FROM_WAND, 1);
    expect(game.messages.slice(1, 3)).toEqual(['WIZARD BATTLE SPELLS', 'PRIEST BATTLE SPELLS']);
    expect(game.messages).toContain('SLEEP');
    expect(game.messages).toContain('MAJOR SHOCK');
  });
});

describe('drawMiscItems', () => {
  it('counts the items, the pills out of record order, and the worn magic', () => {
    const game = newMwGame({
      pc: {
        grenades: 2,
        teleportStones: 3,
        seeingStones: 4,
        floorSloshers: 1,
        healingPotions: 5,
        pills: [6, 7, 8, 9, 10, 11],
        regenRings: 12,
        ringOfProtection: 13,
        antiMagicRing: 14,
        bodyArmorLevel: 15,
        gauntlet: 16,
      },
    });
    drawMiscItems(game);
    expect(game.messages).toEqual([
      'MISC. MAGIC ITEMS:',
      "HIT 'I' AND '5' TO USE THESE:",
      '1) HOLY HAND GRENADES: 2',
      '2) STONES OF TELEPORTATION: 3',
      '3) STONES OF SEEING: 4',
      '4) FLOOR SLOSHERS: 1',
      '5) POTION OF HEALING: 5',
      "HIT 'I' AND '4' TO USE THESE:",
      '6) GREEN PILLS: 7',
      '7) ORANGE PILLS: 6',
      '8) YELLOW PILLS: 11',
      '9) RED PILLS: 9',
      '10) BLUE PILLS: 8',
      '11) WHITE PILLS: 10',
      'THESE ARE AUTOMATICALLY IN USE:',
      '12) RINGS OF REGENERATION: 12',
      '13) RING OF PROTECTION, PLUS 13',
      '14) ANTI-MAGIC RING, PLUS 14',
      '15) BODY ARMOR, LEVEL 15',
      '16) GAUNTLET, PLUS 16',
      'HIT ANY KEY...',
    ]);
  });

  it('leaves a blank row between the three groups', () => {
    const game = newMwGame();
    drawMiscItems(game);
    const rows = game.screen.map((line) => line.y / 0x28);
    expect(rows.slice(0, 3)).toEqual([0, 2, 3]);
    expect(rows).not.toContain(1);
  });
});

describe('inventoryScreen', () => {
  it('shows both pages of the listing the key names', () => {
    const game = newMwGame();
    game.pc.scrolls[0] = 4;
    inventoryScreen(game, 0x32);
    expect(game.messages).toContain('PERMANENT SPELLS');
    expect(game.messages).toContain('PRIEST BATTLE SPELLS');
    expect(game.messages).toContain('ENCHANT WEAPON LEVEL 1');
  });

  it('shows the magic items for 5', () => {
    const game = newMwGame();
    inventoryScreen(game, 0x35);
    expect(game.messages[0]).toBe('MISC. MAGIC ITEMS:');
  });

  it('shows nothing on any other key', () => {
    for (const key of [0x36, 0x30, MW_ESCAPE]) {
      const game = newMwGame();
      inventoryScreen(game, key);
      expect(game.messages).toEqual([]);
    }
  });
});

describe('mwSpellHoldings', () => {
  it('carries the charges of all four arrays for every one of the 120 spells', () => {
    const game = newMwGame();
    game.pc.spellbook[MW_BOOK_SLOTS_PER_CATEGORY * 2] = 1;
    game.pc.wands[MW_BOOK_SLOTS_PER_CATEGORY * 2] = 5;
    game.pc.scrolls[MW_BOOK_SLOTS_PER_CATEGORY * 2] = 2;
    game.pc.paper[MW_BOOK_SLOTS_PER_CATEGORY * 2] = 3;
    const holdings = mwSpellHoldings(game);
    expect(holdings).toHaveLength(120);
    expect(holdings[60]).toEqual({
      record: 60,
      category: 2,
      level: 1,
      slot: 0,
      name: 'SLEEP',
      inSpellbook: true,
      scrolls: 2,
      wands: 5,
      paper: 3,
      spellPointCost: 1,
      maximumCost: 0,
    });
  });

  it('charges a permanent spell its level off the maximum as well', () => {
    const holdings = mwSpellHoldings(newMwGame());
    expect(holdings[29]).toMatchObject({ level: 10, spellPointCost: 10, maximumCost: 10 });
    expect(holdings[59]).toMatchObject({ level: 10, spellPointCost: 10, maximumCost: 0 });
  });
});

describe('mwSpellCost', () => {
  it('charges the level out of the spellbook and nothing off an item', () => {
    expect(mwSpellCost(MW_FROM_SPELLBOOK, 7)).toBe(7);
    expect(mwSpellCost(MW_FROM_SCROLL, 7)).toBe(0);
    expect(mwSpellCost(MW_FROM_WAND, 7)).toBe(0);
    expect(mwSpellCost(MW_FROM_PAPER, 7)).toBe(0);
  });
});
