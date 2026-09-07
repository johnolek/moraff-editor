import { describe, expect, it } from 'vitest';
import {
  CAST_PAPER,
  CAST_SCROLL,
  CAST_SPELLBOOK,
  CAST_TYPE_MENU,
  CAST_WAND,
  castSpell,
  castTypeAllowed,
  drawCastTypeMenu,
  drawSpellList,
  printSpellLine,
  spellCharges,
  spellCost,
  spellHelp,
  SPELL_HELP_LINES,
  SPELL_HELP_RECORDS,
  spellHelpRecord,
  spellIndex,
  spellListChoice,
  showSpellHelp,
  SPELL_MENU_KEYS,
  SPELL_MENU_NAMES,
  spellMenuIndex,
} from './inventory';
import type { Rng } from './rng';
import { newGame } from './state';

/** An {@link Rng} that answers every roll with the same number. */
function always(value: number): Rng {
  return { random: () => value };
}

describe('the spell name table', () => {
  it('has thirty names in each of the four lists', () => {
    expect(SPELL_MENU_NAMES.map((list) => list.length)).toEqual([30, 30, 30, 30]);
  });

  it('keeps the exe spelling where USPELLS.HLP disagrees', () => {
    expect(SPELL_MENU_NAMES[2][6]).toBe('LIGHTNING');
    expect(SPELL_MENU_NAMES[2][7]).toBe('MAGIC MISSLE');
    expect(SPELL_MENU_NAMES[0][10]).toBe('ANTI-MAGIC RING LEVEL 1');
    expect(SPELL_MENU_NAMES[0][11]).toBe('WRITE SCROLL - LEVEL 10');
  });
});

describe('the type menu', () => {
  it('turns a fighter away from anything but paper', () => {
    const game = newGame({ pc: { cls: 0 } });
    expect(drawCastTypeMenu(game, CAST_SPELLBOOK)).toBe(false);
    expect(game.messages).toEqual([
      'FIGHTERS CAN ONLY CAST',
      '  SPELLS BY USING MAGIC',
      '  PAPER. KEEP LOOKING.',
    ]);
    expect(game.screen).toEqual([]);
  });

  it('lets a fighter at the paper menu', () => {
    const game = newGame({ pc: { cls: 0 } });
    expect(drawCastTypeMenu(game, CAST_PAPER)).toBe(true);
    expect(game.screen[0].text).toBe('SELECT THE TYPE OF PAPER:');
    expect(game.screen.slice(1).map((line) => line.text)).toEqual(CAST_TYPE_MENU);
  });

  it('names the source in the prompt', () => {
    const wand = newGame({ pc: { cls: 3 } });
    drawCastTypeMenu(wand, CAST_WAND);
    expect(wand.screen[0].text).toBe('SELECT THE TYPE OF WAND:');
  });
});

describe('the tests on the list that was picked', () => {
  it('refuses a permanent spell anywhere but the town', () => {
    const game = newGame({ pc: { cls: 3, level: 5 } });
    expect(castTypeAllowed(game, CAST_SPELLBOOK, 0)).toBe(false);
    expect(game.messages[0]).toBe('THESE SPELLS TAKE ONE MONTH');
    expect(castTypeAllowed(newGame({ pc: { cls: 3, level: 0 } }), CAST_SPELLBOOK, 0)).toBe(true);
  });

  it('refuses a preparation spell with a monster engaged', () => {
    const game = newGame({ pc: { cls: 3 }, engaged: 4 });
    expect(castTypeAllowed(game, CAST_SPELLBOOK, 1)).toBe(false);
    expect(game.messages[0]).toBe('THESE SPELLS TAKE 3 MINUTES');
  });

  it('refuses a wizard spell out of the book to a class that cannot cast one', () => {
    const priest = newGame({ pc: { cls: 4 } });
    expect(castTypeAllowed(priest, CAST_SPELLBOOK, 2)).toBe(false);
    expect(priest.messages).toEqual(['YOU ARE UNABLE TO CAST THIS', '   TYPE OF SPELLS.']);
    expect(castTypeAllowed(newGame({ pc: { cls: 3 } }), CAST_SPELLBOOK, 2)).toBe(true);
    expect(castTypeAllowed(newGame({ pc: { cls: 4 } }), CAST_SPELLBOOK, 3)).toBe(true);
  });

  it('refuses the help list for spells the class cannot cast', () => {
    expect(castTypeAllowed(newGame({ pc: { cls: 4 } }), CAST_SPELLBOOK, 6)).toBe(false);
  });

  it('lets any class cast a wizard spell off a scroll, a wand or paper', () => {
    expect(castTypeAllowed(newGame({ pc: { cls: 0 } }), CAST_PAPER, 2)).toBe(true);
    expect(castTypeAllowed(newGame({ pc: { cls: 4 } }), CAST_WAND, 2)).toBe(true);
  });
});

describe('a line of the spell menu', () => {
  it('pads the three spells out to columns 27, 53 and 79', () => {
    const line = printSpellLine(['A)', ' B)', ' C)'], ['SLEEP', 'MAGIC ZAP', 'MINOR PROTECTION'], [1, 1, 1]);
    expect(line).toBe('A)SLEEP'.padEnd(27) + ' B)MAGIC ZAP'.padEnd(26) + ' C)MINOR PROTECTION'.padEnd(26));
    expect(line.length).toBe(79);
  });

  it('says NOT YET FOUND for a spell the character has none of', () => {
    const line = printSpellLine(['A)', ' B)', ' C)'], ['SLEEP', 'MAGIC ZAP', 'MINOR PROTECTION'], [1, 0, 3]);
    expect(line.slice(27, 53).trimEnd()).toBe(' B)NOT YET FOUND');
  });
});

describe('the keys the spell menu takes', () => {
  it('runs A to Z and then 1 to 4', () => {
    expect(spellMenuIndex('A')).toBe(0);
    expect(spellMenuIndex('a')).toBe(0);
    expect(spellMenuIndex('Z')).toBe(25);
    expect(spellMenuIndex('1')).toBe(26);
    expect(spellMenuIndex('4')).toBe(29);
    expect(SPELL_MENU_KEYS.length).toBe(30);
  });

  it('takes the four keys between Z and the digits as the same four spells', () => {
    expect(spellMenuIndex('[')).toBe(26);
    expect(spellMenuIndex('^')).toBe(29);
  });

  it('picks a spell the character has and ignores one they do not', () => {
    const game = newGame({ pc: { cls: 3 } });
    game.pc.spellbook[spellIndex(2, 0, 0)] = 1;
    expect(spellListChoice(game, CAST_SPELLBOOK, 2, 'A')).toEqual({
      kind: 'spell',
      index: 0,
      level: 0,
      slot: 0,
    });
    expect(spellListChoice(game, CAST_SPELLBOOK, 2, 'B')).toEqual({ kind: 'ignored' });
  });

  it('reads a wand run down to no charges as a spell that is not there', () => {
    const game = newGame({ pc: { cls: 3 } });
    game.pc.wands[spellIndex(2, 0, 0)] = 0;
    expect(spellListChoice(game, CAST_WAND, 2, 'A')).toEqual({ kind: 'ignored' });
  });

  it('gives up on escape and swaps the layout on 5', () => {
    const game = newGame({ pc: { cls: 3 } });
    expect(spellListChoice(game, CAST_SPELLBOOK, 2, '\x1b')).toEqual({ kind: 'escape' });
    expect(spellListChoice(game, CAST_SPELLBOOK, 2, '5')).toEqual({ kind: 'switchLayout' });
  });

  it('takes the key for a help list off the same list of thirty', () => {
    const game = newGame({ pc: { cls: 3 } });
    game.pc.spellbook[spellIndex(2, 9, 2)] = 1;
    expect(spellListChoice(game, CAST_SPELLBOOK, 6, '4')).toEqual({
      kind: 'spell',
      index: 29,
      level: 9,
      slot: 2,
    });
  });
});

describe('the spell table on the screen', () => {
  it('draws ten lines with the keys in front of the names', () => {
    const game = newGame({ pc: { cls: 3 } });
    game.pc.spellbook[spellIndex(2, 0, 1)] = 1;
    drawSpellList(game, CAST_SPELLBOOK, 2);
    expect(game.screen[0].text).toBe('SELECT A SPELL-SPELLS USE ONE SPELL POINT PER LEVEL:');
    expect(game.screen[1].text).toBe('ESCAPE');
    expect(game.screen[2].text.slice(0, 27)).toBe('A)NOT YET FOUND'.padEnd(27));
    expect(game.screen[2].text.slice(27, 53)).toBe(' B)MAGIC ZAP'.padEnd(26));
    expect(game.screen[2].y).toBe(0x28);
    expect(game.screen[11].y).toBe(0x188);
    expect(game.screen[12].text).toBe(
      'SPELLS ON LINE 1 USE 1 SPELL POINT, ON LINE 3 THEY USE 3, LINE 7 USE 7, ETC.',
    );
  });

  it('heads a help list with the line about descriptions', () => {
    const game = newGame({ pc: { cls: 3 } });
    drawSpellList(game, CAST_SPELLBOOK, 6);
    expect(game.screen[0].text).toBe('PRESS A LETTER OR A NUMBER TO GET A DESCRIPTION:');
  });

  it('heads a scroll list with the plain line', () => {
    const game = newGame({ pc: { cls: 3 } });
    drawSpellList(game, CAST_SCROLL, 2);
    expect(game.screen[0].text).toBe('SELECT A SPELL FROM THE FOLLOWING:');
  });

  it('draws the miniature layout down the menu column with the keys beside it', () => {
    const game = newGame({ pc: { cls: 3 } });
    game.pc.spellbook[spellIndex(2, 0, 0)] = 1;
    drawSpellList(game, CAST_SPELLBOOK, 2, true);
    const names = game.screen.filter((line) => line.font === 1 && line.x === 0x3a2);
    expect(names.length).toBe(10);
    expect(names[0].text.slice(0, 27)).toBe(' )SLEEP'.padEnd(27));
    expect(names[0].y).toBe(0x326);
    const letters = game.screen.filter((line) => line.font === 2 && line.text.length === 1);
    expect(letters.length).toBe(30);
    expect(letters[0]).toEqual({ text: 'A', x: 0x39c, y: 0x323, font: 2, colour: 8 });
    expect(letters[29]).toEqual({ text: '4', x: 0x564, y: 0x323 + 9 * 0x25, font: 2, colour: 8 });
  });
});

describe('casting the spell', () => {
  it('takes the spell level in spell points off the spellbook', () => {
    const game = newGame({ rng: always(1), pc: { cls: 3, sp: 10, level: 0, resistPoisonTimer: 0 } });
    // Wizard battle level 5 slot 1: Resist Poison, which asks nothing of the world.
    const result = castSpell(game, CAST_SPELLBOOK, 2, 4, 2);
    expect(game.pc.sp).toBe(5);
    expect(result.seconds).toBe(10);
  });

  it('refuses a spell the character cannot pay for and casts nothing', () => {
    const game = newGame({ rng: always(1), pc: { cls: 3, sp: 4, resistPoisonTimer: 0 } });
    const result = castSpell(game, CAST_SPELLBOOK, 2, 4, 2);
    expect(game.messages).toEqual([
      'YOU DO NOT HAVE ENOUGH',
      '   SPELL POINTS TO CAST',
      '   THIS SPELL.',
    ]);
    expect(game.pc.sp).toBe(4);
    expect(game.pc.resistPoisonTimer).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it('spends a charge off a wand and no spell points', () => {
    const game = newGame({ rng: always(1), pc: { cls: 0, sp: 0, resistPoisonTimer: 0 } });
    game.pc.wands[spellIndex(2, 4, 2)] = 5;
    castSpell(game, CAST_WAND, 2, 4, 2);
    expect(game.pc.wands[spellIndex(2, 4, 2)]).toBe(4);
    expect(game.pc.sp).toBe(0);
  });

  it('spends a scroll and a sheet of paper the same way', () => {
    const scroll = newGame({ rng: always(1), pc: { cls: 0, resistPoisonTimer: 0 } });
    scroll.pc.scrolls[spellIndex(2, 4, 2)] = 2;
    castSpell(scroll, CAST_SCROLL, 2, 4, 2);
    expect(scroll.pc.scrolls[spellIndex(2, 4, 2)]).toBe(1);
    const paper = newGame({ rng: always(1), pc: { cls: 0, resistPoisonTimer: 0 } });
    paper.pc.papers[spellIndex(2, 4, 2)] = 2;
    castSpell(paper, CAST_PAPER, 2, 4, 2);
    expect(paper.pc.papers[spellIndex(2, 4, 2)]).toBe(1);
  });

  it('charges nothing for a spell that gives up', () => {
    // Wizard battle level 1 slot 2: Magic Zap, which needs a monster to aim at and has none.
    const game = newGame({ rng: always(1), pc: { cls: 3, sp: 10 }, engaged: -1 });
    const result = castSpell(game, CAST_SPELLBOOK, 2, 0, 1);
    expect(game.pc.sp).toBe(10);
    expect(result.seconds).toBe(0);
  });

  it('takes a permanent spell off the maximum spell points and costs ten hours', () => {
    const game = newGame({ rng: always(1), pc: { cls: 3, sp: 20, maxSp: 20, level: 0, maxHp: 50 } });
    // Permanent level 1 slot 2: Extra Health Point.
    const result = castSpell(game, CAST_SPELLBOOK, 0, 0, 1);
    expect(game.pc.maxHp).toBe(51);
    expect(game.pc.sp).toBe(19);
    expect(game.pc.maxSp).toBe(19);
    expect(result.seconds).toBe(0x8d00);
  });

  it('costs a hundred seconds for a preparation spell', () => {
    const game = newGame({ rng: always(1), pc: { cls: 3, sp: 20, level: 0, hp: 10, maxHp: 50 } });
    // Preparation level 1 slot 3: Little Cure.
    const result = castSpell(game, CAST_SPELLBOOK, 1, 0, 2);
    expect(result.seconds).toBe(100);
  });

  it('costs one second when the spell moved the character to another floor', () => {
    const game = newGame({ rng: always(1), pc: { cls: 3, sp: 20, level: 5 } });
    // Preparation level 4 slot 3: Descend.
    const result = castSpell(game, CAST_SPELLBOOK, 1, 3, 2);
    expect(game.pc.level).toBe(6);
    expect(result.seconds).toBe(1);
  });
});

describe('what a spell costs before it is cast', () => {
  it('is the line of the book the spell is on', () => {
    expect(spellCost(0)).toBe(1);
    expect(spellCost(9)).toBe(10);
  });

  it('reads the charges the record holds', () => {
    const game = newGame();
    game.pc.wands[spellIndex(3, 2, 1)] = 5;
    game.pc.papers[spellIndex(0, 0, 0)] = 2;
    expect(spellCharges(game.pc, CAST_WAND, 3, 2, 1)).toBe(5);
    expect(spellCharges(game.pc, CAST_PAPER, 0, 0, 0)).toBe(2);
    expect(spellCharges(game.pc, CAST_SCROLL, 0, 0, 0)).toBe(0);
  });
});

describe("a spell's description", () => {
  it('reads the first record without the space the file opens with', () => {
    expect(spellHelp(0)).toEqual([
      'ENCHANT WEAPON LEVEL 1:',
      '  TURN NORMAL WEAPON INTO',
      'PLUS 1 MAGICAL WEAPON.',
    ]);
  });

  it('reads a later record without the newline that ended the one before', () => {
    expect(spellHelp(1)[0]).toBe('EXTRA HEALTH POINT:');
    expect(spellHelp(119)[0]).toBe('MAJOR SHOCK: DOES 300');
  });

  it('has a record for all 120 spells and none past them', () => {
    for (let record = 0; record < SPELL_HELP_RECORDS; record += 1) {
      expect(spellHelp(record).length).toBeGreaterThan(0);
      expect(spellHelp(record).length).toBeLessThanOrEqual(SPELL_HELP_LINES);
    }
    expect(() => spellHelp(SPELL_HELP_RECORDS)).toThrow();
  });

  it('numbers its records the way the four menus do', () => {
    expect(spellHelpRecord(0, 0, 0)).toBe(0);
    expect(spellHelpRecord(2, 0, 1)).toBe(61);
    expect(spellHelpRecord(3, 9, 2)).toBe(119);
  });

  it('puts the description down the menu column under the prompt', () => {
    const game = newGame({ pc: { cls: 3 } });
    showSpellHelp(game, 2, 0, 1);
    expect(game.screen[0].text).toBe('HIT A KEY WHEN FINISHED');
    expect(game.screen.slice(1).map((line) => line.text)).toEqual(spellHelp(61));
    expect(game.screen[1].text).toBe('MAGIC ZAP: ZAPS ANY');
  });
});
