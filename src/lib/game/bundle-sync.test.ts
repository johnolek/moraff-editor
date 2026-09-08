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
  ['src/lib/game/mwmap.js', 'mw-tools/reference/mwmap.js'],
  ['src/lib/game/revmap.js', 'rev-tools/reference/revmap.js'],
  ['src/lib/game/dung.b64.js', 'mw-tools/data/dung.b64.js'],
  ['src/lib/game/rev7.b64.js', 'rev-tools/data/rev7.b64.js'],
  ['src/lib/game/dotu-data.json', 'dotu-tools/data/dotu-data.json'],
  ['src/lib/game/dotu-fonts.json', 'dotu-tools/data/dotu-fonts.json'],
  ['src/lib/game/uroll.txt', 'dotu-tools/data/uroll.txt'],
  ['src/lib/game/roll.txt', 'mw-tools/data/roll.txt'],
  ['src/lib/game/mw-spells.hlp', 'mw-tools/data/spells.hlp'],
  ['src/lib/game/uspells.hlp', 'dotu-tools/data/uspells.hlp'],
  ['src/lib/game/hints/h.bin', 'mw-tools/data/hints/h.bin'],
  ['src/lib/game/palettes.json', 'dotu-tools/data/palettes.json'],
  ['src/lib/game/building-palette-banks.json', 'dotu-tools/data/building-palette-banks.json'],
];

const pictureNames = [
  'ufmon.pic',
  ...Array.from({ length: 20 }, (_, i) => `ufmon${i + 1}.pic`),
  ...Array.from({ length: 4 }, (_, i) => `ufwall${i + 1}.pic`),
];

const pictureCopies: [string, string][] = pictureNames.map((name) => [
  `src/lib/game/pics/${name}`,
  `dotu-tools/data/pics/${name}`,
]);

// The hint files are the game's own text, so the copies stay identical to the mirrored
// originals apart from the DOS line endings, which both sides have as newlines.
// The game folder has 0.uhp to 18.uhp and 20.uhp to 29.uhp; there is no 19.uhp.
const helpNumbers = [...Array.from({ length: 19 }, (_, i) => i), ...Array.from({ length: 10 }, (_, i) => i + 20)];

const hintNames = ['uh.bin', 'uh2.bin', ...helpNumbers.map((number) => `${number}.uhp`)];

const hintCopies: [string, string][] = hintNames.map((name) => [
  `src/lib/game/hints/${name}`,
  `dotu-tools/data/hints/${name}`,
]);

// Moraff's World's help files are the same idea a year earlier, and the game folder has the same
// gap: 0.hlp to 17.hlp and 20.hlp to 29.hlp, with no 18 or 19.
const mwHelpNumbers = [...Array.from({ length: 18 }, (_, i) => i), ...Array.from({ length: 10 }, (_, i) => i + 20)];

const mwHelpCopies: [string, string][] = mwHelpNumbers.map((number) => [
  `src/lib/game/mw-help/${number}.hlp`,
  `mw-tools/data/help/${number}.hlp`,
]);

describe('game modules copied from the tools directories', () => {
  it.each(copies)('%s is identical to %s', (copy, original) => {
    expect(readFileSync(copy, 'utf8')).toBe(readFileSync(original, 'utf8'));
  });

  it.each(pictureCopies)('%s is byte-identical to %s', (copy, original) => {
    expect(readFileSync(copy).equals(readFileSync(original))).toBe(true);
  });

  it.each(hintCopies)('%s is identical to %s', (copy, original) => {
    expect(readFileSync(copy, 'utf8')).toBe(readFileSync(original, 'utf8'));
  });

  it.each(mwHelpCopies)('%s is identical to %s', (copy, original) => {
    expect(readFileSync(copy, 'utf8')).toBe(readFileSync(original, 'utf8'));
  });
});
