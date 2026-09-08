import { describe, expect, it } from 'vitest';
import {
  MW_EAST_VIEW,
  MW_FRONT_VIEW,
  MW_MAP_CELL,
  MW_MAP_COLUMNS,
  MW_MAP_LEFT,
  MW_MAP_ROWS,
  MW_MAP_TOP_PIXELS,
  MW_SCREEN_MODE,
  MW_SCREEN_PIXELS,
  MW_VIDEO_MODES,
  mwMapTop,
} from './screen';
import type { ViewRect } from '../../view3d/geometry';

/** A rectangle of the 1600 by 1200 grid on a real screen, the way every drawing routine puts it
 *  there: x over the last column and y over the last row. */
const onScreen = (rect: ViewRect, screen: { width: number; height: number }) => ({
  left: Math.trunc(((screen.width - 1) * rect.left) / 0x63f),
  top: Math.trunc(((screen.height - 1) * rect.top) / 0x4af),
  right: Math.trunc(((screen.width - 1) * rect.right) / 0x63f),
  bottom: Math.trunc(((screen.height - 1) * rect.bottom) / 0x4af),
});

describe("Moraff's World's video modes", () => {
  it('has the twelve FUN_2000_1485 switches on', () => {
    expect(MW_VIDEO_MODES).toHaveLength(12);
    expect(MW_VIDEO_MODES.map((mode) => mode.mode)).toEqual([...Array(12).keys()]);
  });

  it('is played in mode 9, the 1024 by 768 in 256 colours', () => {
    expect(MW_SCREEN_MODE).toEqual({ mode: 9, width: 1024, height: 768, colours: 256 });
    expect(MW_SCREEN_PIXELS).toEqual({ width: 1024, height: 768 });
  });

  it('keeps three 1024 by 768 modes, one of them in sixteen colours', () => {
    const big = MW_VIDEO_MODES.filter((mode) => mode.width === 1024);
    expect(big.map((mode) => mode.mode)).toEqual([8, 9, 10]);
    expect(big.map((mode) => mode.colours)).toEqual([16, 256, 256]);
  });
});

describe('the view rectangles on a 1024 by 768 screen', () => {
  it('scales the same table the 640 by 480 screen uses', () => {
    expect(onScreen(MW_FRONT_VIEW, MW_SCREEN_PIXELS)).toEqual({
      left: 462,
      top: 0,
      right: 739,
      bottom: 383,
    });
    expect(onScreen(MW_EAST_VIEW, MW_SCREEN_PIXELS)).toEqual({
      left: 743,
      top: 275,
      right: 1022,
      bottom: 658,
    });
  });

  it('covers the same share of the screen as it does at 640 by 480', () => {
    const small = onScreen(MW_FRONT_VIEW, { width: 640, height: 480 });
    const big = onScreen(MW_FRONT_VIEW, MW_SCREEN_PIXELS);
    expect(Math.abs(big.left / 1024 - small.left / 640)).toBeLessThan(0.002);
    expect(Math.abs(big.bottom / 768 - small.bottom / 480)).toBeLessThan(0.002);
  });
});

describe('the zoom map', () => {
  it('takes the cells set_map_view gives a 1024 by 768 screen', () => {
    expect({ cell: MW_MAP_CELL, columns: MW_MAP_COLUMNS, rows: MW_MAP_ROWS }).toEqual({
      cell: 10,
      columns: 18,
      rows: 38,
    });
    expect(MW_MAP_LEFT).toBe(4);
  });

  it('scales its top edge and nothing else', () => {
    expect(mwMapTop(480)).toBe(171);
    expect(mwMapTop(768)).toBe(274);
    expect(MW_MAP_TOP_PIXELS).toBe(274);
  });
});
