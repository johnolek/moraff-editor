import type { Square } from '../game/unfmap.js';
import { MAP_COLUMNS, MAP_ROWS } from './area';
import { drawFloor } from './draw-floor';
import { TELEPORTER_STILL_HUE } from './teleporters';

export const EXPORT_CELL = 10;

export function floorPngName(moduleIndex: number, floor: number): string {
  const level = floor < 0 ? `floor-minus-${-floor}` : `floor-${floor}`;
  return `dotu-module-${moduleIndex + 1}-${floor === 0 ? 'town' : level}.png`;
}

/** The floor as the game's own map shows it, at EXPORT_CELL pixels per square, as a PNG blob. */
export function renderFloorPng(rows: Square[][], floor: number): Promise<Blob> {
  const width = MAP_COLUMNS * EXPORT_CELL + 2;
  const height = MAP_ROWS * EXPORT_CELL + 2;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  drawFloor(canvas.getContext('2d')!, rows, { cell: EXPORT_CELL, originX: 0, originY: 0, width, height, floor, teleporterHue: TELEPORTER_STILL_HUE });
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG encoding failed'))), 'image/png');
  });
}

export async function downloadFloorPng(rows: Square[][], floor: number, moduleIndex: number): Promise<void> {
  const blob = await renderFloorPng(rows, floor);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = floorPngName(moduleIndex, floor);
  link.click();
  URL.revokeObjectURL(url);
}
