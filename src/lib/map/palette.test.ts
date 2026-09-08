import { describe, expect, it } from 'vitest';
import { UNFORGIVEN_MAP, type MapSquare } from './game';
import { glyphDestination } from './draw-floor';
import { gameSideStroke, palette, sideStroke, squareFill, squareGlyph } from './palette';

function square(overrides: Partial<MapSquare> = {}): MapSquare {
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

  it('draws a false floor only on a square that holds nothing of its own', () => {
    expect(squareGlyph(square({ falseFloor: true }))).toBe('falseFloor');
    expect(squareGlyph(square({ falseFloor: true, ladder: -1 }))).toBe('up');
  });
});

describe('glyphDestination', () => {
  it('drops a false floor one floor, the way the chute that landed you on it did', () => {
    expect(glyphDestination(square({ falseFloor: true }), 12)).toBe(13);
    expect(glyphDestination(square({ chute: 13 }), 12)).toBe(13);
    expect(glyphDestination(square({ ladder: -2 }), 12)).toBe(10);
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

  it('draws a secret door and a module teleporter as plain walls where the game does', () => {
    expect(gameSideStroke(0)).toBe('wall');
    expect(gameSideStroke(1)).toBe('door');
    expect(gameSideStroke(2)).toBe('wall');
    expect(gameSideStroke(3)).toBeNull();
    expect(gameSideStroke(4)).toBe('wall');
  });
});

describe('squareFill', () => {
  it('leaves rock unfilled and colours buildings by kind', () => {
    expect(squareFill(square({ solid: true }), UNFORGIVEN_MAP)).toBeNull();
    expect(squareFill(square(), UNFORGIVEN_MAP)).toBe(palette.square);
    expect(squareFill(square({ town: 1 }), UNFORGIVEN_MAP)).toBe(UNFORGIVEN_MAP.buildings[0].colour);
    expect(squareFill(square({ town: 4 }), UNFORGIVEN_MAP)).toBe(UNFORGIVEN_MAP.buildings[3].colour);
  });
});
