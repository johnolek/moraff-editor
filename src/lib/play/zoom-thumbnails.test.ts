import { describe, expect, it } from 'vitest';
import { newFrame, pixelAt } from './view3d/frame';
import type { PicRowImage } from './view3d/texture';
import {
  buildZoomThumbnail,
  drawZoomThumbnail,
  TRANSPARENT,
  ZoomThumbnails,
  type ZoomThumbnail,
} from './zoom-thumbnails';

/** A picture whose every row is one run of the given colour across all 256 columns. */
function solid(colour: number): PicRowImage {
  return Array.from({ length: 200 }, () => ({ startX: 0, runs: [{ colour, length: 256 }] }));
}

/** A picture with pixels down its left half only, so the right half of a thumbnail stays clear. */
function leftHalf(colour: number): PicRowImage {
  return Array.from({ length: 200 }, () => ({ startX: 0, runs: [{ colour, length: 128 }] }));
}

/** The rule Moraff's World's own drawer uses, near enough for a test: value 0 draws nothing. */
const plainly = (value: number): number => (value === 0 ? TRANSPARENT : value);

describe('a monster picture shrunk for the zoom map', () => {
  it('fills every pixel of the square when the picture covers it', () => {
    const thumbnail = buildZoomThumbnail(solid(7), 8, plainly);
    expect(thumbnail.size).toBe(8);
    expect([...thumbnail.pixels]).toEqual(new Array(64).fill(7));
  });

  it('leaves the columns the picture does not reach clear', () => {
    const thumbnail = buildZoomThumbnail(leftHalf(7), 8, plainly);
    expect([...thumbnail.pixels.slice(0, 8)]).toEqual([7, 7, 7, 7, TRANSPARENT, TRANSPARENT, TRANSPARENT, TRANSPARENT]);
  });

  it('leaves the pixels the rule draws nothing for clear', () => {
    const thumbnail = buildZoomThumbnail(solid(0), 8, plainly);
    expect([...thumbnail.pixels]).toEqual(new Array(64).fill(TRANSPARENT));
  });

  it('is painted into the frame from the corner it is given, gaps and all', () => {
    const thumbnail = buildZoomThumbnail(leftHalf(7), 8, plainly);
    const frame = newFrame(40, 40);
    drawZoomThumbnail(frame, thumbnail, 10, 20);
    expect(pixelAt(frame, 10, 20)).toBe(7);
    expect(pixelAt(frame, 13, 27)).toBe(7);
    expect(pixelAt(frame, 14, 20)).toBe(0);
  });

  it('is clipped rather than wrapped where it runs off the frame', () => {
    const thumbnail = buildZoomThumbnail(solid(7), 8, plainly);
    const frame = newFrame(12, 12);
    drawZoomThumbnail(frame, thumbnail, 8, 8);
    expect(pixelAt(frame, 11, 11)).toBe(7);
    expect(pixelAt(frame, 0, 0)).toBe(0);
  });
});

describe('the store the thumbnails are kept in', () => {
  it('shrinks one picture once however many monsters ask for it', () => {
    const thumbnails = new ZoomThumbnails();
    let decoded = 0;
    const ask = (): ZoomThumbnail | null =>
      thumbnails.get('goblin', 8, () => {
        decoded += 1;
        return solid(7);
      }, plainly);
    expect(ask()).toEqual(ask());
    expect(decoded).toBe(1);
  });

  it('keeps one thumbnail per size, since the expanded map draws smaller cells', () => {
    const thumbnails = new ZoomThumbnails();
    const at = (size: number) => thumbnails.get('goblin', size, () => solid(7), plainly)!;
    expect(at(8).size).toBe(8);
    expect(at(5).size).toBe(5);
  });

  it('remembers a monster the bundle has no picture for, and does not look again', () => {
    const thumbnails = new ZoomThumbnails();
    let looked = 0;
    const ask = () =>
      thumbnails.get('nothing', 8, () => {
        looked += 1;
        return null;
      }, plainly);
    expect(ask()).toBeNull();
    expect(ask()).toBeNull();
    expect(looked).toBe(1);
  });
});
