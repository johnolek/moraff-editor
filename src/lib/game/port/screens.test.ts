import { describe, expect, it } from 'vitest';
import {
  anyKeyChoice,
  battleSpellsInEffect,
  clearMenuBlock,
  clearMessageLine,
  drawHitAnyKey,
  drawMenu,
  getChoice,
  expNeededScreen,
  gmenuChoice,
  menuLine,
  viewBattleSpells,
  viewPrepSpells,
  viewStats,
} from './screens';
import { newGame } from './state';

describe('the menu lines', () => {
  it('puts eight lines down the menu column 0x32 apart', () => {
    const game = newGame();
    drawMenu(game, ['1) ONE', '2) TWO']);
    expect(game.screen).toEqual([
      { text: '1) ONE', x: 0x3a2, y: 0x329, font: 0, colour: 6 },
      { text: '2) TWO', x: 0x3a2, y: 0x35b, font: 0, colour: 6 },
    ]);
  });

  it('spreads a line of 27 characters or more out to the right edge', () => {
    expect(menuLine('12345678901234567890123456', 0).spreadTo).toBeUndefined();
    expect(menuLine('123456789012345678901234567', 0).spreadTo).toBe(0x640);
  });

  it('draws no more than the eight lines the game has room for', () => {
    const game = newGame();
    drawMenu(game, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']);
    expect(game.screen.length).toBe(8);
  });

  it('wipes what was there before drawing again', () => {
    const game = newGame();
    drawMenu(game, ['1) ONE', '2) TWO']);
    drawMenu(game, ['1) ONLY']);
    expect(game.screen.map((line) => line.text)).toEqual(['1) ONLY']);
  });
});

describe('clearing the menu column', () => {
  it('takes off the menu lines and leaves the map alone', () => {
    const game = newGame();
    game.draw({ text: 'MAP', x: 0, y: 0x400, font: 0, colour: 4 });
    drawMenu(game, ['1) ONE']);
    clearMenuBlock(game);
    expect(game.screen.map((line) => line.text)).toEqual(['MAP']);
  });

  it('takes off the prompt above the menu and leaves the menu standing', () => {
    const game = newGame();
    game.draw({ text: 'SELECT THE TYPE OF SPELL:', x: 0x3a2, y: 0x301, font: 0, colour: 8 });
    drawMenu(game, ['1) ONE']);
    clearMessageLine(game);
    expect(game.screen.map((line) => line.text)).toEqual(['1) ONE']);
  });
});

describe('the keys a menu takes', () => {
  it('numbers a gmenu by its own line numbers', () => {
    expect(gmenuChoice(1, 8, '1')).toBe(1);
    expect(gmenuChoice(1, 8, '8')).toBe(8);
    expect(gmenuChoice(1, 8, '9')).toBeNull();
    expect(gmenuChoice(1, 8, '0')).toBeNull();
    expect(gmenuChoice(1, 8, 'A')).toBeNull();
    expect(gmenuChoice(1, 8, '\x1b')).toBe('escape');
  });

  it('starts a get_choice menu at 1 whatever its first line is', () => {
    expect(getChoice(2, 6, '1')).toBe(1);
    expect(getChoice(2, 6, '5')).toBe(5);
    expect(getChoice(2, 6, '6')).toBeNull();
    expect(getChoice(1, 5, '5')).toBe(5);
    expect(getChoice(1, 5, '6')).toBeNull();
    expect(getChoice(1, 5, '\x1b')).toBe('escape');
  });

  it('takes any key when the menu is only waiting to be read', () => {
    expect(anyKeyChoice('Q')).toBe('Q');
    expect(anyKeyChoice('\x1b')).toBe('escape');
  });
});

describe('the hit any key plaque', () => {
  it('draws its two lines inside the box it is given', () => {
    const game = newGame();
    drawHitAnyKey(game, 0x294, 0x41e);
    expect(game.screen).toEqual([
      { text: 'HIT ANY', x: 0x2ad, y: 0x432, spreadTo: 0x375, font: 0, colour: 15 },
      { text: 'KEY NOW', x: 0x2ad, y: 0x45f, spreadTo: 0x375, font: 0, colour: 15 },
    ]);
  });
});

describe('the preparation spells in effect', () => {
  it('lists nothing when nothing is on', () => {
    const game = newGame();
    viewPrepSpells(game);
    expect(game.screen.map((line) => line.text)).toEqual(['PREP SPELLS IN EFFECT']);
  });

  it('names each spell the way the game does and keeps its own line', () => {
    const game = newGame({
      pc: { tempWeaponPlus: 3, feather: 1, prepAgility: 5, superStrength: 10 },
    });
    expect(viewPrepSpells(game)).toEqual([
      { text: 'WEAPONS, PLUS 3', turns: null },
      { text: 'FEATHER', turns: null },
      { text: 'AGILITY (PREP VERSION)', turns: null },
      { text: 'SUPER STRENGTH', turns: null },
    ]);
    expect(game.screen.map((line) => [line.text, line.y])).toEqual([
      ['PREP SPELLS IN EFFECT', 0x301],
      ['WEAPONS, PLUS 3', 0x334],
      ['FEATHER', 0x3ac],
      ['AGILITY (PREP VERSION)', 0x424],
      ['SUPER STRENGTH', 0x44c],
    ]);
  });
});

describe('the battle spells in effect', () => {
  it('gives the level on the two that have one and the moves left on the rest', () => {
    const game = newGame({
      pc: {
        protection: 3,
        protectionTime: 40,
        powerWeapon: 2,
        powerWeaponTime: 55,
        sleepTimer: 12,
        antiFireTimer: 7,
      },
    });
    viewBattleSpells(game);
    expect(battleSpellsInEffect(game)).toEqual([
      { text: 'PROTECT, LEVEL 3', turns: 40 },
      { text: 'POWER WEAPON 2', turns: 55 },
      { text: 'STOP MONSTER', turns: 12 },
      { text: 'ANTI-FIRE', turns: 7 },
    ]);
    expect(game.screen.map((line) => [line.text, line.x, line.y])).toEqual([
      ['CURRENT BATTLE SPELLS IN EFFECT', 10, 0x302],
      ['PROTECT, LEVEL 3', 10, 0x32a],
      ['POWER WEAPON 2', 10, 0x350],
      ['STOP MONSTER', 10, 0x39c],
      ['ANTI-FIRE', 0x172, 0x3e8],
    ]);
  });

  it('draws nothing when the same twelve lines were showing last time', () => {
    const game = newGame({ pc: { sleepTimer: 12 } });
    const shown = viewBattleSpells(game);
    game.pc.sleepTimer = 11;
    game.screen.length = 0;
    expect(viewBattleSpells(game, shown)).toEqual(shown);
    expect(game.screen).toEqual([]);
  });

  it('draws again when a spell runs out', () => {
    const game = newGame({ pc: { sleepTimer: 1 } });
    const shown = viewBattleSpells(game);
    game.pc.sleepTimer = 0;
    game.screen.length = 0;
    viewBattleSpells(game, shown);
    expect(game.screen.map((line) => line.text)).toEqual(['CURRENT BATTLE SPELLS IN EFFECT']);
  });
});

describe('the V screen', () => {
  it('prints the eighteen lines every character has', () => {
    const game = newGame({
      pc: {
        name: 'ZORBO',
        race: 5,
        sex: 1,
        cls: 3,
        age: 41,
        money: 250,
        bank: 1000,
        loadedWeight: 210,
        weight: 180,
        height: 18,
        str: 22,
        iq: 31,
        wis: 27,
        con: 19,
        dex: 24,
        luck: 12,
        weapon: 4,
        armor: 1,
      },
    });
    viewStats(game);
    expect(game.screen.map((line) => line.text)).toEqual([
      'VIEW STATS FOR ZORBO',
      'RACE: GIANT',
      'SEX: FEMALE',
      'CLASS: WIZARD',
      'AGE: 41',
      'MONEY IN POCKET: 250',
      'MONEY IN BANK: 1000',
      'LOADED WEIGHT: 210',
      'NAKED WEIGHT: 180',
      'HEIGHT (INCHES): 72',
      'STRENGTH: 22',
      'INTELLIGENCE: 31',
      'WISDOM: 27',
      'CONSTITUTION: 19',
      'AGILITY: 24',
      'LUCK: 12',
      'WEAPON IN HAND: KNIFE',
      'CURRENT ARMOR: LEATHER',
      'BY THE WAY, YOU ARE STILL ALIVE!',
      'HIT ANY KEY TO RETURN TO GAME...',
    ]);
  });

  it('shows the poison and disease clocks and the body armor when they are on', () => {
    const game = newGame({ pc: { disease: 14, poison: 3, bodyArmor: 2, hard: 1 } });
    viewStats(game);
    const shown = game.screen.map((line) => line.text);
    expect(shown).toContain('YOU ARE DISEASED-MOVES LEFT UNTIL');
    expect(shown).toContain('  CONSTITUTION DRAINED: 14');
    expect(shown).toContain('YOU ARE POISONED-MOVES LEFT UNTIL');
    expect(shown).toContain('  STRENGTH DRAINED: 3');
    expect(shown).toContain('BODY ARMOR - PLUS 2');
    expect(shown).toContain('YOU THINK YOU CAN HANDLE ANYTHING');
  });

  it('wipes the right of the screen and leaves the map alone', () => {
    const game = newGame();
    game.draw({ text: 'MAP', x: 0, y: 0, font: 0, colour: 4 });
    game.draw({ text: 'OLD STATS', x: 0x2d0, y: 0x3ca, font: 0, colour: 4 });
    viewStats(game);
    expect(game.screen.map((line) => line.text)).not.toContain('OLD STATS');
    expect(game.screen.map((line) => line.text)).toContain('MAP');
  });
});

describe('the experience needed screen', () => {
  it('lists the next seven levels with the experience padded to twenty columns', () => {
    const game = newGame({ pc: { lev: 1, hard: 1 } });
    expNeededScreen(game);
    expect(game.messages).toEqual([
      'EXPERIENCE NEEDED FOR LEVEL:',
      '2) 250                 ',
      '3) 500                 ',
      '4) 1000                ',
      '5) 2000                ',
      '6) 4000                ',
      '7) 8000                ',
      '8) 16000               ',
    ]);
  });

  it('rounds the normal difficulty curve to whole points', () => {
    const game = newGame({ pc: { lev: 1, hard: 0 } });
    expNeededScreen(game);
    expect(game.messages[1]).toBe(`2) ${'170'.padEnd(20)}`);
    expect(game.messages[2]).toBe(`3) ${'270'.padEnd(20)}`);
  });
});
