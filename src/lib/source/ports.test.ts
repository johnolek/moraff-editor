import { describe, expect, it } from 'vitest';
import { decompSection } from './decomp';
import { allPortFunctions, declarations, PORT_FILES, portCode, portsOfC, SOURCE_FILES } from './ports';

const FILE = 'src/lib/game/port/magic.ts';

const FRAGMENT = [
  '/** The file this comment heads, citing (exe 1000:0000, unf.c "entry") from a long way off. */',
  '',
  'export const LIMIT = 3;',
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

describe('declarations', () => {
  const found = declarations(FILE, FRAGMENT);

  it('finds the exported values, the exported functions and the methods of a class', () => {
    expect(found.map((fn) => fn.name)).toEqual(['LIMIT', 'sleepMonster', 'solid']);
  });

  it('reads the citation out of the comment above a declaration', () => {
    expect(found[1].c).toEqual({ name: 'sleep_monster', address: '3000:d904' });
    expect(found[2].c).toEqual({ name: 'solidcheck', address: '3000:86b5' });
  });

  it('does not hand a file-level comment to whatever is declared after it', () => {
    expect(found[0].c).toBeNull();
  });
});

describe('the port the app ships', () => {
  it('finds declarations in every file it lists', () => {
    for (const entry of PORT_FILES) expect(entry.functions.length, entry.file).toBeGreaterThan(0);
    expect(PORT_FILES.map((entry) => entry.file)).toEqual(SOURCE_FILES);
  });

  it('can read the text of every declaration it found', () => {
    for (const fn of allPortFunctions()) expect(() => portCode(fn.file, fn.name), `${fn.file} ${fn.name}`).not.toThrow();
  });

  it('cites only functions the decompilation really holds', () => {
    const cited = allPortFunctions().filter((fn) => fn.c);
    expect(cited.length).toBeGreaterThan(50);
    for (const fn of cited) expect(decompSection(fn.c!.name), `${fn.file} ${fn.name}`).not.toBeNull();
  });

  it('says which port functions came from a decompiled one', () => {
    expect(portsOfC('sleep_monster').map((fn) => fn.name)).toContain('sleepMonster');
    expect(portsOfC('no_such_function')).toEqual([]);
  });
});
