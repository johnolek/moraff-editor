import { describe, expect, it } from 'vitest';
import { allFormulas } from '../formulas/formulas';
import { decompSection } from '../source/decomp';
import { allPortFunctions, SOURCE_FILES } from '../source/ports';
import source from './TIDBITS.md?raw';
import { parseTidbits, type Inline, type LinkTarget } from './markdown';

const SECTIONS = [
  'Exploits and shortcuts',
  'Combat',
  'Magic',
  'Monsters',
  'Map and travel',
  'Town and money',
  'Bugs the game has',
  'Trivia and history',
];

const sections = parseTidbits(source);
const entries = sections.flatMap((section) => section.entries);

function inlines(): Inline[] {
  return entries
    .flatMap((entry) => entry.blocks)
    .flatMap((block) => (block.kind === 'paragraph' ? [block.content] : block.items))
    .flat();
}

const targets: LinkTarget[] = inlines().flatMap((node) => (node.kind === 'link' ? [node.target] : []));

describe('TIDBITS.md', () => {
  it('holds the eight sections in order', () => {
    expect(sections.map((section) => section.title)).toEqual(SECTIONS);
  });

  it('gives every section entries and every entry something to say', () => {
    for (const section of sections) expect(section.entries.length, section.title).toBeGreaterThan(0);
    for (const entry of entries) expect(entry.blocks.length, entry.title).toBeGreaterThan(0);
  });

  it('names every entry once', () => {
    const ids = entries.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('links every source:ts/ to a declaration the Source tab shows', () => {
    const declared = allPortFunctions();
    for (const target of targets) {
      if (target.kind !== 'port') continue;
      const file = SOURCE_FILES.find((path) => path.endsWith(`/${target.file}`));
      expect(file, `no file ${target.file}`).toBeDefined();
      const found = declared.some((fn) => fn.file === file && fn.name === target.name);
      expect(found, `${target.file} declares no ${target.name}`).toBe(true);
    }
  });

  it('links every source:c/ to a function of the decompilation', () => {
    for (const target of targets) {
      if (target.kind !== 'decompiled') continue;
      expect(decompSection(target.name), `no decompiled ${target.name}`).not.toBe(null);
    }
  });

  it('links every formula: to an entry of the Formulas tab', () => {
    const ids = new Set(allFormulas().map((formula) => formula.id));
    for (const target of targets) {
      if (target.kind !== 'formula') continue;
      expect(ids.has(target.id), `no formula ${target.id}`).toBe(true);
    }
  });

  it('has links of all four kinds', () => {
    expect(new Set(targets.map((target) => target.kind))).toEqual(new Set(['port', 'decompiled', 'formula', 'url']));
  });
});
