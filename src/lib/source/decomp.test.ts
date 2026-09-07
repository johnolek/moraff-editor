import { describe, expect, it } from 'vitest';
import { decompilation, decompSection, parseSections, sectionsByName } from './decomp';

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

describe('the decompilations the app ships', () => {
  it('holds every function of both executables', () => {
    expect(decompilation('unforgiven')!.sections.length).toBe(647);
    expect(decompilation('moraffsWorld')!.sections.length).toBe(580);
  });

  it('names the executable each one was read out of', () => {
    expect(decompilation('unforgiven')!.executable).toBe('UNF.EXE');
    expect(decompilation('moraffsWorld')!.executable).toBe('WORLD.EXE');
  });

  it('carries the code of a function the Dungeons of the Unforgiven port cites', () => {
    const sleep = decompSection('sleep_monster');
    expect(sleep).not.toBeNull();
    expect(sleep!.address).toBe('3000:d904');
    expect(sleep!.body).toContain('sleep_monster');
  });

  it('carries the code of a function the Moraff\'s World port cites', () => {
    const roll = decompSection('roll_char', 'moraffsWorld');
    expect(roll).not.toBeNull();
    expect(roll!.address).toBe('3000:4695');
    expect(roll!.body).toContain('roll_char');
  });

  it('looks in the game\'s own decompilation for a name', () => {
    expect(decompSection('give_hint', 'moraffsWorld')).toBeNull();
    expect(decompSection('read_roll_line')).toBeNull();
  });

  it('has nothing for a name it does not hold', () => {
    expect(decompSection('no_such_function')).toBeNull();
  });

  it('lists the named functions before the ones only known by their address', () => {
    const names = sectionsByName().map((section) => section.name);
    expect(names.length).toBe(decompilation('unforgiven')!.sections.length);
    expect(names.filter((name) => name.startsWith('FUN_')).length).toBe(447);
    expect(names.findIndex((name) => name.startsWith('FUN_'))).toBe(200);
  });

  it('lists Moraff\'s World the same way', () => {
    const names = sectionsByName('moraffsWorld').map((section) => section.name);
    expect(names.length).toBe(decompilation('moraffsWorld')!.sections.length);
    expect(names[0].startsWith('FUN_')).toBe(false);
    expect(names[names.length - 1].startsWith('FUN_')).toBe(true);
  });
});
