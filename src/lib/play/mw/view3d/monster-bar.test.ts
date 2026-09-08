import { describe, expect, it } from 'vitest';
import { mwMonsterViewSides } from '../../../game/mw-port/screens';
import { mwSetOccupant, newMwGame } from '../../../game/mw-port/state';
import { newFrame, pixelAt } from '../../view3d/frame';
import { drawMwMonsterBars, MW_MONSTER_BAR } from './monster-bar';
import { MW_SCREEN_PIXELS } from './screen';

/** A character with a monster on each of the sides named, all four walls open. */
const surrounded = (sides: { dx: number; dy: number }[], floor = 5) => {
  const game = newMwGame({
    pc: { x: 20, y: 30, floor },
    monsters: sides.map((side) => ({ x: 20 + side.dx, y: 30 + side.dy, hp: 46, type: 1, depth: floor })),
  });
  sides.forEach((side, slot) => mwSetOccupant(game, 20 + side.dx, 30 + side.dy, slot));
  return game;
};

const barPixel = (frame: ReturnType<typeof newFrame>, corner: { x: number; hpY: number }) => {
  const toX = (x: number) => Math.trunc(((frame.width - 1) * x) / 0x63f);
  const toY = (y: number) => Math.trunc(((frame.height - 1) * y) / 0x4af);
  return pixelAt(
    frame,
    toX(corner.x + MW_MONSTER_BAR.from) + 1,
    toY(corner.hpY + MW_MONSTER_BAR.height / 2),
  );
};

describe('the hit-point bars over the views', () => {
  it('puts one over every view a monster stands in', () => {
    const game = surrounded([
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
    ]);
    const frame = newFrame(MW_SCREEN_PIXELS.width, MW_SCREEN_PIXELS.height);
    const corners = mwMonsterViewSides(game).map((side) => side.corner);
    expect(corners).toHaveLength(2);
    drawMwMonsterBars(frame, corners, 5);
    for (const corner of corners) expect(barPixel(frame, corner)).toBe(14);
  });

  it('leaves the corner the level is printed at bare', () => {
    const game = surrounded([{ dx: 1, dy: 0 }]);
    const frame = newFrame(MW_SCREEN_PIXELS.width, MW_SCREEN_PIXELS.height);
    const [corner] = mwMonsterViewSides(game).map((side) => side.corner);
    drawMwMonsterBars(frame, [corner], 5);
    const toX = (x: number) => Math.trunc(((frame.width - 1) * x) / 0x63f);
    const toY = (y: number) => Math.trunc(((frame.height - 1) * y) / 0x4af);
    expect(pixelAt(frame, toX(corner.x), toY(corner.hpY) + 1)).toBe(0);
  });

  it('draws the surface bar in 3 rather than the light grey', () => {
    const game = surrounded([{ dx: -1, dy: 0 }], 0);
    const frame = newFrame(MW_SCREEN_PIXELS.width, MW_SCREEN_PIXELS.height);
    const [corner] = mwMonsterViewSides(game).map((side) => side.corner);
    drawMwMonsterBars(frame, [corner], 0);
    expect(barPixel(frame, corner)).toBe(3);
  });
});
