import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// The reference modules were verified against 341,000 explored squares from real
// save files. They stay byte-identical copies so that verification still holds.
const copies: [string, string][] = [
  ['src/lib/game/unfmap.js', 'dotu-tools/reference/unfmap.js'],
  ['src/lib/game/dotu-files.js', 'dotu-tools/reference/dotu-files.js'],
  ['src/lib/game/dotu-mech.js', 'dotu-tools/reference/dotu-mech.js'],
  ['src/lib/game/dotu-pic.js', 'dotu-tools/reference/dotu-pic.js'],
  ['src/lib/game/unfdung.b64.js', 'dotu-tools/data/unfdung.b64.js'],
  ['src/lib/game/dotu-data.json', 'dotu-tools/data/dotu-data.json'],
  ['src/lib/game/dotu-fonts.json', 'dotu-tools/data/dotu-fonts.json'],
  ['src/lib/game/palettes.json', 'dotu-tools/data/palettes.json'],
  ['src/lib/game/building-palette-banks.json', 'dotu-tools/data/building-palette-banks.json'],
];

describe('game modules copied from dotu-tools', () => {
  it.each(copies)('%s is identical to %s', (copy, original) => {
    expect(readFileSync(copy, 'utf8')).toBe(readFileSync(original, 'utf8'));
  });
});
