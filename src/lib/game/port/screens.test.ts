import { describe, expect, it } from 'vitest';
import {
  anyKeyChoice,
  clearMenuBlock,
  clearMessageLine,
  drawHitAnyKey,
  drawMenu,
  getChoice,
  gmenuChoice,
  menuLine,
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
