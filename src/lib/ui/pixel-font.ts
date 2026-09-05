import fonts from '../game/dotu-fonts.json';

export type FontName = keyof typeof fonts;

export interface PixelFont {
  height: number;
  advance: number;
  glyphs: Record<string, number[]>;
}

export function pixelFont(name: FontName): PixelFont {
  return fonts[name];
}

/** Row bitmaps of one character; the fonts are uppercase only and unknown characters draw as "?". */
export function glyphRows(font: PixelFont, char: string): number[] {
  return font.glyphs[char.toUpperCase()] ?? font.glyphs['?'];
}

export function textWidth(font: PixelFont, text: string): number {
  return text.length * font.advance;
}

/** Draws `text` with its top-left corner at (x, y), each font pixel `scale` canvas pixels. */
export function drawPixelText(ctx: CanvasRenderingContext2D, font: PixelFont, text: string, x: number, y: number, scale: number, colour: string): void {
  ctx.fillStyle = colour;
  for (let i = 0; i < text.length; i++) {
    const rows = glyphRows(font, text[i]);
    const left = x + i * font.advance * scale;
    rows.forEach((row, r) => {
      for (let bit = 0; row >> bit; bit++) {
        if (row & (1 << bit)) ctx.fillRect(left + bit * scale, y + r * scale, scale, scale);
      }
    });
  }
}
