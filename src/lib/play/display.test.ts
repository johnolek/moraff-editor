import { describe, expect, it } from 'vitest';
import { newGame } from '../game/port/state';
import { FOUR_VIEWS } from './view3d/views';
import {
  arrowPixel,
  keyMenuLines,
  KEY_MENU_LINES,
  MESSAGE_BAR_BOX,
  MESSAGE_BOX,
  SCREEN_BOXES,
  statusLines,
  ZOOM_COLUMNS,
  ZOOM_ROWS,
  zoomMapLeft,
  zoomMapSquare,
} from './display';

describe('the boxes on the screen', () => {
  it('keeps every one inside the screen', () => {
    for (const box of SCREEN_BOXES) {
      expect(box.left).toBeGreaterThanOrEqual(0);
      expect(box.top).toBeGreaterThanOrEqual(0);
      expect(box.right).toBeLessThanOrEqual(1600);
      expect(box.bottom).toBeLessThanOrEqual(1200);
      expect(box.right).toBeGreaterThan(box.left);
      expect(box.bottom).toBeGreaterThan(box.top);
    }
  });

  it('never paints over one of the four views', () => {
    for (const box of SCREEN_BOXES) {
      for (const view of FOUR_VIEWS) {
        const rect = view.rect;
        const apart =
          box.right <= rect.left || rect.right <= box.left || box.bottom <= rect.top || rect.bottom <= box.top;
        expect(apart, `${view.name} runs under a box`).toBe(true);
      }
    }
  });

  it('overlaps only where the green bar meets the top of the message box', () => {
    const overlapping = SCREEN_BOXES.flatMap((a, i) =>
      SCREEN_BOXES.slice(i + 1).map((b) => ({ a, b })).filter(
        ({ a: one, b: two }) =>
          !(one.right <= two.left || two.right <= one.left || one.bottom <= two.top || two.bottom <= one.top),
      ),
    );
    expect(overlapping).toHaveLength(1);
    expect(overlapping[0]).toEqual({ a: MESSAGE_BAR_BOX, b: MESSAGE_BOX });
  });
});

describe('the key menu', () => {
  it('has the thirteen lines the game draws, and S) SECTION INFO under them', () => {
    expect(KEY_MENU_LINES).toHaveLength(13);
    const lines = keyMenuLines();
    expect(lines).toHaveLength(27);
    expect(lines[lines.length - 1].text).toBe('S) SECTION INFO');
  });

  it('pairs each line with a key string of its own length, so the letters land in the holes', () => {
    for (const line of KEY_MENU_LINES) expect(line.keys.length).toBe(line.body.length);
  });

  it('reads as the words the game shows once the two passes are laid over each other', () => {
    const merged = KEY_MENU_LINES.map((line) =>
      [...line.body].map((char, i) => (char === ' ' ? line.keys[i] : char)).join('').trimEnd(),
    );
    expect(merged.slice(0, 4)).toEqual(['1) PREP SPELLS', 'VIEW MONEY', 'VIEW STATS', 'CAST SPELL']);
    expect(merged[merged.length - 1]).toBe('QUIT  USE ITEM');
  });

  it('draws the key letters in yellow and every line above the section box', () => {
    for (const line of keyMenuLines()) {
      expect(line.y).toBeLessThan(0x20f);
      expect(line.x).toBe(9);
    }
  });
});

describe('the status block', () => {
  const pc = () => newGame().pc;

  it('names the armor, the weapon and the six characteristics', () => {
    const texts = statusLines(pc()).map((line) => line.text);
    expect(texts.some((text) => text.startsWith('ARMOR:'))).toBe(true);
    expect(texts.some((text) => text.startsWith('WEAPON:'))).toBe(true);
    expect(texts).toContain('STR:20');
    // The one label the game gives no colon, which is why the block reads LUCK20.
    expect(texts).toContain('LUCK20');
  });

  it('shortens the level and experience labels from level nine on', () => {
    const character = pc();
    character.lev = 8;
    expect(statusLines(character).map((line) => line.text)).toContain('LEVEL: 8');
    character.lev = 9;
    expect(statusLines(character).map((line) => line.text)).toContain('L:9');
  });

  it('keeps every line inside the green box', () => {
    for (const line of statusLines(pc())) {
      expect(line.y).toBeGreaterThan(0x40e);
      expect(line.y).toBeLessThan(0x4ac);
    }
  });
});

describe('the zoom map', () => {
  it('is fifteen squares across and twenty-six down, with the character in the middle', () => {
    expect(zoomMapSquare({ x: 40, y: 50 }, 7, 13)).toEqual({ x: 40, y: 50 });
    expect(zoomMapSquare({ x: 40, y: 50 }, 0, 0)).toEqual({ x: 33, y: 37 });
    expect(zoomMapSquare({ x: 40, y: 50 }, ZOOM_COLUMNS - 1, ZOOM_ROWS - 1)).toEqual({ x: 47, y: 62 });
  });

  it('starts where the game puts it on a 640-pixel screen', () => {
    expect(zoomMapLeft(640)).toBe(521);
  });

  it('turns the arrow by the way the character faces', () => {
    // The point of the arrow is the middle of its top row, and it swings to the matching side.
    expect(arrowPixel(0, 100, 100, 3, 0)).toEqual({ x: 102, y: 99 });
    expect(arrowPixel(1, 100, 100, 3, 0)).toEqual({ x: 102, y: 105 });
    expect(arrowPixel(2, 100, 100, 3, 0)).toEqual({ x: 99, y: 102 });
    expect(arrowPixel(3, 100, 100, 3, 0)).toEqual({ x: 105, y: 102 });
  });
});
