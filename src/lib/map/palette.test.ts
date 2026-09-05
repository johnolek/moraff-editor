import { describe, expect, it } from 'vitest';
import type { Square } from '../game/unfmap.js';
import { palette, sideStroke, squareFill, squareGlyph } from './palette';

function square(overrides: Partial<Square> = {}): Square {
  return { n: 3, s: 3, w: 3, e: 3, solid: false, ladder: 0, chute: 0, trapdoor: -1, town: 0, ...overrides };
}

describe('squareGlyph', () => {
  it('prefers ladders, then trap doors, then chutes, like drawsquare', () => {
    expect(squareGlyph(square())).toBeNull();
    expect(squareGlyph(square({ ladder: 2 }))).toBe('down');
    expect(squareGlyph(square({ ladder: -1 }))).toBe('up');
    expect(squareGlyph(square({ trapdoor: 10 }))).toBe('trapdoor');
    expect(squareGlyph(square({ chute: 7 }))).toBe('chute');
    expect(squareGlyph(square({ ladder: 1, trapdoor: 10, chute: 7 }))).toBe('down');
    expect(squareGlyph(square({ trapdoor: 10, chute: 7 }))).toBe('trapdoor');
  });
});

describe('sideStroke', () => {
  it('maps the four drawn side kinds and leaves open sides undrawn', () => {
    expect(sideStroke(0)).toBe('wall');
    expect(sideStroke(1)).toBe('door');
    expect(sideStroke(2)).toBe('secretDoor');
    expect(sideStroke(3)).toBeNull();
    expect(sideStroke(4)).toBe('teleporter');
  });
});

describe('squareFill', () => {
  it('leaves rock unfilled and colours buildings by kind', () => {
    expect(squareFill(square({ solid: true }))).toBeNull();
    expect(squareFill(square())).toBe(palette.square);
    expect(squareFill(square({ town: 1 }))).toBe(palette.town[0]);
    expect(squareFill(square({ town: 4 }))).toBe(palette.town[3]);
  });
});
