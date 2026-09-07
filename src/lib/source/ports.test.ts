import { describe, expect, it } from 'vitest';
import { decompSection } from './decomp';
import { allPortFunctions, declarations, portCode, portFiles, portsOfC, sourceFiles } from './ports';

const FILE = 'src/lib/game/port/magic.ts';

const FRAGMENT = [
  '/** The file this comment heads, citing (exe 1000:0000, unf.c "entry") from a long way off. */',
  '',
  'export const LIMIT = 3;',
  '',
  'export const PAIRS: number[][] = [[1, 2]];',
  '',
  '/** sleep_monster (exe 3000:d904, unf.c "sleep_monster"): put the monster to sleep. */',
  'export function sleepMonster(game) {',
  '  if (game) {',
  '    return LIMIT;',
  '  }',
  '}',
  '',
  'export class Dungeon {',
  '  constructor(dwall) {',
  '    this.dwall = dwall;',
  '  }',
  '',
  '  /** solidcheck (exe 3000:86b5, unf.c "solidcheck"): four walls. */',
  '  solid(x, y) {',
  '    if (x) {',
  '      return y;',
  '    }',
  '  }',
  '}',
  '',
  'function notExported() {}',
].join('\n');

const MW_FRAGMENT = [
  '/** show_roll (WORLD.EXE 3000:4477, mw.c "show_roll"): draw the character rolled. */',
  'export function showRoll(game) {}',
  '',
  '/**',
  ' * Which record of SPELLS.HLP a description is (WORLD.EXE 3000:b7fd, mw.c',
  ' * "FUN_3000_b7fd"), counted in menu order.',
  ' */',
  'export function mwSpellRecord(category) {}',
].join('\n');

describe('declarations', () => {
  const found = declarations(FILE, FRAGMENT);

  it('finds the exported values, the exported functions and the methods of a class', () => {
    expect(found.map((fn) => fn.name)).toEqual(['LIMIT', 'PAIRS', 'sleepMonster', 'solid']);
  });

  it('reads the citation out of the comment above a declaration', () => {
    expect(found[2].c).toEqual({ name: 'sleep_monster', address: '3000:d904', game: 'unforgiven' });
    expect(found[3].c).toEqual({ name: 'solidcheck', address: '3000:86b5', game: 'unforgiven' });
  });

  it('does not hand a file-level comment to whatever is declared after it', () => {
    expect(found[0].c).toBeNull();
  });

  it("takes a citation of mw.c as Moraff's World's, executable name and all", () => {
    const mw = declarations('src/lib/game/mw-port/character.ts', MW_FRAGMENT);
    expect(mw[0].c).toEqual({ name: 'show_roll', address: '3000:4477', game: 'moraffsWorld' });
  });

  it('finds a citation the line wrapping split in two', () => {
    const mw = declarations('src/lib/game/mw-port/spells.ts', MW_FRAGMENT);
    expect(mw[1].c).toEqual({ name: 'FUN_3000_b7fd', address: '3000:b7fd', game: 'moraffsWorld' });
  });
});

describe('the port the app ships', () => {
  const games = ['unforgiven', 'moraffsWorld'] as const;

  it('finds declarations in every file it lists', () => {
    for (const game of games) {
      for (const entry of portFiles(game)) expect(entry.functions.length, entry.file).toBeGreaterThan(0);
      expect(portFiles(game).map((entry) => entry.file)).toEqual(sourceFiles(game));
    }
  });

  it("keeps the two games' files apart", () => {
    expect(sourceFiles()).toEqual(sourceFiles('unforgiven'));
    expect(sourceFiles('unforgiven')).toContain('src/lib/game/port/magic.ts');
    expect(sourceFiles('moraffsWorld')).toContain('src/lib/game/mw-port/character.ts');
    expect(sourceFiles('unforgiven')).not.toContain('src/lib/game/mw-port/character.ts');
  });

  it('can read the text of every declaration it found', () => {
    for (const fn of allPortFunctions()) expect(() => portCode(fn.file, fn.name), `${fn.file} ${fn.name}`).not.toThrow();
  });

  it('cites only functions the decompilation really holds', () => {
    const cited = allPortFunctions().filter((fn) => fn.c);
    expect(cited.length).toBeGreaterThan(50);
    for (const fn of cited) expect(decompSection(fn.c!.name, fn.c!.game), `${fn.file} ${fn.name}`).not.toBeNull();
  });

  it("cites mw.c from the Moraff's World files", () => {
    const mw = portFiles('moraffsWorld').flatMap((entry) => entry.functions).filter((fn) => fn.c);
    expect(mw.length).toBeGreaterThan(10);
    for (const fn of mw) expect(fn.c!.game, `${fn.file} ${fn.name}`).toBe('moraffsWorld');
  });

  it('says which port functions came from a decompiled one', () => {
    expect(portsOfC('sleep_monster').map((fn) => fn.name)).toContain('sleepMonster');
    expect(portsOfC('no_such_function')).toEqual([]);
  });

  it('answers for the game asked about, where both games have a function of that name', () => {
    expect(portsOfC('roll_char').map((fn) => fn.file)).toContain('src/lib/game/port/character.ts');
    expect(portsOfC('roll_char').map((fn) => fn.file)).not.toContain('src/lib/game/mw-port/character.ts');
    const mw = new Set(portsOfC('roll_char', 'moraffsWorld').map((fn) => fn.file));
    expect(mw).toEqual(new Set(['src/lib/game/mw-port/character.ts', 'src/lib/game/mw-port/state.ts']));
  });
});
