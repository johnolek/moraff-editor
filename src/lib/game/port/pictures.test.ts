import { describe, expect, it } from 'vitest';
import { WALL_FILES, wallPictureFile } from './pictures';

describe('wallPictureFile', () => {
  it('names the file the section table points at', () => {
    expect(wallPictureFile(1)).toBe('ufwall1.pic');
    expect(wallPictureFile(4)).toBe('ufwall4.pic');
    expect(wallPictureFile(7)).toBe('ufwall1.pic');
    expect(wallPictureFile(20)).toBe('ufwall4.pic');
  });

  it('falls back on the first file past the table', () => {
    expect(WALL_FILES).toHaveLength(20);
    expect(wallPictureFile(21)).toBe('ufwall1.pic');
  });
});
