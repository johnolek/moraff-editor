import { describe, expect, it } from 'vitest';
import { newGame } from '../game/port/state';
import type { MapSquare } from '../map/game';
import type { StockedMonster } from '../map/stocking';
import { zoomMapMonsters } from './mode';
import { newFrame, pixelAt } from './view3d/frame';
import { FOUR_VIEWS } from './view3d/views';
import { ZOOM_MONSTER_COLOUR } from './zoom-monsters';
import {
  arrowPixel,
  drawScreenFurniture,
  keyMenuLines,
  KEY_MENU_LINES,
  KEY_MENU_SPREAD_TO,
  KEY_MENU_X,
  MESSAGE_BAR_BOX,
  MESSAGE_BOX,
  SCREEN_BOXES,
  SCREEN_MODE,
  SCREEN_PIXELS,
  statusLines,
  VIDEO_MODES,
  ZOOM_CELL,
  ZOOM_COLUMNS,
  ZOOM_ROWS,
  zoomMapLeft,
  zoomMapSquare,
  zoomMapWindow,
} from './display';
import { MW_VIDEO_MODES } from './mw/view3d/screen';

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

  it('reads as the words the game shows once the two passes are laid over each other', () => {
    // The passes are spread separately, and two of them are a shorter string over a wider
    // spread, so a key letter belongs to the body slot its middle is nearest.
    const middles = (text: string, spreadTo: number): number[] =>
      [...text].map((_, i) => KEY_MENU_X + ((spreadTo - KEY_MENU_X) * (i + 0.5)) / text.length);

    const merged = KEY_MENU_LINES.map((line) => {
      const slots = [...line.body];
      const bodyMiddles = middles(line.body, KEY_MENU_SPREAD_TO);
      const keyMiddles = middles(line.keys, line.keysSpreadTo ?? KEY_MENU_SPREAD_TO);
      [...line.keys].forEach((char, j) => {
        if (char === ' ') return;
        let nearest = 0;
        bodyMiddles.forEach((middle, i) => {
          if (Math.abs(middle - keyMiddles[j]) < Math.abs(bodyMiddles[nearest] - keyMiddles[j])) nearest = i;
        });
        expect(slots[nearest]).toBe(' ');
        slots[nearest] = char;
      });
      return slots.join('').trimEnd();
    });

    expect(merged.slice(0, 4)).toEqual(['1) PREP SPELLS', 'VIEW MONEY', 'VIEW STATS', 'CAST SPELL']);
    expect(merged[9]).toBe('ARMOR WEAPONS');
    expect(merged[merged.length - 1]).toBe('QUIT  USE ITEM');
  });

  it('draws the menu words in the .FNT face and the key letters in strokes', () => {
    const lines = keyMenuLines();
    const bitmap = lines.filter((line) => line.bitmapFace);
    expect(bitmap).toHaveLength(13);
    expect(bitmap[0].text).toBe(' ) PREP SPELLS');
    expect(lines.filter((line) => !line.bitmapFace)).toHaveLength(14);
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

describe('the video modes', () => {
  it('has the twelve the jump table dispatches on', () => {
    expect(VIDEO_MODES).toHaveLength(12);
    expect(VIDEO_MODES.map((mode) => mode.mode)).toEqual([...Array(12).keys()]);
  });

  it('is played in mode 9, the 1024 by 768 in 256 colours', () => {
    expect(SCREEN_MODE).toEqual({ mode: 9, width: 1024, height: 768, colours: 256 });
    expect(SCREEN_PIXELS).toEqual({ width: 1024, height: 768 });
  });

  it('offers the same twelve as Moraff\'s World, in the same order', () => {
    expect(VIDEO_MODES).toEqual(MW_VIDEO_MODES);
  });
});

describe('the boxes on a 1024 by 768 screen', () => {
  it('scales the same table a 640 by 480 screen uses', () => {
    const onScreen = (value: number) => Math.trunc(((SCREEN_PIXELS.width - 1) * value) / 0x63f);
    expect(onScreen(MESSAGE_BOX.left)).toBe(588);
    expect(onScreen(MESSAGE_BOX.right)).toBe(1023);
  });
});

describe('the zoom map', () => {
  it('is nineteen squares across and thirty-three down, with the character in the middle', () => {
    expect(zoomMapSquare({ x: 40, y: 50 }, ZOOM_COLUMNS >> 1, ZOOM_ROWS >> 1)).toEqual({ x: 40, y: 50 });
    expect(zoomMapSquare({ x: 40, y: 50 }, 0, 0)).toEqual({ x: 31, y: 34 });
    expect(zoomMapSquare({ x: 40, y: 50 }, ZOOM_COLUMNS - 1, ZOOM_ROWS - 1)).toEqual({ x: 49, y: 66 });
  });

  it('starts where the game puts it, whatever the screen is wide', () => {
    expect(zoomMapLeft(640)).toBe(521);
    expect(zoomMapLeft(1024)).toBe(834);
  });

  it('turns the arrow by the way the character faces', () => {
    // The point of the arrow is the middle of its top row, and it swings to the matching side.
    expect(arrowPixel(0, 100, 100, 3, 0)).toEqual({ x: 102, y: 99 });
    expect(arrowPixel(1, 100, 100, 3, 0)).toEqual({ x: 102, y: 105 });
    expect(arrowPixel(2, 100, 100, 3, 0)).toEqual({ x: 99, y: 102 });
    expect(arrowPixel(3, 100, 100, 3, 0)).toEqual({ x: 105, y: 102 });
  });
});

describe('the monsters debug mode marks on the zoom map', () => {
  /** A floor of open squares, big enough for the whole window of the map. */
  const open = (): MapSquare => ({ n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1 });
  const rows: MapSquare[][] = Array.from({ length: 80 }, () => Array.from({ length: 80 }, open));
  const at = { x: 40, y: 50, dir: 0 };

  /** Two monsters standing where the character cannot see them: neither is in any of the four
   *  views, so faithful draws neither and only the map's own mark would show them. */
  const outOfSight: StockedMonster[] = [
    { slot: 0, x: 43, y: 47, monsterId: '1', level: 3, hp: 20 },
    { slot: 1, x: 38, y: 54, monsterId: '1', level: 4, hp: 25 },
  ];

  /** The colour in the middle of each monster's cell, after a screen drawn in that mode. */
  function marks(mode: 'faithful' | 'speedrun' | 'debug'): number[] {
    const frame = newFrame(SCREEN_PIXELS.width, SCREEN_PIXELS.height);
    drawScreenFurniture(frame, {
      rows,
      at,
      known: () => true,
      monsters: zoomMapMonsters(mode, { monsters: outOfSight }),
    });
    const map = zoomMapWindow(frame.width);
    return outOfSight.map((monster) => {
      const column = monster.x - at.x + (ZOOM_COLUMNS >> 1);
      const row = monster.y - at.y + (ZOOM_ROWS >> 1);
      return pixelAt(frame, map.left + column * ZOOM_CELL + 3, row * ZOOM_CELL + 3);
    });
  }

  it('marks both of them in debug', () => {
    expect(marks('debug')).toEqual([ZOOM_MONSTER_COLOUR, ZOOM_MONSTER_COLOUR]);
  });

  it('marks neither in faithful, where the map is the one the game draws', () => {
    // The square itself is drawn, in the black the game fills a known square with.
    expect(marks('faithful')).toEqual([0, 0]);
    expect(marks('speedrun')).toEqual([0, 0]);
  });
});
