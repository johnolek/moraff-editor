import { drawFloor } from './draw-floor';
import { isExplored, type ExploredSquares } from './explored';
import type { MapGame, MapSquare } from './game';
import { TELEPORTER_STILL_HUE } from './teleporters';

export const EXPORT_CELL = 10;

/** The floor as the game's own map shows it, at EXPORT_CELL pixels per square, as a PNG blob,
 *  with the squares a loaded explored map has seen shaded as they are on screen. */
export function renderFloorPng(rows: MapSquare[][], floor: number, game: MapGame, explored: ExploredSquares | null = null): Promise<Blob> {
  const width = game.area.columns * EXPORT_CELL + 2;
  const height = game.area.rows * EXPORT_CELL + 2;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  drawFloor(canvas.getContext('2d')!, rows, { cell: EXPORT_CELL, originX: 0, originY: 0, width, height, floor, teleporterHue: TELEPORTER_STILL_HUE, game, explored: explored ? (x, y) => isExplored(explored, x, y) : undefined });
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG encoding failed'))), 'image/png');
  });
}

export async function downloadFloorPng(rows: MapSquare[][], floor: number, dungeon: number, game: MapGame, explored: ExploredSquares | null = null): Promise<void> {
  const blob = await renderFloorPng(rows, floor, game, explored);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = game.pngName(dungeon, floor);
  link.click();
  URL.revokeObjectURL(url);
}
