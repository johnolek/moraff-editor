import { describe, expect, it } from 'vitest';
import { sectionInfo } from './sections';

describe('sectionInfo', () => {
  it('names the section, its part of the module, the boss and the boss floor', () => {
    expect(sectionInfo(0, 0)).toEqual({ section: 1, part: 1, bossFloor: 5, bossName: 'Shadow Gargalon' });
    expect(sectionInfo(0, 16)).toMatchObject({ section: 4, part: 4, bossFloor: 20 });
    expect(sectionInfo(4, 100)).toEqual({ section: 20, part: 4, bossFloor: 100, bossName: 'Shadow Ogeroth' });
  });

  it('places boss floors at multiples of 5 per module', () => {
    expect(sectionInfo(1, 1)?.bossFloor).toBe(10);
    expect(sectionInfo(1, 11)?.bossFloor).toBe(20);
    expect(sectionInfo(2, 45)?.bossFloor).toBe(45);
  });

  it('has no section for floors below the town', () => {
    expect(sectionInfo(0, -5)).toBeNull();
    expect(sectionInfo(0, -32768)).toBeNull();
  });

  it('keeps the fourth section for floors far below the bottom of the module', () => {
    expect(sectionInfo(0, 30000)).toMatchObject({ section: 4, part: 4 });
  });
});
