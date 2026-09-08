import { describe, expect, it } from 'vitest';
import { newFrame, pixelAt } from './frame';
import { drawWallFace, parsePicRows, wallPixelIndex, type PicRow } from './texture';

/** Build a .PIC record from rows of runs, the way the game's files are laid out. */
function buildPic(rows: PicRow[]): Uint8Array {
  const body: number[] = [];
  const offsets: number[] = [];
  let at = 2;
  for (let r = 0; r < 200; r++) {
    offsets.push(at);
    const row = rows[r] ?? { startX: 0, runs: [] };
    if (row.runs.length) {
      const bytes = [row.startX];
      for (const run of row.runs) {
        if (run.length >= 1 && run.length <= 7) bytes.push((run.colour & 31) | (run.length << 5));
        else bytes.push(run.colour, run.length === 255 ? 0 : run.length);
      }
      body.push(...bytes);
      at += bytes.length;
    }
  }
  const total = at;
  // The record is a big-endian length, 200 row offsets, then the rows. The offset that would be
  // the 201st falls on the first two bytes of the row data, which hold the length again -- so the
  // end of the last row reads correctly out of what looks like the wrong place.
  const out = new Uint8Array(402 + total);
  out[0] = (total >> 8) & 0xff;
  out[1] = total & 0xff;
  for (let i = 0; i < 200; i++) {
    out[2 + 2 * i] = offsets[i] & 0xff;
    out[3 + 2 * i] = (offsets[i] >> 8) & 0xff;
  }
  out[402] = total & 0xff;
  out[403] = (total >> 8) & 0xff;
  out.set(body, 404);
  return out;
}

const solid = (colour: number): PicRow[] =>
  Array.from({ length: 200 }, () => ({ startX: 0, runs: [{ colour, length: 255 }] }));

describe('reading a .PIC as rows of runs', () => {
  it('reads back the rows it was built from', () => {
    const images = parsePicRows(buildPic(solid(9)));
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveLength(200);
    expect(images[0][0]).toEqual({ startX: 0, runs: [{ colour: 9, length: 255 }] });
  });

  it('reads a short run packed into one byte', () => {
    const rows = solid(9);
    rows[3] = { startX: 4, runs: [{ colour: 5, length: 6 }] };
    expect(parsePicRows(buildPic(rows))[0][3]).toEqual({ startX: 4, runs: [{ colour: 5, length: 6 }] });
  });
});

describe('painting a wall face', () => {
  const pic = parsePicRows(buildPic(solid(9)))[0];
  const colours = { base: 0x50, tint: 12 };

  it('fills a square-on face with the picture', () => {
    const frame = newFrame(40, 40);
    drawWallFace(frame, 10, 20, 8, 8, 24, 24, pic, 0, 392, colours);
    expect(pixelAt(frame, 10, 8)).toBe(0x59);
    expect(pixelAt(frame, 20, 20)).toBe(0x59);
    expect(pixelAt(frame, 9, 12)).toBe(0);
    expect(pixelAt(frame, 21, 12)).toBe(0);
  });

  it('leaves the rows above and below the face alone', () => {
    const frame = newFrame(40, 40);
    drawWallFace(frame, 10, 20, 8, 8, 24, 24, pic, 0, 392, colours);
    expect(pixelAt(frame, 15, 7)).toBe(0);
    expect(pixelAt(frame, 15, 39)).toBe(0);
  });

  it('slopes a side face, so its far end is shorter than its near end', () => {
    const frame = newFrame(40, 40);
    drawWallFace(frame, 10, 30, 4, 14, 34, 22, pic, 0, 392, colours);
    const near = [...Array(40).keys()].filter((y) => pixelAt(frame, 10, y) !== 0).length;
    const far = [...Array(40).keys()].filter((y) => pixelAt(frame, 30, y) !== 0).length;
    expect(near).toBeGreaterThan(far);
  });

  it('draws nothing for a face with no width', () => {
    const frame = newFrame(40, 40);
    drawWallFace(frame, 20, 20, 8, 8, 24, 24, pic, 0, 392, colours);
    expect([...frame.pixels].every((pixel) => pixel === 0)).toBe(true);
  });

  it('stays inside the screen when the face runs off it', () => {
    const frame = newFrame(40, 40);
    expect(() => drawWallFace(frame, -30, 70, -20, -20, 90, 90, pic, 0, 392, colours)).not.toThrow();
    expect(pixelAt(frame, 0, 0)).toBe(0x59);
  });
});

describe('the colours a wall pixel can take', () => {
  it('drops value 16 to black and gives value 17 the face tint', () => {
    expect(wallPixelIndex(0x10, { base: 0x50, tint: 12 })).toBe(0);
    expect(wallPixelIndex(0x11, { base: 0x50, tint: 12 })).toBe(12);
  });

  it('lifts every other value into the wall bank', () => {
    expect(wallPixelIndex(1, { base: 0x50, tint: 12 })).toBe(0x51);
    expect(wallPixelIndex(31, { base: 0x50, tint: 12 })).toBe(0x6f);
  });
});
