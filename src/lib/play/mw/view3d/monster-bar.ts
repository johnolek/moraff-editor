import type { MwMonsterViewCorner } from '../../../game/mw-port/screens';
import { fillRect, type Frame } from '../../view3d/frame';
import { MW_COLOURS } from './screen';

/**
 * FUN_2000_8728 (WORLD.EXE 2000:8728, mw.c "FUN_2000_8728"): the bar a monster's hit points are
 * printed on, over the view that monster stands in.
 *
 * It covers only the `HP:` half of the line — from 0xdb along the view's own corner to 0x18a,
 * and 0x28 tall — so the level printed at the corner beside it stands straight over the monster
 * with nothing behind it. Every side with a monster on it gets one, because movecontrol calls
 * this once per occupied side.
 */
export const MW_MONSTER_BAR = { from: 0xdb, to: 0x18a, height: 0x28 } as const;

/**
 * The colour DS:4396 holds, which FUN_3000_1a08 (exe 3000:1a08) sets whenever it draws a view:
 * the light grey 14, and 3 on the surface.
 */
export const mwMonsterBarColour = (floor: number): number =>
  floor === 0 ? 3 : MW_COLOURS.monsterBar;

/** The bar over every view a monster is standing in. */
export function drawMwMonsterBars(
  frame: Frame,
  corners: readonly MwMonsterViewCorner[],
  floor: number,
): void {
  const toX = (x: number) => Math.trunc(((frame.width - 1) * x) / 0x63f);
  const toY = (y: number) => Math.trunc(((frame.height - 1) * y) / 0x4af);
  const colour = mwMonsterBarColour(floor);
  for (const corner of corners) {
    fillRect(
      frame,
      toX(corner.x + MW_MONSTER_BAR.from),
      toY(corner.hpY),
      toX(corner.x + MW_MONSTER_BAR.to),
      toY(corner.hpY + MW_MONSTER_BAR.height),
      colour,
    );
  }
}
