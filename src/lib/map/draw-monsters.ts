import { squareRect } from './draw-floor';
import { palette } from './palette';
import type { StockedMonster } from './stocking';
import type { Viewport } from './viewport';

/** Square size from which a monster is drawn as its picture rather than a dot. */
export const PICTURE_MIN_CELL = 16;

/** The pictures the map draws monsters with, kept by whoever owns the canvas. */
export interface MonsterSprites {
  isBoss(monsterId: string): boolean;
  /** The monster's picture, drawn on an offscreen canvas the first time it is asked for. */
  picture(monsterId: string): HTMLCanvasElement;
}

/** The monsters stocked on the floor, over the squares they stand on. */
export function drawMonsters(
  ctx: CanvasRenderingContext2D,
  monsters: StockedMonster[],
  view: Viewport,
  sprites: MonsterSprites,
): void {
  for (const monster of monsters) {
    const { x0, y0, w, h } = squareRect(view, monster.x, monster.y);
    if (view.cell < PICTURE_MIN_CELL) {
      drawMarker(ctx, x0 + 1 + w / 2, y0 + 1 + h / 2, Math.max(2, view.cell / 4), sprites.isBoss(monster.monsterId));
    } else {
      drawPicture(ctx, sprites.picture(monster.monsterId), x0, y0, w, h);
    }
  }
}

function drawMarker(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, boss: boolean): void {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.fillStyle = boss ? palette.boss : palette.monster;
  ctx.fill();
  if (!boss) return;
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
}

/** The picture as large as it fits inside the square, keeping its shape and its black
 *  background transparent so the square shows through around it. */
function drawPicture(ctx: CanvasRenderingContext2D, picture: HTMLCanvasElement, x0: number, y0: number, w: number, h: number): void {
  const room = { width: w - 2, height: h - 2 };
  const scale = Math.min(room.width / picture.width, room.height / picture.height);
  const width = picture.width * scale;
  const height = picture.height * scale;
  ctx.drawImage(picture, x0 + 2 + (room.width - width) / 2, y0 + 2 + (room.height - height) / 2, width, height);
}
