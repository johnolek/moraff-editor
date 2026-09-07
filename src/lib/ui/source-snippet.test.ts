import { describe, expect, it } from 'vitest';
import { allFormulas, formulaCode } from '../formulas/formulas';
import { decompSection } from '../source/decomp';
import { snippet } from './source-snippet';

const SOURCE = [
  '// ---------------------------------------------------------------- a section divider',
  '/** Counts the braces in a label. */',
  'export function countBraces(label) {',
  "  const opener = '{';",
  '  return label.split(opener).length - 1;   // a } in a comment',
  '}',
  '',
  '// The odds of each kind.',
  'export const ODDS = {',
  '  puffball: 1 / 20,',
  '  blocker: 1 / 7,',
  '};',
  '',
  'const greeting = (name) => `hello ${name}, welcome {`;',
  '',
  '/** Waits for a key. */',
  'export async function waitForKey(game) {',
  '  return game.key();',
  '}',
  '',
  'export class Dungeon {',
  '  /** One side of a square. */',
  '  side(x, y) {',
  '    return this.walls[y][x];',
  '  }',
  '',
  '  sides(x, y) {',
  '    return [this.side(x, y)];',
  '  }',
  '}',
].join('\n');

describe('snippet', () => {
  it('takes an exported async function, which the playing loop is full of', () => {
    expect(snippet(SOURCE, 'waitForKey')).toBe(
      ['/** Waits for a key. */', 'export async function waitForKey(game) {', '  return game.key();', '}'].join('\n'),
    );
  });

  it('takes an exported function with its documentation', () => {
    expect(snippet(SOURCE, 'countBraces')).toBe(
      [
        '/** Counts the braces in a label. */',
        'export function countBraces(label) {',
        "  const opener = '{';",
        '  return label.split(opener).length - 1;   // a } in a comment',
        '}',
      ].join('\n'),
    );
  });

  it('leaves the section divider above a comment out', () => {
    expect(snippet(SOURCE, 'countBraces').startsWith('/**')).toBe(true);
  });

  it('takes a const up to the semicolon that ends it, with the line comments above', () => {
    expect(snippet(SOURCE, 'ODDS')).toBe(
      ['// The odds of each kind.', 'export const ODDS = {', '  puffball: 1 / 20,', '  blocker: 1 / 7,', '};'].join('\n'),
    );
  });

  it('takes a const that carries a type', () => {
    const typed = ['/** Pairs. */', 'export const PAIRS: number[][] = [', '  [1, 2],', '];', 'const after = 1;'].join('\n');
    expect(snippet(typed, 'PAIRS')).toBe(['/** Pairs. */', 'export const PAIRS: number[][] = [', '  [1, 2],', '];'].join('\n'));
  });

  it('is not confused by a brace inside a template literal', () => {
    expect(snippet(SOURCE, 'greeting')).toBe('const greeting = (name) => `hello ${name}, welcome {`;');
  });

  it('takes a method out of a class and drops the shared indentation', () => {
    expect(snippet(SOURCE, 'side')).toBe(
      ['/** One side of a square. */', 'side(x, y) {', '  return this.walls[y][x];', '}'].join('\n'),
    );
  });

  it('does not mistake a longer name for the one asked for', () => {
    expect(snippet(SOURCE, 'sides')).toBe(['sides(x, y) {', '  return [this.side(x, y)];', '}'].join('\n'));
  });

  it('says so when the name is not there', () => {
    expect(() => snippet(SOURCE, 'missing')).toThrow('no declaration of missing');
  });
});

describe('the code every formula points at', () => {
  it('is still there under the name the entry gives', () => {
    for (const formula of allFormulas()) {
      expect(() => formulaCode(formula), formula.title).not.toThrow();
    }
  });

  it('names a decompiled function the decompilation really holds', () => {
    for (const formula of allFormulas()) {
      if (formula.c) expect(decompSection(formula.c), formula.title).not.toBeNull();
    }
  });
});
