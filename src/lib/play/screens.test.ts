import { describe, expect, it } from 'vitest';
import {
  BATTLE_HP_Y,
  BLOW_Y,
  MENU_LINE_STEP,
  MENU_TOP,
  MENU_X,
  MESSAGE_LINE_Y,
  messageLine,
} from '../game/port/screens';
import type { ScreenLine } from '../game/port/state';
import { keyMenuLines, statusLines, BATTLE_SPELLS_BOX, MESSAGE_BOX } from './display';
import { newGame } from '../game/port/state';
import { inRect, messageBoxScreen, onMessageBox, screenTakenOver } from './screens';

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
    expect(lines.map((line) => [line.text, line.y])).toEqual([['YOU ARE FIGHTING A LEVEL 3', 0x329]]);
  });

  it("puts the banner's lines where engagement_timing prints them", () => {
    // The first two stand at the top of the block and the other two at the bottom of it, with
    // the hit points line and the blow in the gap between: print_battle_hp_info draws its own
    // line at 0x379 rather than saying it, so the banner said here is four lines long.
    const banner = ['YOU ARE FIGHTING A LEVEL 3', 'WATER RAT', 'EXP. VALUE: 27', 'IT IS FAST!'];
    const lines = messageBoxScreen({ box: [], banner, drawn: [] });
    expect(lines.map((line) => [line.x, line.y])).toEqual([
      [MENU_X, 0x329],
      [MENU_X, 0x351],
      [MENU_X, 0x441],
      [MENU_X, 0x469],
    ]);
    // pfont is given the string and a colour and nothing else: none of the four is spread out to
    // the right edge the way a long menu line is.
    expect(lines.every((line) => line.font === 0 && line.colour === 15 && line.spreadTo === undefined)).toBe(true);
  });

  it('gives the eight lines to a menu the game drew down them itself', () => {
    // Every menu wipes the block with FUN_2000_2820 before it draws, so nothing of the box
    // before it shows through.
    const drawn = [{ text: '1) SPELLBOOKS', x: MENU_X, y: MENU_TOP, font: 0, colour: 6 }];
    const lines = messageBoxScreen({ box: ['SOMETHING SAID EARLIER'], banner: [], drawn });
    expect(lines.map((line) => line.text)).toEqual(['1) SPELLBOOKS']);
  });

  it('leaves the banner standing under the lines a fight draws beside it', () => {
    // strike and print_battle_hp_info wipe only the strip their own lines stand on, so those
    // three lines are the ones on the block that do not mean the block was filled again.
    const blow = (text: string, y: number): ScreenLine => ({ text, x: MENU_X, y, font: 0, colour: 15 });
    const drawn = [blow('YOU HIT THE MONSTER!!!', BLOW_Y[0]), blow('IT TAKES 7 POINTS OF DAMAGE!', BLOW_Y[1])];
    const lines = messageBoxScreen({ box: [], banner: ['YOU ARE FIGHTING A LEVEL 3'], drawn });
    expect(lines.map((line) => [line.text, line.y])).toEqual([
      ['YOU ARE FIGHTING A LEVEL 3', MENU_TOP],
      ['YOU HIT THE MONSTER!!!', BLOW_Y[0]],
      ['IT TAKES 7 POINTS OF DAMAGE!', BLOW_Y[1]],
    ]);
    expect(messageBoxScreen({ box: [], banner: ['A LEVEL 3'], drawn: [blow('IT HAS 9 HEALTH POINTS LEFT', BATTLE_HP_Y)] })).toHaveLength(2);
  });

  it('takes the box line a fight wiped the strip under', () => {
    // The fifth of the eight lines stands at 0x3f1, which is where the blow's second line goes,
    // and strike's rectangle takes the whole strip from 0x3c5 to 0x419 before it draws.
    const blow = (text: string, y: number): ScreenLine => ({ text, x: MENU_X, y, font: 0, colour: 15 });
    const box = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT'];
    const drawn = [blow('YOU HIT THE MONSTER!!!', BLOW_Y[0]), blow('IT TAKES 7 POINTS OF DAMAGE!', BLOW_Y[1])];
    const lines = messageBoxScreen({ box, banner: [], drawn });
    expect(lines.map((line) => line.text)).toEqual([
      'ONE',
      'TWO',
      'THREE',
      'FOUR',
      'SIX',
      'SEVEN',
      'EIGHT',
      'YOU HIT THE MONSTER!!!',
      'IT TAKES 7 POINTS OF DAMAGE!',
    ]);
    // The hit points line's own strip runs from 0x377 to 0x3a1, which covers the third line.
    const hp = messageBoxScreen({ box, banner: [], drawn: [blow('IT HAS 9 HEALTH POINTS LEFT', BATTLE_HP_Y)] });
    expect(hp.map((line) => line.text)).not.toContain('THREE');
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

describe('what the spell table blacks out', () => {
  /** cast_a_spell fills the top 0x21c of the screen with colour 0 before it draws the big table
   *  (exe 2000:ee34), and the message column before it draws the miniature one (exe 2000:e26e). */
  const LARGE = { x: 0, y: 0, right: 0x640, bottom: 0x21c };
  const MINI = { x: 0x398, y: 0x2ff, right: 0x640, bottom: 0x4b0 };

  it('takes the whole key menu with it and leaves the status block standing', () => {
    expect(keyMenuLines().every((line) => inRect(LARGE, line))).toBe(true);
    expect(statusLines(newGame().pc).some((line) => inRect(LARGE, line))).toBe(false);
  });

  it('leaves the battle spells and the message box alone as well', () => {
    expect(inRect(LARGE, { text: '', x: BATTLE_SPELLS_BOX.left, y: BATTLE_SPELLS_BOX.top, font: 0, colour: 8 })).toBe(false);
    expect(inRect(LARGE, { text: '', x: MESSAGE_BOX.left, y: MESSAGE_BOX.top, font: 0, colour: 8 })).toBe(false);
  });

  it('takes only the message column when the table is the miniature one', () => {
    expect(keyMenuLines().some((line) => inRect(MINI, line))).toBe(false);
    expect(statusLines(newGame().pc).some((line) => inRect(MINI, line))).toBe(false);
    expect(inRect(MINI, { text: '', x: MESSAGE_BOX.left, y: MESSAGE_BOX.top, font: 0, colour: 8 })).toBe(true);
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
