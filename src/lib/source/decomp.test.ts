import { describe, expect, it } from 'vitest';
import { decompSection, parseSections, SECTIONS, sectionsByName } from './decomp';

const FRAGMENT = [
  '// ==== entry @ 1000:0000 (size 355) callers:   // runtime entry: sets up DS/SS',
  '',
  'void entry(void)',
  '{',
  '  return;',
  '}',
  '',
  '// ==== FUN_1000_0163 @ 1000:0163 (size 19) callers: entry,main',
  'int FUN_1000_0163(void)',
  '{',
  '  return 1;',
  '}',
  '',
].join('\n');

describe('parseSections', () => {
  const sections = parseSections(FRAGMENT);

  it('finds one section per header', () => {
    expect(sections.map((section) => section.name)).toEqual(['entry', 'FUN_1000_0163']);
  });

  it('reads the address and the size off the header', () => {
    expect(sections[0].address).toBe('1000:0000');
    expect(sections[0].size).toBe(355);
  });

  it('takes the note after the callers as the description', () => {
    expect(sections[0].description).toBe('runtime entry: sets up DS/SS');
    expect(sections[0].callers).toEqual([]);
  });

  it('splits the callers and leaves a header with no note undescribed', () => {
    expect(sections[1].callers).toEqual(['entry', 'main']);
    expect(sections[1].description).toBeNull();
  });

  it('takes the body up to the next header, without the blank lines around it', () => {
    expect(sections[0].body).toBe(['void entry(void)', '{', '  return;', '}'].join('\n'));
    expect(sections[1].body.endsWith('}')).toBe(true);
  });
});

describe('the decompilation the app ships', () => {
  it('holds every function of the executable', () => {
    expect(SECTIONS.length).toBe(647);
  });

  it('carries the code of a function the port cites', () => {
    const sleep = decompSection('sleep_monster');
    expect(sleep).not.toBeNull();
    expect(sleep!.address).toBe('3000:d904');
    expect(sleep!.body).toContain('sleep_monster');
  });

  it('has nothing for a name it does not hold', () => {
    expect(decompSection('no_such_function')).toBeNull();
  });

  it('lists the named functions before the ones only known by their address', () => {
    const names = sectionsByName().map((section) => section.name);
    expect(names.length).toBe(SECTIONS.length);
    expect(names.filter((name) => name.startsWith('FUN_')).length).toBe(461);
    expect(names.findIndex((name) => name.startsWith('FUN_'))).toBe(186);
  });
});
