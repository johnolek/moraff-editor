import { describe, expect, it } from 'vitest';
import {
  formatRevRecord,
  isRevRecord,
  parseRevRecord,
  REV_LINE_COUNT,
  REV_LINE_SHAPE,
  REV_VALUE_COUNT,
  revNumberText,
} from './record';

const counting = Array.from({ length: REV_VALUE_COUNT }, (_, i) => i + 1);
const text = (bytes: Uint8Array) => new TextDecoder('latin1').decode(bytes);

describe('the shape of a character file', () => {
  it('is 311 lines holding 340 numbers', () => {
    expect(REV_LINE_COUNT).toBe(311);
    expect(REV_LINE_SHAPE.reduce((total, count) => total + count, 0)).toBe(REV_VALUE_COUNT);
  });

  it('puts each characteristic on a line of its own and then three grouped statements', () => {
    expect(REV_LINE_SHAPE.slice(0, 9)).toEqual([1, 1, 1, 1, 1, 1, 5, 5, 10]);
  });
});

describe('writing a character file', () => {
  const written = formatRevRecord(counting);

  it('separates the numbers with commas and the lines with a carriage return', () => {
    expect(text(written).split('\r\n')[6]).toBe('7,8,9,10,11');
  });

  it('leaves the end-of-file byte CLOSE writes behind the last line', () => {
    expect(written[written.length - 1]).toBe(0x1a);
    expect(text(written.slice(0, -1)).endsWith('340\r\n')).toBe(true);
  });

  it('refuses a record that is not the right length', () => {
    expect(() => formatRevRecord([1, 2, 3])).toThrow('340 numbers');
  });
});

describe('reading a character file back', () => {
  it('gives back every number that was written', () => {
    expect(parseRevRecord(formatRevRecord(counting))).toEqual(counting);
  });

  it('reads a file whose lines were joined differently, the way INPUT # would', () => {
    const flat = new TextEncoder().encode(counting.join(',') + '\r\n');
    expect(parseRevRecord(flat)).toEqual(counting);
  });

  it('stops at the end-of-file byte', () => {
    const padded = new Uint8Array([...formatRevRecord(counting), 0x0d, 0x0a, 0x39, 0x39]);
    expect(parseRevRecord(padded)).toEqual(counting);
  });

  it('turns down a file of the wrong length', () => {
    expect(parseRevRecord(new TextEncoder().encode('1,2,3\r\n'))).toBeNull();
  });

  it('turns down a file with anything in it that is not a number', () => {
    const named = new TextEncoder().encode(`"FIGHTY"\r\n${counting.slice(1).join(',')}\r\n`);
    expect(parseRevRecord(named)).toBeNull();
    expect(isRevRecord(named)).toBe(false);
  });

  it('turns down a save file of one of the other games', () => {
    const bytes = new Uint8Array(2344);
    bytes.set(new TextEncoder().encode('FIGHTY'));
    expect(isRevRecord(bytes)).toBe(false);
  });

  it('recognises one of its own', () => {
    expect(isRevRecord(formatRevRecord(counting))).toBe(true);
  });
});

describe('a number the way WRITE # writes one', () => {
  it('writes a whole number as its digits', () => {
    expect(revNumberText(0)).toBe('0');
    expect(revNumberText(12316)).toBe('12316');
    expect(revNumberText(-3)).toBe('-3');
  });

  it('keeps the seven significant digits a single holds', () => {
    expect(revNumberText(6.3)).toBe('6.3');
    expect(revNumberText(1 / 3)).toBe('0.3333333');
  });
});
