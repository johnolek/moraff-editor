import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { drawFloor } from '../../map/draw-floor';
import { MORAFFS_WORLD_MAP } from '../../map/game';
import { MW_MAP_COLUMNS, MW_MAP_ROWS } from './view3d/screen';

/**
 * What Moraff's World's map on the game's screen draws of the rock, on a floor the site has
 * revealed whole.
 *
 * `is_solid` (WORLD.EXE 3000:a854) is the same test as Dungeons of the Unforgiven's solidcheck: a
 * wall on all four sides, which nothing stands on and no 3-D view sees into. The map is drawn
 * inside `MwScreen.svelte`, so what can be checked here is the floor it is given and the question
 * it asks about a square.
 */

const source = readFileSync('src/lib/play/mw/MwScreen.svelte', 'utf8');

describe("the map on Moraff's World's screen", () => {
  it('drops a rock square before it asks what the character knows', () => {
    expect(source).toContain('if (!square || square.solid) continue;');
    expect(source).toContain('if (discovered && !discovered.known(x, y)) continue;');
  });

  it('has rock to drop inside the window it draws', () => {
    const rows = MORAFFS_WORLD_MAP.floor(3, 0);
    const at = { x: 40, y: 55 };
    let rock = 0;
    for (let row = 0; row < MW_MAP_ROWS; row++) {
      for (let col = 0; col < MW_MAP_COLUMNS; col++) {
        const x = at.x + col - (MW_MAP_COLUMNS >> 1);
        const y = at.y + row - (MW_MAP_ROWS >> 1);
        if (rows[y]?.[x]?.solid) rock += 1;
      }
    }
    expect(rock).toBeGreaterThan(20);
  });

  it('leaves the rock of a whole floor out of the top-down map as well', () => {
    const area = MORAFFS_WORLD_MAP.area;
    const rows = MORAFFS_WORLD_MAP.floor(3, 0);
    const fills: { x: number; y: number }[] = [];
    // A canvas context that does nothing but count the rectangles it is asked to fill: one for
    // the background, and then one for each square the map draws.
    const context = new Proxy(
      {},
      {
        get: (_target, name) => (name === 'fillRect' ? (x: number, y: number) => fills.push({ x, y }) : () => {}),
        set: () => true,
      },
    ) as unknown as CanvasRenderingContext2D;
    drawFloor(context, rows, {
      cell: 1,
      originX: 0,
      originY: 0,
      width: area.columns,
      height: area.rows,
      floor: 3,
      teleporterHue: null,
      game: MORAFFS_WORLD_MAP,
    });

    // `drawFloor` stops at the last column and row inside the game's area, so the count of what
    // it should have drawn uses the same bounds.
    let open = 0;
    for (let y = 0; y < area.rows; y++) {
      for (let x = 0; x < area.columns; x++) if (!rows[y][x].solid) open += 1;
    }
    expect(fills.slice(1)).toHaveLength(open);
    expect(open).toBeLessThan(area.columns * area.rows);
  });

  it('makes a square rock exactly when all four of its sides are walls', () => {
    const rows = MORAFFS_WORLD_MAP.floor(3, 0);
    for (let y = 1; y < 100; y++) {
      for (let x = 1; x < 79; x++) {
        const square = rows[y][x];
        const walled = square.n === 0 && square.s === 0 && square.w === 0 && square.e === 0;
        expect(square.solid, `square ${x}, ${y}`).toBe(walled);
      }
    }
  });
});
