import { describe, expect, it } from 'vitest';
import { DUN_COLUMNS, DUN_ROWS, isExplored, readBinFile, readDunFile, readDunFloors } from '../map/explored';
import { dotuMapFiles, mapsFileName, mwMapFiles, revMapFile } from './export-maps';
import type { MappedFloor } from './memory';
import { RevMapMemory } from './rev/memory';

const ROW_BYTES = DUN_COLUMNS / 8;

/** A floor of a dungeon with one square walked. */
function walked(dungeon: number, floor: number, x: number, y: number): MappedFloor {
  const bitmap = new Uint8Array(ROW_BYTES * DUN_ROWS);
  bitmap[y * ROW_BYTES + (x >> 3)] |= 1 << x % 8;
  return { dungeon, floor, bitmap };
}

describe('the map files of a Dungeons of the Unforgiven character', () => {
  it('is one .DUN per quarter of every module, named after the character', () => {
    const floors = [walked(0, 3, 10, 20), walked(0, 40, 11, 21), walked(4, 3, 12, 22)];

    const files = dotuMapFiles(floors, 21);

    expect(files.map((file) => file.name)).toEqual(['E00.DUN', 'E04.DUN', 'E10.DUN']);
  });

  it('is read back square for square, at the floor the character walked', () => {
    const files = dotuMapFiles([walked(4, 40, 11, 21), walked(4, 41, 12, 22)], 29);

    expect(files.map((file) => file.name)).toEqual(['M14.DUN']);
    const floors = readDunFloors(files[0].bytes, 1);
    expect(floors?.map((floor) => floor.floor)).toEqual([40, 41]);
    expect(isExplored(floors![0].squares, 11, 21)).toBe(true);
    expect(isExplored(floors![1].squares, 12, 22)).toBe(true);
  });

  it('falls back to the first of the ten numbers for a character that has none', () => {
    expect(dotuMapFiles([walked(0, 0, 1, 1)], null)[0].name).toBe('D00.DUN');
  });
});

describe('the map files of a Moraff’s World character', () => {
  it('is one .DUN per block of the dungeon being played, and leaves another dungeon out', () => {
    const floors = [walked(7, 3, 10, 20), walked(7, 40, 11, 21), walked(-9, 3, 12, 22)];

    const files = mwMapFiles(floors, 3, 7);

    expect(files.map((file) => file.name)).toEqual(['30.DUN', '31.DUN']);
    const read = readDunFile('31.DUN', files[1].bytes);
    expect(read.floors.map((floor) => floor.floor)).toEqual([40]);
    expect(isExplored(read.floors[0].squares, 11, 21)).toBe(true);
  });

  it('falls back to the first of the ten slots for a character that has none', () => {
    expect(mwMapFiles([walked(0, 0, 1, 1)], null, 0)[0].name).toBe('00.DUN');
  });
});

describe('the map file of a Moraff’s Revenge character', () => {
  it('is the one <n>.BIN, which the explored-map reader reads back', () => {
    const memory = new RevMapMemory();
    memory.markStep(7, 16, 2);

    const file = revMapFile(memory.bytes(), 5);

    expect(file.name).toBe('5.BIN');
    expect([...readBinFile(file.name, file.bytes).floors[2].squares]).toEqual([15 * 80 + 6]);
  });

  it('falls back to the first of the ten characters for one with no number', () => {
    expect(revMapFile(new RevMapMemory().bytes(), null).name).toBe('1.BIN');
  });
});

describe('what a zip of them is called', () => {
  it('is named after the character, or after nobody when they have no name', () => {
    expect(mapsFileName('SAGEY')).toBe('SAGEY-maps.zip');
    expect(mapsFileName('')).toBe('character-maps.zip');
  });
});
