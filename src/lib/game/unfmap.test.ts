import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { bundledDungeon } from './dungeon';
import { floorsOfModule, summarizeFloor, type FloorSummary } from './floor-summary';
import { render } from './unfmap.js';

// Both fixtures were produced by the verified generator (dotu-tools/reference/make_fixtures.mjs).
// A single differing character means the port is wrong.

function fixtureFloors(): { module: number; floor: number; lines: string[] }[] {
  const text = readFileSync('dotu-tools/fixtures/floors.txt', 'utf8');
  const blocks = text.split(/^=== Module (\d+) floor (\d+) ===\n/m).slice(1);
  const floors = [];
  for (let i = 0; i < blocks.length; i += 3) {
    floors.push({ module: +blocks[i], floor: +blocks[i + 1], lines: blocks[i + 2].trimEnd().split('\n') });
  }
  return floors;
}

describe('bundled dungeon', () => {
  it.each(fixtureFloors())('renders module $module floor $floor like the fixture', ({ module, floor, lines }) => {
    expect(render(bundledDungeon.floor(floor, module - 1))).toEqual(lines);
  });

  const fixtureSummaries: FloorSummary[] = JSON.parse(readFileSync('dotu-tools/fixtures/floor-summary.json', 'utf8'));

  it.each([1, 2, 3, 4, 5])('counts every feature of every floor of module %i like the fixture', (module) => {
    const expected = fixtureSummaries.filter((summary) => summary.module === module);
    const actual = floorsOfModule(module - 1).map((floor) => summarizeFloor(bundledDungeon, floor, module - 1));
    expect(actual).toEqual(expected);
  });
});
