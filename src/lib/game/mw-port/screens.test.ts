import { describe, expect, it } from 'vitest';
import {
  MW_FROM_PAPER,
  MW_FROM_SCROLL,
  MW_FROM_SPELLBOOK,
  MW_FROM_WAND,
} from './magic';
import {
  MW_ESCAPE,
  MW_HELP_FILES,
  MW_HELP_TOPICS,
  MW_SPELL_CATEGORY_MENU,
  applySpellCategory,
  drawHelpMenu,
  drawMonsterInfo,
  drawSpellCategoryMenu,
  drawSpellGrid,
  drawSpellsInForce,
  drawWriteSpellCategoryMenu,
  drawWriteSpellLevelMenu,
  drawWriteSpellSlotMenu,
  helpMenuFile,
  mwHelpPages,
  mwLineMenuKey,
  mwMenuKey,
  mwSpellTimers,
  showHelp,
  showSpellDescription,
  spellGridKey,
  viewStats,
  writeSpellCategoryKey,
  writeSpellLevelKey,
} from './screens';
import { MW_BOOK_SLOTS_PER_CATEGORY, mwSpellHelp, mwSpellRecord } from './spells';
import { mwSetOccupant, newMwGame } from './state';

describe('mwMenuKey', () => {
  it('takes the digits the two line numbers span and hands the key back', () => {
    expect(mwMenuKey(1, 5, 0x31)).toBe(0x31);
    expect(mwMenuKey(1, 5, 0x35)).toBe(0x35);
    expect(mwMenuKey(1, 5, 0x36)).toBe(-1);
    expect(mwMenuKey(1, 5, 0x30)).toBe(-1);
  });

  it('counts the span rather than the numbers themselves', () => {
    expect(mwMenuKey(2, 4, 0x33)).toBe(0x33);
    expect(mwMenuKey(2, 4, 0x34)).toBe(-1);
  });

  it('lets Escape through whatever the range', () => {
    expect(mwMenuKey(1, 5, MW_ESCAPE)).toBe(MW_ESCAPE);
  });
});

describe('mwLineMenuKey', () => {
  it('hands back the digit rather than the key', () => {
    expect(mwLineMenuKey(1, 8, 0x33)).toBe(3);
    expect(mwLineMenuKey(1, 8, 0x39)).toBe(-1);
    expect(mwLineMenuKey(1, 8, MW_ESCAPE)).toBe(-1);
  });

  it('takes any key at all when the low digit is -1', () => {
    expect(mwLineMenuKey(-1, 0, 0x71)).toBe(0x71);
    expect(mwLineMenuKey(-1, 0, MW_ESCAPE)).toBe(MW_ESCAPE);
  });
});

describe('viewStats', () => {
  const rolled = {
    name: 'GRIMBOLD',
    race: 2,
    sex: 1,
    cls: 4,
    money: 70,
    bank: 800,
    loadedWeight: 145,
    weight: 100,
    height: 48,
    str: 15,
    iq: 8,
    wis: 14,
    con: 16,
    dex: 11,
    luck: 9,
    weapon: 5,
    armor: 2,
  };

  it('draws the eighteen lines a healthy character has', () => {
    const game = newMwGame({ pc: rolled });
    viewStats(game);
    expect(game.messages).toEqual([
      'VIEW STATS FOR GRIMBOLD',
      'RACE: DWARF',
      'SEX: FEMALE',
      'CLASS: PRIEST',
      'MONEY IN POCKET: 70',
      'MONEY IN BANK: 800',
      'TOTAL MONEY: 870',
      'LOADED WEIGHT: 145',
      'NAKED WEIGHT: 100',
      'HEIGHT (INCHES): 48',
      'STRENGTH: 15',
      'INTELLIGENCE: 8',
      'WISDOM: 14',
      'CONSTITUTION: 16',
      'AGILITY: 11',
      'LUCK: 9',
      'WEAPON IN HAND: SHORTSWORD',
      'CURRENT ARMOR: CHAIN',
      'RAISE DEAD CONTRACT IS IN EFFECT',
      'HIT ANY KEY TO RETURN TO GAME...',
    ]);
  });

  it('adds the two clocks and the body armor when they are running', () => {
    const game = newMwGame({
      pc: { ...rolled, diseaseTimer: 42, poisonTimer: 7, bodyArmorLevel: 3, returnX: -1 },
    });
    viewStats(game);
    expect(game.messages).toContain('YOU ARE DISEASED-MOVES LEFT UNTIL');
    expect(game.messages).toContain('  CONSTITUTION DRAINED: 42');
    expect(game.messages).toContain('YOU ARE POISONED-MOVES LEFT UNTIL');
    expect(game.messages).toContain('  STRENGTH DRAINED: 7');
    expect(game.messages).toContain('BODY ARMOR - PLUS 3');
    expect(game.messages).toContain('NO RAISE DEAD CONTRACT IS IN EFFECT');
  });

  it('leaves the panel clear once the key has been pressed', () => {
    const game = newMwGame({ pc: rolled });
    viewStats(game);
    expect(game.screen).toEqual([]);
  });
});

describe('drawSpellsInForce', () => {
  it('names only the preparation spells that are up', () => {
    const game = newMwGame({
      pc: { enchantWeaponLevel: 2, feather: 100, superAgility: 10, speedTimer: 40 },
    });
    drawSpellsInForce(game, 0);
    expect(game.messages).toEqual([
      'WEAPONS, PLUS 2',
      'FEATHER',
      'SUPER AGILITY',
      'BATTLE SPEED',
    ]);
  });

  it('names only the battle spells that are up', () => {
    const game = newMwGame({
      pc: { protectionLevel: 3, sleepTimer: 5, antiFireTimer: 12, antiColdTimer: 0 },
    });
    drawSpellsInForce(game, 1);
    expect(game.messages).toEqual(['PROTECT, LEVEL 3', 'STOP MONSTER', 'ANTI-FIRE']);
  });

  it('draws nothing at all with no spell running', () => {
    const game = newMwGame();
    drawSpellsInForce(game, 0);
    drawSpellsInForce(game, 1);
    expect(game.messages).toEqual([]);
  });
});

describe('mwSpellTimers', () => {
  it('carries the number behind each line of the panel', () => {
    const game = newMwGame({
      pc: { slowEnemiesTimer: 37, powerWeaponLevel: 2, powerWeaponTimer: 88, poisonTimer: 4 },
    });
    const timers = mwSpellTimers(game);
    expect(timers.find((timer) => timer.label === 'SLOW MONSTER')?.turns).toBe(37);
    expect(timers.find((timer) => timer.label === 'POWER WEAPON')?.turns).toBe(88);
    expect(timers.find((timer) => timer.label === 'POISON')?.turns).toBe(4);
  });
});

describe('drawMonsterInfo', () => {
  const nearby = (dx: number, dy: number) => {
    const game = newMwGame({
      pc: { x: 20, y: 30, floor: 5 },
      monsters: [{ x: 20 + dx, y: 30 + dy, hp: 46, type: 1, depth: 5 }],
    });
    mwSetOccupant(game, 20 + dx, 30 + dy, 0);
    return game;
  };

  it('gives the level, the hit points and the experience', () => {
    const game = nearby(0, -1);
    drawMonsterInfo(game, 0x2d4, 7, 20, 29);
    expect(game.messages).toEqual([
      'LEVEL:5',
      'HP:46',
      `EXP. VALUE: ${(5 * 1.23 ** 5 + 6).toFixed(0).padEnd(20)}`,
    ]);
  });

  it('shortens the level label past level 9 and the experience label past floor 10', () => {
    const game = newMwGame({
      pc: { x: 20, y: 30, floor: 20 },
      monsters: [{ x: 20, y: 29, hp: 8, type: 1, depth: 20 }],
    });
    mwSetOccupant(game, 20, 29, 0);
    drawMonsterInfo(game, 0x2d4, 7, 20, 29);
    expect(game.messages[0]).toBe('LEV:20');
    expect(game.messages[2].startsWith('EXP: ')).toBe(true);
  });

  it('puts the hit points on the side of the screen the monster is on', () => {
    const west = nearby(-1, 0);
    drawMonsterInfo(west, 0x11d, 0x1b5, 19, 30);
    expect(west.screen.find((line) => line.text.startsWith('HP:'))).toMatchObject({
      x: 0x11d + 0xdb,
      y: 0x1b2,
    });

    const east = nearby(1, 0);
    drawMonsterInfo(east, 0x48b, 0x1b5, 21, 30);
    expect(east.screen.find((line) => line.text.startsWith('HP:'))).toMatchObject({
      x: 0x48b + 0xdb,
      y: 0x1b2,
    });
  });

  it('draws nothing when the square is empty', () => {
    const game = newMwGame({ pc: { x: 20, y: 30 } });
    drawMonsterInfo(game, 0x2d4, 7, 20, 29);
    expect(game.messages).toEqual([]);
  });
});

describe('drawSpellCategoryMenu', () => {
  it('turns a fighter away from the spellbook, the scrolls and the wands', () => {
    for (const source of [MW_FROM_SPELLBOOK, MW_FROM_SCROLL, MW_FROM_WAND]) {
      const game = newMwGame({ pc: { cls: 0 } });
      expect(drawSpellCategoryMenu(game, source)).toBe(false);
      expect(game.messages[0]).toBe('FIGHTERS CAN ONLY CAST');
    }
  });

  it('lets a fighter at the magic paper', () => {
    const game = newMwGame({ pc: { cls: 0 } });
    expect(drawSpellCategoryMenu(game, MW_FROM_PAPER)).toBe(true);
    expect(game.messages).toEqual([
      'SELECT THE TYPE OF PAPER:',
      ...MW_SPELL_CATEGORY_MENU,
    ]);
  });

  it('heads the menu after the source', () => {
    const game = newMwGame({ pc: { cls: 3 } });
    drawSpellCategoryMenu(game, MW_FROM_WAND);
    expect(game.messages[0]).toBe('SELECT THE TYPE OF WAND:');
  });
});

describe('applySpellCategory', () => {
  it('refuses the permanent spells anywhere but the town', () => {
    const game = newMwGame({ pc: { cls: 3, floor: 4 } });
    expect(applySpellCategory(game, MW_FROM_SPELLBOOK, 1)).toBe(-1);
    expect(game.messages[0]).toBe('THESE SPELLS TAKE ONE MONTH');
    expect(applySpellCategory(newMwGame({ pc: { cls: 3 } }), MW_FROM_SPELLBOOK, 1)).toBe(0);
  });

  it('refuses the preparation spells with a monster engaged', () => {
    const game = newMwGame({ pc: { cls: 3 }, engaged: 2 });
    expect(applySpellCategory(game, MW_FROM_PAPER, 2)).toBe(-1);
    expect(game.messages[0]).toBe('THESE SPELLS TAKE 3 MINUTES');
  });

  it('gates the wizard and priestly lines on the class, out of the spellbook alone', () => {
    const priest = newMwGame({ pc: { cls: 4 } });
    expect(applySpellCategory(priest, MW_FROM_SPELLBOOK, 3)).toBe(-1);
    expect(priest.messages[0]).toBe('YOU ARE UNABLE TO CAST THIS');
    expect(applySpellCategory(newMwGame({ pc: { cls: 4 } }), MW_FROM_SPELLBOOK, 4)).toBe(3);
    expect(applySpellCategory(newMwGame({ pc: { cls: 4 } }), MW_FROM_SCROLL, 3)).toBe(2);
  });

  it('gates the help lines the same way', () => {
    const priest = newMwGame({ pc: { cls: 4 } });
    expect(applySpellCategory(priest, MW_FROM_SPELLBOOK, 7)).toBe(-1);
    expect(applySpellCategory(newMwGame({ pc: { cls: 4 } }), MW_FROM_SPELLBOOK, 8)).toBe(7);
  });

  it('closes on Escape', () => {
    expect(applySpellCategory(newMwGame({ pc: { cls: 3 } }), MW_FROM_SPELLBOOK, -1)).toBe(-1);
  });
});

describe('drawSpellGrid', () => {
  const wizardWithTwoSpells = () => {
    const game = newMwGame({ pc: { cls: 3 } });
    game.pc.spellbook[MW_BOOK_SLOTS_PER_CATEGORY * 2] = 1;
    game.pc.spellbook[MW_BOOK_SLOTS_PER_CATEGORY * 2 + 2] = 1;
    return game;
  };

  it('pads the three spells of a row into their columns', () => {
    const game = wizardWithTwoSpells();
    drawSpellGrid(game, MW_FROM_SPELLBOOK, 2);
    const row = game.messages[2];
    expect(row.slice(0, 0x1b)).toBe('1- A)SLEEP'.padEnd(0x1b));
    expect(row.slice(0x1b, 0x35)).toBe(' B)NOT YET FOUND'.padEnd(0x35 - 0x1b));
    expect(row.slice(0x35)).toBe(' C)MINOR PROTECTION'.padEnd(0x4f - 0x35));
  });

  it('heads the grid by what the screen is for', () => {
    const book = wizardWithTwoSpells();
    drawSpellGrid(book, MW_FROM_SPELLBOOK, 2);
    expect(book.messages[0]).toBe('SELECT A SPELL-SPELLS USE ONE SPELL POINT PER LEVEL:');

    const help = wizardWithTwoSpells();
    drawSpellGrid(help, MW_FROM_SPELLBOOK, 6);
    expect(help.messages[0]).toBe('PRESS A LETTER OR A NUMBER TO GET A DESCRIPTION:');

    const wand = wizardWithTwoSpells();
    drawSpellGrid(wand, MW_FROM_WAND, 2);
    expect(wand.messages[0]).toBe('SELECT A SPELL FROM THE FOLLOWING:');
  });

  it('draws ten rows under the heading and the escape', () => {
    const game = wizardWithTwoSpells();
    drawSpellGrid(game, MW_FROM_SPELLBOOK, 2);
    expect(game.messages).toHaveLength(12);
    expect(game.messages[1]).toBe('ESCAPE');
    expect(game.messages[11].startsWith('10-2)')).toBe(true);
  });
});

describe('spellGridKey', () => {
  const holdingEverything = () => {
    const game = newMwGame({ pc: { cls: 3 } });
    game.pc.spellbook.fill(1);
    return game;
  };

  it('reads A to Z and then 1 to 4 across the thirty spells', () => {
    const game = holdingEverything();
    expect(spellGridKey(game, MW_FROM_SPELLBOOK, 2, 0x41)).toBe(0);
    expect(spellGridKey(game, MW_FROM_SPELLBOOK, 2, 0x61)).toBe(0);
    expect(spellGridKey(game, MW_FROM_SPELLBOOK, 2, 0x5a)).toBe(25);
    expect(spellGridKey(game, MW_FROM_SPELLBOOK, 2, 0x31)).toBe(26);
    expect(spellGridKey(game, MW_FROM_SPELLBOOK, 2, 0x34)).toBe(29);
    expect(spellGridKey(game, MW_FROM_SPELLBOOK, 2, 0x35)).toBe(-1);
  });

  it('throws away the key of a spell that is not held', () => {
    const game = newMwGame({ pc: { cls: 3 } });
    expect(spellGridKey(game, MW_FROM_SPELLBOOK, 2, 0x41)).toBe(-1);
    game.pc.spellbook[MW_BOOK_SLOTS_PER_CATEGORY * 2] = 1;
    expect(spellGridKey(game, MW_FROM_SPELLBOOK, 2, 0x41)).toBe(0);
  });

  it('reads the same category behind a help line', () => {
    const game = holdingEverything();
    expect(spellGridKey(game, MW_FROM_SPELLBOOK, 6, 0x41)).toBe(0);
  });
});

describe('showSpellDescription', () => {
  it('shows the record the help line and the grid name between them', () => {
    const game = newMwGame();
    showSpellDescription(game, 6, 0, 0);
    expect(game.messages[0]).toBe(mwSpellHelp(mwSpellRecord(2, 1, 0))[0]);
    expect(game.messages[0]).toContain('SLEEP');
  });
});

describe('the write scroll and enchant wand menus', () => {
  it('dashes out the categories the class cannot cast', () => {
    const priest = newMwGame({ pc: { cls: 4 } });
    drawWriteSpellCategoryMenu(priest);
    expect(priest.messages).toEqual([
      'PLEASE SELECT A TYPE OF SPELL:',
      '',
      '1) PREPARATION SPELLS',
      '2) -------------',
      '3) PRIESTLY SPELLS',
    ]);
  });

  it('takes the key of a dashed-out category all the same', () => {
    expect(writeSpellCategoryKey(0x32)).toBe(2);
    expect(writeSpellCategoryKey(0x33)).toBe(3);
    expect(writeSpellCategoryKey(0x34)).toBe(-1);
    expect(writeSpellCategoryKey(MW_ESCAPE)).toBe(-1);
  });

  it('offers the tenth level only when the spell reaches it', () => {
    const three = newMwGame();
    drawWriteSpellLevelMenu(three, 3);
    expect(three.messages).toEqual([
      'PLEASE SELECT A THE LEVEL',
      '   SPELL YOU WISH ENCHANT.',
      'MAXIMUM LEVEL: 3',
      '',
      '',
      '',
      'HIT ESC FOR PREVIOUS MENU',
    ]);

    const ten = newMwGame();
    drawWriteSpellLevelMenu(ten, 10);
    expect(ten.messages[4]).toBe("HIT 0 FOR 10'TH LEVEL");
  });

  it('keys the tenth level to 0 and nothing past the maximum', () => {
    expect(writeSpellLevelKey(3, 0x31)).toBe(0);
    expect(writeSpellLevelKey(3, 0x33)).toBe(2);
    expect(writeSpellLevelKey(3, 0x34)).toBe(-1);
    expect(writeSpellLevelKey(3, 0x30)).toBe(-1);
    expect(writeSpellLevelKey(10, 0x30)).toBe(9);
    expect(writeSpellLevelKey(10, MW_ESCAPE)).toBe(-1);
  });

  it('names the three spells and keeps the level hint under them', () => {
    const game = newMwGame();
    drawWriteSpellSlotMenu(game, 10, 2, 0);
    expect(game.messages).toEqual([
      '1) SLEEP',
      '2) MAGIC ZAP',
      '3) MINOR PROTECTION',
      '4) PREVIOUS MENU',
      "HIT 0 FOR 10'TH LEVEL",
    ]);

    const shallow = newMwGame();
    drawWriteSpellSlotMenu(shallow, 3, 2, 0);
    expect(shallow.messages).toHaveLength(4);
  });
});

describe('the help files', () => {
  it('has the twenty-eight the game folder holds, with no 18 or 19', () => {
    expect(MW_HELP_FILES).toHaveLength(28);
    expect(MW_HELP_FILES).toContain(17);
    expect(MW_HELP_FILES).not.toContain(18);
    expect(MW_HELP_FILES).not.toContain(19);
    expect(MW_HELP_FILES).toContain(20);
  });

  it('has a file behind every line of the menu', () => {
    for (const topic of MW_HELP_TOPICS) expect(MW_HELP_FILES).toContain(topic.file);
  });

  it('reads the save file page in the colours it names', () => {
    const pages = mwHelpPages(0);
    expect(pages).not.toBeNull();
    expect(pages?.[0][0]).toEqual({ colour: 4, text: 'THE SAVE COMMAND:' });
    expect(pages?.[0][2].colour).toBe(5);
  });

  it('gives back nothing for a file the folder does not have', () => {
    expect(mwHelpPages(18)).toBeNull();
  });
});

describe('showHelp', () => {
  it('draws the lines of a page forty apart and skips the blank ones', () => {
    const game = newMwGame();
    showHelp(game, 15);
    expect(game.messages[0]).toBe("HIT 'Z' TO ZOOM IN ON ANY VIEW");
    expect(game.messages[1]).toBe('   THE ZOOM FEATURE WILL ALLOW YOU');
    expect(game.messages[game.messages.length - 1]).toBe('HIT ANY KEY...');
  });

  it('says so when the folder has no such file', () => {
    const game = newMwGame();
    showHelp(game, 18);
    expect(game.messages).toEqual(['HELP FILE NOT FOUND']);
  });
});

describe('drawHelpMenu', () => {
  it('draws the two headings and the twenty-eight topics', () => {
    const game = newMwGame();
    drawHelpMenu(game);
    expect(game.messages).toHaveLength(30);
    expect(game.messages[0]).toBe('HELP MENU-HIT ESC TO RETURN TO GAME');
    expect(game.messages[2]).toBe('A-CHANGE ARMOR');
    expect(game.screen[2]).toMatchObject({ x: 0x2d0, y: 0x50 });
    expect(game.messages[game.messages.length - 1]).toBe('9-MORE HINTS AND STRATEGIES');
  });
});

describe('helpMenuFile', () => {
  it('takes a letter in either case', () => {
    expect(helpMenuFile(0x73)).toBe(0);
    expect(helpMenuFile(0x53)).toBe(0);
    expect(helpMenuFile(0x62)).toBe(11);
  });

  it('puts the ten digits on files 20 to 29', () => {
    expect(helpMenuFile(0x30)).toBe(20);
    expect(helpMenuFile(0x39)).toBe(29);
  });

  it('takes a control character as a click on the line of that number', () => {
    expect(helpMenuFile(0)).toBe(MW_HELP_TOPICS[0].file);
    expect(helpMenuFile(0x11)).toBe(MW_HELP_TOPICS[0x11].file);
  });

  it('leaves the menu on anything else', () => {
    expect(helpMenuFile(MW_ESCAPE)).toBe(-1);
    expect(helpMenuFile(0x67)).toBe(-1);
  });
});
