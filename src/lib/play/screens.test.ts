import { describe, expect, it } from 'vitest';
import { MENU_LINE_STEP, MENU_TOP, MENU_X, MESSAGE_LINE_Y, messageLine } from '../game/port/screens';
import type { ScreenLine } from '../game/port/state';
import { messageBoxScreen, onMessageBox, screenTakenOver } from './screens';

/** A line drawn where the V screen draws, which is across the four views. */
const overTheViews: ScreenLine = { text: 'VIEW STATS FOR BRAWLER', x: 0x2d0, y: 0, font: 0, colour: 3 };

describe('the message box on the screen', () => {
  it('puts the eight lines where mset_gmenu draws them', () => {
    const lines = messageBoxScreen({ box: ['ONE', 'TWO'], banner: [], drawn: [] });
    expect(lines.map((line) => [line.text, line.x, line.y])).toEqual([
      ['ONE', MENU_X, MENU_TOP],
      ['TWO', MENU_X, MENU_TOP + MENU_LINE_STEP],
    ]);
  });

  it('keeps a line drawn on the bar above the box beside the box', () => {
    const lines = messageBoxScreen({
      box: ['1) TAKE THE WEAPON'],
      banner: [],
      drawn: [messageLine('GOOD NEWS...', 15)],
    });
    expect(lines.map((line) => line.text)).toEqual(['1) TAKE THE WEAPON', 'GOOD NEWS...']);
    expect(lines[1].y).toBe(MESSAGE_LINE_Y);
  });

  it('shows the battle banner when nothing has been said', () => {
    const lines = messageBoxScreen({ box: [], banner: ['YOU ARE FIGHTING A LEVEL 3'], drawn: [] });
    expect(lines.map((line) => [line.text, line.y])).toEqual([['YOU ARE FIGHTING A LEVEL 3', MENU_TOP]]);
  });

  it('gives the eight lines to a menu the game drew down them itself', () => {
    // Every menu wipes the block with FUN_2000_2820 before it draws, so nothing of the box
    // before it shows through.
    const drawn = [{ text: '1) SPELLBOOKS', x: MENU_X, y: MENU_TOP, font: 0, colour: 6 }];
    const lines = messageBoxScreen({ box: ['SOMETHING SAID EARLIER'], banner: [], drawn });
    expect(lines.map((line) => line.text)).toEqual(['1) SPELLBOOKS']);
  });

  it('counts a line across the views as the game taking the display over', () => {
    expect(onMessageBox(overTheViews)).toBe(false);
    expect(onMessageBox(messageLine('GOOD NEWS...', 15))).toBe(true);
    expect(screenTakenOver([overTheViews, messageLine('GOOD NEWS...', 15)])).toEqual([overTheViews]);
  });

  it('leaves what the game drew across the views out of the message box', () => {
    const lines = messageBoxScreen({ box: ['SAID'], banner: [], drawn: [overTheViews] });
    expect(lines.map((line) => line.text)).toEqual(['SAID']);
  });
});

describe('the panel of battle spells', () => {
  it('is left out of the screen, since the screen paints it itself', () => {
    // view_battle_spells draws it and nothing in the loop ever wipes that corner, so the copy the
    // 2 key and a cast leave behind would stand there for the rest of the game.
    const panel: ScreenLine = { text: 'CURRENT BATTLE SPELLS IN EFFECT', x: 10, y: 0x302, font: 0, colour: 8 };
    expect(screenTakenOver([panel, overTheViews])).toEqual([overTheViews]);
  });
});
