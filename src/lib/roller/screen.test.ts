import { describe, expect, it } from 'vitest';
import { FONT_ADVANCE, MW_SCREEN_COLOURS, SCREEN_COLOURS, screenSpans } from './screen';

describe('the game s UI colours', () => {
  it('is the sixteen the roller draws with, black first', () => {
    expect(SCREEN_COLOURS).toHaveLength(16);
    expect(SCREEN_COLOURS[0]).toBe('#000000');
  });

  it('names the eight roll_char reaches for', () => {
    expect(SCREEN_COLOURS[2]).toBe('#0000ff');
    expect(SCREEN_COLOURS[3]).toBe('#51caff');
    expect(SCREEN_COLOURS[4]).toBe('#ffff51');
    expect(SCREEN_COLOURS[5]).toBe('#d75100');
    expect(SCREEN_COLOURS[6]).toBe('#ff0028');
    expect(SCREEN_COLOURS[7]).toBe('#ffb600');
    expect(SCREEN_COLOURS[8]).toBe('#00ff00');
    expect(SCREEN_COLOURS[15]).toBe('#ffffff');
  });
});

describe("Moraff's World s UI colours", () => {
  it('is its own orange, not the other game s', () => {
    expect(MW_SCREEN_COLOURS[5]).toBe('#d75128');
    expect(SCREEN_COLOURS[5]).toBe('#d75100');
  });

  it('draws a line of a Moraff s World screen in it', () => {
    const box = [{ text: 'YOU FOUND A TRAP DOOR!', x: 0, y: 100, font: 0, colour: 5 }];
    expect(screenSpans(box, MW_SCREEN_COLOURS)[0].colour).toBe('#d75128');
  });
});

describe('the spans of a screen', () => {
  it('sets a line in its own colour at its own place', () => {
    const [span] = screenSpans([{ text: 'PLEASE SELECT ONE:', x: 0, y: 100, font: 1, colour: 4 }]);
    expect(span.text).toBe('PLEASE SELECT ONE:');
    expect(span.x).toBe(0);
    expect(span.colour).toBe('#ffff51');
    expect(span.spacing).toBe(0);
    // A character of the middle font is 33 units wide, which VT323 needs 82.5 of font size for,
    // and the line box is lifted so the letters start on the 100 the game draws them at.
    expect(span.size).toBe(FONT_ADVANCE[1] / 0.4);
    expect(span.y).toBeCloseTo(100 - span.size * 0.24);
  });

  it('spreads a line out to the right-hand edge psfont was given', () => {
    const [line] = screenSpans([
      { text: 'YOU MAY ASSIGN 24 ADDITIONAL POINTS', x: 0, y: 700, spreadTo: 0x63f, font: 1, colour: 3 },
    ]);
    // Thirty-five characters over 0x63f units is a step of about 46, which is thirteen more than
    // the font puts between them on its own.
    expect(line.spacing).toBeCloseTo(0x63f / 35 - FONT_ADVANCE[1]);
    expect(line.size).toBe(FONT_ADVANCE[1] / 0.4);
  });

  it('squeezes a line the psfont edge leaves no room for', () => {
    const [line] = screenSpans([
      { text: 'A'.repeat(80), x: 0, y: 0x334, spreadTo: 0x640, font: 0, colour: 6 },
    ]);
    expect(line.spacing).toBeCloseTo(0x640 / 80 - FONT_ADVANCE[0]);
    expect(line.spacing).toBeLessThan(0);
  });

  it('gives the value beside a label a span of its own at its own column', () => {
    const spans = screenSpans([
      { text: 'STRENGTH: ', value: '25', x: 0, valueX: 0x212, y: 100, font: 1, colour: 6 },
    ]);
    expect(spans.map((span) => [span.text, span.x])).toEqual([
      ['STRENGTH: ', 0],
      ['25', 0x212],
    ]);
    expect(spans[1].y).toBe(spans[0].y);
    expect(spans[1].colour).toBe('#ff0028');
  });
});
