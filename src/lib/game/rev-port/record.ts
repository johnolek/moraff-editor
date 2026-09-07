/**
 * The Moraff's Revenge character file: `<n>.EXE`, which is text rather than a program.
 *
 * DUNSMALL.EXE reads it with a run of `INPUT #3` statements at 1000:B674 and writes it back with
 * `WRITE #` at 1000:B308; CHCHAR.EXE creates it with the same nine `WRITE #` statements at its own
 * offsets 1293 to 14C1. `WRITE #` puts one statement's values on one line, separated by commas
 * with no spaces, and ends every line with a carriage return and a line feed, so the file is 311
 * lines holding 340 numbers. Closing the file leaves DOS's end-of-file byte behind it.
 *
 * `INPUT #` treats a comma and a line end alike, so the line breaks matter only for writing the
 * file back the way the game would have written it.
 */

/** How many numbers a character file holds. */
export const REV_VALUE_COUNT = 340;

/** DOS's end-of-file byte, which BASIC's CLOSE writes after the last line. */
const END_OF_FILE = 0x1a;

/**
 * How many numbers each line holds, in order: the six characteristics one to a line, then the
 * three grouped statements, then the five arrays, the twelfth of which is written in pairs.
 * CHCHAR.EXE's nine `WRITE #` statements are at 1293 (in a loop of six), 12B9, 12E1, 132B, 1395
 * (ten), 13DD (ten), 1425 (seventy), 146D (twelve pairs) and 14C1 (two hundred).
 */
export const REV_LINE_SHAPE: number[] = [
  ...Array<number>(6).fill(1),
  5,
  5,
  10,
  ...Array<number>(10).fill(1),
  ...Array<number>(10).fill(1),
  ...Array<number>(70).fill(1),
  ...Array<number>(12).fill(2),
  ...Array<number>(200).fill(1),
];

/** How many lines a character file has. */
export const REV_LINE_COUNT = REV_LINE_SHAPE.length;

/**
 * The numbers in a character file, or null when the bytes are not one.
 *
 * Anything that is not a number is rejected rather than skipped, so that a file of some other
 * game cannot pass for this one; `WRITE #` would quote a string, and no field of this record is
 * one.
 */
export function parseRevRecord(bytes: Uint8Array): number[] | null {
  let text = '';
  for (const byte of bytes) {
    if (byte === END_OF_FILE) break;
    text += String.fromCharCode(byte);
  }
  const values: number[] = [];
  for (const line of text.split(/\r\n|\n|\r/)) {
    for (const field of line.split(',')) {
      const trimmed = field.trim();
      if (trimmed === '') continue;
      if (!/^[-+]?(\d+\.?\d*|\.\d+)([eEdD][-+]?\d+)?$/.test(trimmed)) return null;
      values.push(Number(trimmed.replace(/[dD]/, 'e')));
    }
  }
  return values.length === REV_VALUE_COUNT ? values : null;
}

/** Whether a file the browser has just read is a Moraff's Revenge character. */
export function isRevRecord(bytes: Uint8Array): boolean {
  return parseRevRecord(bytes) !== null;
}

/**
 * One number the way BASIC's `WRITE #` writes it: the digits, and a minus sign when it needs one.
 *
 * BASIC keeps seven significant digits for a single and sixteen for a double, and drops to
 * exponent form for the very large; every number a rolled character holds is a small whole one,
 * and `INPUT #` reads plain digits back whichever form they were written in.
 */
export function revNumberText(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toPrecision(7)));
}

/** The bytes of a character file holding these numbers, laid out the way CHCHAR.EXE lays it out. */
export function formatRevRecord(values: number[]): Uint8Array<ArrayBuffer> {
  if (values.length !== REV_VALUE_COUNT) throw new Error(`a character holds ${REV_VALUE_COUNT} numbers, not ${values.length}`);
  let text = '';
  let at = 0;
  for (const count of REV_LINE_SHAPE) {
    text += values.slice(at, at + count).map(revNumberText).join(',') + '\r\n';
    at += count;
  }
  const bytes = new Uint8Array(text.length + 1);
  for (let i = 0; i < text.length; i++) bytes[i] = text.charCodeAt(i) & 0xff;
  bytes[text.length] = END_OF_FILE;
  return bytes;
}
