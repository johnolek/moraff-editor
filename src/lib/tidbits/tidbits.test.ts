import { describe, expect, it } from 'vitest';
import type { GameId } from '../app-state.svelte';
import { allFormulas } from '../formulas/formulas';
import { decompSection } from '../source/decomp';
import { allPortFunctions, sourceFiles } from '../source/ports';
import { tabsFor } from '../tabs';
import { TIDBITS_FILES, tidbitsGames } from './files';
import { parseTidbits, type Inline, type LinkTarget, type Section } from './markdown';

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

const FORMULA_IDS = new Set(allFormulas().map((formula) => formula.id));

function entriesOf(sections: Section[]) {
  return sections.flatMap((section) => section.entries);
}

function targetsOf(sections: Section[]): LinkTarget[] {
  const nodes: Inline[] = entriesOf(sections)
    .flatMap((entry) => entry.blocks)
    .flatMap((block) => (block.kind === 'paragraph' ? [block.content] : block.items))
    .flat();
  return nodes.flatMap((node) => (node.kind === 'link' ? [node.target] : []));
}

/** True for a game whose tabs hold the one a link would open, since a link that switches to a
 *  tab the game does not have would leave the site showing nothing. */
function hasTab(game: GameId, tab: 'formulas' | 'source'): boolean {
  return tabsFor(game).some((entry) => entry.id === tab);
}

describe.each(tidbitsGames())('the tidbits of %s', (game) => {
  const sections = parseTidbits(TIDBITS_FILES[game] ?? '');
  const entries = entriesOf(sections);
  const targets = targetsOf(sections);

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

  it('links every source:ts/ to a declaration the Source tab shows for this game', () => {
    const declared = allPortFunctions();
    for (const target of targets) {
      if (target.kind !== 'port') continue;
      const file = sourceFiles(game).find((path) => path.endsWith(`/${target.file}`));
      expect(file, `no file ${target.file}`).toBeDefined();
      const found = declared.some((fn) => fn.file === file && fn.name === target.name);
      expect(found, `${target.file} declares no ${target.name}`).toBe(true);
    }
  });

  it("links every source:c/ to a function of this game's decompilation", () => {
    for (const target of targets) {
      if (target.kind !== 'decompiled') continue;
      expect(decompSection(target.name, game), `no decompiled ${target.name}`).not.toBe(null);
    }
  });

  it('links a formula only from a game whose tabs hold the Formulas tab', () => {
    for (const target of targets) {
      if (target.kind !== 'formula') continue;
      expect(hasTab(game, 'formulas'), `${game} has no Formulas tab`).toBe(true);
      expect(FORMULA_IDS.has(target.id), `no formula ${target.id}`).toBe(true);
    }
  });

  it('links to the port, the decompilation and the web', () => {
    const kinds = new Set(targets.map((target) => target.kind));
    for (const kind of ['port', 'decompiled', 'url']) expect(kinds).toContain(kind);
  });

  it('shows on a Tidbits tab, and opens its code links on a Source tab', () => {
    expect(tabsFor(game).map((entry) => entry.id)).toContain('tidbits');
    expect(hasTab(game, 'source')).toBe(true);
  });
});

describe('TIDBITS.md', () => {
  const targets = targetsOf(parseTidbits(TIDBITS_FILES.unforgiven ?? ''));

  it('is the one file that links to the Formulas tab', () => {
    expect(targets.some((target) => target.kind === 'formula')).toBe(true);
  });
});
